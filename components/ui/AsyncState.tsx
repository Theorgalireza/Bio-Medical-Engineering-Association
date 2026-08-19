import Spinner from "@/components/ui/Spinner";

type AsyncStateProps = {
  status: "loading" | "error" | "empty";
  error?: string;
  empty: string;
  onRetry?: () => void;
};

export default function AsyncState({
  status,
  error = "بارگذاری اطلاعات با خطا مواجه شد.",
  empty,
  onRetry,
}: AsyncStateProps) {
  if (status === "loading") {
    return (
      <div className="flex min-h-[180px] items-center justify-center rounded-3xl border border-borderSoft bg-primaryLight/40 text-sm text-gray-400">
        <span className="flex items-center gap-3">
          <Spinner size={18} />
          در حال بارگذاری...
        </span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        role="alert"
        className="flex min-h-[180px] flex-col items-center justify-center gap-4 rounded-3xl border border-red-500/30 bg-red-500/10 px-6 text-center text-sm text-red-300"
      >
        <p>{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full border border-red-400/40 px-4 py-2 text-xs text-red-200 transition hover:bg-red-400/10"
          >
            تلاش دوباره
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-borderSoft bg-primaryLight/40 px-6 text-center text-sm text-gray-400">
      {empty}
    </div>
  );
}
