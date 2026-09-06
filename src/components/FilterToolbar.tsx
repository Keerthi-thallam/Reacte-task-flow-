import React from 'react';
import { 
  List, 
  Kanban, 
  Plus, 
  Filter, 
  ChevronDown, 
  ArrowUpDown 
} from 'lucide-react';
import { FilterOptions, Task } from '../types';

interface FilterToolbarProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
  tasks: Task[];
  onOpenCreateTask: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  onFilterChange,
  tasks,
  onOpenCreateTask,
}) => {
  // Calculate counts for status tabs
  const allCount = tasks.length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const pendingCount = tasks.filter((t) => t.status === 'pending' || t.status === 'backlog').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  const statusTabs = [
    { id: 'all' as const, label: 'All Tasks', count: allCount },
    { id: 'in-progress' as const, label: 'In Progress', count: inProgressCount },
    { id: 'pending' as const, label: 'Pending', count: pendingCount },
    { id: 'completed' as const, label: 'Completed', count: completedCount },
  ];

  return (
    <section className="bg-white p-4 rounded-xl shadow-xs border border-[#e5eeff] flex flex-col gap-4">
      {/* Row 1: Status Segments, View Mode Switcher, and Primary Action */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-lg overflow-x-auto max-w-full">
          {statusTabs.map((tab) => {
            const isActive = filters.status === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange({ status: tab.id })}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-[#464555] hover:text-[#0b1c30] hover:bg-[#dce9ff]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`font-mono text-[11px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/25 text-white' : 'bg-[#dce9ff] text-[#464555]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls: Layout Switcher & Action CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {/* View Toggle Buttons */}
          <div className="flex items-center bg-[#eff4ff] p-1 rounded-lg border border-[#dce9ff]">
            <button
              type="button"
              onClick={() => onFilterChange({ viewMode: 'list' })}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                filters.viewMode === 'list'
                  ? 'bg-white text-primary shadow-xs font-medium'
                  : 'text-[#464555] hover:text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
              title="List View"
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ viewMode: 'kanban' })}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                filters.viewMode === 'kanban'
                  ? 'bg-white text-primary shadow-xs font-medium'
                  : 'text-[#464555] hover:text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
              title="Kanban Board View"
              aria-label="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>

          {/* Create Task Trigger */}
          <button
            id="quick-add-toggle-btn"
            type="button"
            onClick={onOpenCreateTask}
            className="flex items-center gap-1.5 bg-primary hover:bg-[#4f46e5] text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Row 2: Live Filters & Granular Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#f0f4ff]">
        {/* Search Input with Integrated Monospace Badge */}
        <div className="flex items-center gap-2 bg-[#eff4ff] px-3 py-2 rounded-lg flex-1 min-w-[260px] max-w-xl border border-transparent focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <Filter className="w-4 h-4 text-[#777587]" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search tasks, tags, or assignees..."
            className="bg-transparent w-full text-xs sm:text-sm text-[#0b1c30] placeholder:text-[#777587] focus:outline-none"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="font-mono text-[10px] text-[#777587] bg-[#dce9ff] px-1.5 py-0.5 rounded hover:text-[#0b1c30]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdown Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Filter */}
          <div className="relative inline-flex items-center">
            <select
              aria-label="Filter by priority"
              value={filters.priority}
              onChange={(e) => onFilterChange({ priority: e.target.value })}
              className="appearance-none bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] text-xs sm:text-sm py-2 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 border border-[#dce9ff]"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 pointer-events-none text-[#464555]" />
          </div>

          {/* Category Filter */}
          <div className="relative inline-flex items-center">
            <select
              aria-label="Filter by category"
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              className="appearance-none bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] text-xs sm:text-sm py-2 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 border border-[#dce9ff]"
            >
              <option value="All">All Categories</option>
              <option value="Backend API">Backend API</option>
              <option value="Frontend UI">Frontend UI</option>
              <option value="Design System">Design System</option>
              <option value="Database">Database</option>
              <option value="DevOps">DevOps</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 pointer-events-none text-[#464555]" />
          </div>

          {/* Sort Select */}
          <div className="relative inline-flex items-center">
            <select
              aria-label="Sort tasks"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="appearance-none bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] text-xs sm:text-sm py-2 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 border border-[#dce9ff]"
            >
              <option value="priority">Sort: Priority</option>
              <option value="dueDate">Sort: Due Date</option>
              <option value="recent">Sort: Recently Created</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 absolute right-2.5 pointer-events-none text-[#464555]" />
          </div>
        </div>
      </div>
    </section>
  );
};
