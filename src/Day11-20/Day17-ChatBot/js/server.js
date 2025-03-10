const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const axios = require('axios'); // You'll need to install this: npm install axios

const app = express();

// Get the root project directory
const projectRoot = path.join(__dirname, '../../../..');

app.use(express.static(projectRoot, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get('/server', (req, res) => {
    res.send('Chat server running')
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const chatRooms = {};

// Enhanced chatBot with more intelligence
const chatBot = {
    name: 'AI Assistant',
    personality: {
        greetings: ['Hello!', 'Hi there!', 'Hey!', 'Greetings!'],
        farewells: ['Goodbye!', 'See you later!', 'Bye!', 'Take care!'],
        thinking: ['Let me think about that...', 'Interesting question...', 'Give me a moment to process that...']
    },

    // Basic conversation patterns
    conversationPatterns: {
        greetings: /^(hi|hello|hey|good morning|good afternoon|good evening)/i,
        howAreYou: /how are you|how('s| is) it going|what('s| is) up/i,
        thanks: /thank(s| you)/i,
        goodbye: /bye|goodbye|see you|farewell/i,
        weather: /weather|temperature|forecast/i,
        time: /what('s| is) the time|what time is it/i,
        name: /what('s| is) your name|who are you/i,
        science: /what is|how does|why does|explain|tell me about/i,
    },

    // Function to detect message type
    detectMessageType(message) {
        for (let [type, pattern] of Object.entries(this.conversationPatterns)) {
            if (pattern.test(message.toLowerCase())) {
                return type;
            }
        }
        return 'unknown';
    },

    // Function to generate appropriate response
    async generateResponse(message) {
        const messageType = this.detectMessageType(message);
        
        switch (messageType) {
            case 'greetings':
                return this.personality.greetings[Math.floor(Math.random() * this.personality.greetings.length)];
            
            case 'howAreYou':
                return "I'm doing great, thanks for asking! I'm here to help you with any questions you might have.";
            
            case 'thanks':
                return "You're welcome! Let me know if you need anything else.";
            
            case 'goodbye':
                return this.personality.farewells[Math.floor(Math.random() * this.personality.farewells.length)];
            
            case 'weather':
                return "I wish I could check the weather for you! But I don't have access to real-time weather data at the moment.";
            
            case 'time':
                return `The current time is ${new Date().toLocaleTimeString()}`;
            
            case 'name':
                return `I'm ${this.name}, your friendly AI assistant! How can I help you today?`;
            
            case 'science':
                try {
                    // Using Google Search API (you'll need to set up API keys)
                    const response = await this.searchGoogle(message);
                    return response;
                } catch (error) {
                    return "I'd love to help you with that question! However, my search functionality is currently limited. I can still try to help you with what I know!";
                }
            
            default:
                // Handle general conversation
                return this.handleGeneralConversation(message);
        }
    },

    // Function to handle general conversation
    handleGeneralConversation(message) {
        const lowercaseMsg = message.toLowerCase();
        
        // Check if it's a question
        if (lowercaseMsg.includes('?')) {
            return "That's an interesting question! While I don't have access to real-time information, I can discuss this topic based on what I know. What specific aspect would you like to explore?";
        }

        // If it seems like a statement
        return "I understand what you're saying. Would you like to discuss this further or should we explore a different topic?";
    },

    // Function to simulate Google search (you'll need to implement actual API integration)
    async searchGoogle(query) {
        try {
            const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
                params: {
                    key: process.env.key,
                    cx: '5736f97396b834ccc',
                    q: query
                }
            });
            return response.data.items[0].snippet;
        } catch (error) {
            return "I'm having trouble searching for that information right now.";
        }
    }
};

// Function to create bot message
const createBotMessage = async (text, chatCode) => ({
    sender: chatBot.name,
    text: await chatBot.generateResponse(text),
    timestamp: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
    chatCode
});

// Function to send bot response after a delay
const sendBotResponse = async (clients, message, chatCode) => {
    // Send "typing" indicator
    const typingMessage = {
        sender: chatBot.name,
        text: "...",
        isTyping: true,
        chatCode
    };

    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(typingMessage));
        }
    });

    // Generate and send actual response after a realistic delay
    setTimeout(async () => {
        const botMessage = await createBotMessage(message, chatCode);
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(botMessage));
            }
        });
    }, Math.random() * 1000 + 500); // Random delay between 0.5 and 1.5 seconds
};

wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        const messageObject = JSON.parse(message.toString());
        const { type, chatCode, text } = messageObject;

        if (type === 'join') {
            chatRooms[chatCode] = chatRooms[chatCode] || new Set();
            chatRooms[chatCode].add(ws);
            const welcomeMessage = {
                sender: chatBot.name,
                text: "Hello! I'm your AI assistant. I can help answer questions and engage in conversation. Feel free to ask me anything!",
                timestamp: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
                chatCode
            };
            ws.send(JSON.stringify(welcomeMessage));
            return;
        }

        const targetClients = chatRooms[chatCode];
        if (targetClients) {
            // Broadcast user message
            targetClients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(messageObject));
                }
            });

            // Send bot response
            await sendBotResponse(targetClients, text, chatCode);
        }
    });

    ws.on('close', () => {
        Object.values(chatRooms).forEach(clients => {
            clients.delete(ws);
        });
    });
});

server.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
    console.log('Serving static files from:', projectRoot);
});