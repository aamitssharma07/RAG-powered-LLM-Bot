// app.js

document.addEventListener("DOMContentLoaded", function () {
  // ----------------------------
  // Element Selection
  // ----------------------------

  const chatIconBtn = document.getElementById("chatIconBtn");
  const chatbotContainer = document.getElementById("chatbotContainer");
  const closeChatBtn = document.getElementById("closeChat");
  const toggleButton = document.getElementById("themeToggleBtn");
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const messageContainer = document.getElementById("messageContainer");
  const chatStatus = document.getElementById("chatStatus"); // Chat Status Section
  const downloadBtn = document.getElementById("downloadChatBtn"); // Download Transcript Button
  const micBtn = document.getElementById("micBtn"); // Microphone Button

  // ----------------------------
  // Asset Paths
  // ----------------------------

  const BOT_AVATAR_LIGHT = "images/logo.jpg"; // Bot Avatar for Light Mode
  const BOT_AVATAR_DARK = "images/logo.jpg"; // Bot Avatar for Dark Mode
  const USER_AVATAR_ICON = '<i class="fa-solid fa-user"></i>'; // FontAwesome User Icon

    // FastAPI Endpoint URL
    const PROCESS_QUERY = "http://localhost:8000/process_query/"; 

  // ----------------------------
  // Utility: Format Current Time
  // ----------------------------

  function formatCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";
    return `${hours % 12 || 12}:${minutes} ${amPm}`;
  }

  // ----------------------------
  // Theme Persistence on Load
  // ----------------------------

  function setThemeOnLoad() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      toggleButton.innerHTML = '<i class="fas fa-sun text-xl"></i>';
      updateBotAvatars("dark");
    } else {
      document.body.classList.remove("dark-mode");
      toggleButton.innerHTML = '<i class="fas fa-moon text-xl"></i>';
      updateBotAvatars("light");
    }
  }

  function updateBotAvatars(mode) {
    const botAvatars = document.querySelectorAll(".bot-logo");
    botAvatars.forEach((avatar) => {
      avatar.src = mode === "dark" ? BOT_AVATAR_DARK : BOT_AVATAR_LIGHT;
    });
  }

  setThemeOnLoad();

  // ----------------------------
  // Theme Toggle Functionality
  // ----------------------------

  if (toggleButton) {
    toggleButton.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      const mode = document.body.classList.contains("dark-mode") ? "dark" : "light";

      toggleButton.innerHTML =
        mode === "dark" ? '<i class="fas fa-sun text-xl"></i>' : '<i class="fas fa-moon text-xl"></i>';
      localStorage.setItem("theme", mode);
      updateBotAvatars(mode);
    });
  }

  // ----------------------------
  // Chatbot Open Functionality
  // ----------------------------

  function showChatbot() {
    chatbotContainer.classList.remove("hidden");
    chatIconBtn.classList.add("hidden");

    // Update Chat Status
    if (chatStatus) {
      const startTime = formatCurrentTime();
      chatStatus.innerHTML = `
        Chat started at ${startTime}<br>
        You are chatting with Smart Assist
      `;
    }

    // Add Welcome Message if it hasn't been shown yet
    if (!messageContainer.hasChildNodes()) {
      addWelcomeMessage();
    }
  }

  // ----------------------------
  // Chatbot Close Functionality
  // ----------------------------

  function hideChatbot() {
    chatbotContainer.classList.add("hidden");
    chatIconBtn.classList.remove("hidden");
  }

  // ----------------------------
  // Function: Add Welcome Message
  // ----------------------------

  function addWelcomeMessage() {
    const welcomeMessage1 = "Welcome User. I'm your virtual assistant Smart Assist, and I'm here to help you with all your Credit Card related questions.";
    const welcomeMessage2 = "Do you maybe have a question about an existing card or transaction?";
    
    // First welcome message
    addBotMessage(welcomeMessage1);
    
    // Second follow-up message
    setTimeout(() => {
      addBotMessage(welcomeMessage2);
    }, 1000); // Add a slight delay for the second message
  }

  // ----------------------------
  // Event Listeners: Open/Close Chatbot
  // ----------------------------

  if (chatIconBtn) {
    chatIconBtn.addEventListener("click", function () {
      showChatbot();
    });
  }

  if (closeChatBtn) {
    closeChatBtn.addEventListener("click", function () {
      hideChatbot();
    });
  }

  // Flag to track the send button click
let isSendButtonClicked = false;

// Function to set the flag when the button is clicked
function setSendButtonFlag() {
  isSendButtonClicked = true;
  console.log("Send button clicked. Flag set to:", isSendButtonClicked);
}

// Ensure the event listener is attached only once
if (!sendBtn.hasEventListener) {
  sendBtn.addEventListener("click", async () => {
    const userText = userInput.value.trim();

    // Validate input
    if (!userText) {
      alert("Please enter a message before sending.");
      return;
    }

    // Add user message to the chat (ensure this is called only once)
    
      addUserMessage(userText);
  
// Add loading indicator
const loadingMessage = document.createElement("div");
loadingMessage.className = "chat-message bot loading";
loadingMessage.innerHTML = `
  <div class="avatar">
    <img src="${
      document.body.classList.contains("dark-mode") ? BOT_AVATAR_DARK : BOT_AVATAR_LIGHT
    }" alt="Bot Avatar" class="bot-logo" />
  </div>
  <div class="message-content">
    <p>Thinking...</p>
    <span class="timestamp">${formatCurrentTime()}</span>
  </div>`;
messageContainer.appendChild(loadingMessage);

// Scroll to the latest message
messageContainer.scrollTop = messageContainer.scrollHeight;



    // Scroll to the latest message
    // messageContainer.scrollTop = messageContainer.scrollHeight;

    try {
      // Construct the API query string
      const url = new URL(PROCESS_QUERY);
      url.searchParams.append("query1", userText);
      url.searchParams.append("top_k", 5);

      // Make the GET request to the FastAPI endpoint
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle the response
      if (response.ok) {
        const responseData = await response.json();
        console.log("API Response:", responseData);

        // Replace loading indicator with bot response
        loadingMessage.remove();
        addBotMessage(responseData.result || "Sorry, no response available.");
      } else {
        console.error("API Error:", response.statusText);

        // Replace loading indicator with error message
        loadingMessage.remove();
        addBotMessage("Failed to process the query. Please try again.");
      }
    } catch (error) {
      console.error("Error making the API call:", error);

      // Replace loading indicator with error message
      loadingMessage.remove();
      addBotMessage("An error occurred while communicating with the server.");
    }

    // Clear the input field after sending
    userInput.value = "";
  });

  // Mark the event listener as added
  sendBtn.hasEventListener = true;
}

  
  function addUserMessage(message) {
    const userMessage = document.createElement("div");
    userMessage.className = "chat-message user";
    userMessage.innerHTML = `
      <div class="avatar">
        ${USER_AVATAR_ICON}
      </div>
      <div class="message-content bg-blue-500 text-white">
        <p>${message}</p>
        <span class="timestamp">${formatCurrentTime()}</span>
      </div>`;
    messageContainer.appendChild(userMessage);
  
    // Scroll to the latest message
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  
  function addBotMessage(message) {
    const botMessage = document.createElement("div");
    botMessage.className = "chat-message bot";
    botMessage.innerHTML = `
      <div class="avatar">
        <img src="${
          document.body.classList.contains("dark-mode") ? BOT_AVATAR_DARK : BOT_AVATAR_LIGHT
        }" alt="Bot Avatar" class="bot-logo" />
      </div>
      <div class="message-content bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-100">
        <p>${message}</p>
        <span class="timestamp">${formatCurrentTime()}</span>
      </div>`;
    messageContainer.appendChild(botMessage);
  
    // Scroll to the latest message
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
  
  // Send message on Enter key
  if (userInput) {
    userInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendBtn.click();
      }
    });
  }

  // ----------------------------
  // Function: Add User Message
  // ----------------------------

  function addUserMessage(message) {
    // Capitalize the first letter of the message
    if (message.length > 0) {
      message = message.charAt(0).toUpperCase() + message.slice(1);
    }

    const userMessageContainer = document.createElement("div");
    userMessageContainer.classList.add("user-message-container");

    const userAvatarDiv = document.createElement("div");
    userAvatarDiv.classList.add("user-avatar");
    userAvatarDiv.innerHTML = USER_AVATAR_ICON;

    const userMessageDiv = document.createElement("div");
    userMessageDiv.classList.add("user-message");

    const messageTextDiv = document.createElement("div");
    messageTextDiv.classList.add("message-text");
    messageTextDiv.textContent = message;

    const timestampDiv = document.createElement("div");
    timestampDiv.classList.add("user-timestamp");
    timestampDiv.textContent = formatCurrentTime();

    userMessageDiv.appendChild(messageTextDiv);
    userMessageDiv.appendChild(timestampDiv);

    userMessageContainer.appendChild(userMessageDiv);
    userMessageContainer.appendChild(userAvatarDiv);

    messageContainer.appendChild(userMessageContainer);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  // ----------------------------
  // Function: Add Bot Message
  // ----------------------------

  function addBotMessage(message, type = 'text', quickReplies = []) {
    const botMessageContainer = document.createElement("div");
    botMessageContainer.classList.add("bot-message-container");

    const avatarImg = document.createElement("img");
    avatarImg.src = document.body.classList.contains("dark-mode")
      ? BOT_AVATAR_DARK
      : BOT_AVATAR_LIGHT;
    avatarImg.alt = "Bot Avatar";
    avatarImg.classList.add("bot-logo");

    const botMessageDiv = document.createElement("div");
    botMessageDiv.classList.add("bot-message");

    let messageContent;
    if (type === 'image') {
      messageContent = document.createElement("img");
      messageContent.src = message;
      messageContent.alt = "Image from Smart Assist";
      messageContent.classList.add("bot-image");
    } else if (type === 'video') {
      messageContent = document.createElement("video");
      messageContent.src = message;
      messageContent.controls = true;
      messageContent.classList.add("bot-video");
    } else if (type === 'link') {
      messageContent = document.createElement("a");
      messageContent.href = message;
      messageContent.textContent = "Click here";
      messageContent.target = "_blank";
      messageContent.classList.add("bot-link");
    } else {
      messageContent = document.createElement("div");
      messageContent.classList.add("message-text");
      messageContent.textContent = message;
    }

    botMessageDiv.appendChild(messageContent);

    // Feedback Buttons
    const feedbackDiv = document.createElement("div");
    feedbackDiv.classList.add("feedback-buttons");

    const soundBtn = document.createElement("button");
    soundBtn.classList.add("sound-btn");
    soundBtn.innerHTML = '<i class="fas fa-volume-up sound-icon"></i>';
    soundBtn.addEventListener("click", function () {
      speakText(message);
    });

    const thumbsUp = document.createElement("button");
    thumbsUp.classList.add("thumbs-up");
    thumbsUp.innerHTML = '<i class="fas fa-thumbs-up"></i>';
    thumbsUp.addEventListener("click", function () {
      thumbsUp.classList.add("active");
      thumbsDown.classList.remove("active");
      showTemporaryMessage("Thank you for your feedback!", "like", botMessageContainer);
    });

    const thumbsDown = document.createElement("button");
    thumbsDown.classList.add("thumbs-down");
    thumbsDown.innerHTML = '<i class="fas fa-thumbs-down"></i>';
    thumbsDown.addEventListener("click", function () {
      thumbsDown.classList.add("active");
      thumbsUp.classList.remove("active");
      showTemporaryMessage("I'm sorry to hear that. I'll improve.", "dislike", botMessageContainer);
    });

    feedbackDiv.appendChild(soundBtn);
    feedbackDiv.appendChild(thumbsUp);
    feedbackDiv.appendChild(thumbsDown);

    const timestampDiv = document.createElement("div");
    timestampDiv.classList.add("timestamp");
    timestampDiv.textContent = formatCurrentTime();

    const messageFooter = document.createElement("div");
    messageFooter.classList.add("message-footer");

    messageFooter.appendChild(feedbackDiv);
    messageFooter.appendChild(timestampDiv);

    botMessageDiv.appendChild(messageFooter);

    // ----------------------------
    // Toast Container for This Bot Message
    // ----------------------------
    const toastContainer = document.createElement("div");
    toastContainer.classList.add("toast-container");
    botMessageDiv.appendChild(toastContainer);

    botMessageContainer.appendChild(avatarImg);
    botMessageContainer.appendChild(botMessageDiv);

    messageContainer.appendChild(botMessageContainer);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  // ----------------------------
  // Function: Typing Indicator
  // ----------------------------

  function showTypingIndicator() {
    if (document.getElementById("typingIndicator")) return;

    const botMessageContainer = document.createElement("div");
    botMessageContainer.classList.add("bot-message-container");
    botMessageContainer.id = "typingIndicator";

    const avatarImg = document.createElement("img");
    avatarImg.src = document.body.classList.contains("dark-mode")
      ? BOT_AVATAR_DARK
      : BOT_AVATAR_LIGHT;
    avatarImg.alt = "Bot Avatar";
    avatarImg.classList.add("bot-logo");

    const botMessageDiv = document.createElement("div");
    botMessageDiv.classList.add("bot-message");

    const messageTextDiv = document.createElement("div");
    messageTextDiv.classList.add("message-text");
    messageTextDiv.innerHTML = "<em>Smart Assist is typing...</em>";

    botMessageDiv.appendChild(messageTextDiv);
    botMessageContainer.appendChild(avatarImg);
    botMessageContainer.appendChild(botMessageDiv);
    messageContainer.appendChild(botMessageContainer);

    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  function hideTypingIndicator() {
    const typingIndicator = document.getElementById("typingIndicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // ----------------------------
  // Function: Temporary Feedback Message as Toast
  // ----------------------------

  function showTemporaryMessage(text, type, botMessageContainer) {
    if (!botMessageContainer) return; // Exit if botMessageContainer doesn't exist

    // Select the toast container within the specific bot message
    const toastContainer = botMessageContainer.querySelector(".toast-container");
    if (!toastContainer) return; // Exit if toastContainer doesn't exist

    // Remove existing toasts to prevent stacking
    const existingToasts = toastContainer.querySelectorAll(".message-toast");
    existingToasts.forEach((toast) => toast.remove());

    // Create the toast element
    const toast = document.createElement("div");
    toast.classList.add("message-toast");

    // Add icon and message based on feedback type
    if (type === "like") {
      toast.innerHTML = `<i class="fas fa-thumbs-up" aria-hidden="true"></i> ${text}`;
      toast.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--feedback-like-bg");
      toast.style.color = getComputedStyle(document.documentElement).getPropertyValue("--feedback-like-color");
    } else if (type === "dislike") {
      toast.innerHTML = `<i class="fas fa-thumbs-down" aria-hidden="true"></i> ${text}`;
      toast.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--feedback-dislike-bg");
      toast.style.color = getComputedStyle(document.documentElement).getPropertyValue("--feedback-dislike-color");
    }

    // Add ARIA attributes for accessibility
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");

    // Append the toast to the toastContainer
    toastContainer.appendChild(toast);

    // Automatically remove the toast after 4 seconds with fade-out
    setTimeout(() => {
      toast.classList.add("fade-out");
      toast.addEventListener("transitionend", () => {
        toast.remove();
      });
    }, 4000);
  }

  // ----------------------------
  // Function: Text-to-Speech
  // ----------------------------

  function speakText(text) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech.");
    }
  }

  // ----------------------------
  // Function: Download Transcript
  // ----------------------------

  function downloadTranscript() {
    let transcript = "";
    
    // Select all message containers (both user and bot messages)
    const messages = messageContainer.querySelectorAll(".user-message-container, .bot-message-container");
    
    messages.forEach((msg) => {
      // Check if it's a user message
      if (msg.classList.contains("user-message-container")) {
        const userMessage = msg.querySelector(".user-message .message-text").textContent;
        const timestamp = msg.querySelector(".user-timestamp").textContent;
        transcript += `User (${timestamp}): ${userMessage}\n`;
      }
      
      // Check if it's a bot message
      if (msg.classList.contains("bot-message-container")) {
        const botMessage = msg.querySelector(".bot-message .message-text").textContent;
        const timestamp = msg.querySelector(".timestamp").textContent;
        transcript += `Smart Assist (${timestamp}): ${botMessage}\n`;
      }
    });
    
    // Create a Blob from the transcript
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat_transcript.txt";
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ----------------------------
  // Event Listener: Download Transcript
  // ----------------------------

  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      downloadTranscript();
    });
  }

  // ----------------------------
  // Voice Input Functionality
  // ----------------------------

  let recognizing = false;
  let recognition;

  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = function () {
      recognizing = true;
      micBtn.classList.add("recording"); // Add recording state
    };

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      // addUserMessage(transcript);
      userInput.value = transcript;
      sendBtn.click();
    };

    recognition.onerror = function (event) {
      console.error("Speech recognition error:", event.error);
      recognizing = false;
      micBtn.classList.remove("recording");
    };

    recognition.onend = function () {
      recognizing = false;
      micBtn.classList.remove("recording");
    };
  } else {
    micBtn.disabled = true;
    micBtn.title = "Voice input not supported in this browser.";
  }

  if (micBtn) {
    micBtn.addEventListener("click", function () {
      if (recognizing) {
        recognition.stop();
        return;
      }
      recognition.start();
    });
  }

});
