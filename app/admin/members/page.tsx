"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getUsers, createUser, updateUserProfile, updateUserRole, updateUserStatus, deleteUser } from "@/lib/api";
import { filterBySearch, paginate, selectAllVisible, toggleSelection } from "@/lib/admin-table";
import type { ApiUser, Role, CreateUserPayload, UpdateProfilePayload } from "@/types";

const fullName = (u: ApiUser) => [u.profile?.firstName, u.profile?.lastName].filter(Boolean).join(" ") || u.email || u.phone || "—";
const ROLES: Role[] = ["OWNER", "ADMIN", "CONTENT_EDITOR", "STUDENT_MEMBER", "STUDENT_ACTIVE_MEMBER", "STUDENT_INACTIVE_MEMBER", "FACULTY_MEMBER", "GUEST"];
const PAGE_SIZE = 8;

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
  github: string;
  linkedin: string;
  website: string;
}

const EMPTY_FORM: FormState = { firstName: "", lastName: "", email: "", phone: "", studentId: "", major: "", entryYear: "", role: "STUDENT_MEMBER", password: "", github: "", linkedin: "", website: "" };

export default function MembersPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const canManageUsers = currentUser?.role === "OWNER" || currentUser?.role === "ADMIN";
  const canManageRoles = currentUser?.role === "OWNER" || currentUser?.role === "ADMIN";
  const canManageStatus = canManageUsers;

  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ open: boolean; editing: ApiUser | null }>({ open: false, editing: null });
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
      setSelectedIds(new Set());
      setPage(1);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!canManageUsers) {
      setLoading(false);
      setError("شما دسترسی مدیریت اعضا را ندارید.");
      return;
    }
    load();
  }, [authLoading, canManageUsers, load]);

  const filtered = useMemo(
    () => filterBySearch(users, query, (u) => [fullName(u), u.email, u.phone, u.profile?.studentId, u.profile?.major, u.role]),
    [users, query],
  );
  const { slice: visible, totalPages, page: currentPage } = paginate(filtered, page, PAGE_SIZE);
  const allVisibleSelected = visible.length > 0 && visible.every((item) => selectedIds.has(item.id));

  const openAdd = () => { setForm(EMPTY_FORM); setModal({ open: true, editing: null }); };
  const openEdit = (u: ApiUser) => {
    setForm({
      firstName: u.profile?.firstName ?? "",
      lastName: u.profile?.lastName ?? "",
      email: u.email ?? "",
      phone: u.phone ?? "",
      studentId: u.profile?.studentId ?? "",
      major: u.profile?.major ?? "",
      entryYear: u.profile?.entryYear ? String(u.profile.entryYear) : "",
      role: u.role,
      password: "",
      github: u.profile?.github ?? "",
      linkedin: u.profile?.linkedin ?? "",
      website: u.profile?.website ?? "",
    });
    setModal({ open: true, editing: u });
  };

  const save = async () => {
    if (!canManageUsers) { alert("شما دسترسی مدیریت اعضا را ندارید."); return; }
    setSaving(true);
    try {
      if (modal.editing) {
        const profilePayload: UpdateProfilePayload = {
          firstName: form.firstName || undefined,
          lastName: form.lastName || undefined,
          studentId: form.studentId || undefined,
          major: form.major || undefined,
          entryYear: form.entryYear ? Number(form.entryYear) : undefined,
          github: form.github || undefined,
          linkedin: form.linkedin || undefined,
          website: form.website || undefined,
        };
        await updateUserProfile(modal.editing.id, profilePayload);
        if (canManageRoles && form.role !== modal.editing.role) await updateUserRole(modal.editing.id, form.role);
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
          entryYear: form.entryYear ? Number(form.entryYear) : undefined,
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
    if (!canManageRoles) { alert("فقط مالک می‌تواند اعضا را حذف کند."); return; }
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
      if (!canManageStatus) return;
      await updateUserStatus(u.id, !u.isActive);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isActive: !u.isActive } : x)));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "خطا در تغییر وضعیت");
    }
  };

  const bulkSetStatus = async (isActive: boolean) => {
    const targets = users.filter((u) => selectedIds.has(u.id));
    if (!targets.length) return;
    await Promise.all(targets.map((u) => updateUserStatus(u.id, isActive)));
    await load();
  };

  const bulkDelete = async () => {
    if (!canManageRoles) { alert("فقط مالک می‌تواند اعضا را حذف کند."); return; }
    const targets = users.filter((u) => selectedIds.has(u.id));
    if (!targets.length) return;
    if (!confirm(`حذف ${targets.length} عضو انجام شود؟`)) return;
    await Promise.all(targets.map((u) => deleteUser(u.id)));
    await load();
  };

  if (authLoading) return <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/50">در حال بارگذاری...</div>;
  if (!canManageUsers) return <div dir="rtl" className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-300">این بخش فقط برای مدیران در دسترس است.</div>;

  return (
    <div className="space-y-5 p-6 text-white" dir="rtl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت اعضا</h1>
          <p className="mt-1 text-sm text-gray-400">{users.length.toLocaleString("fa-IR")} کاربر ثبت شده است.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedIds.size > 0 && (
            <>
              <button onClick={() => bulkSetStatus(true)} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">فعال‌سازی گروهی</button>
              <button onClick={() => bulkSetStatus(false)} className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">غیرفعال‌سازی گروهی</button>
              {canManageRoles && <button onClick={bulkDelete} className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">حذف انتخاب‌شده‌ها</button>}
            </>
          )}
          <button onClick={openAdd} className="rounded-lg bg-cyan-600 px-4 py-2 text-sm text-white transition hover:bg-cyan-500">+ افزودن عضو</button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 lg:w-[28rem]">
          <Search size={15} className="shrink-0 text-gray-500" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="جستجو در نام، ایمیل، تلفن، رشته یا نقش..." className="w-full bg-transparent outline-none placeholder:text-gray-500" />
        </label>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <button onClick={() => setSelectedIds((prev) => selectAllVisible(prev, visible.map((item) => item.id)))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10">{allVisibleSelected ? "لغو انتخاب صفحه" : "انتخاب صفحه"}</button>
          <span>انتخاب‌شده: {selectedIds.size.toLocaleString("fa-IR")}</span>
        </div>
      </div>

      {loading && <p className="text-gray-400">در حال بارگذاری...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && canManageUsers && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d1526]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="px-4 py-3 text-right"> </th>
                <th className="px-4 py-3 text-right">نام</th>
                <th className="px-4 py-3 text-right">ایمیل / تلفن</th>
                <th className="px-4 py-3 text-right">شماره دانشجویی</th>
                <th className="px-4 py-3 text-right">رشته</th>
                <th className="px-4 py-3 text-right">لینک‌ها</th>
                <th className="px-4 py-3 text-right">نقش</th>
                <th className="px-4 py-3 text-right">وضعیت</th>
                <th className="px-4 py-3 text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {!loading && visible.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.has(u.id)} onChange={() => setSelectedIds((prev) => toggleSelection(prev, u.id))} className="accent-cyan-500" /></td>
                  <td className="px-4 py-3">{fullName(u)}</td>
                  <td className="px-4 py-3 text-gray-300">{u.email || u.phone || "—"}</td>
                  <td className="px-4 py-3 text-gray-300">{u.profile?.studentId || "—"}</td>
                  <td className="px-4 py-3 text-gray-300">{u.profile?.major || "—"}</td>
                  <td className="px-4 py-3"><div className="flex gap-2 text-xs">{u.profile?.github && <a href={u.profile.github} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">GitHub</a>}{u.profile?.linkedin && <a href={u.profile.linkedin} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">LinkedIn</a>}{u.profile?.website && <a href={u.profile.website} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">وب‌سایت</a>}{!u.profile?.github && !u.profile?.linkedin && !u.profile?.website && <span className="text-gray-600">—</span>}</div></td>
                  <td className="px-4 py-3"><span className="rounded bg-white/10 px-2 py-0.5 text-xs">{u.role}</span></td>
                  <td className="px-4 py-3"><button onClick={() => toggleStatus(u)} disabled={!canManageStatus} className={`rounded px-2 py-0.5 text-xs ${u.isActive ? "bg-green-600/30 text-green-400" : "bg-red-600/30 text-red-400"} ${!canManageStatus ? "cursor-not-allowed opacity-60" : ""}`}>{u.isActive ? "فعال" : "غیرفعال"}</button></td>
                  <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => openEdit(u)} className="text-cyan-400 hover:text-cyan-300 text-xs">ویرایش</button>{canManageRoles && <button onClick={() => remove(u.id)} className="text-red-400 hover:text-red-300 text-xs">حذف</button>}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && visible.length === 0 && <p className="py-8 text-center text-gray-500">هیچ عضوی یافت نشد</p>}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
          <button disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={15} /> قبلی</button>
          <span>صفحه {currentPage.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}</span>
          <button disabled={currentPage >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40">بعدی <ChevronLeft size={15} /></button>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="max-h-[70vh] w-full max-w-md overflow-y-auto rounded-xl border border-white/10 bg-gray-900 p-6" dir="rtl">
            <h2 className="mb-4 text-lg font-bold">{modal.editing ? "ویرایش عضو" : "افزودن عضو جدید"}</h2>
            <div className="grid grid-cols-2 gap-3 pr-1">
              {([["firstName", "نام"], ["lastName", "نام خانوادگی"], ["email", "ایمیل"], ["phone", "تلفن"], ["studentId", "شماره دانشجویی"], ["major", "رشته"], ["entryYear", "سال ورود"]] as [keyof FormState, string][]).map(([key, label]) => (
                <div key={key} className="flex flex-col gap-1"><label className="text-xs text-gray-400">{label}</label><input className="rounded border border-white/10 bg-white/5 px-3 py-1.5 text-sm" value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} /></div>
              ))}
              {modal.editing && ([["github", "گیت‌هاب"], ["linkedin", "لینکدین"], ["website", "وب‌سایت"]] as [keyof FormState, string][]).map(([key, label]) => (
                <div key={key} className="flex flex-col gap-1"><label className="text-xs text-gray-400">{label}</label><input className="rounded border border-white/10 bg-white/5 px-3 py-1.5 text-sm" dir="ltr" placeholder="https://..." value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} /></div>
              ))}
              {!modal.editing && <div className="flex flex-col gap-1"><label className="text-xs text-gray-400">رمز عبور</label><input type="password" className="rounded border border-white/10 bg-white/5 px-3 py-1.5 text-sm" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} /></div>}
              <div className="flex flex-col gap-1"><label className="text-xs text-gray-400">نقش</label><select className="rounded border border-white/10 bg-white/5 px-3 py-1.5 text-sm disabled:opacity-60" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))} disabled={!canManageRoles}>{ROLES.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
            </div>
            <div className="mt-5 flex justify-end gap-3"><button onClick={() => setModal({ open: false, editing: null })} className="px-4 py-2 text-sm text-gray-400 hover:text-white">انصراف</button><button onClick={save} disabled={saving} className="rounded-lg bg-cyan-600 px-4 py-2 text-sm disabled:opacity-50">{saving ? "در حال ذخیره..." : "ذخیره"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
