const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const serverBase = apiBase.replace(/\/api\/?$/, "");

/**
 * Turn a stored path (e.g. /uploads/...) into a full URL for <img src>.
 */
export function toPublicUrl(p) {
  if (!p) return "";
  const s = String(p).trim();
  if (/^https?:\/\//i.test(s)) return s;
  return `${serverBase}/${s.replace(/^\/+/, "")}`;
}
