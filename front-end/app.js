document.addEventListener("DOMContentLoaded", function () {
  const chatIconBtn = document.getElementById("chatIconBtn");
  const chatbotContainer = document.getElementById("chatbotContainer");
  const closeChatBtn = document.getElementById("closeChat");
  const toggleButton = document.getElementById("themeToggleBtn");
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const messageContainer = document.getElementById("messageContainer");

  // Paths to avatar and logo images
  const BOT_AVATAR_LIGHT = "images/logo.jpg"; // Path to your bot's logo for light mode
  const BOT_AVATAR_DARK = "images/logo.jpg"; // Use the same logo if a dark version is not available

  const USER_AVATAR_ICON = '<i class="fa-solid fa-user"></i>'; // FontAwesome icon for user avatar

  // Debugging: Verify that all elements are correctly selected
  console.log("chatIconBtn:", chatIconBtn);
  console.log("chatbotContainer:", chatbotContainer);
  console.log("closeChatBtn:", closeChatBtn);
  console.log("toggleButton:", toggleButton);
  console.log("sendBtn:", sendBtn);
  console.log("userInput:", userInput);
  console.log("messageContainer:", messageContainer);

  // Function to show the chatbot
  function showChatbot() {
    chatbotContainer.classList.remove("hidden");
    console.log("Chatbot opened.");
  }

  // Function to hide the chatbot
  function hideChatbot() {
    chatbotContainer.classList.add("hidden");
    console.log("Chatbot minimized.");
  }

  // Event listener for the chat icon to open the chatbot
  if (chatIconBtn) {
    chatIconBtn.addEventListener("click", showChatbot);
    console.log("Chat icon event listener attached.");
  } else {
    console.error("chatIconBtn is null. Check the element ID in HTML.");
  }

  // Event listener for the minimize button to close the chatbot
  if (closeChatBtn) {
    closeChatBtn.addEventListener("click", hideChatbot);
    console.log("Minimize button event listener attached.");
  } else {
    console.error("closeChatBtn is null. Check the element ID in HTML.");
  }

  // Toggle light and dark mode with sun/moon icon switch
  if (toggleButton) {
    toggleButton.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      const lightModeStylesheet = document.getElementById("lightModeStylesheet");
      const darkModeStylesheet = document.getElementById("darkModeStylesheet");

      if (document.body.classList.contains("dark-mode")) {
        lightModeStylesheet.disabled = true;
        darkModeStylesheet.disabled = false;
        toggleButton.innerHTML = '<i class="fas fa-sun text-xl"></i>'; // Show sun icon in dark mode
        console.log("Switched to dark mode.");
      } else {
        lightModeStylesheet.disabled = false;
        darkModeStylesheet.disabled = true;
        toggleButton.innerHTML = '<i class="fas fa-moon text-xl"></i>'; // Show moon icon in light mode
        console.log("Switched to light mode.");
      }
    });
  } else {
    console.error("toggleButton is null. Check the element ID in HTML.");
  }

  // Event listener for send button
  if (sendBtn && userInput) {
    sendBtn.addEventListener("click", function () {
      const message = userInput.value.trim();
      if (message) {
        addUserMessage(message);
        userInput.value = "";

        // Show typing indicator
        showTypingIndicator();

        setTimeout(() => {
          hideTypingIndicator();
          addBotMessage("Thank you for your message! How can I assist further?");
        }, 1000);
      }
    });
    console.log("Send button event listener attached.");
  } else {
    console.error("sendBtn or userInput is null. Check the element IDs in HTML.");
  }

  // Allow sending message with Enter key
  if (userInput) {
    userInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent newline in the input
        sendBtn.click();
        console.log("Enter key pressed. Message sent.");
      }
    });
  }

  // Function to show typing indicator
  function showTypingIndicator() {
    // Check if typing indicator already exists to prevent duplicates
    if (document.getElementById("typingIndicator")) return;

    const botMessageContainer = document.createElement("div");
    botMessageContainer.classList.add("bot-message-container");
    botMessageContainer.id = "typingIndicator"; // Assign ID for removal

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

    console.log("Typing indicator shown.");
  }

  // Function to hide typing indicator
  function hideTypingIndicator() {
    const typingIndicator = document.getElementById("typingIndicator");
    if (typingIndicator) {
      typingIndicator.remove();
      console.log("Typing indicator hidden.");
    }
  }

  // Function to add user message
  function addUserMessage(message) {
    const userMessageContainer = document.createElement("div");
    userMessageContainer.classList.add("user-message-container");

    const userMessageDiv = document.createElement("div");
    userMessageDiv.classList.add("user-message");

    const messageTextDiv = document.createElement("div");
    messageTextDiv.classList.add("message-text");
    messageTextDiv.textContent = message;

    // Create message footer
    const messageFooter = document.createElement("div");
    messageFooter.classList.add("message-footer");

    // Timestamp
    const timestampDiv = document.createElement("div");
    timestampDiv.classList.add("user-timestamp");
    timestampDiv.textContent = getCurrentTime();

    // Append timestamp to footer
    messageFooter.appendChild(timestampDiv);

    // Append text and footer to message div
    userMessageDiv.appendChild(messageTextDiv);
    userMessageDiv.appendChild(messageFooter);

    const userAvatarDiv = document.createElement("div");
    userAvatarDiv.classList.add("user-avatar");
    userAvatarDiv.innerHTML = USER_AVATAR_ICON;

    userMessageContainer.appendChild(userMessageDiv);
    userMessageContainer.appendChild(userAvatarDiv);
    messageContainer.appendChild(userMessageContainer);

    messageContainer.scrollTop = messageContainer.scrollHeight;

    console.log("User message added:", message);
  }

  // Function to add bot message
  function addBotMessage(message) {
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

    const messageTextDiv = document.createElement("div");
    messageTextDiv.classList.add("message-text");
    messageTextDiv.textContent = message;

    const messageFooter = document.createElement("div");
    messageFooter.classList.add("message-footer");

    // Feedback Buttons Container
    const feedbackDiv = document.createElement("div");
    feedbackDiv.classList.add("feedback-buttons");

    // Sound Button
    const soundBtn = document.createElement("button");
    soundBtn.classList.add("sound-btn");
    soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    soundBtn.addEventListener("click", function () {
      speakText(message);
      console.log("Sound button clicked.");
    });

    // Thumbs Up Button
    const thumbsUp = document.createElement("button");
    thumbsUp.classList.add("thumbs-up");
    thumbsUp.innerHTML = '<i class="fas fa-thumbs-up"></i>';

    // Thumbs Down Button
    const thumbsDown = document.createElement("button");
    thumbsDown.classList.add("thumbs-down");
    thumbsDown.innerHTML = '<i class="fas fa-thumbs-down"></i>';

    // Add event listeners after both buttons are defined
    thumbsUp.addEventListener("click", function () {
      thumbsUp.style.color = "green";
      thumbsDown.style.color = "";
      showTemporaryMessage("Thank you for your feedback!", "like");
      console.log("Thumbs Up clicked.");
    });

    thumbsDown.addEventListener("click", function () {
      thumbsDown.style.color = "red";
      thumbsUp.style.color = "";
      showTemporaryMessage(
        "I'm sorry to hear that. I'll improve.",
        "dislike"
      );
      console.log("Thumbs Down clicked.");
    });

    // Append feedback buttons
    feedbackDiv.appendChild(soundBtn);
    feedbackDiv.appendChild(thumbsUp);
    feedbackDiv.appendChild(thumbsDown);

    // Timestamp
    const timestampDiv = document.createElement("div");
    timestampDiv.classList.add("timestamp");
    timestampDiv.textContent = getCurrentTime();

    // Append feedback and timestamp to footer
    messageFooter.appendChild(feedbackDiv);
    messageFooter.appendChild(timestampDiv);

    botMessageDiv.appendChild(messageTextDiv);
    botMessageDiv.appendChild(messageFooter);

    botMessageContainer.appendChild(avatarImg);
    botMessageContainer.appendChild(botMessageDiv);

    messageContainer.appendChild(botMessageContainer);
    messageContainer.scrollTop = messageContainer.scrollHeight;

    console.log("Bot message added:", message);
  }

  // Function to show temporary messages (feedback)
  function showTemporaryMessage(text, type) {
    const temporaryMessageDiv = document.createElement("div");
    temporaryMessageDiv.classList.add("temporary-message");

    if (type === "like") {
      temporaryMessageDiv.style.backgroundColor = "#e0f7e9";
      temporaryMessageDiv.style.color = "#00796b";
    } else if (type === "dislike") {
      temporaryMessageDiv.style.backgroundColor = "#fdecea";
      temporaryMessageDiv.style.color = "#c62828";
    }

    temporaryMessageDiv.textContent = text;
    messageContainer.appendChild(temporaryMessageDiv);

    messageContainer.scrollTop = messageContainer.scrollHeight;

    setTimeout(() => {
      temporaryMessageDiv.remove();
      console.log("Temporary message removed:", text);
    }, 4000);
  }

  // Function to handle text-to-speech
  function speakText(text) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
      console.log("Speaking text:", text);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech.");
      console.error("Text-to-speech not supported.");
    }
  }

  // Function to get current time in HH:MM format
  function getCurrentTime() {
    const now = new Date();
    return now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");
  }
});
