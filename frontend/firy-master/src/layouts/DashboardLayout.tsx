import type { ReactNode } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
};

export default function DashboardLayout({
  children,
  title = "Overview",
  subtitle = "Monitor activity, manage records, and keep your hiring pipeline moving.",
  actions,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <Header title={title} subtitle={subtitle} actions={actions} />

        <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,#1e293b_0%,#0f172a_38%,#020617_100%)] px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
