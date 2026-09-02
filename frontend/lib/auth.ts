"use client";

const TOKEN_KEY = "sfh_admin_token";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

export const authStorage = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY) || getCookie(TOKEN_KEY);
  },
  set: (token: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
    setCookie(TOKEN_KEY, token);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    removeCookie(TOKEN_KEY);
  },
};
