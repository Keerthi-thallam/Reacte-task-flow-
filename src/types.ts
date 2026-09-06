export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low';

export type Category = 'Backend API' | 'Frontend UI' | 'Design System' | 'Database' | 'DevOps';

export type Status = 'backlog' | 'in-progress' | 'pending' | 'completed';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  initials?: string;
  email?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  status: Status;
  dueDate: string;
  subtasks: SubTask[];
  assignee: Member;
  tags: string[];
  codeRef?: {
    type: 'pr' | 'figma' | 'perf' | 'link';
    label: string;
  };
  isStarred?: boolean;
  createdAt: string;
  completedAt?: string;
}

export type NavSection = 'all-tasks' | 'today' | 'upcoming' | 'projects' | 'completed' | 'settings';

export interface FilterOptions {
  status: 'all' | 'in-progress' | 'pending' | 'completed';
  priority: string;
  category: string;
  tag: string | null;
  searchQuery: string;
  sortBy: 'priority' | 'dueDate' | 'recent';
  viewMode: 'list' | 'kanban';
}
