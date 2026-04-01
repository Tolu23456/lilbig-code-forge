import React, { useState, useEffect } from 'react';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from './components/ui/resizable';
import { 
  Layout,
  Play,
  Share2,
  Plus,
  Terminal as TerminalIcon,
  Code2,
  Cloud,
  ChevronRight,
  Monitor,
  GitBranch
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { cn } from './lib/utils';
import { FileSystemItem, Message, LogEntry } from './types';
import Sidebar from './components/ide/Sidebar';
import FileExplorer from './components/ide/FileExplorer';
import EditorArea from './components/ide/EditorArea';
import Console from './components/ide/Console';
import AIChat from './components/ide/AIChat';
import AISettings from './components/ide/AISettings';

const INITIAL_FILES: FileSystemItem[] = [
  { 
    id: 'src-folder', 
    name: 'src', 
    type: 'folder', 
    parentId: null, 
    isOpen: true 
  },
  { 
    id: 'app-tsx', 
    name: 'App.tsx', 
    type: 'file', 
    parentId: 'src-folder', 
    content: `import React from 'react';

export default function App() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-400">Hello Lil'big Source!</h1>
      <p className="mt-4 text-zinc-400">Your AI-powered cloud IDE.</p>
    </div>
  );
}`, 
    language: 'typescript' 
  },
  { 
    id: 'index-css', 
    name: 'index.css', 
    type: 'file', 
    parentId: 'src-folder', 
    content: `body {
  background-color: #09090b;
  color: #fff;
  font-family: sans-serif;
}`, 
    language: 'css' 
  },
  { 
    id: 'package-json', 
    name: 'package.json', 
    type: 'file', 
    parentId: null, 
    content: `{
  "name": "lilbig-workspace",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`, 
    language: 'json' 
  },
];

export default function App() {
  const [files, setFiles] = useState<FileSystemItem[]>(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState<string | null>('app-tsx');
  const [activeTab, setActiveTab] = useState<'explorer' | 'search' | 'git' | 'packages' | 'settings'>('explorer');
  const [rightPanel, setRightPanel] = useState<'chat' | 'settings' | 'none'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const activeFile = files.find(f => f.id === activeFileId);

  const handleFileClick = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file?.type === 'folder') {
      setFiles(files.map(f => f.id === fileId ? { ...f, isOpen: !f.isOpen } : f));
    } else {
      setActiveFileId(fileId);
    }
  };

  const handleContentChange = (id: string, content: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, content } : f));
  };

  const addFile = (parentId: string | null = null, type: 'file' | 'folder' = 'file') => {
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;
    
    const newFile: FileSystemItem = {
      id: uuidv4(),
      name,
      type,
      parentId,
      content: type === 'file' ? '' : undefined,
      language: type === 'file' ? name.split('.').pop() || 'plaintext' : undefined,
      isOpen: type === 'folder'
    };
    
    setFiles(prev => [...prev, newFile]);
    if (newFile.type === 'file') setActiveFileId(newFile.id);
  };

  const deleteFile = (id: string) => {
    if (confirm('Delete this item?')) {
      setFiles(prev => prev.filter(f => f.id !== id && f.parentId !== id));
      if (activeFileId === id) setActiveFileId(null);
    }
  };

  const renameFile = (id: string, newName: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  const runCode = () => {
    if (!activeFile || activeFile.type !== 'file') {
      toast.error('Select a file to run');
      return;
    }

    setIsRunning(true);
    
    const addLog = (message: string, type: 'log' | 'error' | 'warn' = 'log') => {
      setConsoleOutput(prev => [...prev, {
        type,
        message,
        timestamp: new Date().toLocaleTimeString()
      }]);
    };

    addLog(`> [RUN] Executing ${activeFile.name}...`);

    // Simulate build steps for all files
    setTimeout(() => {
      addLog(`> [BUILD] Dependencies resolved successfully.`);
    }, 400);

    setTimeout(() => {
      try {
        const isJavaScript = activeFile.name.endsWith('.js') || activeFile.name.endsWith('.jsx');
        const isTypeScript = activeFile.name.endsWith('.ts') || activeFile.name.endsWith('.tsx');

        if (isJavaScript || isTypeScript) {
          // Create a custom console to redirect output to our UI
          const customConsole = {
            log: (...args: any[]) => addLog(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '), 'log'),
            error: (...args: any[]) => addLog(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '), 'error'),
            warn: (...args: any[]) => addLog(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '), 'warn'),
            info: (...args: any[]) => addLog(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '), 'log'),
          };

          // Basic execution for JS/TS (TS will be executed as JS for simplicity in this mock)
          // We wrap it in a function and pass our custom console
          const codeToRun = activeFile.content || '';
          
          // Safety check for empty code
          if (!codeToRun.trim()) {
            addLog(`> [INFO] File is empty. Nothing to execute.`);
          } else {
            // Use new Function to execute in a controlled way
            // Note: In a real IDE this would happen in a Web Worker or Sandbox
            const run = new Function('console', codeToRun);
            run(customConsole);
            addLog(`> [SUCCESS] Execution finished.`);
          }
        } else {
          addLog(`> [INFO] Execution for ${activeFile.name.split('.').pop()} files is not natively supported in this preview, but the file was "built" successfully.`);
        }
      } catch (err: any) {
        addLog(`> [ERROR] Runtime Exception: ${err.message}`, 'error');
      } finally {
        setIsRunning(false);
        toast.success(`Run completed for ${activeFile.name}`);
      }
    }, 1000);
  };

  const clearConsole = () => setConsoleOutput([]);

  return (
    <div className="flex h-screen w-screen bg-[#09090b] text-zinc-300 overflow-hidden font-sans selection:bg-blue-500/30">
      <Toaster position="top-right" theme="dark" richColors />
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        rightPanel={rightPanel} 
        setRightPanel={setRightPanel} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 border-b border-zinc-800/40 flex items-center justify-between px-4 bg-[#09090b] relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-blue-500/20">LB</div>
              <span className="text-[11px] font-bold flex items-center gap-2 uppercase tracking-tight text-zinc-400 group-hover:text-zinc-200 transition-colors">
                workspace <ChevronRight size={10} className="text-zinc-600" /> <span className="text-zinc-100">my-lil-app</span>
              </span>
            </div>
            <div className="h-4 w-px bg-zinc-800/50 mx-2" />
            <div className="flex items-center gap-1">
              <button onClick={() => addFile(null, 'file')} className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-blue-400" title="New File"><Plus size={16} /></button>
              <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-blue-400" title="Sync"><Cloud size={16} /></button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-zinc-900/50 border border-zinc-800/50 rounded-md px-2 py-1 mr-2">
               <Monitor size={12} className="text-zinc-500 mr-2" />
               <span className="text-[10px] text-zinc-400 font-mono">localhost:5173</span>
            </div>
            <button 
              onClick={runCode} 
              disabled={isRunning}
              className={cn(
                "group flex items-center gap-2 px-5 py-1.5 rounded text-xs font-bold transition-all transform active:scale-95 shadow-lg",
                isRunning 
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
              )}
            >
              <Play size={14} fill={isRunning ? "none" : "currentColor"} className={cn(isRunning && "animate-spin")} /> {isRunning ? 'STOPPING...' : 'RUN'}
            </button>
            <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1.5 rounded text-xs font-bold transition-colors hover:text-white hover:bg-zinc-800">
              <Share2 size={14} /> SHARE
            </button>
            <div className="h-6 w-px bg-zinc-800/50 mx-1" />
            <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
              JD
            </button>
          </div>
        </header>

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={18} minSize={12} collapsible>
            <div className="h-full bg-[#09090b] border-r border-zinc-800/50 flex flex-col">
              <FileExplorer 
                files={files} 
                onFileClick={handleFileClick} 
                activeFileId={activeFileId} 
                addFile={addFile} 
                deleteFile={deleteFile}
                renameFile={renameFile}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle className="w-1 bg-transparent hover:bg-blue-500/10 transition-colors" />
          
          <ResizablePanel defaultSize={57} minSize={30}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70} minSize={20}>
                <EditorArea activeFile={activeFile} onContentChange={handleContentChange} />
              </ResizablePanel>
              <ResizableHandle className="h-1 bg-transparent hover:bg-blue-500/10 transition-colors" />
              <ResizablePanel defaultSize={30} minSize={10} collapsible>
                <Console logs={consoleOutput} onClear={clearConsole} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          
          <ResizableHandle className="w-1 bg-transparent hover:bg-blue-500/10 transition-colors" />
          
          {rightPanel !== 'none' && (
            <ResizablePanel defaultSize={25} minSize={20} collapsible>
              <div className="h-full bg-[#09090b] border-l border-zinc-800/50 flex flex-col shadow-2xl shadow-black">
                <div className="flex bg-[#0c0c0e]/50 border-b border-zinc-800/30">
                  <button onClick={() => setRightPanel('chat')} className={cn("flex-1 px-4 py-3 text-[10px] font-bold uppercase tracking-widest relative transition-colors", rightPanel === 'chat' ? "text-blue-400" : "text-zinc-500 hover:text-zinc-300")}>
                    AI ASSISTANT
                    {rightPanel === 'chat' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_#3b82f6]" />}
                  </button>
                  <button onClick={() => setRightPanel('settings')} className={cn("flex-1 px-4 py-3 text-[10px] font-bold uppercase tracking-widest relative transition-colors", rightPanel === 'settings' ? "text-blue-400" : "text-zinc-500 hover:text-zinc-300")}>
                    MODELS
                    {rightPanel === 'settings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_#3b82f6]" />}
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  {rightPanel === 'chat' ? <AIChat messages={messages} setMessages={setMessages} activeFile={activeFile} /> : <AISettings />}
                </div>
              </div>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>

        <footer className="h-7 bg-[#0c0c0e] border-t border-zinc-800/50 px-4 flex items-center justify-between text-[10px] text-zinc-500 font-medium select-none">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-green-500/80"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Connected</span>
            <span className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors cursor-pointer"><GitBranch size={12} /> main</span>
            <span className="flex items-center gap-1.5"><Code2 size={12} className="text-zinc-600" /> UTF-8</span>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span className="flex items-center gap-1.5 uppercase font-bold tracking-widest text-zinc-600">Ln 1, Col 1</span>
            <span className="flex items-center gap-1.5 uppercase font-bold tracking-widest text-blue-500">TypeScript React</span>
          </div>
        </footer>
      </div>
    </div>
  );
}