import json
import os
import pandas as pd
import logging
from dotenv import load_dotenv
from langchain_community.embeddings import OpenAIEmbeddings
from pinecone import Pinecone, ServerlessSpec

# Load environment variables
load_dotenv()

# Load configuration from JSON
with open("config.json", "r") as config_file:
    config = json.load(config_file)

# Configure logging
logging_level = getattr(logging, config.get("logging_level", "DEBUG").upper(), logging.DEBUG)
logging.basicConfig(level=logging_level)

# Load sensitive keys from .env
pinecone_api_key = os.getenv("PINECONE_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")

# Initialize Pinecone
pinecone = Pinecone(api_key=pinecone_api_key)
index_name = config["index_name"]

# Check if index exists, otherwise create it
if index_name not in [index.name for index in pinecone.list_indexes()]:
    pinecone.create_index(
        name=index_name,
        dimension=config["dimension"],
        metric=config["metric"],
        spec=ServerlessSpec(cloud="aws", region=config["pinecone_region"])  # Dynamic region
    )
index = pinecone.Index(index_name)
logging.info(f"Connected to Pinecone index: {index_name}")

# Load dataset
dataset_path = config["dataset_path"]
data = pd.read_csv(dataset_path)  # Adjust path if necessary
if data.empty:
    raise ValueError(f"The dataset at {dataset_path} is empty.")
if "instruction" not in data.columns:
    raise ValueError("The dataset must contain an 'instruction' column.")
logging.info(f"Loaded {len(data)} rows from the dataset.")

# Initialize embedding model
embed_model = OpenAIEmbeddings(model=config["embedding_model"])
logging.info(f"Embedding model '{config['embedding_model']}' initialized.")

# Generate embeddings in batches
def generate_embeddings_in_batches(documents, batch_size):
    embeddings = []
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i + batch_size]
        try:
            batch_embeddings = embed_model.embed_documents(batch)
            embeddings.extend(batch_embeddings)
            logging.info(f"Processed batch {i // batch_size + 1} of {len(documents) // batch_size + 1}")
        except Exception as e:
            logging.error(f"Error in batch {i // batch_size + 1}: {e}")
    return embeddings

# Generate embeddings for the instructions
data["instruction_embedding"] = generate_embeddings_in_batches(data["instruction"].tolist(), config["batch_size"])
logging.info(f"Generated {len(data['instruction_embedding'])} embeddings.")

# Prepare data for Pinecone
def prepare_data_for_pinecone(documents, doc_embeddings):
    ids = [str(i) for i in range(len(documents))]
    data_with_metadata = [
        {"id": doc_id, "values": embedding, "metadata": {"text": doc_text}}
        for doc_id, doc_text, embedding in zip(ids, documents, doc_embeddings)
    ]
    return data_with_metadata

all_meta_data = prepare_data_for_pinecone(data["instruction"].tolist(), data["instruction_embedding"].tolist())

# Upload data to Pinecone in batches
def upsert_in_batches(data, batch_size):
    for i in range(0, len(data), batch_size):
        batch = data[i:i + batch_size]
        index.upsert(vectors=batch)
        logging.info(f"Uploaded batch {i // batch_size + 1} of {len(data) // batch_size + 1}")

upsert_in_batches(all_meta_data, config["batch_size"])
logging.info("All data successfully uploaded to Pinecone.")
