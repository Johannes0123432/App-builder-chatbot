import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
   - How to install & run locally
   - How to deploy (Vercel / Netlify)

3. Prefer modern, simple stacks:
   - Pure frontend: Vite + React + TypeScript + Tailwind CSS
   - Keep dependencies minimal.

4. The generated app must be completely self-contained.

5. Include every necessary config file (vite.config.ts, tsconfig.json, tailwind.config.js, postcss.config.js, etc.).

6. Never leave TODO comments or incomplete code.

7. If the request is vague, make reasonable assumptions and document them.

Respond with pure JSON only.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, history = [] } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server is missing GEMINI_API_KEY. Please contact the owner." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build conversation history
    const contents = [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I will only reply with valid JSON containing message and files." }],
      },
      ...history.slice(-6).flatMap((m: any) => [
        {
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        },
      ]),
      {
        role: "user",
        parts: [{ text: `Build this app:\n\n${prompt}\n\nRemember: respond with ONLY the JSON object.` }],
      },
    ];

    const result = await model.generateContent({
      contents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    const raw = result.response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Try cleaning markdown if Gemini still adds it
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        return NextResponse.json(
          { error: "Gemini returned invalid JSON. Please try again." },
          { status: 500 }
        );
      }
    }

    if (!parsed.files || typeof parsed.files !== "object") {
      return NextResponse.json(
        { error: "Gemini did not return a valid files object." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: parsed.message || "Here's your generated app. Download the ZIP and follow the README.",
      files: parsed.files,
    });
  } catch (error: any) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      {
        error: error?.message || "Failed to generate the app with Gemini. Please try again.",
      },
      { status: 500 }
    );
  }
}
