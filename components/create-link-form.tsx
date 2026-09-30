"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createLink, type LinkState } from "@/app/dashboard/actions";

function Submit() { const { pending } = useFormStatus(); return <button className="action-button whitespace-nowrap" disabled={pending}>{pending ? "Creating…" : "Shorten it"}<span className="ml-2">→</span></button>; }

export function CreateLinkForm() {
  const [state, action] = useActionState<LinkState, FormData>(createLink, {});
  return <form action={action} className="paper-card grid gap-3 p-4 md:grid-cols-[1fr_170px_170px_auto]"><input name="targetUrl" type="url" placeholder="Paste a long URL here…" required aria-label="Target URL" /><input name="slug" placeholder="Custom alias" aria-label="Custom slug" /><input name="expiresAt" type="datetime-local" aria-label="Expiry date" /><Submit />{state.error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 md:col-span-4" role="alert">{state.error}</p>}{state.success && <p className="rounded-xl bg-lime-100 px-3 py-2 text-sm font-medium text-emerald-900 md:col-span-4">✓ {state.success}</p>}</form>;
}
