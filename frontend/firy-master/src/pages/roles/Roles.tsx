import { useEffect, useMemo, useState } from "react";
import type { Role } from "../../types";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import { deleteRole, getRoles, toggleRoleStatus } from "../../services/roleService";
import AddRoleModal from "./AddRoleModal";

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await getRoles();
      setRoles(res);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this role?");
    if (!confirmDelete) return;

    try {
      await deleteRole(id);
      toast.success("Role deleted successfully");
      fetchRoles();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete role");
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await toggleRoleStatus(id, !currentStatus);
      toast.success("Role status updated");
      fetchRoles();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role status");
    }
  };

  const roleMetrics = useMemo(() => {
    const active = roles.filter((role) => role.isActive).length;
    return [
      { label: "Total roles", value: roles.length },
      { label: "Active roles", value: active },
      { label: "Inactive roles", value: roles.length - active },
    ];
  }, [roles]);

  return (
    <DashboardLayout
      title="Role management"
      subtitle="Maintain access levels, control permissions, and keep the admin structure aligned across your hiring teams."
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={fetchRoles} className="btn-secondary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992V4.356m-.983 4.009A9 9 0 1 0 6.58 17.42" />
            </svg>
            Refresh
          </button>
          <button type="button" onClick={() => setShowAddRoleModal(true)} className="btn-primary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add role
          </button>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        {roleMetrics.map((item) => (
          <article key={item.label} className="metric-card">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="page-card">
        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">Access matrix</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">System roles</h2>
          </div>
          <span className="badge">{roles.length} configured entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-shell">
            <thead>
              <tr>
                <th>SR No.</th>
                <th>ID</th>
                <th>Role name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <svg className="h-7 w-7 animate-spin text-cyan-300" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Loading roles...</span>
                    </div>
                  </td>
                </tr>
              ) : null}

              {!loading && roles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    No roles found yet. Add your first role to get started.
                  </td>
                </tr>
              ) : null}

              {!loading &&
                roles.map((role, index: number) => (
                  <tr key={role.id}>
                    <td>{index + 1}</td>
                    <td>
                      <span className="badge font-mono">#{role.id}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m5.25 2.25a8.25 8.25 0 1 1-16.5 0 8.25 8.25 0 0 1 16.5 0Z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{role.roleName}</p>
                          <p className="text-xs text-slate-400">Permissions template</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(role.id, role.isActive ?? false)}
                        className={`badge ${role.isActive ? "border-amber-400/20 bg-amber-500/10 text-amber-200" : "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${role.isActive ? "bg-amber-300" : "bg-emerald-300"}`} />
                        {role.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                    <td>
                      <button type="button" onClick={() => handleDelete(role.id)} className="btn-danger !px-3 !py-2 text-xs">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7 17.867 18.142A2 2 0 0 1 15.875 20H8.125a2 2 0 0 1-1.992-1.858L5 7m5 4v5m4-5v5M9 7V4.75A1.75 1.75 0 0 1 10.75 3h2.5A1.75 1.75 0 0 1 15 4.75V7M3 7h18" />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {showAddRoleModal ? <AddRoleModal closeModal={() => setShowAddRoleModal(false)} refreshRoles={fetchRoles} /> : null}
    </DashboardLayout>
  );
}
