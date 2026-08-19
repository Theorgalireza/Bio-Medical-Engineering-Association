import type {
  ApiUser,
  CurrentUser,
  Profile,
  Role,
  UpdateProfilePayload,
} from "@/types";
import { apiFetch, getApiUrl } from "./client";
import { normalizeRole, toProfile, toUser } from "./mappers";

export type { Profile } from "@/types";

type AuthResponse = {
  user: { id: string; email: string; role: string };
};

export type OAuthProvider = "google" | "github" | "linkedin";

export async function loginWithPassword(payload: {
  email?: string;
  phone?: string;
  password: string;
}) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(payload: {
  email?: string;
  phone?: string;
  password?: string;
}) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  return apiFetch("/auth/logout", { method: "POST" });
}

export async function sendOtp(payload: { phone: string }) {
  return apiFetch("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function forgotPassword(identifier: string) {
  return apiFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ identifier }),
  });
}

export async function resetPassword(payload: {
  token: string;
  newPassword: string;
}) {
  return apiFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getOAuthLoginUrl(provider: OAuthProvider) {
  return getApiUrl(`/auth/${provider}`);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const response = await apiFetch<{ data?: ApiUser }>("/users/me", {
      auth: true,
    });
    return toUser(response?.data ?? response);
  } catch {
    return null;
  }
}

export async function getProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  return user?.profile ?? null;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<Profile> {
  const response = await apiFetch<any>("/users/me/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
    auth: true,
  });
  const user = response?.profile ? response : response?.data ?? response;
  return toProfile(user?.profile ?? user, user?.id);
}

export const updateMyProfile = updateProfile;

export async function getAuthStatus(): Promise<{
  authenticated: boolean;
  role: string | null;
}> {
  const user = await getCurrentUser();
  return { authenticated: Boolean(user), role: user?.role ?? null };
}

export async function updateUserRole(userId: string, role: Role) {
  return apiFetch(`/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role: normalizeRole(role) }),
    auth: true,
  });
}
