import {
  cpSync,
  existsSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const source = "apps/web/.next";
const target = ".next";

if (!existsSync(source)) {
  throw new Error(`Expected Next.js build output at ${source}`);
}

rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });

const traceFiles = [
  "next-minimal-server.js.nft.json",
  "next-server.js.nft.json",
  "server/pages/_app.js.nft.json",
  "server/pages/_document.js.nft.json",
  "server/pages/_error.js.nft.json",
  "server/app/page.js.nft.json",
  "server/app/_not-found/page.js.nft.json"
];

for (const traceFile of traceFiles) {
  const path = join(target, traceFile);

  if (!existsSync(path)) {
    continue;
  }

  const trace = JSON.parse(readFileSync(path, "utf8"));

  if (Array.isArray(trace.files)) {
    trace.files = trace.files.map((file) =>
      file.replace(/^((?:\.\.\/)+)node_modules\//, (match, parents) => {
        const segments = parents.match(/\.\.\//g) ?? [];
        const shortened = segments.slice(1).join("");
        return `${shortened}node_modules/`;
      })
    );
  }

  writeFileSync(path, `${JSON.stringify(trace)}\n`);
}
