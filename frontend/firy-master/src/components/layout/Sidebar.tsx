import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    hint: "Overview",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 3.75h6.75v6.75H3.75V3.75Zm9.75 0h6.75v10.5H13.5V3.75Zm-9.75 9.75h6.75v6.75H3.75V13.5Zm9.75 3h6.75v3.75H13.5V16.5Z"
      />
    ),
  },
  {
    to: "/roles",
    label: "Roles",
    hint: "Permissions",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m5.25 2.25a8.25 8.25 0 1 1-16.5 0 8.25 8.25 0 0 1 16.5 0Z"
      />
    ),
  },
  {
    to: "/candidate",
    label: "Candidates",
    hint: "Pipeline",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75a17.933 17.933 0 0 1-7.5-1.632Z"
      />
    ),
  },
  {
    to: "/emails",
    label: "Emails",
    hint: "Outreach",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 7.5v9A2.25 2.25 0 0 1 19.5 18.75h-15A2.25 2.25 0 0 1 2.25 16.5v-9m19.5 0A2.25 2.25 0 0 0 19.5 5.25h-15A2.25 2.25 0 0 0 2.25 7.5m19.5 0v.243a2.25 2.25 0 0 1-.988 1.87l-7.5 5.001a2.25 2.25 0 0 1-2.524 0l-7.5-5a2.25 2.25 0 0 1-.988-1.871V7.5"
      />
    ),
  },
  {
    to: "/email-settings",
    label: "Email Settings",
    hint: "Configuration",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6h3m-7.5 6h12m-9 6h6m4.386-11.148a1.875 1.875 0 0 0-3.327-1.386L15 6.75l-1.06-1.284a1.875 1.875 0 0 0-2.88 2.41L12.563 9.75l-1.503 1.874a1.875 1.875 0 1 0 2.88 2.41L15 12.75l1.06 1.284a1.875 1.875 0 1 0 2.88-2.41L17.437 9.75l1.95-2.898Z"
      />
    ),
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const currentSection = useMemo(
    () => navItems.find(({ to }) => location.pathname.startsWith(to))?.label ?? "Workspace",
    [location.pathname]
  );

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-white/10 bg-slate-950/90 px-3 py-4 backdrop-blur xl:flex ${
        isOpen ? "w-80" : "w-24"
      } transition-all duration-300`}
    >
      <div className="flex items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 shadow-2xl shadow-slate-950/30">
        <div className={`flex items-center gap-3 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none w-0 overflow-hidden"}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-cyan-500/25">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 2.75 4.75 13h5.5L11 21.25 19.25 11H13V2.75Z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">FiryMaster</p>
            <p className="text-xs text-slate-400">Recruitment control center</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/70 text-slate-300 transition hover:border-cyan-400/30 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.75h15m-15 5.25h15m-15 5.25h15" />
          </svg>
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-transparent px-4 py-4">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Now viewing</p>
        <p className={`mt-2 text-xl font-semibold text-white transition-all ${isOpen ? "opacity-100" : "text-center text-sm"}`}>{isOpen ? currentSection : "•"}</p>
        {isOpen ? <p className="mt-1 text-sm text-slate-400">Move quickly between dashboard, candidates, and outreach tools.</p> : null}
      </div>

      <nav className="mt-6 flex-1 space-y-2">
        {navItems.map(({ to, label, hint, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl border px-3 py-3 transition-all ${
                isActive
                  ? "border-cyan-400/40 bg-cyan-400/15 text-white shadow-lg shadow-cyan-500/10"
                  : "border-transparent bg-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/70 ring-1 ring-white/10">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                {icon}
              </svg>
            </div>
            {isOpen ? (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{label}</p>
                <p className="truncate text-xs text-slate-400 group-hover:text-slate-300">{hint}</p>
              </div>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-slate-950/30">
        <div className={`flex items-center gap-3 ${isOpen ? "justify-start" : "justify-center"}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-bold text-slate-950">
            AD
          </div>
          {isOpen ? (
            <div>
              <p className="text-sm font-semibold text-white">Admin</p>
              <p className="text-xs text-slate-400">System administrator</p>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
