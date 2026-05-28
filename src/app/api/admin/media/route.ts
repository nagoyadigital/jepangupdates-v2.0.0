import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, permissions } from "@/lib/auth-utils";
import { getPaginationParams } from "@/lib/utils";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
];

// GET /api/admin/media - List media files
export async function GET(request: NextRequest) {
  const { error } = await requireAuth("KONTRIBUTOR");
  if (error) return error;

  const searchParams = request.nextUrl.searchParams;
  const { page, limit, skip } = getPaginationParams(searchParams);
  const mimeType = searchParams.get("type");

  const where = {
    ...(mimeType ? { mimeType: { startsWith: mimeType } } : {}),
  };

  const [media, total] = await Promise.all([
    prisma.media.findMany({
      where,
      include: { uploadedBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.media.count({ where }),
  ]);

  return NextResponse.json({
    media,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

// POST /api/admin/media - Upload file
export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth("KONTRIBUTOR");
  if (error) return error;

  if (!permissions.canUploadMedia(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "File wajib diupload" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Tipe file tidak diizinkan" }, { status: 400 });
  }

  // Create upload directory with date-based structure
  const now = new Date();
  const yearMonth = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const uploadPath = path.join(UPLOAD_DIR, yearMonth);

  if (!existsSync(uploadPath)) {
    await mkdir(uploadPath, { recursive: true });
  }

  // Generate unique filename
  const ext = ".webp"; // Always convert to WebP for optimization
  const filename = `${uuidv4()}${ext}`;
  const filePath = path.join(uploadPath, filename);

  // Write file - optimize images with sharp
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  let width: number | undefined;
  let height: number | undefined;
  let finalBuffer = buffer;

  if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
    try {
      const sharp = (await import("sharp")).default;
      const image = sharp(buffer);
      const metadata = await image.metadata();
      
      // Resize if too large (max 2400px width for ads/banners) and convert to WebP
      const processed = metadata.width && metadata.width > 2400
        ? image.resize(2400, null, { withoutEnlargement: true })
        : image;
      
      finalBuffer = Buffer.from(await processed
        .webp({ quality: 90, effort: 4 })
        .toBuffer() as Buffer);
      
      const newMeta = await sharp(finalBuffer).metadata();
      width = newMeta.width;
      height = newMeta.height;
    } catch {
      // Fallback: save original if sharp fails
      finalBuffer = buffer;
    }
  } else {
    // Non-image files (PDF, SVG) - save as-is with original extension
    const origExt = path.extname(file.name);
    const origFilename = `${uuidv4()}${origExt}`;
    const origPath = path.join(uploadPath, origFilename);
    await writeFile(origPath, buffer);
    
    const url = `/uploads/${yearMonth}/${origFilename}`;
    const media = await prisma.media.create({
      data: {
        filename: origFilename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url,
        uploadedById: session!.user.id,
      },
    });
    return NextResponse.json(media, { status: 201 });
  }

  await writeFile(filePath, finalBuffer);

  const url = `/uploads/${yearMonth}/${filename}`;

  const media = await prisma.media.create({
    data: {
      filename,
      originalName: file.name,
      mimeType: "image/webp",
      size: finalBuffer.length,
      url,
      width,
      height,
      uploadedById: session!.user.id,
    },
  });

  return NextResponse.json(media, { status: 201 });
}
