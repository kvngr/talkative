import { NextRequest, NextResponse } from "next/server";
import { getImage } from "@/lib/imageStore";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> },
) {
  try {
    const { imageId } = await params;

    const imageData = getImage(imageId);

    if (imageData === undefined) {
      return new NextResponse("Image not found", { status: 404 });
    }

    return new NextResponse(imageData.buffer, {
      status: 200,
      headers: {
        "Content-Type": imageData.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", {
      status: 500,
      statusText:
        error instanceof Error
          ? error.message
          : `Internal Server Error: ${error}`,
    });
  }
}
