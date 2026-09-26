My Next.js app is deployed on Cloudflare Pages using the OpenNext adapter 
(@opennextjs/cloudflare), with Prisma connecting to a Neon Postgres database. 
The build and deploy succeed, but the database connection is not working in 
production on Cloudflare — it works fine locally.

Please investigate and fix the following, checking each one and reporting 
what you find:

1. PRISMA CLIENT INITIALIZATION TIMING
   Check my Prisma client setup file (likely lib/db.ts, lib/prisma.ts, or 
   similar). If it creates the PrismaNeon adapter or PrismaClient at module 
   load time (top-level `const adapter = new PrismaNeon({ connectionString: 
   process.env.DATABASE_URL })`), this can run before Cloudflare Workers has 
   attached env vars to the request context. Refactor it to lazily create 
   the client inside a function, only called when a request needs it, while 
   still caching/reusing the instance (don't create a new client per request).

2. PRISMA GENERATOR CONFIG
   Check schema.prisma. Confirm the generator block has:
     previewFeatures = ["driverAdapters"]
   And check whether we're using the wasm engine (engineType = "wasm") or 
   could switch to the newer "client" engine type with queryCompiler preview 
   feature, which avoids wasm-loading issues on Workers. Recommend whichever 
   is more reliable for the Cloudflare Workers runtime and update accordingly.

3. IMPORT PATH CONSISTENCY
   Confirm the PrismaClient import path (e.g. "./generated/prisma/wasm") 
   actually matches the generator's configured output path. Fix any mismatch.

4. PACKAGES
   Confirm @prisma/adapter-neon and @neondatabase/serverless are installed 
   and are recent versions compatible with the installed Prisma version. 
   Check for version mismatches.

5. ENV VARS AND CONFIG
   Confirm wrangler.jsonc has:
     "compatibility_flags": ["nodejs_compat"]
   Confirm DATABASE_URL is expected to be the POOLED Neon connection string 
   (hostname contains "-pooler"). Flag if code or docs reference the 
   non-pooled string anywhere.

6. BUILD/DEPLOY COMMANDS
   Confirm package.json / Cloudflare Pages build settings use:
     Build command: npx prisma generate && npx opennextjs-cloudflare build
     Deploy command: npx wrangler deploy
   (not plain `next build`, which skips the OpenNext transform).

7. VERIFY
   After making fixes, run a local preview using the Cloudflare runtime 
   simulation (npm run preview via opennextjs-cloudflare, or equivalent) 
   and confirm a real database query succeeds before I redeploy.

Go through each item, tell me what was wrong, what you changed, and confirm 
the local Workers-runtime preview successfully queries the database.