"use client";

import { useEffect, useMemo, useState } from "react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import {
  needsGemini,
  processClientPdfTool,
  type ToolOptions
} from "@/lib/clientPdfTools";
import type { Tool } from "@/lib/tools";

type ToolUploadProps = {
  tool: Tool;
};

export function ToolUpload({ tool }: ToolUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("English");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const usesGemini = needsGemini(tool.slug);
  const requiresUpload = tool.acceptedFiles.length > 0;

  useEffect(() => {
    setGeminiApiKey(window.localStorage.getItem("freepdf_gemini_api_key") ?? "");
  }, []);

  const helperText = useMemo(() => {
    if (tool.slug === "organize-pdf") {
      return "Current browser action: reverse page order.";
    }

    if (tool.slug === "crop-pdf") {
      return "Current browser action: trim a small border from every page.";
    }

    if (tool.slug === "redact-pdf") {
      return "Current browser action: apply a black redaction bar on the first page.";
    }

    if (usesGemini) {
      return "This sends the selected file to Google Gemini using your API key from this browser.";
    }

    return "";
  }, [tool.slug, usesGemini]);

  async function handleProcess() {
    if (requiresUpload && selectedFiles.length === 0) {
      setError("Choose a file first.");
      return;
    }

    setError("");
    setDownloadUrl("");
    setDownloadName("");
    setIsProcessing(true);

    try {
      const options: ToolOptions = {
        geminiApiKey,
        prompt,
        language,
        text,
        url
      };
      if (geminiApiKey) {
        window.localStorage.setItem("freepdf_gemini_api_key", geminiApiKey);
      }
      setStatus(`Processing ${tool.name.toLowerCase()}...`);
      const result = await processClientPdfTool(tool.slug, selectedFiles, options);
      const objectUrl = URL.createObjectURL(result.blob);

      setDownloadUrl(objectUrl);
      setDownloadName(result.filename);
      setStatus("Your file is ready.");
    } catch (processError) {
      setError(
        processError instanceof Error
          ? processError.message
          : "Could not process this file."
      );
      setStatus("");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div>
      {requiresUpload ? (
        <FileDropzone
          accept={tool.acceptedFiles}
          maxSizeMB={25}
          multiple={tool.multiple}
          onFilesSelected={(files) => {
            if (downloadUrl) {
              URL.revokeObjectURL(downloadUrl);
            }
            setSelectedFiles(files);
            setError("");
            setDownloadUrl("");
            setDownloadName("");
            setStatus("");
          }}
          disabled={isProcessing}
        />
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <label className="text-sm font-bold text-navy" htmlFor="tool-url">
            Webpage URL
          </label>
          <input
            id="tool-url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
            className="mt-3 w-full rounded-md border border-zinc-200 px-4 py-3 outline-none transition focus:border-red-500"
          />
        </div>
      )}

      {usesGemini ? (
        <div className="mt-5 rounded-lg border border-zinc-200 bg-white p-5 text-left shadow-sm">
          <label className="text-sm font-bold text-navy" htmlFor="gemini-key">
            Gemini API key
          </label>
          <input
            id="gemini-key"
            type="password"
            value={geminiApiKey}
            onChange={(event) => setGeminiApiKey(event.target.value)}
            placeholder="AIza..."
            className="mt-3 w-full rounded-md border border-zinc-200 px-4 py-3 outline-none transition focus:border-red-500"
          />
          {tool.slug === "translate-pdf" ? (
            <>
              <label
                className="mt-4 block text-sm font-bold text-navy"
                htmlFor="target-language"
              >
                Target language
              </label>
              <input
                id="target-language"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="mt-3 w-full rounded-md border border-zinc-200 px-4 py-3 outline-none transition focus:border-red-500"
              />
            </>
          ) : null}
          <label className="mt-4 block text-sm font-bold text-navy" htmlFor="ai-prompt">
            Prompt
          </label>
          <textarea
            id="ai-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Optional custom instruction"
            rows={3}
            className="mt-3 w-full rounded-md border border-zinc-200 px-4 py-3 outline-none transition focus:border-red-500"
          />
        </div>
      ) : null}

      {["watermark-pdf", "sign-pdf", "edit-pdf"].includes(tool.slug) ? (
        <div className="mt-5 rounded-lg border border-zinc-200 bg-white p-5 text-left shadow-sm">
          <label className="text-sm font-bold text-navy" htmlFor="tool-text">
            Text
          </label>
          <input
            id="tool-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={
              tool.slug === "watermark-pdf"
                ? "Watermark text"
                : tool.slug === "sign-pdf"
                  ? "Signature name"
                  : "Text to add"
            }
            className="mt-3 w-full rounded-md border border-zinc-200 px-4 py-3 outline-none transition focus:border-red-500"
          />
        </div>
      ) : null}

      {helperText ? (
        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          {helperText}
        </p>
      ) : null}

      {selectedFiles.length > 0 ? (
        <div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-4 text-left">
          <p className="font-semibold text-red-700">
            {selectedFiles.length} file{selectedFiles.length === 1 ? "" : "s"} ready
            for {tool.name}
          </p>
        </div>
      ) : null}
      {selectedFiles.length > 0 || !requiresUpload ? (
        <button
          type="button"
          onClick={handleProcess}
          disabled={isProcessing}
          className="mt-5 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
        >
          {isProcessing ? "Processing..." : `Run ${tool.name}`}
        </button>
      ) : null}
      {status ? (
        <p className="mt-4 rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-navy/70">
          {status}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}
      {downloadUrl ? (
        <a
          href={downloadUrl}
          download={downloadName}
          className="mt-4 inline-flex rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy/90"
        >
          Download result
        </a>
      ) : null}
    </div>
  );
}
