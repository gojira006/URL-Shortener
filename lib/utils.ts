export const reservedSlugs = new Set(["dashboard", "login", "signup", "api", "auth", "_next", "favicon.ico"]);
export function formatDate(value: string) { return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value)); }
