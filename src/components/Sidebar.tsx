import React from 'react';
import { 
  CheckSquare, 
  Sun, 
  Calendar, 
  FolderOpen, 
  CheckCircle2, 
  Settings, 
  CloudCheck, 
  RefreshCw,
  X
} from 'lucide-react';
import { NavSection, Task } from '../types';
import { WORKSPACE_TAGS } from '../data';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
  tasks: Task[];
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  storageUsageMb?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  activeTag,
  onSelectTag,
  tasks,
  isMobileOpen,
  onCloseMobile,
  storageUsageMb = 7.5
}) => {
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 800);
  };

  // Compute counts for navigation badges
  const allTasksCount = tasks.length;
  const todayCount = tasks.filter(t => t.dueDate.toLowerCase().includes('today')).length;
  const upcomingCount = tasks.filter(t => !t.status.includes('completed') && !t.dueDate.toLowerCase().includes('today')).length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  const navItems = [
    { id: 'all-tasks' as NavSection, label: 'All Tasks', icon: CheckSquare, count: allTasksCount },
    { id: 'today' as NavSection, label: 'Today', icon: Sun, count: todayCount },
    { id: 'upcoming' as NavSection, label: 'Upcoming', icon: Calendar, count: upcomingCount },
    { id: 'projects' as NavSection, label: 'Projects', icon: FolderOpen, count: undefined },
    { id: 'completed' as NavSection, label: 'Completed', icon: CheckCircle2, count: completedCount },
    { id: 'settings' as NavSection, label: 'Settings', icon: Settings, count: undefined },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside 
        id="app-sidebar"
        className={`fixed left-0 top-0 h-full w-[16rem] bg-[#eff4ff] z-50 flex flex-col justify-between p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm font-bold text-base tracking-tight">
                TF
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md font-bold text-primary tracking-tight text-xl">TaskFlow</span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#464555] -mt-1 font-semibold">Sprint Matrix</span>
              </div>
            </div>

            {isMobileOpen && (
              <button 
                onClick={onCloseMobile}
                className="p-1 rounded-md text-[#464555] hover:bg-[#dce9ff] lg:hidden"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Section */}
          <div className="flex flex-col gap-2">
            <span className="px-3 font-caption text-[11px] text-[#464555] uppercase tracking-wider font-semibold">
              Navigation
            </span>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id && activeTag === null;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => {
                      onSelectSection(item.id);
                      onSelectTag(null);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`flex items-center justify-between px-3 py-2 transition-all rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-[#4f46e5] text-white shadow-sm'
                        : 'text-[#464555] hover:bg-[#dce9ff] hover:text-[#0b1c30]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-[#464555]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#dce9ff] text-[#464555]'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Workspace Tags Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-3">
              <span className="font-caption text-[11px] text-[#464555] uppercase tracking-wider font-semibold">
                Workspace Tags
              </span>
              {activeTag && (
                <button 
                  onClick={() => onSelectTag(null)} 
                  className="text-[10px] text-primary hover:underline font-medium"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-col gap-1">
              {WORKSPACE_TAGS.map((tag) => {
                const tagCount = tasks.filter(t => t.tags.includes(tag.name)).length;
                const isTagActive = activeTag === tag.name;
                return (
                  <button
                    key={tag.name}
                    onClick={() => {
                      onSelectTag(isTagActive ? null : tag.name);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg transition-all text-left ${
                      isTagActive 
                        ? 'bg-[#dce9ff] text-[#0b1c30] font-semibold' 
                        : 'text-[#464555] hover:bg-[#dce9ff] hover:text-[#0b1c30]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${tag.colorClass}`} />
                      <span className="font-body-sm text-[13px]">{tag.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#777587]">
                      {tagCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

          {/* Local storage widget */}
        <div className="flex flex-col gap-3 p-3.5 bg-[#e5eeff] rounded-xl border border-[#d3e4fe]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudCheck className="text-primary w-4 h-4" />
              <span className="text-xs font-semibold text-[#0b1c30]">Local Storage</span>
            </div>
            <button 
              onClick={handleManualSync}
              title="Force synchronize"
              className="flex items-center gap-1 font-mono text-[11px] text-[#464555] hover:text-primary transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-primary' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Active'}</span>
            </button>
          </div>

          <div className="w-full bg-[#d3e4fe] rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${(storageUsageMb / 10) * 100}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#464555]">
            <span>Storage Used</span>
            <span className="font-mono">{storageUsageMb.toFixed(1)} / 10 GB</span>
          </div>
        </div>
      </aside>
    </>
  );
};
