import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { createEmailSetting } from "../../services/emailSettingsService";

type Props = {
  closeModal: () => void;
  refreshSettings: () => void;
};

export default function AddEmailSettingModal({ closeModal, refreshSettings }: Props) {
  const [form, setForm] = useState({ key: "", value: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      await createEmailSetting(form);
      toast.success("Added successfully");
      refreshSettings();
      closeModal();
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card max-w-md">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">Configuration</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Add email setting</h2>
          </div>
          <button type="button" onClick={closeModal} className="btn-secondary !px-3 !py-2 text-xs">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Key</label>
              <input
                placeholder="e.g. SMTP_HOST"
                value={form.key}
                onChange={(event) => setForm({ ...form, key: event.target.value })}
                className="input-shell"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Value</label>
              <input
                placeholder="e.g. smtp.gmail.com"
                value={form.value}
                onChange={(event) => setForm({ ...form, value: event.target.value })}
                className="input-shell"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 bg-white/[0.03] px-6 py-5">
            <button type="button" onClick={closeModal} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : "Save setting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
