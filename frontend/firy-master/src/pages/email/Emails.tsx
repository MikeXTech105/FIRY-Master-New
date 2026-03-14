import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import AddEmailModal from "./AddEmailModal";

export default function Emails() {

    const [showModal, setShowModal] = useState(false);

    return (
        <DashboardLayout>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Emails</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Manage email configurations</p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm shadow-blue-200"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Email
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full">

                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SR</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role ID</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td colSpan={3} className="text-center py-12">
                                <div className="flex flex-col items-center gap-2 text-gray-400">
                                    <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm font-medium">No emails yet</span>
                                    <span className="text-xs text-gray-300">Click "Add Email" to get started</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>

            {/* Add Email Modal */}
            {showModal && (
                <AddEmailModal
                    closeModal={() => setShowModal(false)}
                    refreshEmails={() => { }}
                />
            )}

        </DashboardLayout>
    );
}