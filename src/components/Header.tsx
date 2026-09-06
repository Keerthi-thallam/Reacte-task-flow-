import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Bell, Menu, User, Shield, LogOut } from 'lucide-react';
import { NotificationPopover } from './NotificationPopover';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateTask: () => void;
  onOpenCommandPalette: () => void;
  onToggleMobileSidebar: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenCreateTask,
  onOpenCommandPalette,
  onToggleMobileSidebar,
  onOpenSettings
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 lg:left-[16rem] right-0 h-16 bg-[#f8f9ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-4 sm:px-8 border-b border-[#e5eeff]/80">
      {/* Left Search and Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-lg text-[#464555] hover:bg-[#dce9ff] lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 bg-[#eff4ff] px-3 py-1.5 rounded-lg w-52 sm:w-72 border border-transparent focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <Search className="w-4 h-4 text-[#777587]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks or projects..."
            className="bg-transparent w-full text-xs sm:text-sm text-[#0b1c30] placeholder:text-[#777587] focus:outline-none"
          />
          <button
            onClick={onOpenCommandPalette}
            type="button"
            className="hidden sm:inline-flex font-mono text-[11px] bg-[#e5eeff] px-1.5 py-0.5 rounded text-[#464555] border border-[#c7c4d8]/40 hover:bg-[#dce9ff] transition-colors"
            title="Open Command Palette (⌘K)"
          >
            ⌘K
          </button>
        </div>
      </div>

      {/* Right Controls: CTA, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Create Task Button */}
        <button
          id="header-create-task-btn"
          onClick={onOpenCreateTask}
          className="flex items-center gap-1.5 bg-primary hover:bg-[#4f46e5] text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] transition-all cursor-pointer"
          type="button"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg text-[#464555] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors cursor-pointer"
            type="button"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a]" />
          </button>
          <NotificationPopover isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* Profile Card */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 pl-1 rounded-lg hover:bg-[#eff4ff] p-1 transition-colors cursor-pointer text-left"
          >
            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-primary/20">
              AC
            </span>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-semibold text-[#0b1c30] leading-tight">Alex Chen</span>
              <span className="text-[11px] text-[#464555] leading-tight">Tech Lead</span>
            </div>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-[#dce9ff] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-2 border-b border-[#e5eeff]">
                <p className="text-xs font-semibold text-[#0b1c30]">Alex Chen</p>
                <p className="text-[11px] text-[#777587]">alex.chen@taskflow.dev</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-[#464555] hover:bg-[#eff4ff] flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-primary" />
                  <span>Workspace Preferences</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-[#464555] hover:bg-[#eff4ff] flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-[#00505f]" />
                  <span>Sprint Permissions</span>
                </button>
              </div>
              <div className="border-t border-[#e5eeff] pt-1">
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full px-3.5 py-2 text-left text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-[#ba1a1a]" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
