import { apiFetch } from "@/lib/api";

const TOKEN_KEY = "auth_token";
const EMAIL_KEY = "auth_email";
const GUEST_TOKEN_KEY = "guest_token";

// Fired on the window whenever the session changes, so components mounted in the
// layout (e.g. the header) can react without remounting.
export const SESSION_EVENT = "session-change";

function checkWindow() {
  if (typeof window === "undefined") return;
}

function notifySessionChange() {
  checkWindow();
  window.dispatchEvent(new Event(SESSION_EVENT));
}

function post(url, { email, password }) {
  apiFetch(url, { method: "POST", body: { email, password } });
}

function localStorageGetter(key) {
  checkWindow();
  return localStorage.getItem(key);
}

function localStorageSetter(key, value) {
  checkWindow();
  localStorage.setItem(key, value);
}

function localStorageRemover(key) {
  checkWindow();
  localStorage.removeItem(key);
}

// API session
// { token, email }
export function signup({ email, password }) {
  return post("/api/auth/signup", { email, password });
}
// { token, email }
export function login({ email, password }) {
  return post("/api/auth/login", { email, password });
}

// Client-side session
export function saveSession({ token, email }) {
  localStorageSetter(TOKEN_KEY, token);
  if (email) localStorageSetter(EMAIL_KEY, email);
  notifySessionChange();
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorageGetter(TOKEN_KEY);
}

export function getEmail() {
  if (typeof window === "undefined") return null;
  return localStorageGetter(EMAIL_KEY);
}

export function clearSession() {
  localStorageRemover(TOKEN_KEY);
  localStorageRemover(EMAIL_KEY);
  notifySessionChange();
}

// Guest session
// A guest token lets a non-signed-in visitor own the links they create. It is kept
// separate from the user token so the app still treats guests as "not logged in".
function getGuestToken() {
  if (typeof window === "undefined") return null;
  return localStorageGetter(GUEST_TOKEN_KEY);
}

// { token, guest: true }.
function requestGuestToken() {
  return apiFetch("/api/auth/guest", { method: "POST" });
}

function saveGuestToken(token) {
  localStorageSetter(GUEST_TOKEN_KEY, token);
}

export function clearGuestToken() {
  localStorageRemover(GUEST_TOKEN_KEY);
}

let guestBootstrap = null;

// Guarantees a usable token.
// Concurrent callers share one in-flight request so we never mint two guest tokens.
export async function ensureSessionToken() {
  const userToken = getToken();
  if (userToken) return userToken;

  const existingGuest = getGuestToken();
  if (existingGuest) return existingGuest;

  if (!guestBootstrap) {
    guestBootstrap = requestGuestToken()
      .then(({ token }) => {
        saveGuestToken(token);
        return token;
      })
      .finally(() => {
        guestBootstrap = null;
      });
  }
  return guestBootstrap;
}
