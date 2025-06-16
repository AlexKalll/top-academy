document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotCloseBtn = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send');

    // Toggle chatbot window visibility
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
    });

    chatbotCloseBtn.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    // Function to add a message to the chat window
    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message', sender);
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to bottom
    };

    // Simulate bot response (replace with actual API call)
    const getBotResponse = async (message) => {
        // Placeholder for Groq API integration
        // IMPORTANT: For production, you should use a server-side proxy
        // to securely handle your GROQ_API_KEY and make API calls.
        // Never expose your API key directly in client-side code.

        // Example of how you might call a server-side endpoint:
        /*
        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            });
            const data = await response.json();
            addMessage(data.response, 'bot');
        } catch (error) {
            console.error('Error fetching bot response:', error);
            addMessage('Sorry, I am having trouble connecting right now.', 'bot');
        }
        */

        // Simple placeholder responses for demonstration
        const lowerCaseMessage = message.toLowerCase();
        if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
            addMessage('Hello! How can I help you with Top Academy today?', 'bot');
        } else if (lowerCaseMessage.includes('services')) {
            addMessage('Top Academy offers Academic Tutoring, Research & Thesis Support, and Coding Education. What are you interested in?', 'bot');
        } else if (lowerCaseMessage.includes('about')) {
            addMessage('Top Academy is dedicated to empowering minds and shaping futures through high-quality education. We aim to onboard 10,000 students and recruit 500 instructors.', 'bot');
        } else if (lowerCaseMessage.includes('contact')) {
            addMessage('You can reach us via email at info@topacademy.com or by phone at +1 (123) 456-7890.', 'bot');
        } else if (lowerCaseMessage.includes('courses')) {
            addMessage('We offer a wide range of courses. Please visit our Services page for more details.', 'bot');
        } else {
            addMessage('I am designed to answer questions about Top Academy. Please ask me something related to our services, mission, or contact information.', 'bot');
        }
    };

    // Handle sending messages
    const sendMessage = () => {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatbotInput.value = '';
            getBotResponse(message);
        }
    };

    chatbotSendBtn.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Initial bot message
    addMessage('Hi there! I am your Top Academy assistant. How can I help you today?', 'bot');
});