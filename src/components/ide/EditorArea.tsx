import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { FileSystemItem } from '../../types';
import { X, Code2, Save, MoreHorizontal, Settings, FileCode } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EditorAreaProps {
  activeFile: FileSystemItem | undefined;
  onContentChange: (id: string, content: string) => void;
}

export default function EditorArea({ activeFile, onContentChange }: EditorAreaProps) {
  const editorRef = useRef<any>(null);

  if (!activeFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 bg-[#0c0c0e] overflow-hidden">
        <div className="relative mb-8 animate-pulse">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-10" />
          <Code2 size={64} className="relative opacity-30" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Select a file to begin coding</p>
        <p className="text-[10px] mt-4 font-mono opacity-20 border border-zinc-800/50 px-3 py-1 rounded-full">Lil-Big-Source Cloud v1.0</p>
      </div>
    );
  }

  const getLanguage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'ts': return 'typescript';
      case 'jsx':
      case 'js': return 'javascript';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'html': return 'html';
      case 'md': return 'markdown';
      default: return 'javascript'; // Default to javascript for better experience
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    monaco.editor.defineTheme('lilbig-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff79c6' },
        { token: 'string', foreground: 'f1fa8c' },
        { token: 'function', foreground: '50fa7b' },
        { token: 'type', foreground: '8be9fd' },
      ],
      colors: {
        'editor.background': '#09090b',
        'editor.foreground': '#f8f8f2',
        'editor.lineHighlightBackground': '#ffffff05',
        'editor.selectionBackground': '#44475a55',
        'editor.inactiveSelectionBackground': '#44475a22',
        'editorCursor.foreground': '#60a5fa',
        'editorWhitespace.foreground': '#3b3a32',
        'editorLineNumber.foreground': '#4b5563',
        'editorLineNumber.activeForeground': '#94a3b8',
        'editorIndentGuide.background': '#ffffff05',
        'editorIndentGuide.activeBackground': '#ffffff10',
        'editorWidget.background': '#0c0c0e',
        'editorWidget.border': '#1f2937',
      }
    });
    
    monaco.editor.setTheme('lilbig-theme');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#09090b]">
      {/* Tabs Header */}
      <div className="flex bg-[#0c0c0e] border-b border-zinc-800/50 overflow-x-auto scrollbar-hide h-10">
        <div className={cn(
          "flex items-center gap-3 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border-r border-zinc-800/30 bg-[#09090b] text-blue-400 relative group min-w-fit",
        )}>
          <FileCode size={14} className="text-blue-500/80" />
          {activeFile.name}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
          <X size={12} className="cursor-pointer hover:text-white ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
        
        {/* Fill remaining space */}
        <div className="flex-1" />
        
        {/* Editor Actions */}
        <div className="flex items-center px-4 gap-4 text-zinc-500 border-l border-zinc-800/30 bg-[#0c0c0e]">
           <Save size={14} className="cursor-pointer hover:text-zinc-200 transition-colors" />
           <Settings size={14} className="cursor-pointer hover:text-zinc-200 transition-colors" />
           <MoreHorizontal size={14} className="cursor-pointer hover:text-zinc-200 transition-colors" />
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="px-4 py-1.5 bg-[#09090b] border-b border-zinc-800/20 text-[10px] text-zinc-600 font-mono flex items-center gap-2">
        <span>src</span>
        <span className="opacity-50">/</span>
        <span className="text-zinc-400">{activeFile.name}</span>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 relative overflow-hidden">
        <Editor
          key={activeFile.id} // Force re-render on file change to ensure correct model state
          height="100%"
          language={getLanguage(activeFile.name)}
          theme="lilbig-theme"
          defaultValue={activeFile.content || ''}
          value={activeFile.content}
          onChange={(value) => onContentChange(activeFile.id, value || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13,
            minimap: { enabled: true, scale: 0.75, renderCharacters: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 20 },
            fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            lineNumbers: 'on',
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            cursorStyle: 'block',
            wordWrap: 'on',
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              vertical: 'visible',
              horizontal: 'visible',
            }
          }}
        />
      </div>
    </div>
  );
}