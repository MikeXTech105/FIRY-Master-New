import { useState } from "react";
import { createRole } from "../../services/roleService";
import toast from "react-hot-toast";

export default function AddRoleModal({ closeModal, refreshRoles }: any) {

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
            toast.error("Failed to create role");;
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">

            <div className="bg-white p-6 rounded shadow w-96">

                <h2 className="text-xl font-bold mb-4">
                    Add Role
                </h2>

                <input
                    type="text"
                    placeholder="Role name"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="border w-full p-2 rounded mb-4"
                />

                <div className="flex justify-end gap-2">

                    <button
                        onClick={closeModal}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>

                </div>

            </div>

        </div>
    );
}