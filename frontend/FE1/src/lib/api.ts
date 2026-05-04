import { supabase } from './supabase';

const BASE_URL = import.meta.env.VITE_API_URL;

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}

export async function uploadFile(file: File, tool: string, options: object) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('tool', tool);
  formData.append('options', JSON.stringify(options));
  
  const headers = await getAuthHeader();
  const res = await fetch(`${BASE_URL}/api/pdf/upload`, {
    method: 'POST',
    headers: headers as Record<string, string>,
    body: formData
  });
  return res.json();
}

export async function pollJobStatus(jobId: string) {
  const headers = await getAuthHeader();
  const res = await fetch(`${BASE_URL}/api/pdf/jobs/${jobId}`, {
    headers: headers as Record<string, string>
  });
  return res.json();
}
