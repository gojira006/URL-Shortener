import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Shortly", description: "Short links with useful analytics" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
