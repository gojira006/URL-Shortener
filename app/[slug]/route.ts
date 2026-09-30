import { after, NextResponse, type NextRequest } from "next/server";
import { UAParser } from "ua-parser-js";
import { createAdminClient } from "@/lib/supabase/admin";
export const dynamic = "force-dynamic";
const botPattern = /bot|crawler|spider|slurp|facebookexternalhit|preview/i;
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const admin = createAdminClient(); const { data: link } = await admin.from("links").select("id,target_url,expires_at").eq("slug", slug).maybeSingle();
  if (!link || (link.expires_at && new Date(link.expires_at) <= new Date())) return NextResponse.redirect(new URL("/", request.url), 307);
  const userAgent = request.headers.get("user-agent") ?? ""; const parsed = new UAParser(userAgent).getResult(); const browser = parsed.browser.name ?? "Unknown"; const os = parsed.os.name ?? "Unknown"; const device = parsed.device.type ?? "desktop";
  after(async () => { await admin.from("clicks").insert({ link_id: link.id, country: request.headers.get("x-vercel-ip-country") ?? "Unknown", device, browser, os, referrer: request.headers.get("referer") ?? "Direct", is_bot: botPattern.test(userAgent) }); });
  return NextResponse.redirect(link.target_url, 307);
}
