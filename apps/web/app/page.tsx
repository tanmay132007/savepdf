import { FileText, UploadCloud } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-600 text-white">
            <FileText aria-hidden="true" size={24} />
          </div>
          <span className="text-lg font-semibold">FreePDF Editor</span>
        </div>
        <h1 className="max-w-3xl text-5xl font-bold tracking-normal sm:text-6xl">
          PDF tools that are fast, private, and simple to use.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
          Upload, edit, convert, compress, and organize PDFs from one clean
          workspace.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#upload"
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            <UploadCloud aria-hidden="true" size={18} />
            Start editing
          </a>
        </div>
      </section>
    </main>
  );
}
