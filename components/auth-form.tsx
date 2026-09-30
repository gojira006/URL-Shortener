"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { AuthState } from "@/app/auth/actions";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button className="action-button w-full" disabled={pending}>{pending ? "Please wait…" : label}<span className="ml-2">→</span></button>;
}

type AuthFormProps = {
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  title: string;
  alternate: { text: string; href: string; label: string };
  isSignup?: boolean;
};

export function AuthForm({ action, title, alternate, isSignup = false }: AuthFormProps) {
  const [state, formAction] = useActionState(action, {});

  return <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12"><section className="paper-card reveal w-full p-7 sm:p-9"><Link href="/" className="eyebrow hover:text-[#ef744c]">← Back to Shortly</Link><p className="mt-10 text-4xl">◌</p><h1 className="mt-3 text-4xl font-bold">{title}</h1><p className="mt-2 text-sm text-stone-500">Your links, one calm place.</p><form action={formAction} className="mt-8 space-y-5" noValidate><label className="block text-sm font-bold">Email<input className="mt-2" type="email" name="email" autoComplete="email" aria-invalid={Boolean(state.fieldErrors?.email)} aria-describedby={state.fieldErrors?.email ? "email-error" : undefined} required /></label>{state.fieldErrors?.email && <p id="email-error" role="alert" className="-mt-3 text-sm text-red-700">{state.fieldErrors.email}{isSignup && state.duplicateEmail && <> <Link className="font-bold underline" href="/login">Log in</Link>.</>}</p>}<label className="block text-sm font-bold">Password<input className="mt-2" type="password" name="password" autoComplete={isSignup ? "new-password" : "current-password"} minLength={8} aria-invalid={Boolean(state.fieldErrors?.password)} aria-describedby={state.fieldErrors?.password ? "password-error" : undefined} required /></label>{state.fieldErrors?.password && <p id="password-error" role="alert" className="-mt-3 text-sm text-red-700">{state.fieldErrors.password}</p>}{state.fieldErrors?.form && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.fieldErrors.form}</p>}{state.message && <p className="rounded-xl bg-lime-100 px-4 py-3 text-sm text-emerald-900">{state.message}</p>}<Submit label={title} /></form><p className="mt-7 text-sm text-stone-600">{alternate.text} <Link className="font-bold text-emerald-800 hover:text-[#ef744c]" href={alternate.href}>{alternate.label}</Link></p></section></main>;
}
