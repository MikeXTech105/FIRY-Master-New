import { useEffect, useMemo, useState } from "react";
import type { EmailSetting } from "../../types";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import { deleteEmailSetting, getEmailSettings } from "../../services/emailSettingsService";
import AddEmailSettingModal from "./AddEmailSetting";

export default function EmailSettings() {
  const [settings, setSettings] = useState<EmailSetting[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getEmailSettings();
      setSettings(data);
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this email setting?")) return;

    try {
      await deleteEmailSetting(id);
      toast.success("Deleted successfully");
      fetchSettings();
    } catch {
      toast.error("Delete failed");
    }
  };

  const metrics = useMemo(
    () => [
      { label: "Configuration keys", value: settings.length },
      { label: "Secured records", value: settings.filter((item) => item.value).length },
      { label: "Ready environments", value: settings.length > 0 ? 1 : 0 },
    ],
    [settings]
  );

  return (
    <DashboardLayout
      title="Email settings"
      subtitle="Control gateway credentials, streamline notification configuration, and keep communication services stable."
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={fetchSettings} className="btn-secondary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992V4.356m-.983 4.009A9 9 0 1 0 6.58 17.42" />
            </svg>
            Refresh
          </button>
          <button type="button" onClick={() => setShowModal(true)} className="btn-primary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add setting
          </button>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((item) => (
          <article key={item.label} className="metric-card">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="page-card">
        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">Configuration vault</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Delivery settings</h2>
          </div>
          <span className="badge">Protected operational keys</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-shell">
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <svg className="h-7 w-7 animate-spin text-cyan-300" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Loading settings...</span>
                    </div>
                  </td>
                </tr>
              ) : null}

              {!loading && settings.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-16 text-center text-slate-400">
                    No settings found. Add configuration values to initialize email delivery.
                  </td>
                </tr>
              ) : null}

              {!loading &&
                settings.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="badge font-mono">{item.key}</span>
                    </td>
                    <td className="max-w-xl truncate">{item.value}</td>
                    <td>
                      <button type="button" onClick={() => handleDelete(item.id)} className="btn-danger !px-3 !py-2 text-xs">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {showModal ? <AddEmailSettingModal closeModal={() => setShowModal(false)} refreshSettings={fetchSettings} /> : null}
    </DashboardLayout>
  );
}
