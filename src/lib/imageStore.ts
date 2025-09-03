// Safe image store: Memory-only for production, file-based for local development
import path from "path";

interface ImageData {
  buffer: Buffer;
  mimeType: string;
}

// Always use in-memory storage for serverless safety
const memoryStore = new Map<string, ImageData>();

// Safe environment detection
const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL !== undefined;
const isLocalDev = isProduction === false && isVercel === false;

// File system operations (only for local development, lazy-loaded)
let fs: typeof import("fs") | null = null;
let fileStorageReady = false;
let TEMP_DIR = "";

// Lazy initialization of file storage (only in local development)
const initFileStorage = async (): Promise<boolean> => {
  if (isLocalDev === false || fileStorageReady === true) {
    return fileStorageReady;
  }

  try {
    // Only import fs in local development
    fs = await import("fs");
    TEMP_DIR = path.join(process.cwd(), ".next", "temp-images");

    if (fs.existsSync(TEMP_DIR) === false) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    fileStorageReady = true;
    return true;
  } catch (error) {
    console.error("⚠️ File storage failed, using memory only:", error);
    return false;
  }
};

export function storeImage(
  imageId: string,
  buffer: Buffer,
  mimeType: string,
): void {
  // Always store in memory first (works everywhere)
  memoryStore.set(imageId, { buffer, mimeType });

  // Try file storage only in local development
  if (isLocalDev === true) {
    initFileStorage()
      .then((ready) => {
        if (ready && fs) {
          try {
            const imagePath = path.join(TEMP_DIR, `${imageId}.img`);
            const metaPath = path.join(TEMP_DIR, `${imageId}.meta`);

            fs.writeFileSync(imagePath, buffer);
            fs.writeFileSync(metaPath, JSON.stringify({ mimeType }));
          } catch (error) {
            console.warn(`⚠️ File storage failed for ${imageId}:`, error);
          }
        }
      })
      .catch(() => {
        // Silent failure for file storage
      });
  }
}

export function getImage(
  imageId: string,
): { buffer: Buffer; mimeType: string } | undefined {
  const memoryData = memoryStore.get(imageId);
  if (memoryData !== undefined) {
    return memoryData;
  }

  // Try file storage only in local development
  if (isLocalDev === true && fileStorageReady === true && fs !== null) {
    try {
      const imagePath = path.join(TEMP_DIR, `${imageId}.img`);
      const metaPath = path.join(TEMP_DIR, `${imageId}.meta`);

      if (fs.existsSync(imagePath) && fs.existsSync(metaPath)) {
        const buffer = fs.readFileSync(imagePath);
        const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

        // Also store in memory for next time
        memoryStore.set(imageId, { buffer, mimeType: meta.mimeType });

        return { buffer, mimeType: meta.mimeType };
      }
    } catch (error) {
      console.error(`⚠️ File read failed for ${imageId}:`, error);
    }
  }

  return undefined;
}
