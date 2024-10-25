document.addEventListener("DOMContentLoaded", function () {
  const chatIconBtn = document.getElementById("chatIconBtn");
  const chatbotContainer = document.getElementById("chatbotContainer");
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const messageContainer = document.getElementById("messageContainer");

  // Get the minimize button
  const closeChatBtn = document.getElementById("closeChat");

  // Function to show the chatbot
  chatIconBtn.addEventListener("click", function () {
    chatbotContainer.classList.remove("hidden");
  });

  // Function to hide the chatbot when minimize button is clicked
  closeChatBtn.addEventListener("click", function () {
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
        addBotMessage(
          "Thank you for your message! How can I assist further?"
        );
      }, 1000);
    }
  });

  // Function to handle "Enter" key press to send the message
  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendBtn.click(); // Trigger send button click
    }
  });

  // Function to add user message to the chat
  function addUserMessage(message) {
    const userMessageDiv = document.createElement("div");
    userMessageDiv.classList.add("user-message");

    const messageTextDiv = document.createElement("div");
    messageTextDiv.classList.add("message-text");
    messageTextDiv.textContent = message;

    const timestampDiv = document.createElement("div");
    timestampDiv.classList.add("timestamp");
    timestampDiv.textContent = getCurrentTime();

    userMessageDiv.appendChild(messageTextDiv);
    userMessageDiv.appendChild(timestampDiv);
    messageContainer.appendChild(userMessageDiv);

    // Auto-scroll to the bottom when a new message is added
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  // Function to add bot message to the chat with sound icon
  function addBotMessage(message) {
    const botMessageDiv = document.createElement("div");
    botMessageDiv.classList.add("bot-message");

    const messageTextDiv = document.createElement("div");
    messageTextDiv.classList.add("message-text");
    messageTextDiv.textContent = message;

    // Create the message footer
    const messageFooterDiv = document.createElement("div");
    messageFooterDiv.classList.add("message-footer");

    // Create the sound button
    const soundBtn = document.createElement("button");
    soundBtn.classList.add("sound-btn");
    soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';

    // Add event listener to the sound button for text-to-speech
    soundBtn.addEventListener("click", function () {
      speakText(message);
    });

    // Create the timestamp
    const timestampDiv = document.createElement("div");
    timestampDiv.classList.add("timestamp");
    timestampDiv.textContent = getCurrentTime();

    // Append sound button and timestamp to the footer
    messageFooterDiv.appendChild(soundBtn);
    messageFooterDiv.appendChild(timestampDiv);

    // Append message text and footer to the bot message div
    botMessageDiv.appendChild(messageTextDiv);
    botMessageDiv.appendChild(messageFooterDiv);
    messageContainer.appendChild(botMessageDiv);

    // Auto-scroll to the bottom when a new message is added
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  // Function to perform text-to-speech
  function speakText(text) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech.");
    }
  }

  // Helper function to get the current time
  function getCurrentTime() {
    const now = new Date();
    return (
      now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0")
    );
  }
});
