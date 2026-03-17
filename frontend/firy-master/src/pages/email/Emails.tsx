import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import AddEmailModal from "./AddEmailModal";
import { getRoles } from "../../services/roleService";
import { getEmails } from "../../services/emailService";

export default function Emails() {

    const [showModal, setShowModal] = useState(false);
    const [emails, setEmails] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // const [search, setSearch] = useState("");
    const [search, setSearch] = useState("");        // input value
    const [searchText, setSearchText] = useState(""); // API value
    const [roles, setRoles] = useState<any[]>([]);
    const [selectedRole, setSelectedRole] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);


    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        fetchEmails();
    }, [searchText, selectedRole, page, pageSize]);


    const fetchRoles = async () => {
        try {
            const res = await getRoles();
            setRoles(res);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchEmails = async () => {
        try {
            setLoading(true);

            const res = await getEmails({
                searchText: searchText,
                roleId: selectedRole ? Number(selectedRole) : 0,
                pageNumber: page,
                pageSize: pageSize
            });

            console.log("EMAILS 👉", res);

            // ✅ Handle both cases (array OR object)
            const emailData = res.data || res;

            setEmails(emailData);

            // ✅ FIX TOTAL
            setTotal(
                res.totalCount || emailData.length
            );

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(total / pageSize);
    const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    const getPageNumbers = () => {
        const pages = [];

        let start = Math.max(1, page - 2);
        let end = Math.min(totalPages, page + 2);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };
    return (
        <DashboardLayout>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Emails</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Manage email configurations</p>
                </div>
                <div className="flex gap-3 items-center">

                    {/* Search */}
                    <div className="flex gap-2">

                        <input
                            placeholder="Search email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-3 py-2 border rounded-xl text-sm"
                        />

                        <button
                            onClick={() => {
                                setSearchText(search); // 🔥 trigger API
                                setPage(1);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
                        >
                            Search
                        </button>

                    </div>

                    {/* Role Filter */}
                    <select
                        value={selectedRole}
                        onChange={(e) => {
                            setSelectedRole(e.target.value);
                            setPage(1);
                        }}
                        className="px-3 py-2 border rounded-xl text-sm"
                    >
                        <option value="">All Roles</option>
                        {roles.map((role: any) => (
                            <option key={role.id} value={role.id}>
                                {role.roleName}
                            </option>
                        ))}
                    </select>

                    {/* Page Size */}
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                        className="px-3 py-2 border rounded-xl text-sm"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                    </select>

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
                        {emails.length > 0 ? (
                            emails.map((item: any, index: number) => (
                                <tr key={item.id} className="border-b">
                                    <td className="px-5 py-3">{(page - 1) * pageSize + index + 1}</td>
                                    <td className="px-5 py-3">{item.email}</td>
                                    <td className="px-5 py-3">{item.roleName || item.roleId}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center py-10 text-gray-400">
                                    No emails found
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
                {/* // Pagination */}
                <div className="flex items-center justify-between mt-6">

                    {/* Showing text */}
                    <p className="text-sm text-gray-500">
                        Showing {start} to {end} of {total} results
                    </p>

                    {/* Pagination */}
                    <div className="flex items-center gap-2">

                        {/* Previous */}
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
                        >
                            Previous
                        </button>

                        {/* First page */}
                        {page > 3 && (
                            <>
                                <button onClick={() => setPage(1)} className="px-3 py-1 border rounded-lg text-sm">
                                    1
                                </button>
                                <span className="px-2">...</span>
                            </>
                        )}

                        {/* Dynamic pages */}
                        {getPageNumbers().map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-3 py-1 border rounded-lg text-sm ${page === p ? "bg-blue-600 text-white" : ""
                                    }`}
                            >
                                {p}
                            </button>
                        ))}

                        {/* Last page */}
                        {page < totalPages - 2 && (
                            <>
                                <span className="px-2">...</span>
                                <button onClick={() => setPage(totalPages)} className="px-3 py-1 border rounded-lg text-sm">
                                    {totalPages}
                                </button>
                            </>
                        )}

                        {/* Next */}
                        <button
                            disabled={page === totalPages || totalPages === 0}
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
                        >
                            Next
                        </button>

                    </div>
                </div>
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