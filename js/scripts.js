// Load header, footer, and chatbot components
document.addEventListener('DOMContentLoaded', () => {
    const tryFetchSequential = async (paths) => {
        for (const p of paths) {
            try {
                const res = await fetch(p);
                if (res.ok) return await res.text();
            } catch (_) {}
        }
        throw new Error('All fetch attempts failed for: ' + paths.join(', '));
    };

    const baseCandidates = (relPath) => {
        // Works on GitHub Pages (/top-academy/...), on localhost root, and via file://
        const repoBase = '/top-academy/';
        const pathNoSlash = relPath.replace(/^\/+/, '');
        return [
            repoBase + pathNoSlash,
            '/' + pathNoSlash,
            pathNoSlash
        ];
    };

    const loadComponent = async (id, relPath) => {
        try {
            const html = await tryFetchSequential(baseCandidates(relPath));
            const host = document.getElementById(id);
            if (host) host.innerHTML = html;
        } catch (err) {
            console.error(`Error loading ${relPath}:`, err);
        }
    };

    loadComponent('header-placeholder', 'components/header.html');
    loadComponent('footer-placeholder', 'components/footer.html');

    // Learn More button → services.html
    const learnMoreBtn = document.querySelector('.btn-lm');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            window.location.href = 'services.html';
        });
    }

    // Optionally load config.js if present (for production API key injection)
    (async () => {
        try {
            for (const cand of baseCandidates('js/config.js')) {
                try {
                    const head = await fetch(cand, { method: 'HEAD' });
                    if (head.ok) {
                        const s = document.createElement('script');
                        s.src = cand;
                        document.head.appendChild(s);
                        break;
                    }
                } catch (_) {}
            }
        } catch (err) {
            console.warn('Optional config.js not loaded:', err);
        }
    })();

    // Inject chatbot widget globally if not already present
    (async () => {
        try {
            if (!document.getElementById('chatbot-widget')) {
                const html = await tryFetchSequential(baseCandidates('components/chatbot.html'));
                const container = document.createElement('div');
                container.innerHTML = html;
                document.body.appendChild(container.firstElementChild);
            }
            // Ensure chatbot script loaded once
            const existing = Array.from(document.scripts).some(s => s.src.endsWith('/js/chatbot.js') || s.src.endsWith('js/chatbot.js'));
            if (!existing) {
                const scriptSrc = await (async () => {
                    for (const cand of baseCandidates('js/chatbot.js')) {
                        try {
                            const head = await fetch(cand, { method: 'HEAD' });
                            if (head.ok) return cand;
                        } catch (_) {}
                    }
                    return 'js/chatbot.js';
                })();
                const s = document.createElement('script');
                s.src = scriptSrc;
                document.body.appendChild(s);
            }
        } catch (err) {
            console.error('Error injecting chatbot widget:', err);
        }
    })();
});