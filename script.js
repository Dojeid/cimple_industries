const API_KEY = 'AIzaSyDtRjEJDFx09e_6tbBDQ4nxTnrwhbC3_8s'; // Replace with your actual API key
const MODEL = 'gemini-1.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Add a welcome message
addMessage('bot', 'Hello! I\'m your AI chatbot powered by Google Gemini. How can I help?');

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage('user', message);
  userInput.value = '';
  sendBtn.disabled = true;
  sendBtn.textContent = 'Thinking...';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
      })
    });

    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();
    const botReply = data.candidates[0].content.parts[0].text;
    addMessage('bot', botReply);
  } catch (error) {
    addMessage('bot', 'Sorry, something went wrong. Please try again.');
    console.error('Error:', error);
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send';
  }
}

function addMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}