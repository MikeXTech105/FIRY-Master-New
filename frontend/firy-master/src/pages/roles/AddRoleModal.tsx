import { useState } from "react";
import toast from "react-hot-toast";
import { createRole } from "../../services/roleService";

type AddRoleModalProps = {
  closeModal: () => void;
  refreshRoles: () => void;
};

export default function AddRoleModal({ closeModal, refreshRoles }: AddRoleModalProps) {
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!roleName) {
      alert("Role name required");
      return;
    }

    try {
      setLoading(true);
      await createRole(roleName);
      toast.success("Role created successfully");
      refreshRoles();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card max-w-md">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">Create role</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Add a new system role</h2>
          </div>
          <button type="button" onClick={closeModal} className="btn-secondary !px-3 !py-2 text-xs">
            Close
          </button>
        </div>

        <div className="space-y-4 px-6 py-6">
          <label className="block text-sm font-medium text-slate-300">Role name</label>
          <input
            type="text"
            placeholder="e.g. Admin, Manager, Viewer"
            value={roleName}
            onChange={(event) => setRoleName(event.target.value)}
            className="input-shell"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 bg-white/[0.03] px-6 py-5">
          <button type="button" onClick={closeModal} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Save role"}
          </button>
        </div>
      </div>
    </div>
  );
}
