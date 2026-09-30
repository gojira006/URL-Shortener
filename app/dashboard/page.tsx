import { headers } from "next/headers";
import { CreateLinkForm } from "@/components/create-link-form";
import { DashboardLinkTable } from "@/components/dashboard-link-table";
import { createClient } from "@/lib/supabase/server";
import type { Link } from "@/lib/types";
export default async function DashboardPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  const { data } = user ? await supabase.from("links").select("id,user_id,slug,target_url,created_at,expires_at").order("created_at", { ascending: false }) : { data: [] };
  const links = (data ?? []) as Link[];
  const entries = await Promise.all(links.map(async (link) => { const { count } = await supabase.from("clicks").select("id", { count: "exact", head: true }).eq("link_id", link.id).eq("is_bot", false); return [link.id, count ?? 0] as const; }));
  const h = await headers(); const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"; const protocol = h.get("x-forwarded-proto") ?? "http";
  return <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14"><div className="reveal flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Your workspace</p><h1 className="mt-2 text-5xl">Link desk</h1><p className="mt-3 text-stone-600">Shape a cleaner path to every destination.</p></div><div className="paper-card flex items-center gap-3 px-4 py-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-lime-200 text-lg">⌁</span><p className="text-sm"><strong>{links.length}</strong> active {links.length === 1 ? "link" : "links"}</p></div></div><section className="reveal reveal-2 mt-9"><div className="mb-3 flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#ef744c] text-xs font-bold text-white">1</span><h2 className="text-xl font-bold">Make a short link</h2></div><CreateLinkForm /></section><section className="reveal reveal-3 mt-10"><div className="mb-4 flex items-center justify-between"><div><p className="eyebrow">Library</p><h2 className="mt-1 text-2xl font-bold">Recent links</h2></div><span className="text-sm text-stone-500">{links.length} total</span></div><DashboardLinkTable links={links} counts={Object.fromEntries(entries)} origin={`${protocol}://${host}`} /></section></main>;
}
