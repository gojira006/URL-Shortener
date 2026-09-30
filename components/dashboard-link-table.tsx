"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteLink } from "@/app/dashboard/actions";
import type { Link as ShortLink } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function DashboardLinkTable({ links, origin, counts }: { links: ShortLink[]; origin: string; counts: Record<string, number> }) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  async function copy(slug: string) { await navigator.clipboard.writeText(`${origin}/${slug}`); setCopied(slug); window.setTimeout(() => setCopied(null), 1600); }
  async function remove(id: string) { if (!window.confirm("Delete this link and all its click data?")) return; setDeleting(id); await deleteLink(id); setDeleting(null); }
  if (!links.length) return <div className="paper-card border-dashed p-12 text-center"><p className="text-3xl">↗</p><h3 className="mt-4 text-xl font-bold">Your desk is clear.</h3><p className="mt-2 text-sm text-stone-500">Make your first short link above and it will appear here.</p></div>;
  return <div className="paper-card overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b bg-stone-100/70 text-xs font-bold uppercase tracking-[.14em] text-stone-500"><tr><th className="p-4">Short link</th><th className="p-4">Destination</th><th className="p-4">Clicks</th><th className="p-4">Created</th><th className="p-4">Actions</th></tr></thead><tbody>{links.map((link, index) => <tr className="table-row border-b border-stone-200 last:border-0 hover:bg-lime-50/40" style={{ animationDelay: `${index * 45}ms` }} key={link.id}><td className="p-4"><span className="font-bold text-emerald-800">/{link.slug}</span><p className="mt-1 text-xs text-stone-400">{origin.replace(/^https?:\/\//, "")}</p></td><td className="max-w-[250px] truncate p-4 text-stone-600" title={link.target_url}>{link.target_url}</td><td className="p-4"><span className="rounded-full bg-lime-200 px-2.5 py-1 font-bold text-emerald-950">{counts[link.id] ?? 0}</span></td><td className="p-4 text-stone-500">{formatDate(link.created_at)}</td><td className="p-4"><div className="flex gap-2"><button className="rounded-lg px-2 py-1 text-emerald-800 hover:bg-lime-200" onClick={() => copy(link.slug)}>{copied === link.slug ? "Copied!" : "Copy"}</button><Link className="rounded-lg px-2 py-1 font-semibold text-emerald-800 hover:bg-lime-200" href={`/dashboard/links/${link.id}`}>Insights</Link><button className="rounded-lg px-2 py-1 text-[#c45131] hover:bg-red-50" disabled={deleting === link.id} onClick={() => remove(link.id)}>{deleting === link.id ? "Deleting…" : "Delete"}</button></div></td></tr>)}</tbody></table></div>;
}
