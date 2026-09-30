"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
export function LogoutButton() { const router = useRouter(); async function logout() { await createClient().auth.signOut(); router.replace("/"); router.refresh(); } return <button className="rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-white hover:text-emerald-900" onClick={logout}>Log out</button>; }
