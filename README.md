# TaskFlow

TaskFlow is a sprint and task execution workspace for engineering teams. It includes list and Kanban views, task filtering, quick search, local persistence, progress metrics, and responsive team workflows.

## Tech Stack

- React 19 and TypeScript
- Vite
- Tailwind CSS
- Lucide icons

## Local Development

### Prerequisites

- Node.js 18 or newer

### Setup

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:3000` by default. If that port is busy, Vite selects the next available port.

## Deploying to GitHub Pages

The GitHub Actions workflow builds the Vite app and deploys the generated `dist` directory to GitHub Pages whenever changes are pushed to `main`.

In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. After the workflow completes, use the Pages URL shown there.

## Available Scripts

- `npm run dev` starts the development server.
- `npm run build` creates a production build.
- `npm run preview` serves the production build locally.
- `npm run lint` runs the TypeScript check.
