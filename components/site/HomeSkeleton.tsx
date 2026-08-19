export default function HomeSkeleton() {
  return (
    <main
      role="status"
      aria-label="در حال بارگذاری صفحه اصلی"
      className="min-h-screen overflow-hidden bg-surface px-4 py-8 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl animate-pulse space-y-16">
        {/* Hero */}
        <section className="rounded-[2rem] border border-white/10 bg-primaryLight/40 px-6 py-16 sm:px-10 lg:px-16">
          <div className="max-w-2xl space-y-5">
            <div className="h-4 w-32 rounded-full bg-white/10" />
            <div className="h-10 w-full max-w-xl rounded-xl bg-white/10 sm:h-14" />
            <div className="h-10 w-4/5 max-w-lg rounded-xl bg-white/10 sm:h-14" />
            <div className="h-3 w-full max-w-xl rounded-full bg-white/10" />
            <div className="h-3 w-5/6 max-w-lg rounded-full bg-white/10" />
            <div className="flex gap-3 pt-4">
              <div className="h-11 w-32 rounded-xl bg-cyan-400/20" />
              <div className="h-11 w-28 rounded-xl bg-white/10" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-[2rem] border border-white/10 bg-primary/70 px-6 py-16 text-center sm:px-10 lg:px-16">
          <div className="mx-auto max-w-3xl space-y-5">
            <div className="mx-auto h-8 w-32 rounded-full bg-cyan-400/20" />
            <div className="mx-auto h-10 w-4/5 max-w-2xl rounded-xl bg-white/10 sm:h-12" />
            <div className="mx-auto h-10 w-3/5 max-w-xl rounded-xl bg-white/10 sm:h-12" />
            <div className="mx-auto h-3 w-full max-w-2xl rounded-full bg-white/10" />
            <div className="mx-auto h-3 w-5/6 max-w-xl rounded-full bg-white/10" />
            <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
              <div className="h-11 w-full rounded-xl bg-cyan-400/20 sm:w-36" />
              <div className="h-11 w-full rounded-xl bg-white/10 sm:w-32" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-primaryLight/40 p-6 text-center">
                <div className="mx-auto mb-4 h-8 w-16 rounded-lg bg-cyan-400/20" />
                <div className="mx-auto mb-2 h-9 w-20 rounded-lg bg-white/10" />
                <div className="mx-auto h-3 w-24 rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </section>

        {/* Announcements and publications */}
        {[
          { count: 3, image: "h-40" },
          { count: 4, image: "h-28" },
        ].map((section, sectionIndex) => (
          <section key={sectionIndex} className="space-y-6">
            <div className="space-y-3">
              <div className="h-3 w-24 rounded-full bg-cyan-400/20" />
              <div className="h-8 w-56 rounded-lg bg-white/10" />
            </div>
            <div className={`grid gap-5 ${section.count === 3 ? "md:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
              {Array.from({ length: section.count }, (_, index) => (
                <div key={index} className="space-y-4 rounded-2xl border border-white/10 bg-primaryLight/40 p-5">
                  <div className={`${section.image} rounded-xl bg-white/10`} />
                  <div className="h-5 w-4/5 rounded bg-white/10" />
                  <div className="h-3 w-full rounded-full bg-white/10" />
                  <div className="h-3 w-2/3 rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Gallery */}
        <section className="space-y-6">
          <div className="space-y-3">
            <div className="h-3 w-20 rounded-full bg-emerald-400/20" />
            <div className="h-8 w-52 rounded-lg bg-white/10" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="aspect-[4/3] rounded-2xl border border-white/10 bg-white/10" />
            ))}
          </div>
        </section>

        {/* Faculty */}
        <section className="space-y-6">
          <div className="space-y-3">
            <div className="h-3 w-28 rounded-full bg-amber-400/20" />
            <div className="h-8 w-60 rounded-lg bg-white/10" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-primaryLight/40 p-5">
                <div className="h-14 w-14 shrink-0 rounded-full bg-white/10" />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="h-4 w-4/5 rounded bg-white/10" />
                  <div className="h-3 w-3/5 rounded-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feedback */}
        <section className="space-y-6 rounded-[2rem] border border-white/10 bg-primary/70 px-6 py-12 sm:px-10">
          <div className="space-y-3 text-center">
            <div className="mx-auto h-3 w-20 rounded-full bg-cyan-400/20" />
            <div className="mx-auto h-8 w-64 rounded-lg bg-white/10" />
            <div className="mx-auto h-3 w-full max-w-xl rounded-full bg-white/10" />
            <div className="mx-auto h-3 w-5/6 max-w-lg rounded-full bg-white/10" />
          </div>
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-primaryLight/60 p-6 md:p-10">
            <div className="grid gap-5 md:grid-cols-2">
              {[1, 2].map((item) => (
                <div key={item} className="space-y-3">
                  <div className="h-3 w-24 rounded-full bg-white/10" />
                  <div className="h-11 rounded-xl bg-white/10" />
                </div>
              ))}
            </div>
            <div className="mt-5 h-3 w-28 rounded-full bg-white/10" />
            <div className="mt-3 h-10 rounded-xl bg-white/10" />
            <div className="mt-5 h-28 rounded-xl bg-white/10" />
            <div className="mt-5 h-11 w-40 rounded-xl bg-cyan-400/20" />
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-6">
          <div className="space-y-3 text-center">
            <div className="mx-auto h-3 w-28 rounded-full bg-emerald-400/20" />
            <div className="mx-auto h-8 w-60 rounded-lg bg-white/10" />
          </div>
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-primaryLight/40 p-4">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-cyan-400/20" />
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="h-4 w-20 rounded bg-white/10" />
                    <div className="h-3 w-full rounded-full bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-5 rounded-2xl border border-white/10 bg-primaryLight/40 p-6 md:p-8 lg:col-span-3">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="h-11 rounded-xl bg-white/10" />
                <div className="h-11 rounded-xl bg-white/10" />
              </div>
              <div className="h-11 rounded-xl bg-white/10" />
              <div className="h-32 rounded-xl bg-white/10" />
              <div className="h-11 w-36 rounded-xl bg-cyan-400/20" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
