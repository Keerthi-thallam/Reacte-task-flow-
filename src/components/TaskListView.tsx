import React, { useState } from 'react';
import { 
  Check, 
  Calendar, 
  ListChecks, 
  Terminal, 
  Palette, 
  Gauge, 
  Link as LinkIcon, 
  Star, 
  Edit3, 
  MoreVertical, 
  Archive, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  CheckCheck
} from 'lucide-react';
import { Task, Priority } from '../types';

interface TaskListViewProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onToggleStar: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onMarkAllCompleted: () => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onToggleComplete,
  onToggleStar,
  onEditTask,
  onDeleteTask,
  onToggleSubtask,
  onAddSubtask,
  onMarkAllCompleted,
}) => {
  const [expandedSubtasks, setExpandedSubtasks] = useState<Record<string, boolean>>({});
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [newSubtaskTitles, setNewSubtaskTitles] = useState<Record<string, string>>({});

  const toggleSubtasksExpand = (taskId: string) => {
    setExpandedSubtasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleSubtaskSubmit = (taskId: string, e: React.FormEvent) => {
    e.preventDefault();
    const title = newSubtaskTitles[taskId]?.trim();
    if (title) {
      onAddSubtask(taskId, title);
      setNewSubtaskTitles((prev) => ({ ...prev, [taskId]: '' }));
    }
  };

  // Helper for left border color
  const getPriorityBorderClass = (priority: Priority, isCompleted: boolean) => {
    if (isCompleted) return 'bg-[#777587]';
    switch (priority) {
      case 'Urgent':
        return 'bg-[#ba1a1a]';
      case 'High':
        return 'bg-primary';
      case 'Medium':
        return 'bg-[#00505f]';
      case 'Low':
        return 'bg-[#c7c4d8]';
      default:
        return 'bg-primary';
    }
  };

  // Helper for priority badge styles
  const getPriorityBadgeClass = (priority: Priority, isCompleted: boolean) => {
    if (isCompleted) return 'bg-[#e5eeff] text-[#777587]';
    switch (priority) {
      case 'Urgent':
        return 'bg-[#ffdad6] text-[#93000a] font-semibold';
      case 'High':
        return 'bg-[#dae2fd] text-[#3f465c] font-semibold';
      case 'Medium':
        return 'bg-[#e5eeff] text-[#464555] font-semibold';
      case 'Low':
        return 'bg-[#eff4ff] text-[#777587] font-semibold';
      default:
        return 'bg-[#eff4ff] text-[#464555] font-semibold';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Section Sub-Header */}
      <div className="flex items-center justify-between px-1 pt-1 pb-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-[#0b1c30]">Active Task Backlog</span>
          <span className="font-mono text-xs bg-[#e5eeff] text-[#464555] px-2 py-0.5 rounded">
            {tasks.length} in this view
          </span>
        </div>
        <div className="flex items-center gap-3">
          {tasks.some((t) => t.status !== 'completed') && (
            <button
              onClick={onMarkAllCompleted}
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
              type="button"
            >
              <span>Mark all completed</span>
              <CheckCheck className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-xs border border-[#e5eeff] text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#eff4ff] text-primary flex items-center justify-center mb-3">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-base text-[#0b1c30]">No tasks found</h3>
          <p className="text-xs text-[#777587] mt-1 max-w-sm">
            There are no tasks matching your active filter criteria. Try changing the filters or create a new task.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {tasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const completedSubtasksCount = task.subtasks.filter((s) => s.completed).length;
            const totalSubtasks = task.subtasks.length;
            const isExpanded = !!expandedSubtasks[task.id];
            const isMenuOpen = activeMenuId === task.id;

            return (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                className={`group bg-white hover:bg-[#f8f9ff] p-4 sm:p-5 rounded-xl shadow-xs border border-[#e5eeff] transition-all duration-200 flex flex-col gap-3 relative overflow-hidden ${
                  isCompleted ? 'bg-[#eff4ff]/50 opacity-80' : ''
                }`}
              >
                {/* Accent Left Priority Border Emulation */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityBorderClass(
                    task.priority,
                    isCompleted
                  )}`}
                />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-1.5">
                  {/* Left Column: Checkbox and Details */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleComplete(task.id)}
                      className="mt-0.5 shrink-0 relative flex items-center justify-center cursor-pointer focus:outline-none"
                      title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                    >
                      <div
                        className={`w-5 h-5 rounded-md transition-all flex items-center justify-center border ${
                          isCompleted
                            ? 'bg-primary border-primary text-white'
                            : 'bg-[#eff4ff] border-[#c7c4d8] hover:border-primary text-transparent hover:text-[#c7c4d8]'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${isCompleted ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                    </button>

                    {/* Task Title & Description */}
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-semibold text-sm transition-colors truncate ${
                            isCompleted
                              ? 'line-through text-[#777587]'
                              : 'text-[#0b1c30] group-hover:text-primary'
                          }`}
                        >
                          {task.title}
                        </span>

                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider ${getPriorityBadgeClass(
                            task.priority,
                            isCompleted
                          )}`}
                        >
                          {isCompleted ? 'Done' : task.priority}
                        </span>

                        <span className="bg-[#dce9ff] text-[#464555] text-[11px] px-2 py-0.5 rounded-full font-medium">
                          {task.category}
                        </span>
                      </div>

                      <p
                        className={`text-xs line-clamp-1 ${
                          isCompleted ? 'line-through text-[#777587]' : 'text-[#464555]'
                        }`}
                      >
                        {task.description}
                      </p>

                      {/* Metadata Line */}
                      <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-[#464555] pt-1 flex-wrap">
                        <span
                          className={`flex items-center gap-1 font-medium ${
                            task.dueDate.toLowerCase().includes('today') && !isCompleted
                              ? 'text-[#ba1a1a]'
                              : 'text-[#464555]'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{task.dueDate}</span>
                        </span>

                        {totalSubtasks > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleSubtasksExpand(task.id)}
                            className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer text-[#464555]"
                          >
                            <ListChecks className="w-3.5 h-3.5" />
                            <span>
                              {completedSubtasksCount}/{totalSubtasks} subtasks
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        )}

                        {task.codeRef && (
                          <span className="flex items-center gap-1 font-mono text-[11px] text-[#777587] bg-[#eff4ff] px-1.5 py-0.5 rounded border border-[#dce9ff]">
                            {task.codeRef.type === 'pr' && <Terminal className="w-3 h-3 text-primary" />}
                            {task.codeRef.type === 'figma' && <Palette className="w-3 h-3 text-[#3525cd]" />}
                            {task.codeRef.type === 'perf' && <Gauge className="w-3 h-3 text-[#00505f]" />}
                            {task.codeRef.type === 'link' && <LinkIcon className="w-3 h-3" />}
                            <span>{task.codeRef.label}</span>
                          </span>
                        )}

                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-[#464555] bg-[#eff4ff] px-1.5 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Assignee & Action Buttons */}
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pl-8 md:pl-0">
                    <div className="flex items-center gap-1.5">
                      {task.assignee.avatarUrl ? (
                        <img
                          src={task.assignee.avatarUrl}
                          alt={task.assignee.name}
                          className={`w-7 h-7 rounded-full object-cover ring-1 ring-[#e5eeff] ${
                            isCompleted ? 'grayscale opacity-70' : ''
                          }`}
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#565e74] text-white flex items-center justify-center text-xs font-bold">
                          {task.assignee.initials || task.assignee.name.slice(0, 2)}
                        </div>
                      )}
                      <span className="text-xs text-[#0b1c30] hidden sm:inline font-medium">
                        {task.assignee.name}
                      </span>
                    </div>

                    {/* Micro Action Tooling */}
                    <div className="flex items-center gap-1 text-[#464555]">
                      <button
                        type="button"
                        onClick={() => onToggleStar(task.id)}
                        className={`p-1.5 rounded-lg hover:bg-[#eff4ff] transition-colors cursor-pointer ${
                          task.isStarred ? 'text-[#eab308]' : 'text-[#777587] hover:text-[#0b1c30]'
                        }`}
                        title={task.isStarred ? 'Remove from favorites' : 'Star task'}
                      >
                        <Star className={`w-4 h-4 ${task.isStarred ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditTask(task)}
                        className="p-1.5 rounded-lg hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors cursor-pointer"
                        title="Edit task"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(isMenuOpen ? null : task.id)}
                          className="p-1.5 rounded-lg hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors cursor-pointer"
                          title="More options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-[#dce9ff] py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={() => {
                                onToggleComplete(task.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-xs text-[#464555] hover:bg-[#eff4ff] flex items-center gap-2"
                            >
                              <Check className="w-3.5 h-3.5 text-primary" />
                              <span>{isCompleted ? 'Mark Incomplete' : 'Mark Completed'}</span>
                            </button>
                            <button
                              onClick={() => {
                                toggleSubtasksExpand(task.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-xs text-[#464555] hover:bg-[#eff4ff] flex items-center gap-2"
                            >
                              <ListChecks className="w-3.5 h-3.5" />
                              <span>View Checklist</span>
                            </button>
                            <div className="border-t border-[#e5eeff] my-1" />
                            <button
                              onClick={() => {
                                onDeleteTask(task.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Task</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable Subtasks Checklist Section */}
                {isExpanded && (
                  <div className="mt-2 pl-9 pr-2 py-3 bg-[#eff4ff]/60 rounded-lg border border-[#dce9ff] flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#0b1c30]">
                        Subtask Progress ({completedSubtasksCount}/{totalSubtasks})
                      </span>
                      <div className="w-32 bg-[#dce9ff] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all duration-300"
                          style={{
                            width: `${
                              totalSubtasks > 0 ? (completedSubtasksCount / totalSubtasks) * 100 : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 divide-y divide-[#e5eeff]">
                      {task.subtasks.map((sub) => (
                        <label
                          key={sub.id}
                          className="flex items-center gap-2.5 pt-1.5 text-xs text-[#464555] cursor-pointer hover:text-[#0b1c30]"
                        >
                          <input
                            type="checkbox"
                            checked={sub.completed}
                            onChange={() => onToggleSubtask(task.id, sub.id)}
                            className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
                          />
                          <span className={sub.completed ? 'line-through text-[#777587]' : ''}>
                            {sub.title}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Quick Add Subtask Input */}
                    <form
                      onSubmit={(e) => handleSubtaskSubmit(task.id, e)}
                      className="flex items-center gap-2 pt-1"
                    >
                      <input
                        type="text"
                        placeholder="Add a new checklist step..."
                        value={newSubtaskTitles[task.id] || ''}
                        onChange={(e) =>
                          setNewSubtaskTitles((prev) => ({ ...prev, [task.id]: e.target.value }))
                        }
                        className="bg-white px-2.5 py-1 text-xs text-[#0b1c30] rounded border border-[#c7c4d8] flex-1 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1 text-xs bg-primary text-white rounded font-medium hover:bg-[#4f46e5] flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
