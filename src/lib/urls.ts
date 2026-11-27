export function getBaseUrl(dbSetting?: string | null): string {
  const candidates = [
    dbSetting,
    typeof window !== "undefined" ? undefined : process.env.NEXT_PUBLIC_APP_URL,
    typeof window !== "undefined" ? window.location.origin : undefined,
  ].filter(Boolean) as string[];

  for (const raw of candidates) {
    const url = raw.trim().replace(/\/+$/, "");
    if (/^https?:\/\//i.test(url)) return url;
  }
  return "";
}

export function buildMenuUrl(opts: { table?: number | null; baseUrl?: string | null } = {}): string {
  const base = getBaseUrl(opts.baseUrl) || (typeof window !== "undefined" ? window.location.origin : "");
  const clean = base.replace(/\/+$/, "");
  if (opts.table && opts.table >= 1 && opts.table <= 999) {
    return `${clean}/?table=${opts.table}`;
  }
  return clean + "/";
}

export function isLocalhostUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1" || u.hostname === "0.0.0.0";
  } catch {
    return false;
  }
}
