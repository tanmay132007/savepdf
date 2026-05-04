"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { API_BASE_URL, getAccessToken, parseApiResponse } from "@/lib/api";
import type { Tool } from "@/lib/tools";

type ToolUploadProps = {
  tool: Tool;
};

type UploadResponse = {
  operation_id: string;
};

type ProcessResponse = {
  job_id: string;
};

type JobResponse = {
  status: string;
  progress?: number | object;
  downloadUrl: string | null;
};

const toolApiNames: Record<string, string> = {
  "merge-pdf": "merge",
  "split-pdf": "split",
  "compress-pdf": "compress",
  "pdf-to-word": "pdf-to-word",
  "pdf-to-excel": "pdf-to-excel",
  "pdf-to-jpg": "pdf-to-jpg",
  "jpg-to-pdf": "jpg-to-pdf",
  "word-to-pdf": "word-to-pdf",
  "protect-pdf": "protect",
  "unlock-pdf": "unlock",
  "watermark-pdf": "watermark",
  "rotate-pdf": "rotate",
  "ocr-pdf": "ocr",
  "compare-pdf": "compare",
  "edit-pdf": "edit",
  "repair-pdf": "repair",
  "organize-pdf": "organize",
  "crop-pdf": "crop",
  "page-numbers": "page-numbers",
  "excel-to-pdf": "excel-to-pdf",
  "ppt-to-pdf": "powerpoint-to-pdf",
  "pdf-to-ppt": "pdf-to-powerpoint"
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function ToolUpload({ tool }: ToolUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const apiTool = toolApiNames[tool.slug];

  async function uploadFile(file: File, token: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/pdf/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    return parseApiResponse<UploadResponse>(response);
  }

  async function startProcessing(
    operationId: string,
    token: string
  ): Promise<ProcessResponse> {
    const response = await fetch(`${API_BASE_URL}/api/pdf/${apiTool}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        operation_id: operationId,
        options: {}
      })
    });

    return parseApiResponse<ProcessResponse>(response);
  }

  async function waitForJob(jobId: string, token: string): Promise<JobResponse> {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const response = await fetch(`${API_BASE_URL}/api/pdf/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const job = await parseApiResponse<JobResponse>(response);

      if (job.status === "completed") {
        return job;
      }

      if (job.status === "failed") {
        throw new Error("PDF processing failed.");
      }

      setStatus(`Processing ${tool.name.toLowerCase()}...`);
      await delay(2000);
    }

    throw new Error("Processing is taking longer than expected.");
  }

  async function handleProcess() {
    const token = getAccessToken();

    if (!apiTool) {
      setError("This tool is not connected to the PDF server yet.");
      return;
    }

    if (!token) {
      setError("Please sign in before processing files.");
      return;
    }

    if (selectedFiles.length === 0) {
      setError("Choose a file first.");
      return;
    }

    if (selectedFiles.length > 1) {
      setError("Multi-file processing is not connected to the API yet.");
      return;
    }

    setError("");
    setDownloadUrl("");
    setIsProcessing(true);

    try {
      setStatus("Uploading file...");
      const upload = await uploadFile(selectedFiles[0], token);

      setStatus("Starting PDF job...");
      const process = await startProcessing(upload.operation_id, token);

      const job = await waitForJob(process.job_id, token);
      if (!job.downloadUrl) {
        throw new Error("The server finished without a download URL.");
      }

      setDownloadUrl(job.downloadUrl);
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
      <FileDropzone
        accept={tool.acceptedFiles}
        maxSizeMB={25}
        multiple={tool.multiple}
        onFilesSelected={(files) => {
          setSelectedFiles(files);
          setError("");
          setDownloadUrl("");
          setStatus("");
        }}
        disabled={isProcessing}
      />
      {selectedFiles.length > 0 ? (
        <div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-4 text-left">
          <p className="font-semibold text-red-700">
            {selectedFiles.length} file{selectedFiles.length === 1 ? "" : "s"} ready
            for {tool.name}
          </p>
          <button
            type="button"
            onClick={handleProcess}
            disabled={isProcessing}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {isProcessing ? "Processing..." : `Run ${tool.name}`}
          </button>
        </div>
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
          className="mt-4 inline-flex rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy/90"
        >
          Download result
        </a>
      ) : null}
    </div>
  );
}
