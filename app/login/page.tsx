import { login } from "@/app/auth/actions";
import { AuthForm } from "@/components/auth-form";
export default function LoginPage() { return <AuthForm action={login} title="Log in" alternate={{ text: "New here?", href: "/signup", label: "Create an account" }} />; }
