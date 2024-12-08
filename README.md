# RAG-powered-LLM-Bot

## **Setup Instructions**

Follow these steps to set up and run the **RAG-powered-LLM-Bot** on your local system:

---

### **1. Unzip the Folder**
Unzip the downloaded folder `RAG-powered-LLM-Bot` to extract all the files.

---

### **2. Navigate to the `app` Directory**
Open your terminal and navigate to the `app` folder using the command:

```bash
cd app

3. Create a Virtual Environment
	python -m venv venv

Activate the virtual environment:

	On Windows:
		venv\Scripts\activate
	On macOS/Linux:
		source venv/bin/activate
		
4. Set API Keys in .env File

	Open the .env file and set the following API keys:

	OpenAI API Key: OPENAI_API_KEY=<your_openai_api_key>
	Pinecone API Key: PINECONE_API_KEY=<your_pinecone_api_key>
	Save and close the .env file.
	
5. Install Required Dependencies
Install the necessary packages listed in requirements.txt:
pip install -r requirements.txt

6. Set Up the Database
Initialize the Pinecone vector database by running the script:
python upload_to_pinecone.py
This will upload the required embeddings to Pinecone for retrieval.

7. Start the Server

Run the following command to start the server:
python -m uvicorn main:app --reload
The server will be accessible at http://127.0.0.1:8000.

8. Interact with the Chatbot
Open the index.html file in your browser which is in front-end folder to interact with the chatbot. You can use voice-based input or text-based input to query the system.

Enjoy exploring the RAG-powered chatbot! 🚀
