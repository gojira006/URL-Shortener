"use server";

import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { reservedSlugs } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

const linkInput = z.object({ targetUrl: z.string().url("Enter a valid URL.").refine((url) => /^https?:\/\//i.test(url), "Only HTTP and HTTPS URLs are allowed."), slug: z.string().trim().regex(/^[A-Za-z0-9-]{3,32}$/, "Use 3–32 letters, numbers, or hyphens.").optional().or(z.literal("")), expiresAt: z.string().optional().or(z.literal("")) });
export type LinkState = { error?: string; success?: string };

export async function createLink(_: LinkState, formData: FormData): Promise<LinkState> {
  const parsed = linkInput.safeParse({ targetUrl: formData.get("targetUrl"), slug: formData.get("slug"), expiresAt: formData.get("expiresAt") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid link details." };
  const { targetUrl, expiresAt } = parsed.data; const customSlug = parsed.data.slug || undefined;
  if (customSlug && reservedSlugs.has(customSlug.toLowerCase())) return { error: "That slug is reserved." };
  if (expiresAt && Number.isNaN(Date.parse(expiresAt))) return { error: "Enter a valid expiry date." };
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired. Please log in again." };
  for (let attempt = 0; attempt < (customSlug ? 1 : 5); attempt += 1) {
    const slug = customSlug ?? nanoid(7);
    const { error } = await supabase.from("links").insert({ user_id: user.id, slug, target_url: targetUrl, expires_at: expiresAt ? new Date(expiresAt).toISOString() : null });
    if (!error) { revalidatePath("/dashboard"); return { success: "Short link created." }; }
    if (error.code !== "23505") return { error: error.message };
    if (customSlug) return { error: "That custom slug is already in use." };
  }
  return { error: "Could not create a unique slug. Please try again." };
}

export async function deleteLink(id: string) {
  const supabase = await createClient(); const { error } = await supabase.from("links").delete().eq("id", id);
  if (error) return { error: error.message }; revalidatePath("/dashboard"); return { success: true };
}
