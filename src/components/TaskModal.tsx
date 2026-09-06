import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Calendar, 
  CheckSquare, 
  User, 
  Tag, 
  Terminal, 
  Layers 
} from 'lucide-react';
import { Task, Priority, Category, Status, SubTask } from '../types';
import { TEAM_MEMBERS, WORKSPACE_TAGS } from '../data';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (taskData: Partial<Task>) => void;
  taskToEdit?: Task | null;
  defaultStatus?: Status;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  taskToEdit,
  defaultStatus = 'in-progress',
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  const [category, setCategory] = useState<Category>('Backend API');
  const [status, setStatus] = useState<Status>(defaultStatus);
  const [dueDate, setDueDate] = useState('Today, 5:00 PM');
  const [assigneeId, setAssigneeId] = useState(TEAM_MEMBERS[0].id);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Sprint Alpha']);
  const [codeRefLabel, setCodeRefLabel] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category);
      setStatus(taskToEdit.status);
      setDueDate(taskToEdit.dueDate);
      setAssigneeId(taskToEdit.assignee.id);
      setSubtasks(taskToEdit.subtasks || []);
      setSelectedTags(taskToEdit.tags || ['Sprint Alpha']);
      setCodeRefLabel(taskToEdit.codeRef?.label || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('High');
      setCategory('Backend API');
      setStatus(defaultStatus);
      setDueDate('Tomorrow, 5:00 PM');
      setAssigneeId(TEAM_MEMBERS[0].id);
      setSubtasks([]);
      setSelectedTags(['Sprint Alpha']);
      setCodeRefLabel('');
    }
  }, [taskToEdit, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: `sub-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleToggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignedMember =
      TEAM_MEMBERS.find((m) => m.id === assigneeId) || TEAM_MEMBERS[0];

    onSaveTask({
      ...(taskToEdit ? { id: taskToEdit.id } : {}),
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      status,
      dueDate,
      assignee: assignedMember,
      subtasks,
      tags: selectedTags,
      codeRef: codeRefLabel.trim()
        ? {
            type: codeRefLabel.toLowerCase().includes('pr')
              ? 'pr'
              : codeRefLabel.toLowerCase().includes('figma')
              ? 'figma'
              : 'perf',
            label: codeRefLabel.trim(),
          }
        : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#dce9ff] max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
              {taskToEdit ? 'TF' : '+'}
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0b1c30]">
                {taskToEdit ? 'Edit Task Specifications' : 'Create High-Velocity Task'}
              </h3>
              <p className="text-[11px] text-[#464555]">
                {taskToEdit ? 'Update objective and sprint dependencies' : 'Dispatch immediately to execution matrix'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777587] hover:bg-[#dce9ff] hover:text-[#0b1c30]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 flex-1">
          {/* Title Input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#0b1c30]">
              Task Title <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Architect Real-time WebSocket Gateway"
              className="w-full bg-[#eff4ff] px-3.5 py-2 rounded-lg text-sm text-[#0b1c30] placeholder:text-[#777587] border border-[#dce9ff] focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#0b1c30]">Objective Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe technical implementation, dependencies, and acceptance criteria..."
              className="w-full bg-[#eff4ff] px-3.5 py-2 rounded-lg text-sm text-[#0b1c30] placeholder:text-[#777587] border border-[#dce9ff] focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Priority & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30]">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="bg-[#eff4ff] text-[#0b1c30] text-xs py-2 px-3 rounded-lg border border-[#dce9ff] focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="bg-[#eff4ff] text-[#0b1c30] text-xs py-2 px-3 rounded-lg border border-[#dce9ff] focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="Backend API">Backend API</option>
                <option value="Frontend UI">Frontend UI</option>
                <option value="Design System">Design System</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30]">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="bg-[#eff4ff] text-[#0b1c30] text-xs py-2 px-3 rounded-lg border border-[#dce9ff] focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="backlog">Backlog</option>
                <option value="in-progress">In Progress</option>
                <option value="pending">In Review / Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Due Date</span>
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g., Today, 5:00 PM or Oct 22"
                className="bg-[#eff4ff] px-3.5 py-2 rounded-lg text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>Assignee</span>
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="bg-[#eff4ff] text-[#0b1c30] text-xs py-2 px-3 rounded-lg border border-[#dce9ff] focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                {TEAM_MEMBERS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Code Ref / Tag Link */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-primary" />
              <span>Reference Link / PR / Metric (Optional)</span>
            </label>
            <input
              type="text"
              value={codeRefLabel}
              onChange={(e) => setCodeRefLabel(e.target.value)}
              placeholder="e.g., PR #482, Figma Sync, DB Latency"
              className="bg-[#eff4ff] px-3.5 py-2 rounded-lg text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Workspace Tags selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-primary" />
              <span>Workspace Tags</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {WORKSPACE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag.name);
                return (
                  <button
                    key={tag.name}
                    type="button"
                    onClick={() => handleToggleTag(tag.name)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-[#eff4ff] text-[#464555] hover:bg-[#dce9ff]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-white' : tag.colorClass
                      }`}
                    />
                    <span>{tag.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtasks Builder */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#e5eeff]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5 text-primary" />
                <span>Checklist Steps ({subtasks.filter((s) => s.completed).length}/{subtasks.length})</span>
              </label>
            </div>

            {/* List of subtasks */}
            {subtasks.length > 0 && (
              <div className="flex flex-col gap-1 max-h-36 overflow-y-auto bg-[#eff4ff]/60 p-2 rounded-lg border border-[#dce9ff]">
                {subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-1.5 hover:bg-white rounded text-xs gap-2"
                  >
                    <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => handleToggleSubtask(sub.id)}
                        className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
                      />
                      <span className={`truncate ${sub.completed ? 'line-through text-[#777587]' : 'text-[#0b1c30]'}`}>
                        {sub.title}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      className="text-[#ba1a1a] hover:opacity-80 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add subtask input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="New subtask checklist step..."
                className="bg-[#eff4ff] px-3 py-1.5 rounded-lg text-xs text-[#0b1c30] border border-[#dce9ff] flex-1 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-[#dce9ff] text-primary hover:bg-[#c7c4d8] rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e5eeff] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#464555] hover:bg-[#eff4ff] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary hover:bg-[#4f46e5] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
