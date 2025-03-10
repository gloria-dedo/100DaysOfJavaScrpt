// @ts-nocheck

// Create a WebSocket connection
const ws = new WebSocket('ws://localhost:3000/server')

// ws.onmessage = (event) => {
//   console.log('Message received from server')
//   const message = JSON.parse(event.data)
//   console.log(message)
//   chatMessages.innerHTML += createChatMessageElement(message)
// }

ws.onmessage = (event) => {
  console.log('Message received from server');
  const message = JSON.parse(event.data);
  
  // Check if the message is a typing indicator
  if (message.isTyping) {
    // Show typing indicator (e.g., add a typing indicator element to the chat)
    showTypingIndicator(message.sender);
  } else {
    // Remove typing indicator if it exists
    removeTypingIndicator(message.sender);
    
    // Append the actual message to the chat
    chatMessages.innerHTML += createChatMessageElement(message);
  }
  
  // Scroll to the bottom of chat messages
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

const showTypingIndicator = (sender) => {
  // Logic to display a typing indicator (e.g., add a placeholder message element)
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'typing-indicator';
  typingIndicator.innerText = `${sender} is typing...`;
  chatMessages.appendChild(typingIndicator);
};

const removeTypingIndicator = (sender) => {
  // Logic to remove the typing indicator
  const typingIndicators = document.querySelectorAll('.typing-indicator');
  typingIndicators.forEach(indicator => {
    if (indicator.innerText.includes(sender)) {
      indicator.remove();
    }
  });
};


const userInfoModal = document.querySelector('.user-info-modal')
const userInfoForm = document.querySelector('.user-info-form')

const chatHeader = document.querySelector('.chat-header')
const chatMessages = document.querySelector('.chat-messages')
const chatInputForm = document.querySelector('.chat-input-form')
const chatInput = document.querySelector('.chat-input')
const clearChatBtn = document.querySelector('.clear-chat-button')

let messageSender = ''
let chatCode = ''

const createChatMessageElement = (message) => `
  <div class="message ${message.sender === messageSender ? 'blue-bg' : 'gray-bg'}">
    <div class="message-sender">${message.sender}</div>
    <div class="message-text">${message.text}</div>
    <div class="message-timestamp">${message.timestamp}</div>
  </div>
`

const updateMessageSender = (name, code) => {
  messageSender = name
  chatCode = code
  chatHeader.innerText = `${name}`
  chatInput.placeholder = `Type here, ${messageSender}...`

  /* auto-focus the input field */
  chatInput.focus()
}

userInfoForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const username = e.target.username.value
  // const chatCode = e.target.chatCode.value

  updateMessageSender(username)

  ws.send(JSON.stringify({ type: 'join', }))
  userInfoModal.style.display = 'none'
})

const sendMessage = (e) => {
  e.preventDefault()

  const timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  const message = {
    sender: messageSender,
    text: chatInput.value,
    timestamp,
    chatCode,
  }

  // Send message through WebSocket
  ws.send(JSON.stringify(message))

  // Clear input field
  chatInputForm.reset()

  // Scroll to bottom of chat messages
  chatMessages.scrollTop = chatMessages.scrollHeight
}

chatInputForm.addEventListener('submit', sendMessage)

clearChatBtn.addEventListener('click', () => {
  localStorage.clear()
  chatMessages.innerHTML = ''
})