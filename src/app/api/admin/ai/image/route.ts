import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

async function getImageAISettings() {
  const settings = await prisma.siteSetting.findMany({ where: { group: "ai" } });
  const config: Record<string, string> = {};
  for (const s of settings) config[s.key] = s.value;
  return config;
}

async function generateWithLeonardo(apiKey: string, prompt: string) {
  // Step 1: Create generation
  const createRes = await fetch("https://cloud.leonardo.ai/api/rest/v1/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: prompt,
      modelId: "6b645e3a-d64f-4341-a6d8-7a3690fbf042", // Leonardo Lightning XL
      width: 1024,
      height: 576,
      num_images: 1,
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    throw new Error(err.error || "Leonardo API error");
  }

  const createData = await createRes.json();
  const generationId = createData.sdGenerationJob?.generationId;

  if (!generationId) throw new Error("Gagal membuat generation");

  // Step 2: Poll for result (max 30 seconds)
  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 2000));

    const pollRes = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (pollRes.ok) {
      const pollData = await pollRes.json();
      const images = pollData.generations_by_pk?.generated_images;
      if (images && images.length > 0) {
        return images[0].url;
      }
    }
  }

  throw new Error("Timeout: gambar belum selesai di-generate");
}

async function generateWithDALLE(apiKey: string, prompt: string) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1792x1024",
      quality: "standard",
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "DALL-E API error");
  }

  const data = await res.json();
  return data.data[0].url;
}

async function searchUnsplash(query: string) {
  const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
    headers: { Authorization: "Client-ID YOUR_UNSPLASH_KEY" },
  });
  if (!res.ok) throw new Error("Unsplash API error");
  const data = await res.json();
  if (data.results.length === 0) throw new Error("Tidak ada gambar ditemukan");
  return data.results[0].urls.regular;
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth("PENULIS");
  if (error) return error;

  const body = await request.json();
  const { prompt, provider: requestProvider } = body;

  if (!prompt) {
    return NextResponse.json({ error: "Prompt wajib diisi" }, { status: 400 });
  }

  const config = await getImageAISettings();
  const provider = requestProvider || config.ai_image_provider || "leonardo";
  const apiKey = config.ai_image_api_key || config.ai_api_key;

  if (!apiKey && provider !== "unsplash") {
    return NextResponse.json({ error: "API Key belum diatur di Pengaturan → AI Writer" }, { status: 400 });
  }

  try {
    let imageUrl: string;

    if (provider === "leonardo") {
      const leonardoKey = config.ai_image_api_key || apiKey;
      imageUrl = await generateWithLeonardo(leonardoKey, prompt);
    } else if (provider === "dalle") {
      imageUrl = await generateWithDALLE(apiKey, prompt);
    } else {
      imageUrl = await searchUnsplash(prompt);
    }

    // Download image and save locally
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) throw new Error("Gagal download gambar");
    const buffer = Buffer.from(await imgRes.arrayBuffer());

    const now = new Date();
    const yearMonth = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", "ai", yearMonth);
    if (!existsSync(uploadPath)) await mkdir(uploadPath, { recursive: true });

    const filename = `${uuidv4()}.jpg`;
    const filePath = path.join(uploadPath, filename);
    await writeFile(filePath, buffer);

    const localUrl = `/uploads/ai/${yearMonth}/${filename}`;

    return NextResponse.json({ url: localUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal generate gambar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
