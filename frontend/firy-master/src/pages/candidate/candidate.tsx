import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import toast from "react-hot-toast";
import AddCandidateModal from "../candidate/AddCandidateModal";

import {
    getCandidates,
    deleteCandidate,
    toggleCandidateStatus
    // viewResume
} from "../../services/candidateService";

export default function Candidate() {

    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [showResumeModal, setShowResumeModal] = useState(false);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const res = await getCandidates();
            console.log("Candidates:", res);
            setCandidates(res);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load candidates");
        } finally {
            setLoading(false);
        }
    };

    const handleViewResume = (resumeFilePath: string) => {
        const url = `${import.meta.env.VITE_API_BASE_URL}/Candidate/view-resume?resumeFilePath=${encodeURIComponent(resumeFilePath)}`;
        setResumeUrl(url);
        setShowResumeModal(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteCandidate(id);
            toast.success("Candidate deleted successfully");
            getCandidates();
        } catch (error) {
            toast.error("Error deleting candidate");
        }
    };

    const handleToggleStatus = async (id: number, current: boolean) => {
        try {
            await toggleCandidateStatus(id, !current);
            toast.success("Status updated");
            fetchCandidates();
        } catch (error) {
            console.error(error);
            toast.error("Status update failed");
        }
    };

    return (
        <DashboardLayout>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Manage all job candidates</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={fetchCandidates}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-medium shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>

                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm shadow-blue-200"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Candidate
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SR</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Resume</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">

                        {/* Loading */}
                        {loading && (
                            <tr>
                                <td colSpan={8} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <svg className="w-6 h-6 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        <span className="text-sm">Loading candidates...</span>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* Empty */}
                        {!loading && candidates.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="text-sm font-medium">No candidates found</span>
                                        <span className="text-xs text-gray-300">Click "Add Candidate" to get started</span>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* Data */}
                        {!loading && candidates.map((c: any, index: number) => (
                            <tr key={c.id ?? index} className="hover:bg-gray-50 transition-colors duration-150">

                                <td className="px-5 py-3.5 text-sm text-gray-400 font-medium">
                                    {index + 1}
                                </td>

                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            <span className="text-blue-600 text-xs font-bold">
                                                {c.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800">{c.name}</span>
                                    </div>
                                </td>

                                <td className="px-5 py-3.5">
                                    <span className="text-sm text-gray-600">{c.phoneNumber}</span>
                                </td>

                                <td className="px-5 py-3.5">
                                    <span className="text-sm text-gray-600">{c.email}</span>
                                </td>

                                <td className="px-5 py-3.5">
                                    <span className="text-sm text-gray-600">{c.subject}</span>
                                </td>

                                <td className="px-5 py-3.5">
                                    {c.resumeFilePath ? (
                                        <button
                                            onClick={() => handleViewResume(c.resumeFilePath)}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-all duration-200"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View
                                        </button>
                                    ) : (
                                        <span className="text-gray-300 text-sm">—</span>
                                    )}
                                </td>

                                <td className="px-5 py-3.5">
                                    {c.isActive ? (
                                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            Inactive
                                        </span>
                                    )}
                                </td>

                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(c.id, c.isActive)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                                c.isActive
                                                    ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200"
                                                    : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                                            }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? "bg-yellow-500" : "bg-green-500"}`} />
                                            {c.isActive ? "Deactivate" : "Activate"}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all duration-200"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

            {/* Add Candidate Modal */}
            {showModal && (
                <AddCandidateModal
                    closeModal={() => setShowModal(false)}
                    refreshCandidates={fetchCandidates}
                />
            )}

            {/* Resume Preview Modal */}
            {showResumeModal && resumeUrl && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-[82%] h-[88%] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">Resume Preview</h2>
                                    <p className="text-xs text-gray-400">Candidate document</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowResumeModal(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* PDF */}
                        <div className="flex-1">
                            <iframe
                                src={resumeUrl}
                                width="100%"
                                height="100%"
                                title="Resume"
                                className="border-0"
                            />
                        </div>

                    </div>
                </div>
            )}

        </DashboardLayout>
    );
}