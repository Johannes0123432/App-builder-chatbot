import { NextRequest, NextResponse } from "next/server";
import { createClient, SUPPORTED_PROVIDERS } from "@/lib/openai";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are an expert full-stack developer and app builder.

When the user describes an app, you MUST respond with a complete, production-ready project that can be deployed immediately.

Rules:
1. Output ONLY valid JSON in this exact shape (no markdown fences, no extra text outside the JSON):
{
  "message": "A short friendly summary of what you built + clear run & deploy instructions (markdown is fine inside this string)",
  "files": {
    "package.json": "{...}",
    "src/App.tsx": "...",
    "README.md": "...",
    "index.html": "...",
    ...
  }
}

2. Always include a clear README.md that contains:
   - What the app does
   - Prerequisites
   - How to install & run locally (exact commands)
   - How to deploy (Vercel, Netlify, or simple static hosting)

3. Prefer modern, simple, reliable stacks:
   - Pure frontend: Vite + React + TypeScript + Tailwind CSS
   - Full-stack: Next.js 14+ App Router
   - Keep the dependency list short and current.

4. The generated app must be completely self-contained. No sandbox, no special runtime, no external services required beyond what the user can configure with env vars.

5. Include every necessary config file (vite.config.ts, tsconfig.json, tailwind.config.js, postcss.config.js, next.config.mjs, etc.).

6. Never leave TODO comments or incomplete implementations.

7. If the request is ambiguous, make sensible choices and document them in the "message" field.

Respond with pure JSON only.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, apiKey, provider = "openai", model, history = [] } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }
    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json({ error: "Missing API key" }, { status: 400 });
    }

    const selected = SUPPORTED_PROVIDERS.find((p) => p.id === provider) || SUPPORTED_PROVIDERS[0];
    const openai = createClient(apiKey, selected.baseURL);
    const usedModel = model || selected.defaultModel;

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...history.slice(-6).map((m: any) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      {
        role: "user" as const,
        content: `Build this app:\n\n${prompt}\n\nRemember: respond with ONLY the JSON object described in the system prompt.`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: usedModel,
      messages,
      temperature: 0.25,
      max_tokens: 12000,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "{}";

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        return NextResponse.json(
          { error: "Model returned invalid JSON. Please try again." },
          { status: 500 }
        );
      }
    }

    if (!parsed.files || typeof parsed.files !== "object") {
      return NextResponse.json(
        { error: "Model did not return a valid files object." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: parsed.message || "Here's your generated app. Download the ZIP and follow the README.",
      files: parsed.files,
    });
  } catch (error: any) {
    console.error("Generation error:", error);
    const message =
      error?.status === 401
        ? "Invalid API key. Please check your key and provider."
