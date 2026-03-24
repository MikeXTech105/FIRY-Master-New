import type { ReactNode } from "react";

type HeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export default function Header({ title, subtitle, actions }: HeaderProps) {
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Talent operations suite
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
            {subtitle ? <p className="mt-2 max-w-2xl text-sm text-slate-300">{subtitle}</p> : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {actions}

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-2xl shadow-slate-950/20">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-cyan-500/20">
              FM
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Admin Workspace</p>
              <p className="text-xs text-slate-400">{today}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
