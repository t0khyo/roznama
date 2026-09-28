import "temporal-polyfill/full/global";
import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

/**
 * Note: When running on Cloudflare Workers (such as OpenNext), do NOT use this
 * module-level singleton client across requests because socket connections freeze.
 * Instead, use `withDb` or `createRequestDb` from `@/lib/db`.
 */
export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
});

