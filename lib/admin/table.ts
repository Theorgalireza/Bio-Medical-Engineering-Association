export function normalizeSearch(value: unknown): string {
  return String(value ?? "").toLowerCase().trim();
}

export function filterBySearch<T>(
  items: T[],
  term: string,
  selector: (item: T) => Array<string | number | null | undefined>,
) {
  const q = normalizeSearch(term);
  if (!q) return items;
  return items.filter((item) => selector(item).map(normalizeSearch).join(" ").includes(q));
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    page: safePage,
    totalPages,
    slice: items.slice(start, start + pageSize),
  };
}

export function toggleSelection(set: Set<string>, id: string) {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

export function selectAllVisible(selection: Set<string>, ids: string[]) {
  const next = new Set(selection);
  const allSelected = ids.every((id) => next.has(id));
  if (allSelected) {
    ids.forEach((id) => next.delete(id));
  } else {
    ids.forEach((id) => next.add(id));
  }
  return next;
}
