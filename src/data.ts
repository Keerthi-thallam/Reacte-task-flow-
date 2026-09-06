import { Member, Task } from './types';

export const TEAM_MEMBERS: Member[] = [
  {
    id: 'alex-c',
    name: 'Alex Chen',
    role: 'Tech Lead',
    initials: 'AC',
    email: 'alex.chen@taskflow.dev'
  },
  {
    id: 'sarah-l',
    name: 'Sarah L.',
    role: 'Staff UI Designer',
    initials: 'SL',
    email: 'sarah.l@taskflow.dev'
  },
  {
    id: 'dmitri-k',
    name: 'Dmitri K.',
    role: 'Principal Data Engineer',
    initials: 'DK',
    email: 'dmitri.k@taskflow.dev'
  },
  {
    id: 'maya-n',
    name: 'Maya N.',
    role: 'Frontend Engineer',
    initials: 'MN',
    email: 'maya.n@taskflow.dev'
  },
  {
    id: 'devops-lead',
    name: 'Jordan P.',
    role: 'DevOps Architect',
    initials: 'JP',
    email: 'jordan.p@taskflow.dev'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Architect Real-time WebSocket Gateway',
    description: 'Refactor Redis pub/sub broker to handle broadcast scaling past 50,000 concurrent socket connections without event drop.',
    priority: 'Urgent',
    category: 'Backend API',
    status: 'in-progress',
    dueDate: 'Today, 5:00 PM',
    subtasks: [
      { id: 'sub-1-1', title: 'Implement cluster adapter for socket pool', completed: true },
      { id: 'sub-1-2', title: 'Benchmark heartbeat connection timeouts', completed: true },
      { id: 'sub-1-3', title: 'Setup Redis Sentinel failover listeners', completed: true },
      { id: 'sub-1-4', title: 'Stress test 50k connection multiplexing', completed: true },
      { id: 'sub-1-5', title: 'Deploy staging load generator', completed: false },
      { id: 'sub-1-6', title: 'Conduct latency profiling under peak churn', completed: false },
    ],
    assignee: TEAM_MEMBERS[0],
    tags: ['Sprint Alpha', 'Critical Bugs'],
    codeRef: {
      type: 'pr',
      label: 'PR #482'
    },
    isStarred: true,
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'task-2',
    title: 'Design System Glass Tokens Migration',
    description: 'Implement Tailwind 4 CSS variable tokens for dark glass elevation layers and unified blur filters.',
    priority: 'High',
    category: 'Design System',
    status: 'in-progress',
    dueDate: 'Tomorrow, 11:30 AM',
    subtasks: [
      { id: 'sub-2-1', title: 'Audit color elevation tokens in Figma', completed: true },
      { id: 'sub-2-2', title: 'Export CSS variables with fallbacks', completed: true },
      { id: 'sub-2-3', title: 'Validate WCAG contrast ratio for pill states', completed: false },
    ],
    assignee: TEAM_MEMBERS[1],
    tags: ['Design System', 'Sprint Alpha'],
    codeRef: {
      type: 'figma',
      label: 'Figma Sync'
    },
    isStarred: false,
    createdAt: '2026-09-02T10:30:00Z'
  },
  {
    id: 'task-3',
    title: 'PostgreSQL Composite Indexing for Audit Logs',
    description: 'Optimize tenant lookup times under 15ms by introducing B-tree indices on (tenant_id, created_at).',
    priority: 'Medium',
    category: 'Database',
    status: 'in-progress',
    dueDate: 'Oct 18, 2:00 PM',
    subtasks: [
      { id: 'sub-3-1', title: 'Run EXPLAIN ANALYZE on partition queries', completed: true },
      { id: 'sub-3-2', title: 'Write zero-downtime concurrent index migration', completed: false },
    ],
    assignee: TEAM_MEMBERS[2],
    tags: ['Sprint Alpha'],
    codeRef: {
      type: 'perf',
      label: 'DB Latency'
    },
    isStarred: false,
    createdAt: '2026-09-03T11:00:00Z'
  },
  {
    id: 'task-4',
    title: 'Revamp Onboarding Product Walkthrough',
    description: 'Incorporate keyboard shortcut prompts into the first-run experience for newly invited engineering teams.',
    priority: 'Low',
    category: 'Frontend UI',
    status: 'pending',
    dueDate: 'Oct 22',
    subtasks: [
      { id: 'sub-4-1', title: 'Draft interactive guided tour tooltips', completed: false },
      { id: 'sub-4-2', title: 'Implement hotkey listener for skip tour', completed: false },
      { id: 'sub-4-3', title: 'Add animated keyboard key visualizer', completed: false },
      { id: 'sub-4-4', title: 'Mobile touch gesture fallbacks', completed: false },
    ],
    assignee: TEAM_MEMBERS[3],
    tags: ['Sprint Alpha'],
    isStarred: false,
    createdAt: '2026-09-04T09:15:00Z'
  },
  {
    id: 'task-5',
    title: 'Configure OpenTelemetry Traces in Node Backend',
    description: 'Telemetry exporter verified on staging Kubernetes clusters with Jaeger integration.',
    priority: 'High',
    category: 'DevOps',
    status: 'completed',
    dueDate: 'Completed today, 9:15 AM',
    subtasks: [
      { id: 'sub-5-1', title: 'Setup auto-instrumentation for Express routes', completed: true },
      { id: 'sub-5-2', title: 'Trace database connection pool calls', completed: true },
      { id: 'sub-5-3', title: 'Send spans to Jaeger collector', completed: true },
      { id: 'sub-5-4', title: 'Verify trace propagation headers', completed: true },
      { id: 'sub-5-5', title: 'Set latency alerts above 500ms threshold', completed: true },
    ],
    assignee: TEAM_MEMBERS[0],
    tags: ['Sprint Alpha'],
    isStarred: false,
    createdAt: '2026-09-04T14:20:00Z',
    completedAt: '2026-09-06T09:15:00Z'
  },
  {
    id: 'task-6',
    title: 'Security Patch: Bump Express & Cookie Parser',
    description: 'Resolved vulnerability report CVE-2024-3401 in session validation pipeline.',
    priority: 'Urgent',
    category: 'Backend API',
    status: 'completed',
    dueDate: 'Completed yesterday',
    subtasks: [
      { id: 'sub-6-1', title: 'Update dependency versions in package.json', completed: true },
      { id: 'sub-6-2', title: 'Run automated regression test suites', completed: true },
    ],
    assignee: TEAM_MEMBERS[1],
    tags: ['Critical Bugs'],
    isStarred: false,
    createdAt: '2026-09-03T16:00:00Z',
    completedAt: '2026-09-05T17:30:00Z'
  }
];

export const WORKSPACE_TAGS = [
  { name: 'Sprint Alpha', colorClass: 'bg-primary' },
  { name: 'Design System', colorClass: 'bg-tertiary-container' },
  { name: 'Critical Bugs', colorClass: 'bg-error' }
];

export const STORAGE_KEY = 'taskflow_tasks_v1';
