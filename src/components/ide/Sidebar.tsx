import React from 'react';
import { 
  FolderTree, 
  Search, 
  Box, 
  Settings, 
  Cpu, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  rightPanel: string;
  setRightPanel: (panel: any) => void;
}

export default function Sidebar({ activeTab, setActiveTab, rightPanel, setRightPanel }: SidebarProps) {
  return (
    <div className="w-12 border-r border-zinc-800/50 flex flex-col items-center py-4 gap-4 bg-[#09090b] z-20">
      <div className="mb-4">
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/c49fa4ce-ff6a-4647-ac03-f121ee1e182b/lil-big-source-logo-de02c417-1775034669663.webp" 
          alt="Lil'big Source" 
          className="w-8 h-8 rounded-lg shadow-lg shadow-blue-500/20"
        />
      </div>
      
      <SidebarButton 
        icon={<FolderTree size={20} />} 
        active={activeTab === 'explorer'} 
        onClick={() => setActiveTab('explorer')} 
        label="Explorer"
      />
      <SidebarButton 
        icon={<Search size={20} />} 
        active={activeTab === 'search'} 
        onClick={() => setActiveTab('search')}
        label="Search"
      />
      <SidebarButton 
        icon={<Box size={20} />} 
        active={activeTab === 'packages'} 
        onClick={() => setActiveTab('packages')}
        label="Packages"
      />
      
      <div className="mt-auto flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-sm shadow-blue-500/50" />
          <SidebarButton 
            icon={<Zap size={20} className="text-yellow-500" />} 
            active={rightPanel === 'chat'} 
            onClick={() => setRightPanel(rightPanel === 'chat' ? 'none' : 'chat')}
            label="AI Chat"
          />
        </div>
        <SidebarButton 
          icon={<Cpu size={20} />} 
          active={rightPanel === 'settings'} 
          onClick={() => setRightPanel(rightPanel === 'settings' ? 'none' : 'settings')}
          label="AI Models"
        />
        <SidebarButton 
          icon={<Settings size={20} />} 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
          label="Settings"
        />
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold cursor-pointer hover:ring-2 ring-blue-500/50 transition-all">
          LB
        </div>
      </div>
    </div>
  );
}

function SidebarButton({ icon, active, onClick, label }: { icon: React.ReactNode, active?: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-2 rounded-lg transition-all relative group",
        active ? "bg-blue-500/10 text-blue-400" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
      )}
    >
      {icon}
      {active && <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-[3px] h-4 bg-blue-500 rounded-r-full shadow-sm shadow-blue-500" />}
      <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity uppercase font-bold tracking-wider">
        {label}
      </span>
    </button>
  );
}