# Vite + React Project Setup Prompt (Best Practices)

---

## 1. Project Goal
This setup provides a production-ready foundation for building scalable web applications, dashboards, or SaaS products with a focus on clean routing, shared layouts, and clear separation of concerns.

---

## 2. Create Project (Commands)
Run the following commands in your terminal to initialize the project and install core dependencies.

```bash
# Initialize Vite with React and TypeScript
npm create vite@latest my-app -- --template react-ts

# Navigate to project directory
cd my-app

# Install core routing and utility dependencies
npm install react-router-dom lucide-react clsx tailwind-merge

# Start the development server
npm run dev
```

---

## 3. Recommended Directory Structure
A clean folder structure prevents technical debt as the project grows.

- **src/**: Root directory for all application source code.
- **src/main.tsx**: The entry point that bootstraps the React application.
- **src/App.tsx**: The composition root that renders the RouterProvider.
- **src/pages/**: High-level view components mapped to specific routes.
- **src/components/**: Reusable atomic UI elements (buttons, inputs, cards).
- **src/layouts/**: Wrapper components providing shared UI like headers and sidebars.
- **src/router/**: Configuration files defining the application route map.
- **src/lib/**: Third-party client initializations and shared utility helpers.
- **src/styles/**: Global CSS files and Tailwind configurations.
- **src/hooks/**: Custom React hooks for shared logic and data fetching.

---

## 4. Routing Setup (Simple & Correct)
All routing configuration should live in a dedicated file to maintain a clear overview of the application map.

**File: src/router/index.tsx**
```tsx
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> }
    ]
  }
]);
```

---

## 5. Layout Pattern
Use the Layout Pattern to share persistent UI elements across multiple pages without re-rendering the shell.

**File: src/layouts/RootLayout.tsx**
```tsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4">
        <Outlet />
      </main>
    </div>
  );
}
```

---

## 6. Best Practices (Core Rules)
1. **File Naming**: Use PascalCase for components (Button.tsx) and camelCase for logic/hooks (useAuth.ts).
2. **Component Content**: Keep components focused on UI. Move complex logic, API calls, and calculations into custom hooks or utility functions.
3. **Prop Drilling**: If data is needed more than two levels deep, use React Context or a lightweight state management solution.
4. **Thin Pages**: Page components should primarily compose smaller components and pass data, rather than containing large blocks of JSX.
5. **Standardized Styling**: Use utility classes (Tailwind) for consistent spacing and colors. Avoid raw inline styles.
6. **Path Aliases**: Use absolute imports or root-relative paths to avoid deeply nested relative imports (../../../).

---

## 7. What NOT to Do
1. **App.tsx Bloat**: Do not put page-specific UI, heavy state logic, or many providers directly into App.tsx.
2. **Mixing Logic**: Avoid mixing complex business logic with JSX markup; it makes testing and maintenance difficult.
3. **Direct DOM Manipulation**: Never use document.querySelector or similar methods; rely strictly on React state and refs.
4. **Deep Nesting**: Avoid nesting components more than 3-4 levels deep within a single file. Break them into smaller files instead.