document.addEventListener("DOMContentLoaded", function () {
  const chatIconBtn = document.getElementById("chatIconBtn");
  const chatbotContainer = document.getElementById("chatbotContainer");
  const closeChat = document.getElementById("closeChat");
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const voiceBtn = document.getElementById("voiceBtn");
  const messageContainer = document.getElementById("messageContainer");

  // Function to toggle chatbot visibility
  chatIconBtn.addEventListener("click", function () {
    chatbotContainer.classList.toggle("hidden");
  });

  // Function to close the chat
  closeChat.addEventListener("click", function () {
    chatbotContainer.classList.add("hidden");
  });

  // Event listener to send message when clicking the send button
  sendBtn.addEventListener("click", function () {
    const message = userInput.value.trim();
    if (message) {
      addUserMessage(message);
      userInput.value = ""; // Clear input

      // Simulate bot response
      setTimeout(() => {
        addBotMessage("Thank you for your message! How can I assist further?");
      }, 1000);
    }
  });

  // Voice recognition feature using Web Speech API
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  // Handle voice input
  voiceBtn.addEventListener("click", function () {
    recognition.start();
  });

  // On result (speech recognition complete)
  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    addUserMessage(transcript);
    setTimeout(() => {
      addBotMessage("Thank you for your voice message! How can I assist further?");
    }, 1000);
  };

  // Function to handle "Enter" key press to send the message
  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendBtn.click(); // Trigger send button click
    }
  });

  // Function to add user message to the chat (right-aligned with timestamp)
  function addUserMessage(message) {
    const userMessageDiv = document.createElement("div");
    userMessageDiv.classList.add("bg-blue-500", "text-white", "p-2", "rounded-lg", "max-w-xs", "self-end", "mb-2", "user-message");
    userMessageDiv.innerHTML = `${message} <div class="timestamp">${getCurrentTime()}</div>`;
    messageContainer.appendChild(userMessageDiv);

    // Auto-scroll to the bottom when a new message is added
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  // Function to simulate bot response (left-aligned with timestamp)
  function addBotMessage(message) {
    const botMessageDiv = document.createElement("div");
    botMessageDiv.classList.add("bg-gray-200", "p-2", "rounded-lg", "max-w-xs", "self-start", "mb-2", "bot-message");
    botMessageDiv.innerHTML = `${message} <div class="timestamp">${getCurrentTime()}</div>`;
    messageContainer.appendChild(botMessageDiv);

    // Auto-scroll to the bottom when a new message is added
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  // Helper function to get the current time for timestamps
  function getCurrentTime() {
    const now = new Date();
    return now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
  }
});
