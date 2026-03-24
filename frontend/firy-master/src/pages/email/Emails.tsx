import { useCallback, useEffect, useMemo, useState } from "react";
import type { EmailRecord, Role } from "../../types";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getEmails } from "../../services/emailService";
import { getRoles } from "../../services/roleService";
import AddEmailModal from "./AddEmailModal";

export default function Emails() {
  const [showModal, setShowModal] = useState(false);
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getEmails({
        searchText,
        roleId: selectedRole ? Number(selectedRole) : 0,
        pageNumber: page,
        pageSize,
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
  }, [page, pageSize, searchText, selectedRole]);

  const totalPages = Math.ceil(total / pageSize);
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);
    for (let pageNumber = startPage; pageNumber <= endPage; pageNumber += 1) pages.push(pageNumber);
    return pages;
  };



  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const emailMetrics = useMemo(() => {
    const uniqueRoles = new Set(emails.map((item) => item.roleName || item.roleId)).size;
    return [
      { label: "Visible emails", value: emails.length },
      { label: "Roles covered", value: uniqueRoles },
      { label: "Total records", value: total },
    ];
  }, [emails, total]);

  return (
    <DashboardLayout
      title="Email outreach"
      subtitle="Search message targets, filter by role, and manage outbound communication with a cleaner campaign view."
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={fetchEmails} className="btn-secondary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992V4.356m-.983 4.009A9 9 0 1 0 6.58 17.42" />
            </svg>
            Refresh
          </button>
          <button type="button" onClick={() => setShowModal(true)} className="btn-primary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add email
          </button>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        {emailMetrics.map((item) => (
          <article key={item.label} className="metric-card">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="page-card">
        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">Campaign targeting</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Email directory</h2>
            </div>

            <div className="grid gap-3 md:grid-cols-[220px_minmax(260px,1fr)_auto_120px]">
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(event) => {
                    setSelectedRole(event.target.value);
                    setPage(1);
                  }}
                  className="select-shell"
                >
                  <option value="">All roles</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>

              <input
                placeholder="Search email address"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setSearchText(search);
                    setPage(1);
                  }
                }}
                className="input-shell"
              />

              <button
                type="button"
                onClick={() => {
                  setSearchText(search);
                  setPage(1);
                }}
                className="btn-primary"
              >
                Search
              </button>

              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="select-shell"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={30}>30 / page</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-shell">
            <thead>
              <tr>
                <th>SR</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <svg className="h-7 w-7 animate-spin text-cyan-300" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Loading emails...</span>
                    </div>
                  </td>
                </tr>
              ) : null}

              {!loading && emails.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-16 text-center text-slate-400">
                    No emails found. Try changing filters or add a new email record.
                  </td>
                </tr>
              ) : null}

              {!loading &&
                emails.map((item, index: number) => (
                  <tr key={item.id}>
                    <td>{(page - 1) * pageSize + index + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 7.5v9A2.25 2.25 0 0 1 19.5 18.75h-15A2.25 2.25 0 0 1 2.25 16.5v-9m19.5 0A2.25 2.25 0 0 0 19.5 5.25h-15A2.25 2.25 0 0 0 2.25 7.5m19.5 0v.243a2.25 2.25 0 0 1-.988 1.87l-7.5 5.001a2.25 2.25 0 0 1-2.524 0l-7.5-5a2.25 2.25 0 0 1-.988-1.871V7.5" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{item.email}</p>
                          <p className="text-xs text-slate-400">Message target</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge border-cyan-400/20 bg-cyan-500/10 text-cyan-100">{item.roleName || item.roleId}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-400">
            Showing <span className="font-semibold text-white">{start}</span> to <span className="font-semibold text-white">{end}</span> of <span className="font-semibold text-white">{total}</span> entries
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" disabled={page === 1} onClick={() => setPage(1)} className="btn-secondary !px-3 !py-2 text-xs disabled:opacity-40">
              First
            </button>
            <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)} className="btn-secondary !px-3 !py-2 text-xs disabled:opacity-40">
              Previous
            </button>
            {getPageNumbers().map((pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={page === pageNumber ? "btn-primary !px-3 !py-2 text-xs" : "btn-secondary !px-3 !py-2 text-xs"}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              className="btn-secondary !px-3 !py-2 text-xs disabled:opacity-40"
            >
              Next
            </button>
            <button
              type="button"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(totalPages)}
              className="btn-secondary !px-3 !py-2 text-xs disabled:opacity-40"
            >
              Last
            </button>
          </div>
        </div>
      </section>

      {showModal ? <AddEmailModal closeModal={() => setShowModal(false)} refreshEmails={fetchEmails} /> : null}
    </DashboardLayout>
  );
}
