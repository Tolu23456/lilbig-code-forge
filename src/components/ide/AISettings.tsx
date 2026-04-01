import React, { useState } from 'react';
import { Shield, Key, Cpu, Info, CheckCircle2, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AIModel } from '../../types';

const MODELS: AIModel[] = [
  // OpenAI
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
  // Anthropic
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', provider: 'Anthropic' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
  // Google
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google' },
  { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', provider: 'Google' },
  // Meta
  { id: 'llama-3-1-405b', name: 'Llama 3.1 405B', provider: 'Meta' },
  { id: 'llama-3-1-70b', name: 'Llama 3.1 70B', provider: 'Meta' },
  { id: 'llama-3-1-8b', name: 'Llama 3.1 8B', provider: 'Meta' },
  { id: 'llama-3-70b', name: 'Llama 3 70B', provider: 'Meta' },
  // Mistral
  { id: 'mistral-large-2', name: 'Mistral Large 2', provider: 'Mistral' },
  { id: 'mistral-medium', name: 'Mistral Medium', provider: 'Mistral' },
  { id: 'mistral-small', name: 'Mistral Small', provider: 'Mistral' },
  { id: 'codestral', name: 'Codestral', provider: 'Mistral' },
  // Cohere
  { id: 'command-r-plus', name: 'Command R+', provider: 'Cohere' },
  { id: 'command-r', name: 'Command R', provider: 'Cohere' },
  // Perplexity
  { id: 'sonar-huge', name: 'Sonar Huge', provider: 'Perplexity' },
  { id: 'sonar-large', name: 'Sonar Large', provider: 'Perplexity' },
  // Local AI (Ollama/LM Studio)
  { id: 'local-llama-3', name: 'Llama 3 (Local)', provider: 'Local', isLocal: true },
  { id: 'local-mistral', name: 'Mistral (Local)', provider: 'Local', isLocal: true },
  { id: 'local-phi-3', name: 'Phi-3 (Local)', provider: 'Local', isLocal: true },
  { id: 'local-gemma', name: 'Gemma (Local)', provider: 'Local', isLocal: true },
  { id: 'local-deepseek', name: 'DeepSeek Coder (Local)', provider: 'Local', isLocal: true },
  // DeepSeek
  { id: 'deepseek-v2-5', name: 'DeepSeek-V2.5', provider: 'DeepSeek' },
  { id: 'deepseek-coder', name: 'DeepSeek Coder V2', provider: 'DeepSeek' },
  // Groq (fast inference)
  { id: 'groq-llama-3-70b', name: 'Llama 3 70B (Groq)', provider: 'Groq' },
  { id: 'groq-mixtral', name: 'Mixtral 8x7B (Groq)', provider: 'Groq' },
  // Together AI
  { id: 'together-llama-3', name: 'Llama 3 70B (Together)', provider: 'Together' },
  { id: 'together-qwen-2', name: 'Qwen 2 72B (Together)', provider: 'Together' },
];

export default function AISettings() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [search, setSearch] = useState('');
  const [keys, setKeys] = useState<Record<string, string>>({
    'openai': 'sk-....',
    'anthropic': '',
    'google': '',
    'mistral': '',
    'deepseek': '',
  });

  const filteredModels = MODELS.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.provider.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#09090b] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-zinc-300">
              <Cpu size={14} className="text-blue-500" />
              Models Selection
            </h3>
            <span className="text-[10px] text-blue-500 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded">{MODELS.length} Models</span>
          </div>
          <p className="text-[10px] text-zinc-500 mb-4 font-medium uppercase tracking-tighter">Choose your intelligence engine.</p>
          
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search 40+ models..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-lg pl-9 pr-3 py-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500/30"
            />
          </div>

          <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredModels.map(model => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={cn(
                  "w-full flex items-center justify-between p-2.5 rounded-lg text-xs transition-all border",
                  selectedModel === model.id 
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400" 
                    : "border-transparent bg-zinc-900/30 text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
                )}
              >
                <div className="flex flex-col items-start">
                  <span className="font-bold tracking-tight">{model.name}</span>
                  <span className="text-[9px] opacity-60 font-medium uppercase">{model.provider}</span>
                </div>
                {selectedModel === model.id && <CheckCircle2 size={14} />}
                {model.isLocal && <span className="text-[8px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-full font-bold">LOCAL</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800/50">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2 text-zinc-300">
            <Shield size={14} className="text-green-500" />
            API Credentials
          </h3>
          <p className="text-[10px] text-zinc-500 mb-4 font-medium uppercase tracking-tighter">Stored locally in your secure vault.</p>
          
          <div className="space-y-4">
            {['OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'Mistral'].map((provider) => (
              <div key={provider}>
                <label className="block text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2">{provider}</label>
                <div className="relative">
                  <Key size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input 
                    type="password" 
                    placeholder={`sk-........................`}
                    value={keys[provider.toLowerCase()] || ''}
                    onChange={(e) => setKeys({...keys, [provider.toLowerCase()]: e.target.value})}
                    className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-lg pl-8 pr-3 py-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-green-500/30"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800/50">
          <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg flex gap-3">
            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <div className="text-[10px] text-blue-500/80 leading-relaxed font-medium">
              <strong>Local LLM Support:</strong> Point your workspace to Ollama (http://localhost:11434) or LM Studio (http://localhost:1234) for offline development.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}