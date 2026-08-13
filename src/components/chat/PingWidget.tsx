'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// ── Structured Signal design-system scoped styles ──
// Uses globals.css tokens so the widget reads as built-in, not bolted-on.
const STYLES = `
.pw-root, .pw-root * { box-sizing: border-box; margin: 0; padding: 0; }
.pw-root {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.55;
  color: var(--text-primary);
}

.pw-host { position: fixed; bottom: 22px; right: 22px; z-index: var(--z-overlay); }

/* ───── FAB — a quiet signal node (no perpetual motion) ───── */
.pw-fab {
  position: relative;
  width: 52px; height: 52px; border-radius: 50%;
  border: 1px solid var(--border-default);
  background: var(--surface-raised);
  color: hsl(var(--accent-interactive));
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow-md);
  transition: border-color var(--duration-fast) var(--ease-standard),
              color var(--duration-fast) var(--ease-standard);
}
.pw-fab:hover {
  border-color: hsl(var(--accent-interactive) / 0.7);
  color: hsl(var(--accent-interactive-hover));
}
.pw-fab-glyph {
  font-family: var(--font-mono);
  font-size: 20px; font-weight: 600;
  letter-spacing: -0.02em; line-height: 1;
}

/* ───── Panel ───── */
.pw-panel {
  position: fixed; bottom: 86px; right: 22px;
  width: 384px; max-width: calc(100vw - 32px);
  height: 560px; max-height: calc(100vh - 140px);
  background: var(--surface-raised);
  border: 1px solid var(--border-subtle);
  border-radius: 0.5rem;
  display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 24px 60px -12px rgb(0 0 0 / 0.7);
  animation: pw-slide var(--duration-normal) var(--ease-decelerate);
}
@keyframes pw-slide {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* scanline overlay — same motif as the site terminals */
.pw-panel::after {
  content: ''; position: absolute; inset: 0;
  pointer-events: none; opacity: 0.5; z-index: 1;
  background: linear-gradient(to bottom,
    rgba(255,255,255,0), rgba(255,255,255,0) 50%,
    rgba(0,0,0,0.10) 50%, rgba(0,0,0,0.10));
  background-size: 100% 4px;
}

/* ───── Header ───── */
.pw-header {
  position: relative; z-index: 2;
  padding: 13px 16px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex; align-items: center; gap: 10px;
  background: var(--surface-base);
}
.pw-status-dot {
  display: inline-block; width: 8px; height: 8px; border-radius: 50%;
  background: hsl(var(--accent-interactive));
  box-shadow: 0 0 7px hsl(var(--accent-interactive) / 0.6);
  flex-shrink: 0;
}
.pw-header-text h3 {
  font-family: var(--font-display);
  font-size: 14px; font-weight: 600;
  color: var(--text-primary); letter-spacing: -0.01em;
}
.pw-header-text p {
  font-family: var(--font-mono);
  font-size: 10.5px; color: var(--text-tertiary);
  margin-top: 2px; letter-spacing: 0.04em;
  text-transform: uppercase;
}
.pw-close {
  margin-left: auto; background: none; border: none;
  color: var(--text-tertiary); cursor: pointer;
  font-size: 15px; padding: 4px 6px; border-radius: 4px; line-height: 1;
  transition: color var(--duration-fast), background var(--duration-fast);
}
.pw-close:hover { color: var(--text-primary); background: var(--surface-overlay); }

/* ───── Messages ───── */
.pw-messages {
  position: relative; z-index: 2;
  flex: 1; overflow-y: auto;
  padding: 16px;
  display: flex; flex-direction: column; gap: 14px;
  scroll-behavior: smooth;
}
.pw-messages::-webkit-scrollbar { width: 6px; }
.pw-messages::-webkit-scrollbar-track { background: transparent; }
.pw-messages::-webkit-scrollbar-thumb {
  background: var(--border-default); border-radius: 3px;
}
.pw-messages::-webkit-scrollbar-thumb:hover { background: var(--text-tertiary); }

.pw-empty {
  margin: auto; text-align: center; max-width: 280px;
}
.pw-empty-mark {
  font-family: var(--font-mono); font-size: 13px;
  color: var(--text-tertiary); letter-spacing: 0.08em;
  text-transform: uppercase; margin-bottom: 10px;
}
.pw-empty-text {
  font-size: 13px; color: var(--text-secondary); line-height: 1.6;
}
.pw-empty-suggest {
  margin-top: 14px; display: flex; flex-direction: column; gap: 6px;
}
.pw-suggest-btn {
  text-align: left; background: var(--surface-overlay);
  border: 1px solid var(--border-subtle); border-radius: 0.375rem;
  padding: 8px 11px; font-family: var(--font-body); font-size: 12px;
  color: var(--text-secondary); cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}
.pw-suggest-btn:hover {
  border-color: hsl(var(--accent-interactive) / 0.4);
  color: var(--text-primary);
}
.pw-suggest-btn .pw-suggest-tag {
  font-family: var(--font-mono); font-size: 10px;
  color: hsl(var(--accent-interactive)); margin-right: 6px;
  text-transform: uppercase; letter-spacing: 0.05em;
}

.pw-msg {
  display: flex; max-width: 88%;
  animation: pw-in var(--duration-fast) var(--ease-decelerate);
}
@keyframes pw-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

.pw-msg-user { align-self: flex-end; flex-direction: row-reverse; }
.pw-msg-user .pw-bubble {
  background: color-mix(in srgb, hsl(var(--accent-interactive)) 16%, var(--surface-overlay));
  border: 1px solid hsl(var(--accent-interactive) / 0.3);
  color: var(--text-primary);
  border-radius: 0.75rem 0.75rem 0.25rem 0.75rem;
}
.pw-msg-assistant { align-self: flex-start; }
.pw-msg-assistant .pw-bubble {
  background: var(--surface-overlay);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  border-radius: 0.75rem 0.75rem 0.75rem 0.25rem;
}
.pw-bubble { padding: 10px 13px; font-size: 13.5px; line-height: 1.55; word-break: break-word; }
.pw-bubble > * + * { margin-top: 8px; }
.pw-bubble p { margin: 0; }
/* markdown typography inside bubbles */
.pw-bubble strong { color: var(--text-primary); font-weight: 600; }
.pw-bubble ul, .pw-bubble ol { padding-left: 18px; }
.pw-bubble li { margin-bottom: 3px; }
.pw-bubble li::marker { color: hsl(var(--accent-interactive)); }
.pw-bubble code {
  font-family: var(--font-mono); font-size: 12px;
  background: var(--surface-sunken);
  border: 1px solid var(--border-subtle);
  padding: 1px 5px; border-radius: 4px; color: var(--text-primary);
}
.pw-blockquote {
  border-left: 2px solid hsl(var(--accent-interactive) / 0.5);
  padding-left: 10px; color: var(--text-secondary);
}
.pw-cursor {
  display: inline-block; width: 0.55em; height: 1.05em;
  background: hsl(var(--accent-interactive)); margin-left: 2px;
  vertical-align: text-bottom; animation: pw-blink 1s step-end infinite;
}
@keyframes pw-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

/* ───── Loading dots (while first token pending) ───── */
.pw-loading {
  align-self: flex-start; display: flex; align-items: center; gap: 5px;
  padding: 12px 14px; background: var(--surface-overlay);
  border: 1px solid var(--border-subtle); border-radius: 0.75rem;
  width: fit-content;
}
.pw-loading span {
  width: 6px; height: 6px; border-radius: 50%;
  background: hsl(var(--accent-interactive) / 0.7);
  animation: pw-dot 1.4s infinite ease-in-out;
}
.pw-loading span:nth-child(2) { animation-delay: 0.2s; }
.pw-loading span:nth-child(3) { animation-delay: 0.4s; }
@keyframes pw-dot { 0%,80%,100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }

/* ───── Input ───── */
.pw-input-bar {
  position: relative; z-index: 2;
  padding: 11px 12px; border-top: 1px solid var(--border-subtle);
  display: flex; gap: 8px; background: var(--surface-base);
}
.pw-input {
  flex: 1; resize: none; max-height: 100px;
  background: var(--surface-overlay); border: 1px solid var(--border-default);
  border-radius: 0.5rem; padding: 9px 12px;
  color: var(--text-primary); font-family: var(--font-body); font-size: 13px;
  outline: none; line-height: 1.45;
  transition: border-color var(--duration-fast), box-shadow var(--duration-fast);
}
.pw-input:focus {
  border-color: hsl(var(--accent-interactive) / 0.6);
  box-shadow: 0 0 0 3px hsl(var(--accent-interactive) / 0.12);
}
.pw-input::placeholder { color: var(--text-tertiary); }
.pw-input:disabled { opacity: 0.5; }
.pw-send {
  flex-shrink: 0; width: 38px; height: 38px; border-radius: 0.5rem;
  border: 1px solid hsl(var(--accent-interactive) / 0.4);
  background: color-mix(in srgb, hsl(var(--accent-interactive)) 14%, var(--surface-overlay));
  color: hsl(var(--accent-interactive)); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--duration-fast) var(--ease-standard);
}
.pw-send:hover:not(:disabled) {
  background: color-mix(in srgb, hsl(var(--accent-interactive)) 22%, var(--surface-overlay));
  border-color: hsl(var(--accent-interactive));
}
.pw-send:disabled { opacity: 0.35; cursor: not-allowed; }

.pw-error {
  position: relative; z-index: 2;
  font-family: var(--font-mono); font-size: 11px;
  color: hsl(var(--error)); padding: 7px 16px 0;
}
`;

const SUGGESTIONS: { tag: string; text: string }[] = [
  { tag: 'who', text: 'Who is Dhanush?' },
  { tag: 'skills', text: 'What are his skills?' },
  { tag: 'projects', text: 'What projects has he built?' },
];

export default function PingWidget() {
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [streaming, setStreaming] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const abortRef = useRef<AbortController | null>(null);
	const streamRef = useRef<string>('');
	const messagesRef = useRef<Message[]>([]);

	useEffect(() => { messagesRef.current = messages; }, [messages]);

	const scrollToBottom = useCallback(() => {
		setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 40);
	}, []);
	useEffect(() => { scrollToBottom(); }, [messages, streaming, scrollToBottom]);
	useEffect(() => () => { abortRef.current?.abort(); }, []);

	const send = async (text: string) => {
		const trimmed = text.trim();
		if (!trimmed || streaming) return;
		setInput('');
		setError(null);

		const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed };
		const current = messagesRef.current;
		const assistantPlaceholder: Message = { id: crypto.randomUUID(), role: 'assistant', content: '' };
		const nextMessages = [...current, userMsg, assistantPlaceholder];

		setMessages(nextMessages);
		messagesRef.current = nextMessages;

		abortRef.current?.abort();
		const controller = new AbortController();
		abortRef.current = controller;
		setStreaming(true);
		streamRef.current = '';

		try {
			// Send only REAL turns to the model — the empty assistant placeholder is a
			// client-side streaming artifact; if it reaches the model it corrupts output.
			const historyForModel = nextMessages
				.filter(m => m.content.trim() !== '')
				.map(m => ({ role: m.role, content: m.content }));

			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: historyForModel }),
				signal: controller.signal,
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
				setMessages(prev => [...prev.slice(0, -1), { ...prev[prev.length - 1]!, content: `Error: ${err.error || err.message || res.statusText}` }]);
				setStreaming(false);
				return;
			}

			const reader = res.body?.getReader();
			if (!reader) throw new Error('No response stream');
			const decoder = new TextDecoder();
			let buf = '';
			let streamDone = false;
			let currentEvent = 'chunk';

			while (!streamDone) {
				const { value, done } = await reader.read();
				if (done) break;
				buf += decoder.decode(value, { stream: true });
				const lines = buf.split('\n');
				buf = lines.pop() ?? '';
				for (const line of lines) {
					const trimmedLine = line.trim();
					if (trimmedLine.startsWith('event:')) {
						currentEvent = trimmedLine.slice(6).trim();
						continue;
					}
					if (!trimmedLine.startsWith('data:')) continue;
					const payload = trimmedLine.slice(5).trim();
					if (!payload) continue;
					try {
						const evt = JSON.parse(payload);
						const eventType = currentEvent === 'message' ? 'chunk' : currentEvent;
						if (eventType === 'chunk') {
							streamRef.current += (evt as { content: string }).content;
							setMessages(prev => [...prev.slice(0, -1), { ...prev[prev.length - 1]!, content: streamRef.current }]);
						} else if (eventType === 'done') {
							setStreaming(false);
							streamDone = true;
							break;
						} else if (eventType === 'error') {
							setMessages(prev => [...prev.slice(0, -1), { ...prev[prev.length - 1]!, content: `Error: ${(evt as { message: string }).message}` }]);
							setStreaming(false);
							streamDone = true;
							break;
						}
					} catch { /* skip malformed */ }
				}
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : 'Request failed';
			if (msg !== 'The user aborted a request.') setError(msg);
			setStreaming(false);
		}
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send(input);
		}
	};

	const lastAssistantStreaming =
		streaming && messages.length > 0 && messages[messages.length - 1]!.role === 'assistant';

	return (
		<>
			<style>{STYLES}</style>
			<div className="pw-root">
				<div className="pw-host">
					{open ? (
						<div className="pw-panel">
							<div className="pw-header">
								<span className="pw-status-dot" />
								<div className="pw-header-text">
									<h3>Ping</h3>
									<p>assistant // knows dhanush</p>
								</div>
								<button className="pw-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
							</div>

							<div className="pw-messages">
								{messages.length === 0 && !error && (
									<div className="pw-empty">
										<div className="pw-empty-mark">ping</div>
										<div className="pw-empty-text">
											Ask me anything about Dhanush — his work, skills, projects, or background.
										</div>
										<div className="pw-empty-suggest">
											{SUGGESTIONS.map((s) => (
												<button
													key={s.tag}
													className="pw-suggest-btn"
													onClick={() => send(s.text)}
													disabled={streaming}
												>
													<span className="pw-suggest-tag">{s.tag}</span>{s.text}
												</button>
											))}
										</div>
									</div>
								)}
								{error && <div className="pw-error">{error}</div>}
								{messages.map((m) => (
									<div key={m.id} className={"pw-msg pw-msg-" + m.role}>
										<div className="pw-bubble">
											{m.role === 'user' ? (
												<p>{m.content}</p>
											) : m.content ? (
												<>
													<ReactMarkdown remarkPlugins={[remarkGfm]}>
														{m.content}
													</ReactMarkdown>
													{lastAssistantStreaming && m.id === messages[messages.length - 1]!.id && <span className="pw-cursor" />}
												</>
											) : null}
										</div>
									</div>
								))}
								{streaming && messages.length > 0 && messages[messages.length - 1]!.role === 'assistant' && messages[messages.length - 1]!.content === '' && (
									<div className="pw-loading"><span /><span /><span /></div>
								)}
								<div ref={messagesEndRef} />
							</div>

							<div className="pw-input-bar">
								<textarea
									className="pw-input"
									rows={1}
									value={input}
									placeholder="Ask anything…"
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={onKeyDown}
									disabled={streaming}
								/>
								<button className="pw-send" onClick={() => send(input)} disabled={streaming || !input.trim()} aria-label="Send">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<line x1="22" y1="2" x2="11" y2="13" />
										<polygon points="22 2 15 22 11 13 2 9" />
									</svg>
								</button>
							</div>
						</div>
					) : (
						<button className="pw-fab" onClick={() => setOpen(true)} aria-label="Open chat">
							<span className="pw-fab-glyph">◈</span>
						</button>
					)}
				</div>
			</div>
		</>
	);
}
