import { useEffect, useState } from "react";
import type { Role } from "../../types";
import toast from "react-hot-toast";
import { addEmails } from "../../services/emailService";
import { getRoles } from "../../services/roleService";

interface Props {
  closeModal: () => void;
  refreshEmails: () => void;
}

export default function AddEmailModal({ closeModal, refreshEmails }: Props) {
  const [emails, setEmails] = useState("");
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
    }
  };

  const handleSubmit = async () => {
    if (!emails) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      await addEmails({
        emails,
        roleId: Number(selectedRole),
      });
      toast.success("Email added successfully");
      refreshEmails();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card max-w-md">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">Outreach setup</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Add email target</h2>
          </div>
          <button type="button" onClick={closeModal} className="btn-secondary !px-3 !py-2 text-xs">
            Close
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Email address</label>
            <input
              type="text"
              placeholder="e.g. john@example.com"
              value={emails}
              onChange={(event) => setEmails(event.target.value)}
              className="input-shell"
            />
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
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 bg-white/[0.03] px-6 py-5">
          <button type="button" onClick={closeModal} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Save email"}
          </button>
        </div>
      </div>
    </div>
  );
}
