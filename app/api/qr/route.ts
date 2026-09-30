import QRCode from "qrcode";
import { NextResponse, type NextRequest } from "next/server";
export async function GET(request: NextRequest) { const value = request.nextUrl.searchParams.get("url"); if (!value || value.length > 2048) return new NextResponse("Missing or invalid URL", { status: 400 }); try { new URL(value); const image = await QRCode.toBuffer(value, { type: "png", width: 512, margin: 1 }); return new NextResponse(image, { headers: { "Content-Type": "image/png", "Cache-Control": "private, max-age=3600" } }); } catch { return new NextResponse("Invalid URL", { status: 400 }); } }
