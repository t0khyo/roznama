import "temporal-polyfill/full/global";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "@/prisma/contract.d";
import contractJson from "@/prisma/contract.json" with { type: "json" };

export type DbClient = ReturnType<typeof postgres<Contract>>;

/**
 * Execute a callback with a per-request database client.
 * The client is created per-request and closed with ctx.waitUntil(db.close()) after queries complete.
 */
export async function withDb<T>(fn: (db: DbClient) => Promise<T>): Promise<T> {
  let env: any;
  let ctx: any;
  try {
    const cfContext = getCloudflareContext();
    env = cfContext.env;
    ctx = cfContext.ctx;
  } catch {
    // In environments where getCloudflareContext is unavailable
  }

  const url = (env?.DATABASE_URL as string | undefined) || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  const db = postgres<Contract>({ contractJson, url });
  try {
    return await fn(db);
  } finally {
    if (ctx && typeof ctx.waitUntil === "function") {
      ctx.waitUntil(db.close());
    } else {
      await db.close();
    }
  }
}

/**
 * Creates a per-request database client and a close function bound to ctx.waitUntil.
 */
export function createRequestDb(): { db: DbClient; close: () => void } {
  let env: any;
  let ctx: any;
  try {
    const cfContext = getCloudflareContext();
    env = cfContext.env;
    ctx = cfContext.ctx;
  } catch {
    // In environments where getCloudflareContext is unavailable
  }

  const url = (env?.DATABASE_URL as string | undefined) || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  const db = postgres<Contract>({ contractJson, url });
  const close = () => {
    if (ctx && typeof ctx.waitUntil === "function") {
      ctx.waitUntil(db.close());
    } else {
      void db.close();
    }
  };

  return { db, close };
}
