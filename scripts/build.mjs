// scripts/build.mjs
// Assembles the deployable site into dist/.
// This file is the single source of truth for what goes public.

import { rm, mkdir, cp, access, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = "dist";

// The allowlist. If it is not in this array, it does not reach the internet.
// Note the absence of `css` — the stylesheet is compiled directly into
// dist/css by the sass step, not copied from the working directory.
const DEPLOY = [
	"index.html",
	"info.html",
	"404.html",
	"js",
	"data",
	"favicon",
];

const branch = process.env.WORKERS_CI_BRANCH ?? "local";
const isProduction = branch === "main";

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

for (const entry of DEPLOY) {
	try {
		await access(entry);
	} catch {
	throw new Error(
		`Deploy manifest lists "${entry}", but it does not exist in the repo.`
	);
	}
	await cp(entry, join(OUT_DIR, entry), { recursive: true });
	console.log(`  + ${entry}`);
}

const headerRules = `/*
	X-Content-Type-Options: nosniff
	Referrer-Policy: strict-origin-when-cross-origin
	X-Frame-Options: SAMEORIGIN${isProduction ? "" : "\n  X-Robots-Tag: noindex"}

	/data/*
	Cache-Control: public, max-age=3600

	/js/*
	Cache-Control: public, max-age=3600

	/css/*
	Cache-Control: public, max-age=3600
`;

await writeFile(join(OUT_DIR, "_headers"), headerRules);

await writeFile(
  join(OUT_DIR, "robots.txt"),
  isProduction ? "User-agent: *\nAllow: /\n" : "User-agent: *\nDisallow: /\n"
);

await writeFile(join(OUT_DIR, ".assetsignore"), "_headers\n_redirects\n");

console.log(`Built for branch "${branch}" (production: ${isProduction})`);