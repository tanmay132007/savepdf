
import { 
  Layers, Scissors, Minimize2, FileText, Table, Image, FileImage, 
  FileType, Lock, Unlock, Droplets, RotateCw, ScanText, Sparkles, 
  Languages, GitCompare, PenLine, EyeOff, Crop, LayoutGrid, Hash, 
  Globe, Archive, Wrench, Scan, Sheet, Presentation, Monitor, Edit3
} from 'lucide-react';

export const tools = [
  { slug: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDFs into one file', icon: 'Layers', category: 'Edit', acceptedFiles: ['application/pdf'], multiple: true, backendTool: 'merge' },
  { slug: 'split-pdf', name: 'Split PDF', description: 'Split a PDF into multiple files', icon: 'Scissors', category: 'Edit', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'split' },
  { slug: 'compress-pdf', name: 'Compress PDF', description: 'Reduce PDF file size', icon: 'Minimize2', category: 'Compress', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'compress' },
  { slug: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF to editable Word doc', icon: 'FileText', category: 'Convert', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'to_word' },
  { slug: 'pdf-to-excel', name: 'PDF to Excel', description: 'Extract tables to Excel', icon: 'Table', category: 'Convert', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'to_excel' },
  { slug: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF pages to images', icon: 'Image', category: 'Convert', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'to_jpg' },
  { slug: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert images to PDF', icon: 'FileImage', category: 'Convert', acceptedFiles: ['image/jpeg','image/png','image/webp'], multiple: true, backendTool: 'jpg_to_pdf' },
  { slug: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Word docs to PDF', icon: 'FileType', category: 'Convert', acceptedFiles: ['.docx','.doc'], multiple: false, backendTool: 'word_to_pdf' },
  { slug: 'protect-pdf', name: 'Protect PDF', description: 'Add password to your PDF', icon: 'Lock', category: 'Security', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'protect' },
  { slug: 'unlock-pdf', name: 'Unlock PDF', description: 'Remove PDF password', icon: 'Unlock', category: 'Security', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'unlock' },
  { slug: 'watermark-pdf', name: 'Watermark PDF', description: 'Add watermark to PDF', icon: 'Droplets', category: 'Edit', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'watermark' },
  { slug: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate PDF pages', icon: 'RotateCw', category: 'Edit', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'rotate' },
  { slug: 'ocr-pdf', name: 'OCR PDF', description: 'Make scanned PDFs searchable', icon: 'ScanText', category: 'AI Tools', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'ocr' },
  { slug: 'ai-summarizer', name: 'AI Summarizer', description: 'Summarize PDF with AI', icon: 'Sparkles', category: 'AI Tools', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'ai_summarizer' },
  { slug: 'translate-pdf', name: 'Translate PDF', description: 'Translate PDF to any language', icon: 'Languages', category: 'AI Tools', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'translate' },
  { slug: 'compare-pdf', name: 'Compare PDF', description: 'Compare two PDF documents', icon: 'GitCompare', category: 'AI Tools', acceptedFiles: ['application/pdf'], multiple: true, backendTool: 'compare' },
  { slug: 'sign-pdf', name: 'Sign PDF', description: 'Add signature to PDF', icon: 'PenLine', category: 'Edit', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'sign' },
  { slug: 'redact-pdf', name: 'Redact PDF', description: 'Hide sensitive information', icon: 'EyeOff', category: 'Edit', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'redact' },
  { slug: 'crop-pdf', name: 'Crop PDF', description: 'Crop PDF pages', icon: 'Crop', category: 'Edit', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'crop' },
  { slug: 'organize-pdf', name: 'Organize PDF', description: 'Reorder PDF pages', icon: 'LayoutGrid', category: 'Edit', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'organize' },
  { slug: 'page-numbers', name: 'Page Numbers', description: 'Add page numbers to PDF', icon: 'Hash', category: 'Edit', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'page_numbers' },
  { slug: 'html-to-pdf', name: 'HTML to PDF', description: 'Convert webpage to PDF', icon: 'Globe', category: 'Convert', acceptedFiles: [], multiple: false, backendTool: 'html_to_pdf' },
  { slug: 'pdf-to-pdfa', name: 'PDF to PDF/A', description: 'Convert to archival format', icon: 'Archive', category: 'Security', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'to_pdfa' },
  { slug: 'repair-pdf', name: 'Repair PDF', description: 'Fix corrupted PDF files', icon: 'Wrench', category: 'Security', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'repair' },
  { slug: 'scan-to-pdf', name: 'Scan to PDF', description: 'Convert scans to PDF', icon: 'Scan', category: 'AI Tools', acceptedFiles: ['image/jpeg','image/png'], multiple: true, backendTool: 'scan_to_pdf' },
  { slug: 'excel-to-pdf', name: 'Excel to PDF', description: 'Convert Excel to PDF', icon: 'Sheet', category: 'Convert', acceptedFiles: ['.xlsx','.xls'], multiple: false, backendTool: 'excel_to_pdf' },
  { slug: 'ppt-to-pdf', name: 'PPT to PDF', description: 'Convert PowerPoint to PDF', icon: 'Presentation', category: 'Convert', acceptedFiles: ['.pptx','.ppt'], multiple: false, backendTool: 'ppt_to_pdf' },
  { slug: 'pdf-to-ppt', name: 'PDF to PPT', description: 'Convert PDF to PowerPoint', icon: 'Monitor', category: 'Convert', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'to_ppt' },
  { slug: 'edit-pdf', name: 'Edit PDF', description: 'Edit text and images in PDF', icon: 'Edit3', category: 'Edit', acceptedFiles: ['application/pdf'], multiple: false, backendTool: 'edit' },
];

export const iconMap: Record<string, any> = {
  Layers, Scissors, Minimize2, FileText, Table, Image, FileImage, 
  FileType, Lock, Unlock, Droplets, RotateCw, ScanText, Sparkles, 
  Languages, GitCompare, PenLine, EyeOff, Crop, LayoutGrid, Hash, 
  Globe, Archive, Wrench, Scan, Sheet, Presentation, Monitor, Edit3
};
