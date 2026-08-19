import Spinner from "@/components/ui/Spinner";

export default function SiteLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div role="status" className="flex flex-col items-center gap-4 text-sm text-gray-400">
        <Spinner size={28} />
        <span>در حال بارگذاری انجمن...</span>
      </div>
    </main>
  );
}
