# Shortly

A Next.js link shortener with Supabase authentication, private dashboards, QR codes, and click analytics.

## Setup

1. Create a Supabase project. In its SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql).
2. For local development, open **Authentication → Providers → Email** in Supabase and disable **Confirm email**.
3. Copy `.env.example` to `.env.local`, then add the project URL, anon key, and service-role key. The service-role key is used only in server code to resolve redirects and record clicks.
4. Install dependencies and run the app:

```bash
npm install
npm run dev
```

Open http://localhost:3000. Sign up, create a link, and open the generated short URL to record a click. IP addresses are never stored.

## Deploy on Vercel

1. Push this project to GitHub and import it at [Vercel](https://vercel.com/new).
2. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in Vercel Project Settings → Environment Variables.
3. You can alternatively choose the Supabase integration during import; connect the same project and confirm the variables it supplies. Add `SUPABASE_SERVICE_ROLE_KEY` manually if the integration does not add it.
4. Deploy. Vercel automatically sets the `x-vercel-ip-country` header used for country analytics. Configure your Supabase Auth site URL and redirect URLs to include the deployed Vercel URL.

Run `npm run build` and `npm run lint` before deploying.
