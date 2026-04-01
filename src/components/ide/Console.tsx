import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Trash2 } from 'lucide-react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { cn } from '../../lib/utils';
import { LogEntry } from '../../types';

interface ConsoleProps {
  logs: LogEntry[];
  onClear: () => void;
}

export default function Console({ logs, onClear }: ConsoleProps) {
  const [activeTab, setActiveTab] = useState<'console' | 'terminal' | 'ports'>('console');
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (activeTab === 'terminal' && terminalRef.current && !xtermRef.current) {
      const term = new XTerm({
        cursorBlink: true,
        fontSize: 12,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        theme: {
          background: '#09090b',
          foreground: '#d4d4d8',
          cursor: '#60a5fa',
          selectionBackground: '#2563eb33',
          black: '#09090b',
          red: '#f87171',
          green: '#4ade80',
          yellow: '#fbbf24',
          blue: '#60a5fa',
          magenta: '#c084fc',
          cyan: '#22d3ee',
          white: '#e4e4e7',
        },
        allowTransparency: true,
        scrollback: 1000,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      const ESC = String.fromCharCode(27);
      const CR = String.fromCharCode(13);
      const LF = String.fromCharCode(10);
      const CRLF = CR + LF;

      term.writeln(ESC + '[1;34mWelcome to Lil-Big-Source Terminal' + ESC + '[0m');
      term.writeln(ESC + '[2mType "help" for a list of commands' + ESC + '[0m');
      term.write(CRLF + ESC + '[32m~/workspace $' + ESC + '[0m ');

      let currentCommand = '';
      term.onData(data => {
        const code = data.charCodeAt(0);
        if (code === 13) {
          term.write(CRLF);
          handleCommand(currentCommand, term);
          currentCommand = '';
          term.write(CRLF + ESC + '[32m~/workspace $' + ESC + '[0m ');
        } else if (code === 127) {
          if (currentCommand.length > 0) {
            currentCommand = currentCommand.slice(0, -1);
            term.write(String.fromCharCode(8) + ' ' + String.fromCharCode(8));
          }
        } else if (data.length === 1 && code >= 32 && code <= 126) {
          currentCommand += data;
          term.write(data);
        }
      });

      xtermRef.current = term;
      fitAddonRef.current = fitAddon;
    }

    const handleResize = () => {
      fitAddonRef.current?.fit();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  const handleCommand = (cmd: string, term: XTerm) => {
    const trimmed = cmd.trim();
    if (trimmed === 'help') {
      term.writeln('Available commands:');
      term.writeln('  help     - Show this help message');
      term.writeln('  clear    - Clear the terminal');
      term.writeln('  ls       - List files');
      term.writeln('  date     - Show current date');
      term.writeln('  whoami   - Show current user');
    } else if (trimmed === 'clear') {
      term.clear();
    } else if (trimmed === 'ls') {
      term.writeln('src/  package.json  tsconfig.json  README.md');
    } else if (trimmed === 'date') {
      term.writeln(new Date().toLocaleString());
    } else if (trimmed === 'whoami') {
      term.writeln('lilbig-user');
    } else if (trimmed !== '') {
      term.writeln('sh: command not found: ' + trimmed);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#09090b] overflow-hidden">
      <div className="flex items-center justify-between px-4 border-y border-zinc-800/50 bg-[#0c0c0e]">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('console')}
            className={cn(
              "py-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2",
              activeTab === 'console' ? "border-blue-500 text-blue-400" : "border-transparent text-zinc-500 hover:text-zinc-300"
            )}
          >
            Console
          </button>
          <button 
            onClick={() => setActiveTab('terminal')}
            className={cn(
              "py-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2",
              activeTab === 'terminal' ? "border-blue-500 text-blue-400" : "border-transparent text-zinc-500 hover:text-zinc-300"
            )}
          >
            Terminal
          </button>
          <button 
            onClick={() => setActiveTab('ports')}
            className={cn(
              "py-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2",
              activeTab === 'ports' ? "border-blue-500 text-blue-400" : "border-transparent text-zinc-500 hover:text-zinc-300"
            )}
          >
            Ports
          </button>
        </div>
        <div className="flex gap-2 text-zinc-500">
          <button onClick={onClear} title="Clear Console">
            <Trash2 size={14} className="cursor-pointer hover:text-white" />
          </button>
          <Maximize2 size={14} className="cursor-pointer hover:text-white" />
          <X size={14} className="cursor-pointer hover:text-white" />
        </div>
      </div>
      
      <div className="flex-1 font-mono text-xs overflow-hidden relative">
        <div className={cn("h-full overflow-y-auto p-3", activeTab !== 'console' && "hidden")}>
          <div className="space-y-1">
            {logs.length === 0 ? (
              <span className="text-zinc-600 italic uppercase tracking-tighter opacity-50">No output yet. Run your code to see logs here.</span>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={cn(
                  "border-l-2 pl-3 py-0.5",
                  log.type === 'error' ? "border-red-500/50 text-red-400 bg-red-500/5" : 
                  log.type === 'warn' ? "border-yellow-500/50 text-yellow-400 bg-yellow-500/5" : 
                  "border-blue-500/20 text-zinc-300"
                )}>
                  <span className="text-[9px] text-zinc-600 mr-2">[{log.timestamp}]</span>
                  {log.message}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div 
          className={cn("h-full w-full bg-[#09090b]", activeTab !== 'terminal' && "hidden")} 
          ref={terminalRef} 
        />

        {activeTab === 'ports' && (
          <div className="flex flex-col items-center justify-center h-full opacity-30">
            <TerminalIcon size={32} className="mb-2" />
            <span className="uppercase tracking-widest text-[10px] font-bold">No active ports found</span>
          </div>
        )}
      </div>
    </div>
  );
}