import { signup } from "@/app/auth/actions";
import { AuthForm } from "@/components/auth-form";
export default function SignupPage() { return <AuthForm action={signup} title="Create account" alternate={{ text: "Already have an account?", href: "/login", label: "Log in" }} isSignup />; }
