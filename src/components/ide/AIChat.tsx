import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, Code, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Message, FileSystemItem } from '../../types';
import { toast } from 'sonner';

interface AIChatProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  activeFile: FileSystemItem | undefined;
}

export default function AIChat({ messages, setMessages, activeFile }: AIChatProps) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've analyzed your request for ${activeFile?.name || 'the project'}. Here's how I can help: 

I recommend refactoring the main loop to use a more efficient data structure. Based on your current context, we could implement a memoization pattern to optimize performance.`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
      toast.success('AI suggest updated');
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-[#09090b]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50 px-6">
            <div className="p-4 rounded-full bg-blue-500/10 text-blue-400">
              <Sparkles size={32} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-300">Lil'big AI Assistant</h3>
              <p className="text-xs mt-1">Ask me to write code, debug issues, or explain logic. I support 40+ models!</p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full mt-4">
              {['"Fix the bug in App.tsx"', '"Explain this function"', '"Add a new login component"'].map((prompt, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(prompt.replace(/"/g, ''))}
                  className="text-[10px] text-left p-2 rounded border border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={cn(
            "flex gap-3 max-w-[90%]",
            msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-zinc-800" : "bg-blue-600/20 text-blue-400 border border-blue-500/30"
            )}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-xs leading-relaxed",
              msg.role === 'user' ? "bg-zinc-800 text-zinc-100 rounded-tr-none" : "bg-zinc-900/50 border border-zinc-800/50 text-zinc-300 rounded-tl-none shadow-sm"
            )}>
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 mr-auto animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 flex items-center gap-1">
              <Loader2 size={12} className="animate-spin text-blue-400" />
              <span className="text-[10px] text-zinc-500">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-800/50 bg-[#0c0c0e]">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Lil'big AI..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none pr-12 min-h-[44px] max-h-32"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 bottom-2 p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/20"
          >
            <Send size={14} />
          </button>
        </div>
        <div className="flex justify-between mt-2 px-1">
          <div className="flex gap-2">
            <button className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
              <Code size={10} /> Context: App.tsx
            </button>
          </div>
          <span className="text-[10px] text-zinc-600 flex items-center gap-1">
            <Zap size={10} className="text-yellow-500" /> Powered by GPT-4o
          </span>
        </div>
      </div>
    </div>
  );
}