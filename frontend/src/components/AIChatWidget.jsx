import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hi, I\'m the SkillHub assistant. Ask me anything about a course and I\'ll help you find your footing.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

        try {
            const res = await fetch(`${API_URL}/api/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.text, context: 'Dashboard' }),
                credentials: 'include'
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                const detailedError = errorData.details ? ` (${errorData.details})` : '';
                const suggestion = errorData.suggestion ? `\n\nTip: ${errorData.suggestion}` : '';
                throw new Error(`${errorData.error || 'Server Error'}${detailedError}${suggestion}`);
            }

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'ai', text: data.reply || 'Sorry, I am offline.' }]);
        } catch (error) {
            console.error('AI Chat Error:', error);
            setMessages(prev => [...prev, { role: 'ai', text: `Issue: ${error.message}` }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        style={{
                            position: 'absolute',
                            bottom: '80px',
                            right: 0,
                            width: '350px',
                            height: '500px',
                            background: 'var(--surface)',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-hover)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            border: '1px solid var(--border)'
                        }}
                    >
                        <div style={{ padding: '16px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600,
                                    color: 'var(--bg)', background: 'var(--accent)', width: '24px', height: '24px',
                                    borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>SH</span>
                                <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}>
                                <X size={18} />
                            </button>
                        </div>

                        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg)' }}>
                            {messages.map((msg, i) => (
                                <div key={i} style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    background: msg.role === 'user' ? 'var(--accent)' : 'var(--surface)',
                                    color: msg.role === 'user' ? 'var(--bg)' : 'var(--text-main)',
                                    padding: '11px 13px',
                                    borderRadius: 'var(--radius-md)',
                                    maxWidth: '85%',
                                    border: msg.role === 'ai' ? '1px solid var(--border)' : 'none',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.5
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                            {isTyping && (
                                <div style={{ alignSelf: 'flex-start', background: 'var(--surface)', padding: '11px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                    <Loader size={15} className="animate-spin" color="var(--accent)" />
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSend} style={{ display: 'flex', padding: '14px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question..."
                                style={{ flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', outline: 'none', background: 'var(--bg)', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '0.875rem' }}
                            />
                            <button type="submit" disabled={!input.trim() || isTyping} style={{ marginLeft: '8px', padding: '10px 14px', background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Send size={15} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--accent)',
                    color: 'var(--bg)',
                    border: 'none',
                    boxShadow: 'var(--shadow-hover)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>
        </div>
    );
};

export default AIChatWidget;
