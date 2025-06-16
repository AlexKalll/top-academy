// Load header and footer components
document.addEventListener('DOMContentLoaded', () => {
    const loadComponent = async (id, path) => {
        try {
            const res = await fetch(path);
            const html = await res.text();
            document.getElementById(id).innerHTML = html;
        } catch (err) {
            console.error(`Error loading ${path}:`, err);
        }
    };

    loadComponent('header-placeholder', '/top-academy/components/header.html');
    loadComponent('footer-placeholder', '/top-academy/components/footer.html');
});