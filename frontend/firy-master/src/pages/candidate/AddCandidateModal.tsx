import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Candidate, Role } from "../../types";
import toast from "react-hot-toast";
import { createCandidate } from "../../services/candidateService";
import { getRoles } from "../../services/roleService";

type AddCandidateModalProps = {
  closeModal: () => void;
  refreshCandidates: () => void;
};

type CandidateFormState = Partial<Omit<Candidate, "id" | "isActive" | "resumeFilePath">>;

export default function AddCandidateModal({ closeModal, refreshCandidates }: AddCandidateModalProps) {
  const [form, setForm] = useState<CandidateFormState>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load roles");
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      await createCandidate({
        name: form.name ?? "",
        phoneNumber: form.phoneNumber ?? "",
        email: form.email ?? "",
        appPassword: form.appPassword ?? "",
        subject: form.subject ?? "",
        body: form.body ?? "",
        roleId: Number(selectedRole),
        resumeFile: file,
      });
      toast.success("Candidate created");
      refreshCandidates();
      closeModal();
    } catch {
      toast.error("Create candidate failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card max-w-3xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">Candidate intake</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Add candidate</h2>
          </div>
          <button type="button" onClick={closeModal} className="btn-secondary !px-3 !py-2 text-xs">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid max-h-[68vh] gap-5 overflow-y-auto px-6 py-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Full name</label>
              <input name="name" placeholder="e.g. John Doe" onChange={handleChange} className="input-shell" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Role</label>
              <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)} className="select-shell">
                <option value="">Select role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Phone number</label>
              <input name="phoneNumber" placeholder="e.g. 9876543210" onChange={handleChange} className="input-shell" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
              <input name="email" placeholder="e.g. john@email.com" onChange={handleChange} className="input-shell" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">App password</label>
              <input name="appPassword" placeholder="App password" onChange={handleChange} className="input-shell" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Subject</label>
              <input name="subject" placeholder="Email subject" onChange={handleChange} className="input-shell" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">Body</label>
              <textarea name="body" placeholder="Email body content..." onChange={handleChange} rows={4} className="input-shell resize-none" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">Resume</label>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-4 transition hover:border-cyan-400/40 hover:bg-cyan-400/5">
                <div>
                  <p className="font-medium text-white">Upload PDF resume</p>
                  <p className="mt-1 text-sm text-slate-400">{file ? file.name : "Choose a file to attach to this profile."}</p>
                </div>
                <span className="btn-secondary !px-3 !py-2 text-xs">Browse</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setFile(event.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 bg-white/[0.03] px-6 py-5">
            <button type="button" onClick={closeModal} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : "Save candidate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
