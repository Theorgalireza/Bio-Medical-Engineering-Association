import type {
  ActivityLog,
  ActivityLogsResponse,
  ApiUser,
  CreateUserPayload,
  Role,
  RoleStat,
  UpdateProfilePayload,
} from "@/types";
import { apiFetch } from "./client";
import { normalizeRole, toUser } from "./mappers";

export async function getActivityLogs(params: {
  page?: number;
  limit?: number;
  action?: string;
  targetType?: string;
} = {}): Promise<ActivityLogsResponse> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
  });
  if (params.action) query.set("action", params.action);
  if (params.targetType) query.set("targetType", params.targetType);

  const response = await apiFetch<ActivityLogsResponse>(
    `/activity-logs?${query}`,
    { auth: true },
  );
  return { ...response, data: response.data as ActivityLog[] };
}

export async function getActivityLogsCount(): Promise<number> {
  const response = await getActivityLogs({ page: 1, limit: 1 });
  return response.meta?.total ?? response.data.length;
}

export async function adminGetRoleStats(): Promise<RoleStat[]> {
  return apiFetch<RoleStat[]>("/users/stats/roles", { auth: true });
}

export async function adminGetUsers(): Promise<ApiUser[]> {
  const users = await apiFetch<any[]>("/users", { auth: true });
  return users.map(toUser);
}

export const getUsers = adminGetUsers;

export async function adminCreateUser(payload: CreateUserPayload) {
  return apiFetch<{ user: ApiUser }>("/users", {
    method: "POST",
    body: JSON.stringify({ ...payload, role: normalizeRole(payload.role) }),
    auth: true,
  });
}

export const createUser = adminCreateUser;

export async function adminDeleteUser(userId: string) {
  return apiFetch<{ undoToken: string; undoExpiresAt: string }>(`/users/${userId}`, {
    method: "DELETE",
    auth: true,
  });
}
export const adminRestoreUser = (token: string) => apiFetch(`/users/restore/${token}`, { method: "POST", auth: true });

export const deleteUser = adminDeleteUser;

export async function updateUserStatus(userId: string, isActive: boolean) {
  return apiFetch(`/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
    auth: true,
  });
}

export async function updateUserProfile(
  userId: string,
  payload: UpdateProfilePayload,
) {
  return apiFetch(`/users/${userId}/profile`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    auth: true,
  });
}

export type { Role };
