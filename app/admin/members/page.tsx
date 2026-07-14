"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getUsers, createUser, updateUserProfile,
  updateUserRole, updateUserStatus, deleteUser,
} from "@/lib/api";
import type { ApiUser, Role, CreateUserPayload, UpdateProfilePayload } from "@/types";

// ─── helpers ─────────────────────────────────────────────
const fullName = (u: ApiUser) =>
  [u.profile?.firstName, u.profile?.lastName].filter(Boolean).join(" ") || "—";

const ROLES: Role[] = ["MEMBER", "ADMIN", "OWNER"];

// ─── types ───────────────────────────────────────────────
interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentId: string;
  major: string;
  entryYear: string;
  role: Role;
  password: string;
}

const EMPTY_FORM: FormState = {
  firstName: "", lastName: "", email: "", phone: "",
  studentId: "", major: "", entryYear: "", role: "MEMBER", password: "",
};

// ─── component ───────────────────────────────────────────
export default function MembersPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ open: boolean; editing: ApiUser | null }>({
    open: false, editing: null,
  });
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setUsers(await getUsers());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal({ open: true, editing: null });
  };

  const openEdit = (u: ApiUser) => {
    setForm({
      firstName: u.profile?.firstName ?? "",
      lastName: u.profile?.lastName ?? "",
      email: u.email ?? "",
      phone: u.phone ?? "",
      studentId: u.profile?.studentId ?? "",
      major: u.profile?.major ?? "",
      entryYear: u.profile?.entryYear ?? "",
      role: u.role,
      password: "",
    });
    setModal({ open: true, editing: u });
  };

  const save = async () => {
    setSaving(true);
    try {
      if (modal.editing) {
        const profilePayload: UpdateProfilePayload = {
          firstName: form.firstName || undefined,
          lastName: form.lastName || undefined,
          studentId: form.studentId || undefined,
          major: form.major || undefined,
          entryYear: form.entryYear || undefined,
        };
        await updateUserProfile(modal.editing.id, profilePayload);
        if (form.role !== modal.editing.role)
          await updateUserRole(modal.editing.id, form.role);
      } else {
        const payload: CreateUserPayload = {
          email: form.email || undefined,
          phone: form.phone || undefined,
          password: form.password,
          role: form.role,
          firstName: form.firstName || undefined,
          lastName: form.lastName || undefined,
          studentId: form.studentId || undefined,
          major: form.major || undefined,
          entryYear: form.entryYear || undefined,
        };
        await createUser(payload);
      }
      setModal({ open: false, editing: null });
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "خطا در حذف");
    }
  };

  const toggleStatus = async (u: ApiUser) => {
    try {
      await updateUserStatus(u.id, !u.isActive);
      setUsers((prev) =>
        prev.map((x) => (x.id === u.id ? { ...x, isActive: !u.isActive } : x))
      );
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "خطا در تغییر وضعیت");
    }
  };

  // ─── render ──────────────────────────────────────────
  return (
    <div className="p-6 text-white" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">مدیریت اعضا</h1>
        <button
          onClick={openAdd}
          className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg text-sm"
        >
          + افزودن عضو
        </button>
      </div>

      {loading && <p className="text-gray-400">در حال بارگذاری...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="py-3 px-4 text-right">نام</th>
                <th className="py-3 px-4 text-right">ایمیل / تلفن</th>
                <th className="py-3 px-4 text-right">شماره دانشجویی</th>
                <th className="py-3 px-4 text-right">رشته</th>
                <th className="py-3 px-4 text-right">نقش</th>
                <th className="py-3 px-4 text-right">وضعیت</th>
                <th className="py-3 px-4 text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">{fullName(u)}</td>
                  <td className="py-3 px-4 text-gray-300">{u.email || u.phone || "—"}</td>
                  <td className="py-3 px-4 text-gray-300">{u.profile?.studentId || "—"}</td>
                  <td className="py-3 px-4 text-gray-300">{u.profile?.major || "—"}</td>
                  <td className="py-3 px-4">
                    <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{u.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleStatus(u)}
                      className={`px-2 py-0.5 rounded text-xs ${
                        u.isActive ? "bg-green-600/30 text-green-400" : "bg-red-600/30 text-red-400"
                      }`}
                    >
                      {u.isActive ? "فعال" : "غیرفعال"}
                    </button>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => openEdit(u)}
                      className="text-cyan-400 hover:text-cyan-300 text-xs"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => remove(u.id)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center text-gray-500 py-8">هیچ عضوی یافت نشد</p>
          )}
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md" dir="rtl">
            <h2 className="text-lg font-bold mb-4">
              {modal.editing ? "ویرایش عضو" : "افزودن عضو جدید"}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ["firstName", "نام"],
                  ["lastName", "نام خانوادگی"],
                  ["email", "ایمیل"],
                  ["phone", "تلفن"],
                  ["studentId", "شماره دانشجویی"],
                  ["major", "رشته"],
                  ["entryYear", "سال ورود"],
                ] as [keyof FormState, string][]
              ).map(([key, label]) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">{label}</label>
                  <input
                    className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm"
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
              {!modal.editing && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">رمز عبور</label>
                  <input
                    type="password"
                    className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">نقش</label>
                <select
                  className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button
                onClick={() => setModal({ open: false, editing: null })}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                انصراف
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm"
              >
                {saving ? "در حال ذخیره..." : "ذخیره"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
