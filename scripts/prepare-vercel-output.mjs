import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

const source = "apps/web/.next";
const target = ".next";
const publicSource = "apps/web/public";
const publicTarget = "public";

if (!existsSync(source)) {
  throw new Error(`Expected Next.js build output at ${source}`);
}

rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });

if (existsSync(publicSource)) {
  rmSync(publicTarget, { recursive: true, force: true });
  cpSync(publicSource, publicTarget, { recursive: true });
}

const sourceRoot = resolve(source);
const targetRoot = resolve(target);
const requiredServerFilesPath = join(target, "required-server-files.json");
const requiredServerFiles = existsSync(requiredServerFilesPath)
  ? JSON.parse(readFileSync(requiredServerFilesPath, "utf8")).files ?? []
  : [];

const toPosixPath = (path) => path.split(sep).join("/");

const isInside = (parent, child) => {
  const path = relative(parent, child);
  return path === "" || (!path.startsWith("..") && !isAbsolute(path));
};

const listTraceFiles = (directory, prefix = "") =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    const relativePath = join(prefix, entry.name);

    if (entry.isDirectory()) {
      return listTraceFiles(path, relativePath);
    }

    return entry.isFile() && entry.name.endsWith(".nft.json")
      ? [relativePath]
      : [];
  });

for (const traceFile of listTraceFiles(target)) {
  const sourcePath = join(source, traceFile);
  const targetPath = join(target, traceFile);

  if (!existsSync(sourcePath) || !existsSync(targetPath)) {
    continue;
  }

  const sourceDirectory = dirname(sourcePath);
  const targetDirectory = dirname(targetPath);
  const trace = JSON.parse(readFileSync(targetPath, "utf8"));

  if (Array.isArray(trace.files)) {
    const tracedFiles = trace.files.map((file) => {
      const sourceFilePath = resolve(sourceDirectory, file);
      const absolutePath = isInside(sourceRoot, sourceFilePath)
        ? resolve(targetRoot, relative(sourceRoot, sourceFilePath))
        : sourceFilePath;

      return toPosixPath(relative(targetDirectory, absolutePath));
    });

    const serverFiles = requiredServerFiles.map((file) =>
      toPosixPath(relative(targetDirectory, resolve(file)))
    );

    trace.files = Array.from(new Set([...tracedFiles, ...serverFiles]));
  }

  writeFileSync(targetPath, `${JSON.stringify(trace)}\n`);
}
