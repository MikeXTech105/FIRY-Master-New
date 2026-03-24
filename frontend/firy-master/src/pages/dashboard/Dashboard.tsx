import DashboardLayout from "../../layouts/DashboardLayout";

const metrics = [
  { label: "Active candidates", value: "148", trend: "+18% this month" },
  { label: "Open roles", value: "24", trend: "6 hiring teams engaged" },
  { label: "Emails sent", value: "1,284", trend: "+9% response rate" },
  { label: "Automation health", value: "99.2%", trend: "No critical issues" },
];

const activities = [
  { title: "Candidate outreach batch completed", detail: "124 emails were sent to frontend and full-stack candidates.", time: "08:40 AM" },
  { title: "New role approval requested", detail: "A Senior Product Designer role is pending admin review.", time: "09:15 AM" },
  { title: "SMTP key updated", detail: "The primary notification gateway was refreshed successfully.", time: "10:02 AM" },
];

const stages = [
  { name: "Screening", count: 46, color: "from-cyan-400 to-blue-500" },
  { name: "Interview", count: 31, color: "from-violet-400 to-indigo-500" },
  { name: "Offer", count: 12, color: "from-emerald-400 to-cyan-500" },
];

export default function Dashboard() {
  return (
    <DashboardLayout
      title="Operations dashboard"
      subtitle="Track recruiting momentum, monitor pipeline health, and review the most important admin events in one place."
      actions={
        <button type="button" className="btn-secondary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992V4.356m-.983 4.009A9 9 0 1 0 6.58 17.42" />
          </svg>
          Refresh overview
        </button>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => (
          <article key={item.label} className="metric-card">
            <p className="text-sm text-slate-400">{item.label}</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-4xl font-semibold text-white">{item.value}</p>
              <span className="badge border-emerald-400/20 bg-emerald-500/10 text-emerald-200">{item.trend}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="page-section">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.26em] text-cyan-200/70">Pipeline pulse</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Hiring stage distribution</h2>
            </div>
            <span className="badge">Weekly sync ready</span>
          </div>

          <div className="mt-8 space-y-5">
            {stages.map((stage) => (
              <div key={stage.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-200">{stage.name}</span>
                  <span className="text-slate-400">{stage.count} candidates</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${stage.color}`}
                    style={{ width: `${Math.min(stage.count * 2, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="page-section">
          <p className="text-sm uppercase tracking-[0.26em] text-cyan-200/70">Today</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Focus areas</h2>
          <div className="mt-6 space-y-4">
            {[
              "Review shortlisted candidates for engineering roles.",
              "Confirm email template updates with the hiring ops team.",
              "Validate SMTP and notification settings before campaign launch.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.26em] text-cyan-200/70">Latest updates</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Recent activity</h2>
          </div>
          <button type="button" className="btn-secondary">
            View all events
          </button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {activities.map((activity) => (
            <article key={activity.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">{activity.title}</p>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{activity.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
