import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

// GET AI settings from database
async function getAISettings() {
  const settings = await prisma.siteSetting.findMany({
    where: { group: "ai" },
  });
  const config: Record<string, string> = {};
  for (const s of settings) config[s.key] = s.value;
  return config;
}

async function generateWithOpenAI(apiKey: string, prompt: string, model: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Kamu adalah penulis berita profesional untuk portal berita Indonesia di Jepang bernama Jepang Updates. Tulis artikel dalam Bahasa Indonesia yang informatif, SEO-friendly, dan menarik. Format output dalam HTML (gunakan tag <p>, <h2>, <h3>, <strong>, <blockquote>, <ul>, <li>). Jangan gunakan tag <html>, <head>, <body>.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "OpenAI API error");
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

async function generateWithGemini(apiKey: string, prompt: string, model: string) {
  const modelName = model || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Kamu adalah penulis berita profesional untuk portal berita Indonesia di Jepang bernama Jepang Updates. Tulis artikel dalam Bahasa Indonesia yang informatif, SEO-friendly, dan menarik. Format output dalam HTML (gunakan tag <p>, <h2>, <h3>, <strong>, <blockquote>, <ul>, <li>). Jangan gunakan tag <html>, <head>, <body>.\n\n${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 3000,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Gemini API error");
  }

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth("PENULIS");
  if (error) return error;

  const body = await request.json();
  const { topic, tone, length } = body;

  if (!topic) {
    return NextResponse.json({ error: "Topik wajib diisi" }, { status: 400 });
  }

  // Get AI config from settings
  const config = await getAISettings();
  const provider = config.ai_provider || "openai";
  const apiKey = config.ai_api_key;
  const model = config.ai_model || "";

  if (!apiKey) {
    return NextResponse.json(
      { error: "API Key AI belum diatur. Pergi ke Pengaturan → AI untuk setup." },
      { status: 400 }
    );
  }

  const toneText = tone === "formal" ? "formal dan profesional" : tone === "santai" ? "santai dan mudah dipahami" : "informatif";
  const lengthText = length === "short" ? "400-600 kata" : length === "long" ? "1200-1500 kata" : "800-1000 kata";

  const prompt = `Buatkan artikel berita dengan topik: "${topic}"

Ketentuan:
- Tone: ${toneText}
- Panjang: ${lengthText}
- Awali dengan lead paragraph yang kuat (siapa, apa, dimana, kapan, mengapa)
- Sertakan kutipan jika relevan
- Akhiri dengan kesimpulan atau outlook ke depan
- Format HTML yang rapi

Berikan juga di akhir (pisahkan dengan ---METADATA---):
- Judul artikel (menarik, SEO-friendly, maks 70 karakter)
- Excerpt (ringkasan 1-2 kalimat, maks 160 karakter)
- Meta keywords (5-7 keyword, pisahkan koma)`;

  try {
    let result: string;

    if (provider === "gemini") {
      result = await generateWithGemini(apiKey, prompt, model);
    } else {
      result = await generateWithOpenAI(apiKey, prompt, model);
    }

    // Parse result - split content and metadata
    const parts = result.split("---METADATA---");
    let content = parts[0].trim();
    let title = topic;
    let excerpt = "";
    let metaKeywords = "";

    if (parts[1]) {
      const meta = parts[1].trim();
      const titleMatch = meta.match(/Judul[:\s]*(.+)/i);
      const excerptMatch = meta.match(/Excerpt[:\s]*(.+)/i);
      const keywordsMatch = meta.match(/(?:Meta )?[Kk]eywords?[:\s]*(.+)/i);

      if (titleMatch) title = titleMatch[1].trim().replace(/^["']|["']$/g, "");
      if (excerptMatch) excerpt = excerptMatch[1].trim().replace(/^["']|["']$/g, "");
      if (keywordsMatch) metaKeywords = keywordsMatch[1].trim();
    }

    // Clean up content
    content = content.replace(/```html\n?/g, "").replace(/```\n?/g, "").trim();

    return NextResponse.json({ title, content, excerpt, metaKeywords });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal generate artikel";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
