document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQs 
    initFaqAccordion();
    
    // Load chatbot component
    loadChatbot();

    const showFaqsButton = document.getElementById('show-faqs');
    const showAssistantButton = document.getElementById('show-assistant');
    const faqSection = document.getElementById('faq-section');
    const chatbotSection = document.getElementById('chatbot-section');
 

    showFaqsButton.addEventListener('click', () => {
        faqSection.style.display = 'block';
        chatbotSection.style.display = 'none';
        showFaqsButton.classList.add('active');
        showAssistantButton.classList.remove('active');
    });

    showAssistantButton.addEventListener('click', () => {
        faqSection.style.display = 'none';
        chatbotSection.style.display = 'block';
        showFaqsButton.classList.remove('active');
        showAssistantButton.classList.add('active');
    });
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
    // Change target from chatbotPlaceholder to chatbotSection
    const chatbotSection = document.getElementById('chatbot-section');
    
    if (chatbotSection) {
        fetch('/top-academy/components/chatbot.html')
            .then(response => response.text())
            .then(html => {
                chatbotSection.innerHTML = html; 
                const script = document.createElement('script');
                script.src = '/top-academy/js/chatbot.js';
                document.body.appendChild(script);
            })
            .catch(error => {
                console.error('Error loading chatbot component:', error);
            });
    }
}