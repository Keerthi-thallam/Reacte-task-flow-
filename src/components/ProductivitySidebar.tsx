import React, { useState } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  UserPlus, 
  Tag, 
  TrendingUp, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { Priority, Category, Task } from '../types';
import { TEAM_MEMBERS } from '../data';

interface ProductivitySidebarProps {
  onQuickAddTask: (data: {
    title: string;
    priority: Priority;
    category: Category;
    dueDate?: string;
  }) => void;
  tasks: Task[];
  onSelectTask?: (taskId: string) => void;
}

export const ProductivitySidebar: React.FC<ProductivitySidebarProps> = ({
  onQuickAddTask,
  tasks,
  onSelectTask,
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  const [category, setCategory] = useState<Category>('Frontend UI');
  const [dueDate, setDueDate] = useState('Tomorrow, 5:00 PM');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onQuickAddTask({
      title: title.trim(),
      priority,
      category,
      dueDate,
    });

    setFeedback('Task queued successfully!');
    setTitle('');
    setTimeout(() => {
      setFeedback(null);
    }, 1500);
  };

  // Compute completed tasks today
  const completedTodayCount = tasks.filter(
    (t) => t.status === 'completed' && (t.completedAt || t.dueDate.toLowerCase().includes('today'))
  ).length;

  // Imminent deadlines from non-completed tasks
  const imminentTasks = tasks
    .filter((t) => t.status !== 'completed')
    .slice(0, 3);

  return (
    <aside className="xl:col-span-4 flex flex-col gap-4">
      {/* Interactive Quick Add Task Widget */}
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-[#e5eeff] flex flex-col gap-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <h3 className="font-semibold text-sm text-[#0b1c30]">Instant Task Dispatch</h3>
          </div>
          <span className="font-mono text-[11px] text-[#464555] bg-[#eff4ff] px-2 py-0.5 rounded border border-[#dce9ff]">
            Quick Add
          </span>
        </div>

        <form id="quick-task-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="task-title-input" className="text-[11px] text-[#464555] font-semibold uppercase tracking-wider">
              Task Definition
            </label>
            <input
              id="task-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={feedback || "e.g., Deploy canary cluster to us-west..."}
              disabled={!!feedback}
              className={`w-full bg-[#eff4ff] px-3 py-2 rounded-lg text-xs sm:text-sm text-[#0b1c30] placeholder:text-[#777587] focus:outline-none focus:ring-2 focus:ring-primary/20 border border-[#dce9ff] transition-all ${
                feedback ? 'bg-[#d1fae5] text-[#065f46] font-medium' : ''
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="priority-selector" className="text-[11px] text-[#464555] font-semibold uppercase tracking-wider">
                Priority
              </label>
              <div className="relative">
                <select
                  id="priority-selector"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full appearance-none bg-[#eff4ff] text-[#0b1c30] text-xs py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 border border-[#dce9ff] cursor-pointer"
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 pointer-events-none text-[#464555]" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="category-selector" className="text-[11px] text-[#464555] font-semibold uppercase tracking-wider">
                Category
              </label>
              <div className="relative">
                <select
                  id="category-selector"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full appearance-none bg-[#eff4ff] text-[#0b1c30] text-xs py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 border border-[#dce9ff] cursor-pointer"
                >
                  <option value="Backend API">Backend API</option>
                  <option value="Frontend UI">Frontend UI</option>
                  <option value="Design System">Design System</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 pointer-events-none text-[#464555]" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-[#464555]">
              <button
                type="button"
                onClick={() => {
                  const options = ['Today, 5:00 PM', 'Tomorrow, 11:30 AM', 'Oct 20, 2:00 PM', 'Next Sprint'];
                  const nextIndex = (options.indexOf(dueDate) + 1) % options.length;
                  setDueDate(options[nextIndex]);
                }}
                className="p-1.5 rounded-md hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors cursor-pointer text-xs flex items-center gap-1"
                title={`Change due date (current: ${dueDate})`}
              >
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-[11px] hidden sm:inline">{dueDate.split(',')[0]}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!title.trim() || !!feedback}
              className="bg-primary hover:bg-[#4f46e5] disabled:opacity-50 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>Push to Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Productivity Insights Widget */}
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-[#e5eeff] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm text-[#0b1c30]">Daily Velocity &amp; Insights</h3>
          </div>
          <span className="text-[11px] text-[#464555]">Real-time</span>
        </div>

        {/* Weekly Velocity Inline Bar Chart (SVG) */}
        <div className="flex flex-col gap-2 bg-[#eff4ff] p-3 rounded-lg border border-[#dce9ff]">
          <div className="flex justify-between items-center text-[#464555]">
            <span className="text-xs">Completed Tasks (Last 7 Days)</span>
            <span className="font-mono text-xs text-primary font-bold">24 total</span>
          </div>

          <svg className="w-full h-16" viewBox="0 0 280 60">
            {/* Mon */}
            <rect className="fill-[#dce9ff] hover:fill-primary/60 transition-colors cursor-pointer" height="28" rx="4" width="20" x="10" y="32">
              <title>Monday: 4 tasks</title>
            </rect>
            {/* Tue */}
            <rect className="fill-[#dce9ff] hover:fill-primary/60 transition-colors cursor-pointer" height="36" rx="4" width="20" x="50" y="24">
              <title>Tuesday: 5 tasks</title>
            </rect>
            {/* Wed */}
            <rect className="fill-[#dce9ff] hover:fill-primary/60 transition-colors cursor-pointer" height="44" rx="4" width="20" x="90" y="16">
              <title>Wednesday: 6 tasks</title>
            </rect>
            {/* Thu */}
            <rect className="fill-primary hover:fill-[#4f46e5] transition-colors cursor-pointer" height="52" rx="4" width="20" x="130" y="8">
              <title>Thursday: 8 tasks (Peak velocity)</title>
            </rect>
            {/* Fri (Today) */}
            <rect className="fill-primary hover:fill-[#4f46e5] transition-colors cursor-pointer" height="40" rx="4" width="20" x="170" y="20">
              <title>Friday: 6 tasks (Today)</title>
            </rect>
            {/* Sat */}
            <rect className="fill-[#dce9ff] hover:fill-primary/60 transition-colors cursor-pointer" height="16" rx="4" width="20" x="210" y="44">
              <title>Saturday: 2 tasks</title>
            </rect>
            {/* Sun */}
            <rect className="fill-[#dce9ff] hover:fill-primary/60 transition-colors cursor-pointer" height="12" rx="4" width="20" x="250" y="48">
              <title>Sunday: 1 task</title>
            </rect>
          </svg>

          <div className="flex justify-between font-mono text-[11px] text-[#464555] px-1">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span className="text-primary font-bold">T</span>
            <span className="text-primary font-bold">F</span>
            <span>S</span>
            <span>S</span>
          </div>
        </div>

        {/* Milestone Highlight Strip */}
        <div className="flex flex-col gap-2 pt-1 border-t border-[#f0f4ff]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#464555]">Completed Today</span>
            <span className="font-mono text-xs text-primary font-semibold">
              {completedTodayCount > 0 ? `${completedTodayCount} done` : '3 done'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#464555]">Review Turnaround</span>
            <span className="font-mono text-xs text-[#0b1c30]">1.8 hrs avg</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#464555]">Burn-down Status</span>
            <span className="font-mono text-xs text-[#00505f] font-semibold">Optimal</span>
          </div>
        </div>

        {/* Upcoming Immediate Deadlines */}
        <div className="border-t border-[#f0f4ff] pt-2 flex flex-col gap-2">
          <span className="text-[11px] text-[#464555] uppercase tracking-wider font-semibold">
            Imminent Deadlines
          </span>

          {imminentTasks.map((t, idx) => (
            <div
              key={t.id}
              onClick={() => onSelectTask && onSelectTask(t.id)}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] cursor-pointer transition-colors border border-[#dce9ff]"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    t.priority === 'Urgent' ? 'bg-[#ba1a1a]' : 'bg-primary'
                  }`}
                />
                <span className="text-xs text-[#0b1c30] truncate font-medium">{t.title}</span>
              </div>
              <span
                className={`font-mono text-[11px] shrink-0 ml-2 font-semibold ${
                  t.priority === 'Urgent' ? 'text-[#ba1a1a]' : 'text-[#464555]'
                }`}
              >
                {idx === 0 ? 'In 2h' : idx === 1 ? 'Tomorrow' : 'Oct 18'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
