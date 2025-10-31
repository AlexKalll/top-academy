document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    // Prefill message from ?service=
    try {
        const usp = new URLSearchParams(window.location.search);
        const service = (usp.get('service') || '').trim();
        if (service) {
            const msg = document.getElementById('message');
            if (msg) {
                msg.value = `Hello Top Academy, I’m interested in ${service}.\n\nHere are a few details about me/our needs:`;
                msg.focus();
            }
        }
    } catch (_) {}
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Create success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.textContent = `Thank you, ${fullName}! Your message has been sent. We'll get back to you soon.`;
            
            contactForm.parentNode.insertBefore(successMessage, contactForm);
            
            // Show success message
            successMessage.style.display = 'block';
            
            contactForm.reset();
            
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000); // remove the success message after 5sec 
        });
    }
});