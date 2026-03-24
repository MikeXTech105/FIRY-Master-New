import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getRoles } from "../../services/roleService";
import AddRoleModal from "../roles/AddRoleModal";
import { deleteRole } from "../../services/roleService";
import { toggleRoleStatus } from "../../services/roleService";
import toast from "react-hot-toast";

export default function Roles() {

    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddRoleModal, setShowAddRoleModal] = useState(false);

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm("Are you sure you want to delete this role?");
        if (!confirmDelete) return;
        try {
            await deleteRole(id);
            toast.success("Role deleted successfully");
            fetchRoles();
        } catch (error) {
            toast.error("Failed to delete role");
        }
    };

    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            await toggleRoleStatus(id, !currentStatus);
            toast.success("Role status updated");
            fetchRoles();
        } catch (error) {
            toast.error("Failed to update role status");
        }
    };

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const res = await getRoles();
            console.log("Roles API:", res);
            setRoles(res);
        } catch (error) {
            console.error("Error fetching roles:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Manage system roles and permissions</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={fetchRoles}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-medium shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>

                    <button
                        onClick={() => setShowAddRoleModal(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm shadow-blue-200"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Role
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SR No.</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role Name</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">

                        {/* Loading */}
                        {loading && (
                            <tr>
                                <td colSpan={5} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <svg className="w-6 h-6 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        <span className="text-sm">Loading roles...</span>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* Empty */}
                        {!loading && roles.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        <span className="text-sm font-medium">No roles found</span>
                                        <span className="text-xs text-gray-300">Click "Add Role" to create one</span>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* Data */}
                        {!loading && roles.map((role: any, index: number) => (
                            <tr key={role.id} className="hover:bg-gray-50 transition-colors duration-150">

                                <td className="px-5 py-3.5 text-sm text-gray-400 font-medium">
                                    {index + 1}
                                </td>

                                <td className="px-5 py-3.5">
                                    <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">
                                        #{role.id}
                                    </span>
                                </td>

                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800">{role.roleName}</span>
                                    </div>
                                </td>

                                {/* <td className="px-5 py-3.5">
                                    <button
                                        onClick={() => handleToggleStatus(role.id, role.isActive)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                            role.isActive
                                                ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200"
                                                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                                        }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${role.isActive ? "bg-yellow-500" : "bg-green-500"}`} />
                                        {role.isActive ? "Deactivate" : "Activate"}
                                    </button>
                                </td> */}
                                <td className="px-5 py-3.5">
                                    <button
                                        onClick={() => handleToggleStatus(role.id, role.isActive)}
                                        className="group relative flex items-center gap-2.5 cursor-pointer"
                                        title={role.isActive ? "Click to Deactivate" : "Click to Activate"}
                                    >
                                        {/* Track */}
                                        <div
                                            className={`relative w-11 h-6 rounded-full transition-all duration-300 ease-in-out shadow-inner
                ${role.isActive
                                                    ? "bg-green-500 shadow-green-200"
                                                    : "bg-red-400 shadow-red-100"
                                                }`}
                                        >
                                            {/* Glow ring */}
                                            <span
                                                className={`absolute inset-0 rounded-full transition-all duration-300
                    ${role.isActive
                                                        ? "ring-2 ring-green-300 ring-offset-1 opacity-60"
                                                        : "ring-2 ring-red-300 ring-offset-1 opacity-60"
                                                    }`}
                                            />

                                            {/* Thumb */}
                                            <span
                                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md
                    transform transition-all duration-300 ease-in-out
                    flex items-center justify-center
                    ${role.isActive ? "translate-x-5" : "translate-x-0"}
                    group-hover:scale-90`}
                                            >
                                                {role.isActive ? (
                                                    <svg className="w-2.5 h-2.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-2.5 h-2.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                )}
                                            </span>
                                        </div>


                                    </button>
                                </td>

                                <td className="px-5 py-3.5">
                                    <button
                                        onClick={() => handleDelete(role.id)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all duration-200"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        
                                    </button>
                                </td>

                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

            {/* Add Role Modal */}
            {showAddRoleModal && (
                <AddRoleModal
                    closeModal={() => setShowAddRoleModal(false)}
                    refreshRoles={fetchRoles}
                />
            )}

        </DashboardLayout>
    );
}