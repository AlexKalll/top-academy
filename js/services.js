document.addEventListener('DOMContentLoaded', function() {
	openAssistantWhenReady();
	wireServiceCtas();
});

function openAssistantWhenReady(retries = 30) {
	// Prefer global API
	if (window.TopAcademyAssistant && typeof window.TopAcademyAssistant.open === 'function') {
		window.TopAcademyAssistant.open();
		return;
	}
	// Fallback to direct toggle click once elements exist
	const panel = document.getElementById('chatbot-panel');
	const toggle = document.getElementById('chatbot-toggle');
	if (panel && toggle && panel.hasAttribute('hidden')) {
		toggle.click();
		return;
	}
	if (retries > 0) {
		setTimeout(() => openAssistantWhenReady(retries - 1), 200);
	}
}

function wireServiceCtas() {
	const cards = Array.from(document.querySelectorAll('.srv-card'));
	cards.forEach((card) => {
		const btn = card.querySelector('.lm-btn');
		if (!btn) return;
		const titleEl = card.querySelector('h2');
		const title = titleEl ? titleEl.textContent.trim() : 'Service Inquiry';
		btn.addEventListener('click', () => {
			const params = new URLSearchParams({ service: title });
			window.location.href = `contact.html?${params.toString()}`;
		});
	});
}
