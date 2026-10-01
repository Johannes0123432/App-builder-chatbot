import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

// ============ TEMPLATES ============

const templates: Record<string, { message: string; files: Record<string, string> }> = {
  todo: {
    message: `Here's a complete **Todo App** built with Vite + React + TypeScript + Tailwind.

### How to run
\`\`\`bash
npm install
npm run dev
\`\`\`

### Deploy
Push to GitHub and import into Vercel or Netlify.`,
    files: {
      "package.json": `{
  "name": "todo-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "typescript": "^5.5.3",
    "vite": "^5.3.4"
  }
}`,
      "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Todo App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
      "src/main.tsx": `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
      "src/App.tsx": `import { useState, useEffect } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState('')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (!input.trim()) return
    setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }])
    setInput('')
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Todo App</h1>
        
        <div className="flex gap-2 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new todo..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center gap-3 bg-gray-700/50 p-3 rounded-lg">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5"
              />
              <span className={\`flex-1 \${todo.completed ? 'line-through text-gray-400' : ''}\`}>
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No todos yet. Add one!</p>
        )}
      </div>
    </div>
  )
}`,
      "src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
}`,
      "tailwind.config.js": `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}`,
      "postcss.config.js": `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
      "vite.config.ts": `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
      "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}`,
      "README.md": `# Todo App

A simple and clean Todo application built with Vite + React + TypeScript + Tailwind CSS.

## Features
- Add, complete, and delete todos
- Data saved in localStorage
- Responsive design

## Run locally
\`\`\`bash
npm install
npm run dev
\`\`\`

## Deploy
Push this folder to GitHub and import into Vercel or Netlify.
`
    }
  },

  landing: {
    message: `Here's a modern **SaaS Landing Page** built with Vite + React + Tailwind.

### How to run
\`\`\`bash
npm install
npm run dev
\`\`\`

### Deploy
Just push to Vercel or Netlify.`,
    files: {
      "package.json": `{
  "name": "saas-landing",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "typescript": "^5.5.3",
    "vite": "^5.3.4"
  }
}`,
      "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SaaS Landing Page</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
      "src/main.tsx": `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
      "src/App.tsx": `export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="text-xl font-bold">Acme</div>
        <div className="hidden md:flex gap-8 text-sm text-gray-300">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-sm font-medium">
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-24 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Build faster.<br />Ship smarter.
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          The modern platform that helps teams launch products in days instead of months.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-medium text-lg">
            Start Free Trial
          </button>
          <button className="border border-gray-700 hover:border-gray-500 px-8 py-3 rounded-xl font-medium text-lg">
            View Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Everything you need</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Lightning Fast", desc: "Built for speed from the ground up." },
            { title: "Secure by Default", desc: "Enterprise-grade security included." },
            { title: "Beautiful UI", desc: "Polished components that look great." },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Simple pricing</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-2">Starter</h3>
            <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-400">/mo</span></div>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Unlimited projects</li>
              <li>✓ Basic analytics</li>
              <li>✓ Community support</li>
            </ul>
            <button className="w-full border border-gray-700 py-3 rounded-xl hover:bg-gray-800">
              Get Started
            </button>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/50 rounded-2xl p-8 relative">
            <div className="absolute top-4 right-4 bg-blue-600 text-xs px-3 py-1 rounded-full">Popular</div>
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-gray-400">/mo</span></div>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Everything in Starter</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Priority support</li>
              <li>✓ Custom domains</li>
            </ul>
            <button className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-medium">
              Start Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 text-center text-gray-500 text-sm">
        © 2025 Acme Inc. All rights reserved.
      </footer>
    </div>
  )
}`,
      "src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
}`,
      "tailwind.config.js": `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}`,
      "postcss.config.js": `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
      "vite.config.ts": `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
      "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}`,
      "README.md": `# SaaS Landing Page

A clean, modern landing page built with Vite + React + Tailwind CSS.

## Run locally
\`\`\`bash
npm install
npm run dev
\`\`\`

## Deploy
Push to GitHub → Import to Vercel or Netlify.
`
    }
  },

  // Fallback generic template
  generic: {
    message: `Here's a clean starter **React + Vite + Tailwind** app.

You can customize it further after downloading.

### How to run
\`\`\`bash
npm install
npm run dev
\`\`\``,
    files: {
      "package.json": `{
  "name": "my-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "typescript": "^5.5.3",
    "vite": "^5.3.4"
  }
}`,
      "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
      "src/main.tsx": `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
      "src/App.tsx": `export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to your App</h1>
        <p className="text-gray-400">Edit src/App.tsx to get started</p>
      </div>
    </div>
  )
}`,
      "src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
}`,
      "tailwind.config.js": `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}`,
      "postcss.config.js": `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
      "vite.config.ts": `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
      "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}`,
      "README.md": `# My App

Starter project created by App Builder Chatbot.

## Run
\`\`\`bash
npm install
npm run dev
\`\`\`
`
    }
  }
};

// ============ KEYWORD MATCHING ============

function detectTemplate(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes("todo") || p.includes("task") || p.includes("to-do") || p.includes("checklist")) {
    return "todo";
  }
  if (
    p.includes("landing") ||
    p.includes("saas") ||
    p.includes("marketing") ||
    p.includes("homepage") ||
    p.includes("pricing") ||
    p.includes("hero")
  ) {
    return "landing";
  }

  // fallback
  return "generic";
}

// ============ API HANDLER ============

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const templateKey = detectTemplate(prompt);
    const template = templates[templateKey];

    return NextResponse.json({
      message: template.message,
      files: template.files,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong while generating the app." },
      { status: 500 }
    );
  }
}
