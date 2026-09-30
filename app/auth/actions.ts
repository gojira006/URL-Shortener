"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const credentials = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type FieldErrors = { email?: string; password?: string; form?: string };
export type AuthState = { fieldErrors?: FieldErrors; message?: string; duplicateEmail?: boolean };

function validationErrors(error: z.ZodError): AuthState {
  const { fieldErrors } = error.flatten();
  return { fieldErrors: { email: fieldErrors.email?.[0], password: fieldErrors.password?.[0] } };
}

function duplicateAccount(): AuthState {
  return { duplicateEmail: true, fieldErrors: { email: "An account with this email already exists." } };
}

function isDuplicateSignupError(error: { code?: string; message: string }): boolean {
  return error.code === "user_already_exists" || /user already registered|already exists/i.test(error.message);
}

function friendlySignupError(error: { code?: string; message: string }): AuthState {
  if (isDuplicateSignupError(error)) return duplicateAccount();
  if (error.code === "weak_password" || /weak password|password.*(?:weak|short)/i.test(error.message)) return { fieldErrors: { password: "Choose a stronger password with at least 8 characters." } };
  if (/rate limit|too many requests|over_email_send_rate_limit/i.test(error.message)) return { fieldErrors: { form: "Too many attempts. Please wait a few minutes and try again." } };
  return { fieldErrors: { form: "We couldn’t create your account. Check your connection and try again." } };
}

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = credentials.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationErrors(parsed.error);

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) return { fieldErrors: { form: "We couldn’t sign you in. Check your email and password, then try again." } };
  } catch {
    return { fieldErrors: { form: "We couldn’t sign you in. Check your connection and try again." } };
  }

  redirect("/dashboard");
}

export async function signup(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = credentials.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationErrors(parsed.error);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp(parsed.data);
    if (error) return friendlySignupError(error);
    if (data.user?.identities?.length === 0) return duplicateAccount();
    if (!data.user || !data.user.identities || data.user.identities.length === 0) return { fieldErrors: { form: "We couldn’t confirm account creation. Please try again." } };
    return { message: "Account created. Check your inbox if email confirmation is enabled." };
  } catch {
    return { fieldErrors: { form: "We couldn’t create your account. Check your connection and try again." } };
  }
}
