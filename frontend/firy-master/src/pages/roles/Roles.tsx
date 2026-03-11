import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getRoles } from "../../services/roleService";
import AddRoleModal from "../roles/AddRoleModal";
import { deleteRole } from "../../services/roleService";
import { toggleRoleStatus } from "../../services/roleService";
import api from "../../services/api";
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

                <h1 className="text-2xl font-bold">
                    Roles
                </h1>

                <div className="flex gap-2">

                    <button
                        onClick={fetchRoles}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Refresh
                    </button>

                    <button
                        onClick={() => setShowAddRoleModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Add Role
                    </button>

                </div>

            </div>

            {/* Table */}
            <div className="bg-white shadow rounded overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">SR No.</th>
                            <th className="p-3 text-left">id</th>
                            <th className="p-3 text-left">Role Name</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {/* Loading */}
                        {loading && (
                            <tr>
                                <td colSpan={4} className="text-center p-6">
                                    Loading roles...
                                </td>
                            </tr>
                        )}

                        {/* Empty */}
                        {!loading && roles.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center p-6">
                                    No roles found
                                </td>
                            </tr>
                        )}

                        {/* Data */}
                        {!loading &&
                            roles.map((role: any, index: number) => (
                                <tr key={role.id} className="border-t hover:bg-gray-50">
                                    {/* SR No */}
                                    <td className="p-3">
                                        {index + 1}
                                    </td>

                                    <td className="p-3">
                                        {role.id}
                                    </td>

                                    <td className="p-3 font-medium">
                                        {role.roleName}
                                    </td>

                                    <td className="p-3 flex gap-2">

                                        <button
                                            onClick={() => handleToggleStatus(role.id, role.isActive)}
                                            className={`px-3 py-1 rounded text-white text-sm 
  ${role.isActive ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}
                                        >
                                            {role.isActive ? "Deactivate" : "Activate"}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(role.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                        >
                                            🗑 Delete
                                        </button>

                                    </td>

                                    {/* Actions */}
                                    <td className="p-3">

                                        <button
                                            onClick={() => handleDelete(role.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                        >
                                            🗑 Delete
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
// export const toggleRoleStatus = async (id: number) => {
//     const response = await api.post(`/Role/ActivateRole`, null, {
//         params: { ID: id }
//     });

//     return response.data;
// };