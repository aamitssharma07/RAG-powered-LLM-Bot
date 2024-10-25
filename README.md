# SmartAssist-LLM-RAG-Chatbot

This project is an intelligent FAQ chatbot that combines Retrieval-Augmented Generation (RAG) and a Large Language Model (LLM) to provide contextual and human-like responses. It is designed to enhance customer service automation by efficiently handling frequently asked questions (FAQs) while maintaining conversational context in multi-turn queries.

## Project Team

- **Aakarsh Mehta** (Fullstack Developer)
- **Amit Kumar** (ML Engineer)
- **Manmeet Detroja** (Software Developer)
- **Sai Krrishnaa Reddi** (Front-end Developer)

## Project Aim

This project integrates the latest advancements in natural language understanding with dynamic information retrieval to improve FAQ handling. The key features include:
- **RAG Integration**: Combining retrieval techniques with LLMs for contextual responses.
- **Vector Database**: Storing and querying vector embeddings for fast, semantic matching.
- **User Experience**: Providing a conversational and personalized experience for users.

## Features

- **FAQ Dataset Handling**: Collects, preprocesses, and vectorizes FAQ data for semantic matching.
- **RAG Integration**: Retrieves the most relevant FAQ entries and uses the LLM for response generation.
- **Context Retention**: Supports multi-turn conversations by maintaining context across the interaction.
- **Text-to-Speech**: Converts the bot's response to audio for a better user experience.
- **Voice Input**: Allows users to input queries through voice using Web Speech API.

## Project Structure

- `index.html`: Contains the front-end structure for the chatbot UI.
- `style.css`: Defines the layout and design, including the background, chatbot window, and other elements.
- `app.js`: Handles the core functionality of the chatbot, including message handling, voice input, and text-to-speech.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Tailwind CSS
- **Backend**: Retrieval-Augmented Generation (RAG) with a vector database and Large Language Model (LLM) for dynamic responses.
- **APIs**: Web Speech API for voice input and speech synthesis.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/faq-chatbot-rag-llm.git
    ```
2. Navigate into the project directory:
    ```bash
    cd faq-chatbot-rag-llm
    ```
3. Open `index.html` in your browser to interact with the chatbot.

## Usage

- **Sending Messages**: Type a message or speak using the voice input button, and the chatbot will respond.
- **Voice Output**: Bot responses can be played as audio by clicking the volume icon in the chatbot's response.
- **Multi-Turn Conversations**: You can ask follow-up questions, and the chatbot will maintain the context of the conversation.

## Future Enhancements

- **Improve Retrieval Accuracy**: Fine-tune semantic matching for more nuanced queries.
- **LLM Integration**: Enhance the LLM's response generation to include additional context or clarification.
- **Scalability**: Optimize the vector database for larger datasets and faster retrieval.
- **User Feedback**: Implement a feedback mechanism for users to rate the bot's responses for continuous improvement.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

For more details on the project objectives, literature review, and detailed workflow, refer to the attached [Project Proposal Writeup](Team%203%20-%20Project%20Proposal%20WriteUp.docx) and [Presentation](Team%203%20-%20Project%20Proposal%20Presentation.pptx).
