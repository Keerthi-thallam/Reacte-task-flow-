import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricsRibbon } from './components/MetricsRibbon';
import { FilterToolbar } from './components/FilterToolbar';
import { TaskListView } from './components/TaskListView';
import { KanbanBoardView } from './components/KanbanBoardView';
import { ProductivitySidebar } from './components/ProductivitySidebar';
import { TaskModal } from './components/TaskModal';
import { CommandPalette } from './components/CommandPalette';
import { SettingsModal } from './components/SettingsModal';
import { Task, NavSection, FilterOptions, Status, Priority, Category } from './types';
import { INITIAL_TASKS, STORAGE_KEY, TEAM_MEMBERS } from './data';

export default function App() {
  // Load tasks from localStorage or initial dataset
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((task) => ({
            ...task,
            assignee: {
              ...task.assignee,
              avatarUrl: undefined,
              initials: task.assignee.initials || task.assignee.name.slice(0, 2).toUpperCase(),
            },
          }));
        }
      }
    } catch (e) {
      console.error('Error loading saved tasks:', e);
    }
    return INITIAL_TASKS;
  });

  // Navigation & Filtering States
  const [currentSection, setCurrentSection] = useState<NavSection>('all-tasks');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    priority: 'All',
    category: 'All',
    tag: null,
    searchQuery: '',
    sortBy: 'priority',
    viewMode: 'list',
  });

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [defaultModalStatus, setDefaultModalStatus] = useState<Status>('in-progress');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks to localStorage:', e);
    }
  }, [tasks]);

  // Global Keyboard Shortcuts (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update filters handler
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Section switch
  const handleSelectSection = (section: NavSection) => {
    setCurrentSection(section);
    if (section === 'settings') {
      setIsSettingsOpen(true);
    }
  };

  // Task Mutations
  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isNowCompleted = t.status !== 'completed';
          return {
            ...t,
            status: isNowCompleted ? 'completed' : 'in-progress',
            completedAt: isNowCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleToggleStar = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isStarred: !t.isStarred } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleChangeStatus = (taskId: string, newStatus: Status) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, completed: !s.completed } : s
            ),
          };
        }
        return t;
      })
    );
  };

  const handleAddSubtask = (taskId: string, title: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newSub = {
            id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            title,
            completed: false,
          };
          return {
            ...t,
            subtasks: [...t.subtasks, newSub],
          };
        }
        return t;
      })
    );
  };

  const handleMarkAllCompleted = () => {
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        status: 'completed' as Status,
        completedAt: new Date().toISOString(),
      }))
    );
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskData.id) {
      // Edit existing
      setTasks((prev) =>
        prev.map((t) => (t.id === taskData.id ? ({ ...t, ...taskData } as Task) : t))
      );
    } else {
      // Create new
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: taskData.title || 'Untitled Sprint Task',
        description: taskData.description || '',
        priority: taskData.priority || 'High',
        category: taskData.category || 'Backend API',
        status: taskData.status || defaultModalStatus,
        dueDate: taskData.dueDate || 'Tomorrow, 5:00 PM',
        subtasks: taskData.subtasks || [],
        assignee: taskData.assignee || TEAM_MEMBERS[0],
        tags: taskData.tags || ['Sprint Alpha'],
        codeRef: taskData.codeRef,
        isStarred: false,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleQuickAddTask = (data: {
    title: string;
    priority: Priority;
    category: Category;
    dueDate?: string;
  }) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.title,
      description: `Rapid dispatch item for ${data.category}`,
      priority: data.priority,
      category: data.category,
      status: 'in-progress',
      dueDate: data.dueDate || 'Tomorrow, 5:00 PM',
      subtasks: [],
      assignee: TEAM_MEMBERS[0],
      tags: ['Sprint Alpha'],
      isStarred: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleResetData = () => {
    setTasks(INITIAL_TASKS);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Filter and Sort Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Navigation section filtering
      if (currentSection === 'today') {
        const isToday =
          task.dueDate.toLowerCase().includes('today') ||
          (task.completedAt && task.completedAt.slice(0, 10) === new Date().toISOString().slice(0, 10));
        if (!isToday) return false;
      } else if (currentSection === 'upcoming') {
        if (task.status === 'completed' || task.dueDate.toLowerCase().includes('today')) {
          return false;
        }
      } else if (currentSection === 'completed') {
        if (task.status !== 'completed') return false;
      }

      // Workspace tag filtering
      if (activeTag && !task.tags.includes(activeTag)) {
        return false;
      }

      // Status tab filter
      if (filters.status === 'in-progress' && task.status !== 'in-progress') return false;
      if (filters.status === 'pending' && task.status !== 'pending' && task.status !== 'backlog')
        return false;
      if (filters.status === 'completed' && task.status !== 'completed') return false;

      // Priority filter
      if (filters.priority !== 'All' && task.priority !== filters.priority) return false;

      // Category filter
      if (filters.category !== 'All' && task.category !== filters.category) return false;

      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = task.description.toLowerCase().includes(q);
        const matchesCat = task.category.toLowerCase().includes(q);
        const matchesAssignee = task.assignee.name.toLowerCase().includes(q);
        const matchesTags = task.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesAssignee && !matchesTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'priority') {
        const priorityWeight: Record<Priority, number> = {
          Urgent: 4,
          High: 3,
          Medium: 2,
          Low: 1,
        };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (filters.sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [tasks, currentSection, activeTag, filters]);

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans antialiased">
      {/* Fixed Left Sidebar */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={handleSelectSection}
        activeTag={activeTag}
        onSelectTag={setActiveTag}
        tasks={tasks}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area Offset by Sidebar */}
      <div className="lg:pl-[16rem] flex-1 flex flex-col min-h-screen">
        {/* Top Fixed Header */}
        <Header
          searchQuery={filters.searchQuery}
          onSearchChange={(query) => handleFilterChange({ searchQuery: query })}
          onOpenCreateTask={() => {
            setTaskToEdit(null);
            setDefaultModalStatus('in-progress');
            setIsTaskModalOpen(true);
          }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Scrollable Page Body */}
        <main className="pt-20 px-4 sm:px-8 py-6 flex-1 flex flex-col gap-6 max-w-[1440px] w-full mx-auto">
          {/* Top Momentum Metrics & Velocity Ribbon */}
          <MetricsRibbon tasks={tasks} />

          {/* Filter & Control Matrix Toolbar */}
          <FilterToolbar
            filters={filters}
            onFilterChange={handleFilterChange}
            tasks={tasks}
            onOpenCreateTask={() => {
              setTaskToEdit(null);
              setDefaultModalStatus('in-progress');
              setIsTaskModalOpen(true);
            }}
          />

          {/* Workspace Grid: Task Stream + Right Productivity Drawer */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Main Task Execution Stream (Col 8) */}
            <div className="xl:col-span-8 flex flex-col gap-4">
              {filters.viewMode === 'list' ? (
                <TaskListView
                  tasks={filteredTasks}
                  onToggleComplete={handleToggleComplete}
                  onToggleStar={handleToggleStar}
                  onEditTask={(task) => {
                    setTaskToEdit(task);
                    setIsTaskModalOpen(true);
                  }}
                  onDeleteTask={handleDeleteTask}
                  onToggleSubtask={handleToggleSubtask}
                  onAddSubtask={handleAddSubtask}
                  onMarkAllCompleted={handleMarkAllCompleted}
                />
              ) : (
                <KanbanBoardView
                  tasks={filteredTasks}
                  onToggleComplete={handleToggleComplete}
                  onToggleStar={handleToggleStar}
                  onEditTask={(task) => {
                    setTaskToEdit(task);
                    setIsTaskModalOpen(true);
                  }}
                  onDeleteTask={handleDeleteTask}
                  onChangeStatus={handleChangeStatus}
                  onQuickAddInStatus={(status) => {
                    setTaskToEdit(null);
                    setDefaultModalStatus(status);
                    setIsTaskModalOpen(true);
                  }}
                />
              )}
            </div>

            {/* Right Productivity Insights & Quick Add Drawer (Col 4) */}
            <ProductivitySidebar
              onQuickAddTask={handleQuickAddTask}
              tasks={tasks}
              onSelectTask={(taskId) => {
                const found = tasks.find((t) => t.id === taskId);
                if (found) {
                  setTaskToEdit(found);
                  setIsTaskModalOpen(true);
                }
              }}
            />
          </section>
        </main>
      </div>

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaveTask={handleSaveTask}
        taskToEdit={taskToEdit}
        defaultStatus={defaultModalStatus}
      />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tasks={tasks}
        onSelectTask={(task) => {
          setTaskToEdit(task);
          setIsTaskModalOpen(true);
        }}
        onOpenCreateTask={() => {
          setTaskToEdit(null);
          setIsTaskModalOpen(true);
        }}
        onSelectTag={(tag) => {
          setActiveTag(tag);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetData={handleResetData}
        tasks={tasks}
      />
    </div>
  );
}
