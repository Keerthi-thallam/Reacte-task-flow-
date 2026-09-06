import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, CheckCircle, Tag, ArrowRight, X } from 'lucide-react';
import { Task } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenCreateTask: () => void;
  onSelectTag: (tag: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tasks,
  onSelectTask,
  onOpenCreateTask,
  onSelectTag,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase()) ||
      t.assignee.name.toLowerCase().includes(query.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-20 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#dce9ff] max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col">
        {/* Search Bar */}
        <div className="p-3 sm:p-4 border-b border-[#e5eeff] flex items-center gap-3 bg-[#eff4ff]">
          <Search className="w-5 h-5 text-primary" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tasks, tags, assignees..."
            className="bg-transparent w-full text-sm text-[#0b1c30] placeholder:text-[#777587] focus:outline-none"
          />
          <kbd className="text-[10px] font-mono bg-[#e5eeff] px-1.5 py-0.5 rounded text-[#464555] border border-[#c7c4d8]">
            ESC
          </kbd>
          <button onClick={onClose} className="text-[#777587] hover:text-[#0b1c30]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#f0f4ff]">
          {/* Quick Actions */}
          <div className="py-1">
            <span className="text-[10px] font-semibold text-[#777587] uppercase tracking-wider px-2 block mb-1">
              Quick Actions
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenCreateTask();
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#eff4ff] flex items-center justify-between text-xs text-[#0b1c30] cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                <span className="font-medium">Create New Sprint Task</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#777587] group-hover:text-primary transition-colors" />
            </button>
          </div>

          {/* Tasks matches */}
          <div className="py-1">
            <span className="text-[10px] font-semibold text-[#777587] uppercase tracking-wider px-2 block mb-1">
              Matching Backlog Objectives ({filteredTasks.length})
            </span>
            {filteredTasks.length === 0 ? (
              <p className="text-xs text-[#777587] px-3 py-3 text-center">No tasks match your query</p>
            ) : (
              filteredTasks.slice(0, 6).map((task) => (
                <button
                  key={task.id}
                  onClick={() => {
                    onClose();
                    onSelectTask(task);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#eff4ff] flex items-center justify-between text-xs text-[#0b1c30] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        task.status === 'completed'
                          ? 'bg-[#10b981]'
                          : task.priority === 'Urgent'
                          ? 'bg-[#ba1a1a]'
                          : 'bg-primary'
                      }`}
                    />
                    <span className="truncate font-medium">{task.title}</span>
                    <span className="text-[10px] bg-[#e5eeff] px-1.5 py-0.5 rounded text-[#464555] shrink-0">
                      {task.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#777587] shrink-0 ml-2">
                    {task.assignee.name.split(' ')[0]}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-[#f8f9ff] border-t border-[#e5eeff] flex items-center justify-between text-[11px] text-[#777587] px-4">
          <span>Navigate with arrow keys or click to open</span>
          <span className="font-mono">TaskFlow Search Matrix</span>
        </div>
      </div>
    </div>
  );
};
