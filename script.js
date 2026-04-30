document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // AI Chat Box Logic
  const chatToggleBtn = document.getElementById('chat-toggle-btn');
  const chatWindow = document.getElementById('chat-window');
  const closeChatBtn = document.getElementById('close-chat-btn');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  // Toggle chat window
  chatToggleBtn.addEventListener('click', () => {
    chatWindow.classList.add('active');
    chatToggleBtn.style.display = 'none';
    chatInput.focus();
    scrollToBottom();
  });

  // Close chat window
  closeChatBtn.addEventListener('click', () => {
    chatWindow.classList.remove('active');
    chatToggleBtn.style.display = 'flex';
  });

  // Scroll to bottom of messages
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Handle message submission
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageText = chatInput.value.trim();
    if (!messageText) return;

    // Add user message
    addMessage(messageText, 'user');
    chatInput.value = '';
    
    // Disable input while waiting
    chatInput.disabled = true;
    chatInput.placeholder = "AI is thinking...";

    try {
      // Send to Flask backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText })
      });

      const data = await response.json();
      
      if (response.ok) {
        addMessage(data.response, 'ai');
      } else {
        addMessage(data.error || "Sorry, I encountered an error.", 'ai');
      }
    } catch (error) {
      addMessage("Failed to connect to the AI server.", 'ai');
    } finally {
      // Re-enable input
      chatInput.disabled = false;
      chatInput.placeholder = "Ask me anything...";
      chatInput.focus();
    }
  });

  // Helper to add a message to the DOM
  function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'chat-bubble';
    bubbleDiv.textContent = text;
    
    msgDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(msgDiv);
    
    scrollToBottom();
  }
});
