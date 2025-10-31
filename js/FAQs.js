document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQs 
    initFaqAccordion();
});

function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}