# App Builder Chatbot

A simple, deployable chatbot that turns natural language descriptions into complete, ready-to-deploy web apps.

You describe an app → it generates a full project (files + README) → you download a ZIP → you deploy it.

No sandbox required. Everything runs as a normal Next.js application.

---

## Features

- Chat interface for describing apps
- Supports multiple LLM providers (OpenAI, xAI Grok, Groq, Together, OpenRouter)
- Generates complete projects (usually Vite + React + TypeScript + Tailwind, or Next.js)
- One-click ZIP download of the generated app
- Clean dark UI

---

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

1. Click **Set API Key**
2. Choose your provider and paste your API key
3. Describe an app and hit Generate

---

## Deploy to Vercel (Recommended)

### Option A – Deploy from your computer

```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# From the project root
vercel
```

Follow the prompts. After the first deploy you can use `vercel --prod`.

### Option B – Deploy from GitHub

1. Create a new GitHub repository
2. Push this project to it:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/app-builder-chatbot.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import the repository
4. Click **Deploy** (no environment variables needed for basic usage)

The app is now live. Users will still enter their own API keys in the UI.

---

## Deploy to other platforms

- **Netlify**: Use the Next.js runtime or build command `npm run build` and publish directory `.next`
- **Railway / Render**: Connect the GitHub repo and use the default Node.js settings
- **Cloudflare Pages**: Use the `@cloudflare/next-on-pages` adapter if you want edge deployment

---

## How the generated apps work

When you ask the chatbot to build something, it returns a complete project as a set of files.  
You download the ZIP, unzip it, run `npm install && npm run dev` (or follow the generated README), and deploy that new project independently.

The generated apps themselves do **not** depend on any sandbox or special runtime.

---

## Environment / API Keys

This chatbot never stores API keys.  
Users paste their own key in the browser; it is only sent to the `/api/generate` route of this app and then to the chosen LLM provider.

You can later add server-side keys or authentication if you want to turn this into a multi-user product.

---

## Project Structure

```
app/
  api/generate/route.ts   ← LLM call + JSON parsing
  page.tsx                ← Main chat UI
  layout.tsx
  globals.css
components/
  ChatMessage.tsx
  DownloadButton.tsx      ← Creates the ZIP client-side
lib/
  openai.ts               ← Provider helpers
```

---

## Customization Ideas

- Add authentication (Clerk, Auth.js, etc.)
- Persist generated projects
- Let users choose the stack (Vite vs Next.js vs Astro)
- Add a “Deploy to Vercel” button that uses the Vercel API
- Support streaming responses

---

## License

MIT – do whatever you want with it.
