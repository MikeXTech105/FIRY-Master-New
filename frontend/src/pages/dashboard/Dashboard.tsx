import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  getDashboardStats,
  getEmailCandidateSection,
} from "../../services/dashboardService";
import type {
  DashboardStats,
  EmailCandidateSectionResponse,
} from "../../services/dashboardService";
import toast from "react-hot-toast";

// ── existing hooks & components (unchanged) ──────────────────────────────────

function useCountUp(target: number, duration: number = 1200, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (target === 0) { setCount(0); return; }
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({ label, value, icon, color, bgColor, ringColor, delay, animate, description }: {
  label: string; value: number; icon: React.ReactNode;
  color: string; bgColor: string; ringColor: string;
  delay: number; animate: boolean; description: string;
}) {
  const count = useCountUp(value, 1000, animate);
  return (
    <div className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300"
      style={{ animation: animate ? `slideUp 0.5s ease-out ${delay}ms both` : "none" }}>
      <div className={`absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-20 group-hover:scale-110 ${bgColor}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
          <p className={`text-4xl font-bold tracking-tight ${color} mt-1`}>{count.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2">{description}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${bgColor} ${ringColor} ring-1 flex items-center justify-center shrink-0`}>{icon}</div>
      </div>
      <div className={`absolute bottom-0 left-0 h-0.5 ${bgColor} transition-all duration-500 w-0 group-hover:w-full`} />
    </div>
  );
}

function DonutChart({ sent, failed, queued }: { sent: number; failed: number; queued: number }) {
  const total = sent + failed + queued || 1;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 400); return () => clearTimeout(t); }, []);
  const sentPct = (sent / total) * 100;
  const failedPct = (failed / total) * 100;
  const queuedPct = (queued / total) * 100;
  const sentDash = (sentPct / 100) * circumference;
  const failedDash = (failedPct / 100) * circumference;
  const queuedDash = (queuedPct / 100) * circumference;
  const sentOffset = 0;
  const failedOffset = -sentDash;
  const queuedOffset = -(sentDash + failedDash);
  return (
    <div className="flex items-center gap-8">
      <div className="relative w-36 h-36 shrink-0">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="18" />
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#22c55e" strokeWidth="18"
            strokeDasharray={`${animated ? sentDash : 0} ${circumference}`} strokeDashoffset={sentOffset} strokeLinecap="butt"
            style={{ transition: "stroke-dasharray 1s ease-out 0.4s" }} />
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#ef4444" strokeWidth="18"
            strokeDasharray={`${animated ? failedDash : 0} ${circumference}`} strokeDashoffset={failedOffset} strokeLinecap="butt"
            style={{ transition: "stroke-dasharray 1s ease-out 0.6s" }} />
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#3b82f6" strokeWidth="18"
            strokeDasharray={`${animated ? queuedDash : 0} ${circumference}`} strokeDashoffset={queuedOffset} strokeLinecap="butt"
            style={{ transition: "stroke-dasharray 1s ease-out 0.8s" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{total}</span>
          <span className="text-[10px] text-gray-400 font-medium">Total</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {[{ color: "bg-green-500", label: "Sent", val: sent, pct: sentPct },
          { color: "bg-red-500", label: "Failed", val: failed, pct: failedPct },
          { color: "bg-blue-500", label: "In Queue", val: queued, pct: queuedPct }].map(i => (
          <div key={i.label} className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${i.color} shrink-0`} />
            <div>
              <p className="text-xs text-gray-500">{i.label}</p>
              <p className="text-sm font-bold text-gray-800">{i.val} <span className="text-xs font-normal text-gray-400">({i.pct.toFixed(0)}%)</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(max > 0 ? (value / max) * 100 : 0), 300); return () => clearTimeout(t); }, [value, max]);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-28 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${width}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-6 text-right">{value}</span>
    </div>
  );
}

// ── NEW: Email Section ────────────────────────────────────────────────────────

function SectionStatCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className={`flex flex-col items-center justify-center px-6 py-4 rounded-2xl ${bg}`}>
      <span className={`text-3xl font-bold ${color}`}>{value.toLocaleString()}</span>
      <span className="text-xs text-gray-500 mt-1 font-medium">{label}</span>
    </div>
  );
}

function EmailCandidateSectionUI({ data }: { data: EmailCandidateSectionResponse }) {
  const maxCandidate = Math.max(...data.candidateReports.map(c => c.totalEmails), 1);
  const maxRole = Math.max(...data.roleReports.map(r => r.totalEmails), 1);

  return (
    <div className="space-y-6 mt-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <SectionStatCard label="Total Emails" value={data.summary.totalEmails} color="text-blue-600" bg="bg-blue-50" />
        <SectionStatCard label="Emails Sent" value={data.summary.emailsSent} color="text-green-600" bg="bg-green-50" />
        <SectionStatCard label="Pending" value={data.summary.pendingEmails} color="text-orange-500" bg="bg-orange-50" />
      </div>

      {/* Candidate + Role Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Candidate Report */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-800 mb-4">Candidate-wise Report</h4>
          <div className="space-y-3">
            {data.candidateReports.map(c => (
              <div key={c.appCandidateID}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-700">{c.candidateName}</span>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span className="text-green-600 font-semibold">✓ {c.sentEmails}</span>
                    {c.pendingEmails > 0 && <span className="text-orange-500 font-semibold">⏳ {c.pendingEmails}</span>}
                    <span className="text-gray-400">/ {c.totalEmails}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-700"
                    style={{ width: `${(c.sentEmails / maxCandidate) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Report */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-800 mb-4">Role-wise Report</h4>
          <div className="space-y-3">
            {data.roleReports.map(r => (
              <div key={r.appRoleID}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-700">{r.roleName}</span>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span className="text-green-600 font-semibold">✓ {r.sentEmails}</span>
                    {r.pendingEmails > 0 && <span className="text-orange-500 font-semibold">⏳ {r.pendingEmails}</span>}
                    <span className="text-gray-400">/ {r.totalEmails}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-700"
                    style={{ width: `${(r.sentEmails / maxRole) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Trends */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-800 mb-4">Daily Trends</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase pb-3 pr-4">Date</th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase pb-3 px-4">Total</th>
                <th className="text-center text-xs font-semibold text-green-500 uppercase pb-3 px-4">Sent</th>
                <th className="text-center text-xs font-semibold text-orange-400 uppercase pb-3 px-4">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.dailyTrends.map((d, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 pr-4 text-xs text-gray-600 font-medium">
                    {new Date(d.emailDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-2.5 px-4 text-center text-xs font-semibold text-blue-600">{d.totalEmails}</td>
                  <td className="py-2.5 px-4 text-center text-xs font-semibold text-green-600">{d.sentEmails}</td>
                  <td className="py-2.5 px-4 text-center text-xs font-semibold text-orange-500">{d.pendingEmails}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Email section state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [emailSection, setEmailSection] = useState<EmailCandidateSectionResponse | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
      setLastUpdated(new Date());
      setTimeout(() => setAnimate(true), 100);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Default: null date = all data
  const fetchEmailSection = async (start: string | null = null, end: string | null = null) => {
    try {
      setEmailLoading(true);
      const data = await getEmailCandidateSection(start, end);
      setEmailSection(data);
    } catch {
      toast.error("Failed to load email section");
    } finally {
      setEmailLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchEmailSection(); // default: load all
  }, []);

  const handleFilter = () => {
    fetchEmailSection(startDate || null, endDate || null);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    fetchEmailSection(null, null);
  };

  const maxToday = Math.max(stats?.todayEmailQueue ?? 0, stats?.todaySentEmail ?? 0, stats?.todayFailedEmail ?? 0, 1);

  return (
    <DashboardLayout>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4" style={{ animation: "fadeIn 0.4s ease-out" }}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Email campaign overview &amp; today's activity</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-400">Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          )}
          <button onClick={fetchStats} disabled={loading}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm font-medium shadow-sm disabled:opacity-50">
            <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-gray-100 rounded w-24" />
                  <div className="h-8 bg-gray-100 rounded w-16 mt-3" />
                  <div className="h-2.5 bg-gray-100 rounded w-32 mt-2" />
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      {!loading && stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            <StatCard label="Total Queue" value={stats.totalEmailQueue} color="text-blue-600" bgColor="bg-blue-500" ringColor="ring-blue-100" delay={0} animate={animate} description="All emails ever queued"
              icon={<svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
            <StatCard label="Today's Queue" value={stats.todayEmailQueue} color="text-violet-600" bgColor="bg-violet-500" ringColor="ring-violet-100" delay={100} animate={animate} description="Emails queued today"
              icon={<svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <StatCard label="Sent Today" value={stats.todaySentEmail} color="text-green-600" bgColor="bg-green-500" ringColor="ring-green-100" delay={200} animate={animate} description="Successfully delivered today"
              icon={<svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <StatCard label="Failed Today" value={stats.todayFailedEmail} color="text-red-600" bgColor="bg-red-500" ringColor="ring-red-100" delay={300} animate={animate} description="Failed deliveries today"
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm" style={{ animation: "slideUp 0.5s ease-out 400ms both" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Today's Breakdown</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Email activity for today</p>
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                  {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="space-y-4">
                <ActivityRow label="Queued" value={stats.todayEmailQueue} max={maxToday} color="bg-violet-500" />
                <ActivityRow label="Sent" value={stats.todaySentEmail} max={maxToday} color="bg-green-500" />
                <ActivityRow label="Failed" value={stats.todayFailedEmail} max={maxToday} color="bg-red-400" />
              </div>
              {(stats.todaySentEmail + stats.todayFailedEmail) > 0 && (
                <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Success Rate</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${(stats.todaySentEmail / (stats.todaySentEmail + stats.todayFailedEmail)) >= 0.8 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                    {((stats.todaySentEmail / (stats.todaySentEmail + stats.todayFailedEmail)) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm" style={{ animation: "slideUp 0.5s ease-out 500ms both" }}>
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-800">Email Distribution</h3>
                <p className="text-xs text-gray-400 mt-0.5">Overall split across all statuses</p>
              </div>
              <DonutChart sent={stats.todaySentEmail} failed={stats.todayFailedEmail} queued={stats.todayEmailQueue} />
              <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-400">All-time Total Queue</span>
                <span className="text-sm font-bold text-blue-600">{stats.totalEmailQueue.toLocaleString()} emails</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── NEW: Email Candidate Section ──────────────────────────────────────── */}
      <div className="mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Email Candidate Report</h2>
            <p className="text-xs text-gray-400 mt-0.5">Filter by date range to see candidate & role wise breakdown</p>
          </div>
        </div>

        {/* Date Filter */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-end gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleFilter}
              disabled={emailLoading}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm shadow-blue-200 disabled:opacity-50"
            >
              {emailLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
              )}
              Filter
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          </div>
        </div>

        {/* Email Section Data */}
        {emailLoading && (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
            <svg className="w-5 h-5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-sm">Loading report...</span>
          </div>
        )}

        {!emailLoading && emailSection && (
          <EmailCandidateSectionUI data={emailSection} />
        )}
      </div>

    </DashboardLayout>
  );
}