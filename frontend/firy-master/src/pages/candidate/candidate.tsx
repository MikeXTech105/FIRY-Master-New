import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import toast from "react-hot-toast";
import AddCandidateModal from "../candidate/AddCandidateModal";


import {
    getCandidates,
    deleteCandidate,
    toggleCandidateStatus,
    viewResume
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
    // const handleViewResume = (resumeFilePath: string) => {

    //     const baseUrl = "http://192.168.1.71:5000";

    //     window.open(`${baseUrl}${resumeFilePath}`, "_blank");

    // };
    const handleViewResume = (resumeFilePath: string) => {

        const url = `${import.meta.env.VITE_API_BASE_URL}/Candidate/view-resume?resumeFilePath=${encodeURIComponent(resumeFilePath)}`;

        setResumeUrl(url);
        setShowResumeModal(true);

    };
    // const handleDelete = async (id: number) => {

    //     const confirmDelete = confirm("Are you sure you want to delete this candidate?");

    //     if (!confirmDelete) return;

    //     try {

    //         await deleteCandidate(id);

    //         toast.success("Candidate deleted successfully");

    //         fetchCandidates();

    //     } catch (error) {

    //         toast.error("Delete failed");

    //         console.error(error);

    //     }

    // };
    const handleDelete = async (id: number) => {
        try {
            await deleteCandidate(id);
            toast.success("Candidate deleted successfully");
            getCandidates(); // refresh list
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

                <h1 className="text-2xl font-bold">
                    Candidates
                </h1>

                <div className="flex gap-2">

                    <button
                        onClick={fetchCandidates}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Refresh
                    </button>

                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Add Candidate
                    </button>

                </div>

            </div>

            {/* Table */}
            <div className="bg-white shadow rounded overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">SR</th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Phone</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Subject</th>
                            <th className="p-3 text-left">Resume</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {/* Loading */}
                        {loading && (
                            <tr>
                                <td colSpan={8} className="text-center p-6">
                                    Loading candidates...
                                </td>
                            </tr>
                        )}

                        {/* Empty */}
                        {!loading && candidates.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center p-6">
                                    No candidates found
                                </td>
                            </tr>
                        )}

                        {/* Data */}
                        {!loading &&
                            candidates.map((c: any, index: number) => (
                                <tr key={c.id ?? index} className="border-t hover:bg-gray-50">

                                    <td className="p-3">
                                        {index + 1}
                                    </td>

                                    <td className="p-3 font-medium">
                                        {c.name}
                                    </td>

                                    <td className="p-3">
                                        {c.phoneNumber}
                                    </td>

                                    <td className="p-3">
                                        {c.email}
                                    </td>

                                    <td className="p-3">
                                        {c.subject}
                                    </td>

                                    <td className="p-3">
                                        {c.resumeFilePath ? (
                                            <button
                                                onClick={() => handleViewResume(c.resumeFilePath)}
                                                className="text-blue-600 underline"
                                            >
                                                View
                                            </button>
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                    <td className="p-3">
                                        {c.isActive ? (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm">
                                                Inactive
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-3 flex gap-2">

                                        <button
                                            onClick={() => handleToggleStatus(c.id, c.isActive)}
                                            className={`px-3 py-1 rounded text-white text-sm
                      ${c.isActive
                                                    ? "bg-yellow-500 hover:bg-yellow-600"
                                                    : "bg-green-500 hover:bg-green-600"
                                                }`}
                                        >
                                            {c.isActive ? "Deactivate" : "Activate"}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                        >
                                            Delete
                                        </button>


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

            {/* Resume Preview */}
            {showResumeModal && resumeUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

                    <div className="bg-white w-[80%] h-[85%] rounded shadow-lg flex flex-col">

                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b">

                            <h2 className="text-lg font-semibold">
                                Resume Preview
                            </h2>

                            <button
                                onClick={() => setShowResumeModal(false)}
                                className="text-red-500 font-bold"
                            >
                                ✖ Close
                            </button>

                        </div>

                        {/* PDF */}
                        <div className="flex-1">
                            <iframe
                                src={resumeUrl}
                                width="100%"
                                height="100%"
                                title="Resume"
                                className="border"
                            />
                        </div>

                    </div>

                </div>
            )}
        </DashboardLayout>
    );
}