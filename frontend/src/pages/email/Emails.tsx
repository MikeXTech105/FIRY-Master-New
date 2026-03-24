import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import AddEmailModal from "./AddEmailModal";
import { getRoles } from "../../services/roleService";
import { getEmails } from "../../services/emailService";

export default function Emails() {

    const [showModal, setShowModal] = useState(false);
    const [emails, setEmails] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [searchText, setSearchText] = useState("");
    const [roles, setRoles] = useState<any[]>([]);
    const [selectedRole, setSelectedRole] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => { fetchRoles(); }, []);
    useEffect(() => { fetchEmails(); }, [searchText, selectedRole, page, pageSize]);

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
                searchText,
                roleId: selectedRole ? Number(selectedRole) : 0,
                pageNumber: page,
                pageSize
            });
            const emailData = res.data || res;
            setEmails(emailData);
            const totalCount = res.total ?? res.totalCount ?? res.count ?? res.totalRecords ?? emailData.length;
            setTotal(totalCount);
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
        const s = Math.max(1, page - 2);
        const e = Math.min(totalPages, page + 2);
        for (let i = s; i <= e; i++) pages.push(i);
        return pages;
    };

    // const getRoleName = (roleId: number) => {
    //     const role = roles.find((r: any) => r.id === roleId);
    //     return role?.roleName || roleId;
    // };

    return (
        <DashboardLayout>

            {/* ── Top: Title+Refresh | Add Email ── */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Manage all job candidates</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={fetchEmails}
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
                        Add Email
                    </button>
                </div>
            </div>

            {/* ── ONE CARD ── */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

                {/* Filter Bar */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50 gap-3">

                    {/* Left: Search + Role */}
                    <div className="flex items-center gap-3 flex-1">
                        {/* Role Dropdown */}
                        <div className="relative">
                            <select
                                value={selectedRole}
                                onChange={(e) => { setSelectedRole(e.target.value); setPage(1); }}
                                className="appearance-none pl-3 pr-9 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
                            >
                                <option value="">All Roles</option>
                                {roles.map((role: any) => (
                                    <option key={role.id} value={role.id}>{role.roleName}</option>
                                ))}
                            </select>
                            <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        {/* Search — takes available space */}
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm flex-1 max-w-sm">
                            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.15 10.15z" />
                            </svg>
                            <input
                                placeholder="Search email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") { setSearchText(search); setPage(1); } }}
                                className="text-sm text-gray-700 placeholder-gray-400 focus:outline-none w-full"
                            />
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={() => { setSearchText(search); setPage(1); }}
                            className="px-5 py-2 bg-blue-600 border border-gray-200 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm whitespace-nowrap"
                        >
                            Search
                        </button>



                    </div>

                    {/* Right: Page Size */}
                    <div className="relative">
                        <select
                            value={pageSize}
                            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                            className="appearance-none pl-3 pr-9 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                        </select>
                        <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                </div>

                {/* Table */}
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SR</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">

                        {loading && (
                            <tr>
                                <td colSpan={3} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <svg className="w-6 h-6 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        <span className="text-sm">Loading emails...</span>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {!loading && emails.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm font-medium">No emails found</span>
                                        <span className="text-xs text-gray-300">Try a different search or add a new email</span>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {!loading && emails.map((item: any, index: number) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-5 py-3.5 text-sm text-gray-400 font-medium">
                                    {(page - 1) * pageSize + index + 1}
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm text-gray-700">{item.email}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold">
                                       {item.roleName || item.roleId}
                                    </span>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-400">
                        Showing <span className="font-medium text-gray-600">{start}</span> to <span className="font-medium text-gray-600">{end}</span> of <span className="font-medium text-gray-600">{total}</span> entries
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button disabled={page === 1} onClick={() => setPage(1)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">First</button>
                        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">Previous</button>
                        {getPageNumbers().map((p) => (
                            <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-all duration-200 ${page === p ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>{p}</button>
                        ))}
                        <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">Next</button>
                        <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(totalPages)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">Last</button>
                    </div>
                </div>

            </div>

            {showModal && (
                <AddEmailModal
                    closeModal={() => setShowModal(false)}
                    refreshEmails={fetchEmails}
                />
            )}

        </DashboardLayout>
    );
}
