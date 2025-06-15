document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQs 
    initFaqAccordion();
    
    // Load chatbot component
    loadChatbot();
});

function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Check if current item is already active
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // If clicked item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

function loadChatbot() {
    const chatbotPlaceholder = document.getElementById('chatbot-placeholder');
    
    if (chatbotPlaceholder) {
        fetch('../components/chatbot.html')
            .then(response => response.text())
            .then(html => {
                chatbotPlaceholder.innerHTML = html;
                
                // Initialize chatbot functionality after loading the component
                const script = document.createElement('script');
                script.src = '../js/chatbot.js';
                document.body.appendChild(script);
            })
            .catch(error => {
                console.error('Error loading chatbot component:', error);
            });
    }
}