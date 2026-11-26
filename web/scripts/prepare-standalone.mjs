// Copies the assets the standalone server needs next to it, so `npm start`
// (node .next/standalone/server.js) serves the same site as the Docker image.
import { cpSync, existsSync } from "node:fs";

const out = ".next/standalone";
if (!existsSync(out)) {
  console.error(`[prepare-standalone] ${out} not found. Run "next build" first.`);
  process.exit(1);
}
cpSync(".next/static", `${out}/.next/static`, { recursive: true });
cpSync("public", `${out}/public`, { recursive: true });
cpSync("content", `${out}/content`, { recursive: true });
console.log("[prepare-standalone] copied .next/static, public and content");
