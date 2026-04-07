import { createRequire } from "module";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Manually load .env to stderr to avoid polluting stdout (used by Observable loaders)
const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const envPath = join(__dirname, "../../.env");
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = val;
  }
} catch (_) {
  // .env not present — rely on shell environment
}

const require = createRequire(import.meta.url);
const pg = require("pg");
const { Client } = pg;

export async function query(sql, params = []) {
  const client = new Client({
    host: process.env.PGHOST || "kerboul.me",
    port: parseInt(process.env.PGPORT || "15433"),
    user: process.env.PGUSER || "spotify",
    password: process.env.PGPASSWORD || "Sp0tify-DB-2026!Kerboul",
    database: process.env.PGDATABASE || "spotify",
    statement_timeout: 120000,
  });
  await client.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    await client.end();
  }
}
