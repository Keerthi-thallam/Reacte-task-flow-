import React from 'react';
import { 
  Plus, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  CheckCircle, 
  Star, 
  MoreVertical 
} from 'lucide-react';
import { Task, Status } from '../types';

interface KanbanBoardViewProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onToggleStar: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onChangeStatus: (taskId: string, newStatus: Status) => void;
  onQuickAddInStatus: (status: Status) => void;
}

interface ColumnConfig {
  id: Status;
  label: string;
  colorClass: string;
  badgeBg: string;
}

const COLUMNS: ColumnConfig[] = [
  { id: 'backlog', label: 'Backlog', colorClass: 'border-t-4 border-[#777587]', badgeBg: 'bg-[#eff4ff]' },
  { id: 'in-progress', label: 'In Progress', colorClass: 'border-t-4 border-primary', badgeBg: 'bg-[#dae2fd]' },
  { id: 'pending', label: 'In Review / Pending', colorClass: 'border-t-4 border-[#00505f]', badgeBg: 'bg-[#acedff]' },
  { id: 'completed', label: 'Completed', colorClass: 'border-t-4 border-[#10b981]', badgeBg: 'bg-[#d1fae5]' },
];

export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({
  tasks,
  onToggleComplete,
  onToggleStar,
  onEditTask,
  onDeleteTask,
  onChangeStatus,
  onQuickAddInStatus,
}) => {
  const getTasksByStatus = (status: Status) => {
    return tasks.filter((t) => t.status === status);
  };

  const getNextStatus = (current: Status): Status | null => {
    if (current === 'backlog') return 'in-progress';
    if (current === 'in-progress') return 'pending';
    if (current === 'pending') return 'completed';
    return null;
  };

  const getPrevStatus = (current: Status): Status | null => {
    if (current === 'completed') return 'pending';
    if (current === 'pending') return 'in-progress';
    if (current === 'in-progress') return 'backlog';
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start overflow-x-auto pb-4">
      {COLUMNS.map((column) => {
        const columnTasks = getTasksByStatus(column.id);

        return (
          <div
            key={column.id}
            className={`bg-[#eff4ff]/60 rounded-xl p-3.5 flex flex-col gap-3 min-w-[260px] border border-[#dce9ff] shadow-xs ${column.colorClass}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-[#0b1c30] uppercase tracking-wider">
                  {column.label}
                </span>
                <span className="font-mono text-xs bg-white text-[#464555] px-2 py-0.5 rounded-full border border-[#dce9ff] font-semibold">
                  {columnTasks.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onQuickAddInStatus(column.id)}
                className="p-1 rounded-md text-[#464555] hover:bg-white hover:text-primary transition-colors cursor-pointer"
                title={`Add task to ${column.label}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Task Cards */}
            <div className="flex flex-col gap-2.5 min-h-[140px]">
              {columnTasks.map((task) => {
                const isCompleted = task.status === 'completed';
                const nextStatus = getNextStatus(task.status);
                const prevStatus = getPrevStatus(task.status);

                return (
                  <div
                    key={task.id}
                    className="bg-white p-3.5 rounded-xl border border-[#e5eeff] shadow-xs hover:shadow-md transition-all flex flex-col gap-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                          task.priority === 'Urgent'
                            ? 'bg-[#ffdad6] text-[#93000a]'
                            : task.priority === 'High'
                            ? 'bg-[#dae2fd] text-[#3f465c]'
                            : 'bg-[#eff4ff] text-[#464555]'
                        }`}
                      >
                        {task.priority}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onToggleStar(task.id)}
                          className={`p-1 rounded hover:bg-[#eff4ff] transition-colors ${
                            task.isStarred ? 'text-[#eab308]' : 'text-[#777587]'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${task.isStarred ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditTask(task)}
                          className="p-1 rounded text-[#777587] hover:bg-[#eff4ff] hover:text-[#0b1c30]"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4
                      onClick={() => onEditTask(task)}
                      className={`text-xs font-semibold cursor-pointer hover:text-primary leading-snug ${
                        isCompleted ? 'line-through text-[#777587]' : 'text-[#0b1c30]'
                      }`}
                    >
                      {task.title}
                    </h4>

                    <p className="text-[11px] text-[#464555] line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-[#464555] pt-1 border-t border-[#f0f4ff]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#777587]" />
                        <span>{task.dueDate}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        {task.assignee.avatarUrl ? (
                          <img
                            src={task.assignee.avatarUrl}
                            alt={task.assignee.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#565e74] text-white flex items-center justify-center font-bold text-[9px]">
                            {task.assignee.initials || 'AC'}
                          </div>
                        )}
                        <span>{task.assignee.name.split(' ')[0]}</span>
                      </div>
                    </div>

                    {/* Column Movement Controls */}
                    <div className="flex items-center justify-between pt-1 text-[11px] text-[#777587]">
                      {prevStatus ? (
                        <button
                          type="button"
                          onClick={() => onChangeStatus(task.id, prevStatus)}
                          className="p-1 rounded hover:bg-[#eff4ff] hover:text-primary transition-colors flex items-center gap-0.5"
                          title="Move left"
                        >
                          <ArrowLeft className="w-3 h-3" />
                          <span className="text-[9px] uppercase">Back</span>
                        </button>
                      ) : (
                        <span />
                      )}

                      {nextStatus ? (
                        <button
                          type="button"
                          onClick={() => onChangeStatus(task.id, nextStatus)}
                          className="p-1 rounded hover:bg-[#eff4ff] hover:text-primary transition-colors flex items-center gap-0.5 ml-auto"
                          title="Move right"
                        >
                          <span className="text-[9px] uppercase">Advance</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#10b981] font-semibold flex items-center gap-1 ml-auto">
                          <CheckCircle className="w-3 h-3" />
                          <span>Done</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {columnTasks.length === 0 && (
                <div className="p-4 text-center border-2 border-dashed border-[#dce9ff] rounded-lg">
                  <span className="text-xs text-[#777587]">No tasks here</span>
                </div>
              )}
            </div>

            {/* Column Quick Add Action */}
            <button
              type="button"
              onClick={() => onQuickAddInStatus(column.id)}
              className="w-full py-2 bg-white hover:bg-[#e5eeff] text-[#464555] hover:text-[#0b1c30] text-xs font-semibold rounded-lg border border-[#dce9ff] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
