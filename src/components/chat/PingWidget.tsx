'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: string;
}

const STYLES = `
.pw-root * { box-sizing: border-box; margin: 0; padding: 0; }
.pw-root {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	font-size: 14px;
	line-height: 1.5;
	color: #e8eaf0;
}

.pw-host {
	position: fixed;
	bottom: 24px;
	right: 24px;
	z-index: 9999;
}

/* ───── FAB ───── */
.pw-fab {
	width: 56px;
	height: 56px;
	border-radius: 50%;
	border: none;
	background: #3f4450;
	color: #fff;
	cursor: pointer;
	font-size: 22px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s;
}
.pw-fab:hover {
	background: #4f5663;
	transform: scale(1.05);
}

/* ───── Panel ───── */
.pw-panel {
	position: fixed;
	bottom: 92px;
	right: 24px;
	width: 380px;
	max-width: calc(100vw - 32px);
	height: 540px;
	max-height: calc(100vh - 140px);
	background: #0d1117;
	border: 1px solid #21262d;
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	box-shadow: 0 20px 60px rgba(0,0,0,0.5);
	animation: pw-slide 0.2s ease-out;
}
@keyframes pw-slide {
	from { opacity: 0; transform: translateY(10px); }
	to { opacity: 1; transform: translateY(0); }
}

/* ───── Header ───── */
.pw-header {
	padding: 14px 18px;
	border-bottom: 1px solid #21262d;
	display: flex;
	align-items: center;
	gap: 10px;
	background: #0d1117;
}
.pw-header-text h3 {
	font-size: 14px;
	font-weight: 600;
	color: #f0f6fc;
}
.pw-header-text p {
	font-size: 11px;
	color: #8b949e;
	margin-top: 1px;
}
.pw-close {
	margin-left: auto;
	background: none;
	border: none;
	color: #8b949e;
	cursor: pointer;
	font-size: 18px;
	padding: 4px;
	border-radius: 4px;
	line-height: 1;
}
.pw-close:hover {
	color: #f0f6fc;
	background: rgba(255,255,255,0.05);
}

/* ───── Messages ───── */
.pw-messages {
	flex: 1;
	overflow-y: auto;
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	scroll-behavior: smooth;
}
.pw-messages::-webkit-scrollbar { width: 5px; }
.pw-messages::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }

.pw-empty {
	text-align: center;
	color: #8b949e;
	margin: auto;
	font-size: 13px;
}

.pw-msg {
	display: flex;
	gap: 8px;
	max-width: 85%;
	animation: pw-in 0.15s ease-out;
}
@keyframes pw-in {
	from { opacity: 0; transform: translateY(4px); }
	to { opacity: 1; transform: translateY(0); }
}
.pw-msg-user {
	align-self: flex-end;
	flex-direction: row-reverse;
}
.pw-msg-user .pw-bubble {
	background: #3f4450;
	color: #fff;
	border-radius: 12px 12px 4px 12px;
}
.pw-msg-assistant { align-self: flex-start; }
.pw-msg-assistant .pw-bubble {
	background: #161b22;
	border: 1px solid #21262d;
	color: #e6edf3;
	border-radius: 12px 12px 12px 4px;
}
.pw-bubble {
	padding: 10px 14px;
	font-size: 13.5px;
	line-height: 1.5;
	word-break: break-word;
}
.pw-bubble p { margin: 0 0 8px; }
.pw-bubble p:last-child { margin-bottom: 0; }
.pw-bubble code {
	background: rgba(255,255,255,0.08);
	color: #e6edf3;
	padding: 1px 5px;
	border-radius: 4px;
	font-family: 'SF Mono', monospace;
	font-size: 12px;
}
.pw-bubble ul, .pw-bubble ol {
	margin: 4px 0;
	padding-left: 18px;
}
.pw-bubble li { margin-bottom: 3px; }

/* ───── Loading dots ───── */
.pw-loading {
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 10px 14px;
	background: #161b22;
	border: 1px solid #21262d;
	border-radius: 12px;
	width: fit-content;
}
.pw-loading span {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: #8b949e;
	animation: pw-dot 1.4s infinite ease-in-out;
}
.pw-loading span:nth-child(1) { animation-delay: 0s; }
.pw-loading span:nth-child(2) { animation-delay: 0.2s; }
.pw-loading span:nth-child(3) { animation-delay: 0.4s; }
@keyframes pw-dot {
	0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
	40% { transform: scale(1); opacity: 1; }
}

/* ───── Input ───── */
.pw-input-bar {
	padding: 12px;
	border-top: 1px solid #21262d;
	display: flex;
	gap: 8px;
	background: #0d1117;
}
.pw-input {
	flex: 1;
	background: #161b22;
	border: 1px solid #30363d;
	border-radius: 8px;
	padding: 8px 12px;
	color: #f0f6fc;
	font-size: 13px;
	outline: none;
	resize: none;
	font-family: inherit;
	max-height: 100px;
	transition: border-color 0.15s;
}
.pw-input:focus {
	border-color: #8b949e;
}
.pw-input::placeholder {
	color: #484f58;
}
.pw-send {
	width: 36px;
	height: 36px;
	border-radius: 8px;
	border: none;
	background: #3f4450;
	color: #fff;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	transition: background 0.15s;
}
.pw-send:hover:not(:disabled) {
	background: #4f5663;
}
.pw-send:disabled {
	opacity: 0.3;
	cursor: not-allowed;
}

.pw-status {
	font-size: 11px;
	color: #f85149;
	padding: 6px 16px;
	background: rgba(248,81,73,0.05);
}
`;

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
		setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
	}, []);

	useEffect(() => { scrollToBottom(); }, [messages, streaming, scrollToBottom]);
	useEffect(() => () => { abortRef.current?.abort(); }, []);

	const send = async () => {
		const text = input.trim();
		if (!text || streaming) return;
		setInput('');
		setError(null);

		const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
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
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: nextMessages.map(m => ({ role: m.role, content: m.content })) }),
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
				buf = lines.pop() || '';
				for (const line of lines) {
					const trimmed = line.trim();
					if (trimmed.startsWith('event:')) {
						currentEvent = trimmed.slice(6).trim();
						continue;
					}
					if (!trimmed.startsWith('data:')) continue;
					const payload = trimmed.slice(5).trim();
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
					} catch { /* skip */ }
				}
			}
			if (buf.trim().startsWith('data:')) {
				try {
					const evt = JSON.parse(buf.slice(5).trim());
					if ((evt as { event?: string }).event === 'done' || streamRef.current) setStreaming(false);
				} catch {}
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
			send();
		}
	};

	return (
		<>
			<style>{STYLES}</style>
			<div className="pw-root">
				<div className="pw-host">
					{open ? (
						<div className="pw-panel">
							<div className="pw-header">
								<div className="pw-header-text">
									<h3>Ping</h3>
									<p>Ask about Dhanush</p>
								</div>
								<button className="pw-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
							</div>

							<div className="pw-messages">
								{messages.length === 0 && !streaming && !error && (
									<div className="pw-empty">Ask me anything about Dhanush.</div>
								)}
								{messages.map((m) => (
									<div key={m.id} className={"pw-msg pw-msg-" + m.role}>
										<div className="pw-bubble" dangerouslySetInnerHTML={{ __html: m.content || (m.role === 'assistant' ? '…' : '') }} />
									</div>
								))}
								{streaming && !error && (
									<div className="pw-loading">
										<span /><span /><span />
									</div>
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
								<button className="pw-send" onClick={send} disabled={streaming || !input.trim()} aria-label="Send">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<line x1="22" y1="2" x2="11" y2="13" />
										<polygon points="22 2 15 22 11 13 2 9" />
									</svg>
								</button>
							</div>

							{error && <div className="pw-status">{error}</div>}
						</div>
					) : (
						<button className="pw-fab" onClick={() => setOpen(true)} aria-label="Open chat">◈</button>
					)}
				</div>
			</div>
		</>
	);
}