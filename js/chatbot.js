(function () {
	const WIDGET_IDS = {
		widget: 'chatbot-widget',
		panel: 'chatbot-panel',
		toggle: 'chatbot-toggle',
		close: 'chatbot-close',
		keyBtn: 'chatbot-key-btn',
		messages: 'chat-messages',
		input: 'chat-input',
		send: 'send-button'
	};

	const COMPANY_CONTEXT = (
		"You are the helpful, concise assistant for Top Academy. " +
		"Answer ONLY about Top Academy's services, mission, vision, team, contact, and policies based on the context below. " +
		"If a question is unrelated, politely decline and steer the user back to Top Academy topics.\n\n" +
		"Company: Top Academy\n" +
		"Mission: Empower students through personalized, accessible, practical education with skilled instructors and parent collaboration.\n" +
		"Vision: Every student has the tools, support, and opportunity to thrive in academics, research, and technology.\n" +
		"Services: Academic Tutoring (all core subjects), Research/Thesis Support (topic to defense), Coding Education (from basics to web dev).\n" +
		"Approach: Personalized plans, flexible schedules (online + in-person), affordable, result‑driven, strong parent updates.\n" +
		"Audience: Elementary, high school, and university students; instructors; partners (schools, NGOs).\n" +
		"Location: Addis Ababa, Ethiopia (4 Kilo).\n" +
		"Contact: contact@topacademy.et, +251 909146096, Telegram: https://t.me/Top_Academy_2025\n" +
		"Team: Founder & CEO: Kaletsidik Ayalew; Development Lead: Mekuanint Workie; Communication Lead: Nebiyu Minwuyelet; Senior Instructor: Melkamu Gatew; Coding Instructor: Henok Getahun.\n" +
		"Pricing: Varies by level and frequency; scholarships available for qualifying students.\n" +
		"FAQ highlights: group sessions available; parents can track progress; both online and in‑person sessions supported.\n"
	);

	function readMeta(name) {
		const el = document.querySelector(`meta[name="${name}"]`);
		return el ? (el.getAttribute('content') || '').trim() : '';
	}

	function resolveApiKey() {
		const ls = localStorage.getItem('groq_api_key');
		if (ls && ls.trim()) return ls.trim();
		const globalKey = (window.__GROQ_API_KEY__ || '').trim ? window.__GROQ_API_KEY__ : '';
		if (globalKey) return globalKey;
		const metaKey = readMeta('groq-api-key');
		if (metaKey) return metaKey;
		return '';
	}
	function setApiKey(key) {
		localStorage.setItem('groq_api_key', (key || '').trim());
	}

	function isReady() {
		return !!document.getElementById(WIDGET_IDS.panel);
	}

	function init() {
		const widget = document.getElementById(WIDGET_IDS.widget);
		const panel = document.getElementById(WIDGET_IDS.panel);
		const toggle = document.getElementById(WIDGET_IDS.toggle);
		const close = document.getElementById(WIDGET_IDS.close);
		const keyBtn = document.getElementById(WIDGET_IDS.keyBtn);
		const send = document.getElementById(WIDGET_IDS.send);
		const input = document.getElementById(WIDGET_IDS.input);

		if (!panel || !toggle || !send || !input || !widget) return;
		if (widget.dataset.initialized === '1') return;

		function openPanel() {
			if (panel.hasAttribute('hidden')) {
				panel.removeAttribute('hidden');
				panel.setAttribute('aria-hidden', 'false');
				toggle.setAttribute('aria-expanded', 'true');
				input.focus();
				ensureWelcome();
			}
		}
		function closePanel() {
			if (!panel.hasAttribute('hidden')) {
				panel.setAttribute('hidden', '');
				panel.setAttribute('aria-hidden', 'true');
				toggle.setAttribute('aria-expanded', 'false');
			}
		}

		// Toggle by bubble
		toggle.addEventListener('click', () => {
			if (panel.hasAttribute('hidden')) openPanel(); else closePanel();
		});
		// Close by ✕
		if (close) close.addEventListener('click', (e) => { e.stopPropagation(); closePanel(); });
		// Close on outside click
		document.addEventListener('click', (e) => {
			const target = e.target;
			if (!widget.contains(target) && !panel.hasAttribute('hidden')) {
				closePanel();
			}
		});
		// Close on Escape
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') closePanel();
		});
		// Key management
		if (keyBtn) {
			keyBtn.addEventListener('click', () => {
				const current = resolveApiKey();
				const next = window.prompt('Enter your Groq API Key (stored locally):', current || '');
				if (next) setApiKey(next);
			});
		}

		send.addEventListener('click', () => sendMessage());
		input.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') sendMessage();
		});

		ensureWelcome();

		// Public API
		window.TopAcademyAssistant = window.TopAcademyAssistant || {
			open: () => { openPanel(); return true; }
		};

		widget.dataset.initialized = '1';
	}

	function ensureWelcome() {
		const messages = document.getElementById(WIDGET_IDS.messages);
		if (!messages) return;
		if (messages.childElementCount === 0) {
			appendMessage(
				"Hi! I'm the Top Academy Assistant. Ask me anything about our services, mission, pricing, schedules, or how to get started.",
				'bot'
			);
		}
	}

	function appendMessage(text, author) {
		const messages = document.getElementById(WIDGET_IDS.messages);
		if (!messages) return;
		const item = document.createElement('div');
		item.className = `chat-message ${author === 'user' ? 'user-message' : 'bot-message'}`;
		item.textContent = text;
		messages.appendChild(item);
		messages.scrollTop = messages.scrollHeight;
	}

	async function sendMessage() {
		const input = document.getElementById(WIDGET_IDS.input);
		const userMessage = (input && input.value ? input.value : '').trim();
		if (!userMessage) return;
		appendMessage(userMessage, 'user');
		if (input) input.value = '';

		const messagesEl = document.getElementById(WIDGET_IDS.messages);
		const typing = document.createElement('div');
		typing.className = 'chat-message bot-message typing';
		typing.textContent = 'Typing…';
		if (messagesEl) messagesEl.appendChild(typing);
		try {
			const apiKey = resolveApiKey();
			if (!apiKey) {
				throw new Error('Missing API key');
			}
			const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({
					model: 'llama3-8b-8192',
					temperature: 0.2,
					messages: [
						{ role: 'system', content: COMPANY_CONTEXT },
						{ role: 'user', content: userMessage }
					]
				})
			});
			let data;
			if (!res.ok) {
				// Try to parse error JSON
				try { data = await res.json(); } catch (_) { data = null; }
				const apiErr = data && (data.error?.message || data.error) ? ` - ${data.error?.message || data.error}` : '';
				throw new Error(`HTTP ${res.status} ${res.statusText}${apiErr}`);
			}
			data = await res.json();
			if (data && data.error) {
				throw new Error(`Groq error: ${data.error.message || data.error}`);
			}
			const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
				? data.choices[0].message.content
				: 'Sorry, I could not get a response.';
			typing.remove();
			appendMessage(content, 'bot');
		} catch (err) {
			console.error(err);
			typing.remove();
			const msg = String(err && err.message || err);
			if (msg.includes('Missing API key')) {
				appendMessage('No API key found. Click the key icon (🔑), or define one in js/config.js as window.__GROQ_API_KEY__ = "..." or a <meta name="groq-api-key" content="..."> tag.', 'bot');
			} else if (msg.includes('401')) {
				appendMessage('Unauthorized (401). Your API key may be invalid. Click 🔑 to update it.', 'bot');
			} else if (location.protocol === 'file:') {
				appendMessage('Network error. When using file://, some browsers block requests. Please run a local server (e.g., python -m http.server) and try again.', 'bot');
			} else {
				appendMessage('Sorry, I could not get a response. Please try again later.', 'bot');
			}
		}
	}

	// Ensure we initialize when the widget is injected later
	function bindWhenReady() {
		if (document.getElementById(WIDGET_IDS.widget)) {
			init();
			return;
		}
		const mo = new MutationObserver(() => {
			const w = document.getElementById(WIDGET_IDS.widget);
			if (w && w.dataset.initialized !== '1') {
				init();
			}
		});
		mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', bindWhenReady);
	} else {
		bindWhenReady();
	}
})();