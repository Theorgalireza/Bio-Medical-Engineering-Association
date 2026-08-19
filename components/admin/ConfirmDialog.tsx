"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ConfirmOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
};

type ConfirmContextValue = {
  requestConfirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<{
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const requestConfirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => setRequest({ options, resolve })),
    [],
  );

  const close = (value: boolean) => {
    request?.resolve(value);
    setRequest(null);
  };

  return (
    <ConfirmContext.Provider value={{ requestConfirm }}>
      {children}
      {request && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          role="presentation"
          onMouseDown={() => close(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="w-full max-w-md rounded-2xl border border-borderSoft bg-primaryLight p-6 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
            dir="rtl"
          >
            <h2 id="confirm-title" className="text-lg font-bold text-white">
              {request.options.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              {request.options.description}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => close(false)}
                className="rounded-lg border border-borderSoft px-4 py-2 text-sm text-gray-300 transition hover:bg-white/5"
              >
                انصراف
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => close(true)}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
              >
                {request.options.confirmLabel ?? "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useConfirm باید داخل ConfirmProvider استفاده شود");
  return context.requestConfirm;
}
