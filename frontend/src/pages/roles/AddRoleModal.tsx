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
            toast.error("Failed to create role");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">Add Role</h2>
                            <p className="text-xs text-gray-400">Create a new system role</p>
                        </div>
                    </div>
                    <button
                        onClick={closeModal}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-5">
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                        Role Name
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Admin, Manager, Viewer"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-blue-200"
                    >
                        {loading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Save Role
                            </>
                        )}
                    </button>
                </div>

            </div>

        </div>
    );
}