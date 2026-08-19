import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookie = request.headers.get("cookie");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${apiUrl}/users/me`, {
    headers: { cookie },
    cache: "no-store",
  }).catch(() => null);
  const payload = await response?.json().catch(() => null);
  const user = payload?.data ?? payload;

  if (!response?.ok || !["OWNER", "ADMIN"].includes(user?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  revalidateTag("site-settings");
  return NextResponse.json({ revalidated: true });
}
