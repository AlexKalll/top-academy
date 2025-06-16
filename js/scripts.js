// Load header and footer components
document.addEventListener('DOMContentLoaded', () => {
    const loadComponent = async (id, path, jsPath = null) => {
        try {
            const res = await fetch(path);
            const html = await res.text();
            const placeholder = document.getElementById(id);
            if (placeholder) {
                placeholder.innerHTML = html;
                if (jsPath) {
                    const script = document.createElement('script');
                    script.src = jsPath;
                    script.defer = true; // Defer script execution
                    document.body.appendChild(script);
                }
            }
        } catch (err) {
            console.error(`Error loading ${path}:`, err);
        }
    };

    // Load Header and Footer with absolute paths for GitHub Pages
    loadComponent('header-placeholder', '/top-academy/components/header.html');
    loadComponent('footer-placeholder', '/top-academy/components/footer.html');

    // Load Chatbot component and its JS
    loadComponent('chatbot-placeholder', '/top-academy/components/chatbot.html', '/top-academy/js/chatbot.js');
});