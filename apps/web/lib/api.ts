export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
).replace(/\/$/, "");

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("freepdf_access_token");
}

export function setAccessToken(token: string): void {
  window.localStorage.setItem("freepdf_access_token", token);
}

export function clearAccessToken(): void {
  window.localStorage.removeItem("freepdf_access_token");
}

export async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const apiError =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : null;
    const message = apiError ?? `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}
