import React, { useState } from 'react';
import { 
  File, 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Edit2, 
  MoreVertical,
  Search,
  FolderPlus,
  FilePlus,
  FileCode
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { FileSystemItem } from '../../types';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface FileExplorerProps {
  files: FileSystemItem[];
  onFileClick: (id: string) => void;
  activeFileId: string | null;
  addFile: (parentId: string | null, type: 'file' | 'folder') => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
}

export default function FileExplorer({ 
  files, 
  onFileClick, 
  activeFileId, 
  addFile, 
  deleteFile, 
  renameFile 
}: FileExplorerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleRenameSubmit = (id: string) => {
    if (editValue.trim()) {
      renameFile(id, editValue);
    }
    setEditingId(null);
  };

  const renderTree = (parentId: string | null = null, level = 0) => {
    return files
      .filter(f => f.parentId === parentId)
      .sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'folder' ? -1 : 1;
      })
      .map(file => {
        const isActive = activeFileId === file.id;
        const isEditing = editingId === file.id;

        return (
          <div key={file.id}>
            <div 
              onClick={() => onFileClick(file.id)}
              className={cn(
                "group flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs transition-colors",
                isActive ? "bg-blue-500/10 text-blue-400 border-r-2 border-blue-500" : "hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200"
              )}
              style={{ paddingLeft: `${level * 12 + 12}px` }}
            >
              <span className="flex items-center">
                {file.type === 'folder' ? (
                  <>
                    {file.isOpen ? <ChevronDown size={14} className="mr-1" /> : <ChevronRight size={14} className="mr-1" />}
                    <Folder size={14} className={cn("text-blue-500/80", file.isOpen && "fill-blue-500/20")} />
                  </>
                ) : (
                  <>
                    <span className="w-[18px]" />
                    <FileCode size={14} className={cn(isActive ? "text-blue-400" : "text-zinc-500")} />
                  </>
                )}
              </span>
              
              <div className="flex-1 truncate">
                {isEditing ? (
                  <input
                    autoFocus
                    className="bg-zinc-800 text-white px-1 py-0.5 rounded outline-none border border-blue-500 w-full"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleRenameSubmit(file.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit(file.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="truncate">{file.name}</span>
                )}
              </div>

              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                {file.type === 'folder' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); addFile(file.id, 'file'); }}
                    className="hover:text-white p-1 rounded"
                    title="New File"
                  >
                    <Plus size={12} />
                  </button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <button className="hover:text-white p-1 rounded">
                      <MoreVertical size={12} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" className="bg-[#0c0c0e] border-zinc-800 text-zinc-400">
                    <DropdownMenuItem 
                      onClick={() => {
                        setEditingId(file.id);
                        setEditValue(file.name);
                      }}
                      className="hover:text-blue-400 hover:bg-blue-500/10 cursor-pointer text-xs uppercase tracking-widest"
                    >
                      <Edit2 size={12} className="mr-2" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => deleteFile(file.id)}
                      className="hover:text-red-400 hover:bg-red-500/10 cursor-pointer text-xs uppercase tracking-widest"
                    >
                      <Trash2 size={12} className="mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {file.type === 'folder' && file.isOpen && (
              <div>{renderTree(file.id, level + 1)}</div>
            )}
          </div>
        );
      });
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col py-1 scrollbar-thin scrollbar-thumb-zinc-800">
      <div className="px-3 mb-2 flex items-center justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
        <span className="flex items-center gap-1.5 opacity-50"><Search size={10} /> Explorer</span>
        <div className="flex gap-1.5">
          <button onClick={() => addFile(null, 'file')} className="hover:text-zinc-300" title="New Root File"><FilePlus size={12} /></button>
          <button onClick={() => addFile(null, 'folder')} className="hover:text-zinc-300" title="New Root Folder"><FolderPlus size={12} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto select-none">
        {files.length === 0 ? (
          <div className="p-4 text-center opacity-20 italic text-xs">Workspace is empty</div>
        ) : (
          renderTree(null)
        )}
      </div>
    </div>
  );
}