document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;

        appendMessage(userMessage, 'user-message');
        chatInput.value = '';

        // Simulate a response or call an API
        getChatbotResponse(userMessage);
    }

    function appendMessage(message, className) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', className);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function getChatbotResponse(message) {
        appendMessage('Typing...', 'bot-message'); // Placeholder for typing indicator

        try {
           
            const GROQ_API_KEY = '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'; 
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama3-8b-8192', 
                    messages: [{ role: 'user', content: message }],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            const botResponse = data.choices[0].message.content;
            
            // Remove typing indicator
            const typingIndicator = chatMessages.querySelector('.bot-message:last-child');
            if (typingIndicator && typingIndicator.textContent === 'Typing...') {
                chatMessages.removeChild(typingIndicator);
            }

            appendMessage(botResponse, 'bot-message');
        } catch (error) {
            console.error('Error fetching chatbot response:', error);
            // Remove typing indicator
            const typingIndicator = chatMessages.querySelector('.bot-message:last-child');
            if (typingIndicator && typingIndicator.textContent === 'Typing...') {
                chatMessages.removeChild(typingIndicator);
            }
            appendMessage('Sorry, I could not get a response. Please try again later.', 'bot-message error');
        }
    }
});