"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Laxance Financial Assistant. How can I help you optimize your wealth today?' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { role: 'user', content: input };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch('/api/financial-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          history: messages.slice(1).map(m => ({ role: m.role, content: m.content })) 
        })
      });
      
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      console.error('Laxance Assistant Error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered a synchronization error with my neural frequency. Please try asking again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Hello! I am your Laxance Financial Assistant. How can I help you optimize your wealth today?' }]);
  };

  return (
    <div className="chat-container">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#000', color: '#fff', padding: '0.5rem', borderRadius: '8px' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Financial AI Chat</h1>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Always active, always intelligent.</p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #eee', background: '#fff', cursor: 'pointer' }}
        >
          Clear History
        </button>
      </header>

      <div style={{ 
        flex: 1, 
        background: '#fff', 
        borderRadius: '16px', 
        border: '1px solid #eee', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                display: 'flex', 
                gap: '1rem', 
                flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              <div style={{ 
                padding: '0.5rem', 
                background: m.role === 'assistant' ? '#000' : '#f0f0f0', 
                borderRadius: '8px',
                color: m.role === 'assistant' ? '#fff' : '#000'
              }}>
                {m.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div 
                className="chat-bubble"
                style={{ 
                  background: m.role === 'assistant' ? '#f9f9f9' : '#000',
                  color: m.role === 'assistant' ? '#000' : '#fff',
                  border: m.role === 'assistant' ? '1px solid #eee' : 'none'
                }}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
               <Loader2 size={16} className="animate-spin" />
               <span style={{ fontSize: '0.8rem', color: '#888' }}>AI is thinking...</span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="chat-input-area">
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your finances..."
              disabled={isTyping}
              style={{ 
                flex: 1, 
                padding: '1rem 1.5rem', 
                borderRadius: '12px', 
                border: '1px solid #ddd',
                outline: 'none',
                fontSize: '1rem'
              }}
            />
            <button 
              onClick={handleSend}
              disabled={isTyping}
              className="btn btn-primary" 
              style={{ borderRadius: '12px', padding: '0 1.5rem' }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
