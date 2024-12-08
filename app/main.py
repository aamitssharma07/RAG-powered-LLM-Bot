import json
import logging
from fastapi import FastAPI, HTTPException, Query
from typing import List
from dotenv import load_dotenv
from os import getenv
from pinecone import Pinecone, Index
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_openai.chat_models import ChatOpenAI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Load configuration from JSON
with open("config.json", "r") as config_file:
    config = json.load(config_file)

# Configure logging
logging_level = getattr(logging, config.get("logging_level", "DEBUG").upper(), logging.DEBUG)
logging.basicConfig(level=logging_level)

# Sensitive keys from .env
pinecone_api_key = getenv("PINECONE_API_KEY")
openai_api_key = getenv("OPENAI_API_KEY")

# Initialize FastAPI app
app = FastAPI()

# Global variables
pinecone = None
index = None
embed_model = None
LLM = None
THRESHOLD = config["relevance_threshold"]
TOP_K_DEFAULT = config["top_k"]

# Context management
context_history = []


@app.on_event("startup")
async def startup_event():
    """Initialize embeddings, Pinecone, and LLM on app startup."""
    global pinecone, index, embed_model, LLM

    try:
        # Initialize OpenAI embeddings
        embed_model = OpenAIEmbeddings(model=config["embedding_model"])
        logging.debug("Embedding model initialized.")

        # Initialize Pinecone
        pinecone = Pinecone(api_key=pinecone_api_key)

        # Connect to the existing index
        index_name = config["index_name"]
        if index_name not in [idx.name for idx in pinecone.list_indexes()]:
            raise ValueError(f"Pinecone index '{index_name}' does not exist.")
        index = pinecone.Index(index_name)
        logging.debug(f"Connected to Pinecone index: {index_name}")

        # Initialize LLM
        LLM = ChatOpenAI(temperature=0, model_name=config["llm_model"])
        logging.debug("LLM initialized.")
    except Exception as e:
        logging.error(f"Error during startup initialization: {e}")
        raise e


def query_pinecone_for_relevant_docs(query: str, top_k: int = TOP_K_DEFAULT) -> List[tuple]:
    """Retrieve relevant documents from Pinecone based on the query."""
    try:
        logging.debug(f"Generating embedding for query: {query}")
        query_embedding = embed_model.embed_query(query)

        logging.debug("Querying Pinecone for relevant documents.")
        query_response = index.query(vector=query_embedding, top_k=top_k, include_metadata=True, timeout=10)
        results = [(match['score'], match['metadata']['text']) for match in query_response['matches']]
        logging.debug(f"Retrieved {len(results)} results from Pinecone.")
        return results
    except Exception as e:
        logging.error(f"Error querying Pinecone: {e}")
        raise HTTPException(status_code=500, detail="Error querying the document database.")


def filter_relevance(results: List[tuple]) -> str:
    """Filter results based on a similarity threshold."""
    logging.debug("Filtering results based on relevance threshold.")
    for score, document in results:
        if score >= THRESHOLD:
            logging.debug(f"Document with score {score} passed the threshold.")
            return document
    logging.debug("No document passed the relevance threshold.")
    return None


def generate_llm_response(relevant_document: str, query: str) -> str:
    """Generate a final response using the LLM."""
    try:
        prompt = f"{relevant_document}\n\nUsing the provided information, answer the following question:\n{query}"
        logging.debug(f"Generating response with LLM for prompt: {prompt}")
        response = LLM.invoke(prompt, timeout=10)
        logging.debug("Response generated successfully.")
        return response.content.strip()
    except Exception as e:
        logging.error(f"Error generating LLM response: {e}")
        raise HTTPException(status_code=500, detail="Error generating the response.")


def fallback_handler(query: str) -> str:
    """Handle fallback logic when no relevant documents are found."""
    fallback_prompt = (
        f"You are a helpful assistant specialized in bank-related and credit card queries. "
        f"Do not answer questions unrelated to banking, credit cards, or general inquiries about bank services. "
        f"If the query is a greeting, respond politely. "
        f"If the query is outside the scope of banking or credit cards, respond with: 'The question is beyond the scope of the current documents.'\n\n"
        f"User Query: {query}\n"
    )
    try:
        logging.debug(f"Sending fallback prompt to LLM: {fallback_prompt}")
        response = LLM.invoke(fallback_prompt, timeout=10)
        logging.debug("Fallback response generated successfully.")
        return response.content.strip()
    except Exception as e:
        logging.error(f"Error during fallback handling: {e}")
        raise HTTPException(status_code=500, detail="Error during fallback handling.")


def maintain_context(new_query: str, context_limit: int = 3):
    """Maintain a limited context history for better responses."""
    global context_history
    context_history.append(new_query)
    if len(context_history) > context_limit:
        context_history.pop(0)  # Remove the oldest query


def generate_prompt_with_context(query: str) -> str:
    """Generate a combined prompt with limited context."""
    global context_history
    return "\n".join(context_history + [query])


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend's URL for better security
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


@app.get("/process_query/")
async def handle_user_query(query1: str = Query(...), top_k: int = TOP_K_DEFAULT):
    """
    Handle a user query by embedding it, retrieving relevant documents,
    filtering based on relevance, and generating a response.
    """
    try:
        logging.debug(f"Received query: {query1}")

        # Step 1: Maintain context
        maintain_context(query1)

        # Step 2: Retrieve relevant documents
        retrieval_results = query_pinecone_for_relevant_docs(query1, top_k=top_k)

        # Step 3: Filter results by relevance
        relevant_document = filter_relevance(retrieval_results)

        # Step 4: Generate response if relevant; otherwise, handle fallback
        if relevant_document:
            final_answer = generate_llm_response(relevant_document, query1)
        else:
            final_answer = fallback_handler(query1)

        logging.debug(f"Returning final answer: {final_answer}")
        return {"status": "success", "result": final_answer}
    except Exception as e:
        logging.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")
