import React, { useState, useEffect, useRef } from 'react';
import { Send, Cpu, X, Sparkles, ClipboardList, FileText } from 'lucide-react';
import { getGeminiResponse, generateQuiz, generateMemoryCards } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function AITutor({ moduleId, moduleName }: { moduleId?: string; moduleName?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: `Halo! Saya Tutor Medis AI Anda. Saya siap membantu Anda menjelajahi ${moduleName || 'anatomi'}. Apa yang ingin Anda fokuskan?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    const response = await getGeminiResponse(userMessage, { moduleId, moduleName });
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-[#0a0a0a] border-b border-white/10 px-4 py-3 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4da1ff] to-[#7c3aed] flex items-center justify-center overflow-hidden border border-white/10">
            <img src="/tomy.png" alt="Tomy Assistant" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
            <Cpu className="w-5 h-5 text-white absolute opacity-0" />
          </div>
          <div>
            <h2 className="text-[10px] font-bold text-white uppercase tracking-widest">Tomy AI Assistant</h2>
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.1em]">Node Aktif</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#020202]">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex flex-col max-w-[95%]", msg.role === 'user' ? "items-end self-end" : "items-start")}>
            <div className={cn(
              "rounded-xl px-4 py-3 text-[11px] leading-relaxed prose prose-invert prose-xs max-w-none",
              msg.role === 'user' 
                ? "bg-white/5 border border-white/5 italic text-white/70" 
                : "bg-primary/5 border border-primary/10 text-white/90 shadow-[0_0_15px_rgba(77,161,255,0.05)]"
            )}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-primary font-black text-[8px] uppercase tracking-widest px-2 animate-pulse">
            <Sparkles className="w-3 h-3" />
            Menganalisis Data...
          </div>
        )}
      </div>

      <div className="p-3 bg-[#0a0a0a] border-t border-white/5">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Cari anatomi..."
            className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-[11px] text-white outline-none focus:border-primary/30 transition-all placeholder:text-white/10"
          />
        </div>
      </div>
    </div>
  );
}
