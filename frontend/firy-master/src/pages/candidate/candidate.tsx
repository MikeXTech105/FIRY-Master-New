import { useEffect, useMemo, useState } from "react";
import type { Candidate } from "../../types";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import { deleteCandidate, getCandidates, toggleCandidateStatus } from "../../services/candidateService";
import AddCandidateModal from "./AddCandidateModal";

export default function Candidate() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
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
    const confirmed = confirm("Are you sure you want to delete this candidate?");
    if (!confirmed) return;

    try {
      await deleteCandidate(id);
      toast.success("Candidate deleted successfully");
      fetchCandidates();
    } catch (error) {
      console.error(error);
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

  const candidateMetrics = useMemo(() => {
    const active = candidates.filter((candidate) => candidate.isActive).length;
    const withResume = candidates.filter((candidate) => candidate.resumeFilePath).length;
    return [
      { label: "Total candidates", value: candidates.length },
      { label: "Active candidates", value: active },
      { label: "Resumes uploaded", value: withResume },
    ];
  }, [candidates]);

  return (
    <DashboardLayout
      title="Candidate pipeline"
      subtitle="Review applicants, preview resumes, and keep hiring activity moving with a cleaner, more actionable workflow."
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={fetchCandidates} className="btn-secondary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992V4.356m-.983 4.009A9 9 0 1 0 6.58 17.42" />
            </svg>
            Refresh
          </button>
          <button type="button" onClick={() => setShowModal(true)} className="btn-primary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add candidate
          </button>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        {candidateMetrics.map((item) => (
          <article key={item.label} className="metric-card">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="page-card">
        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">Recruiting queue</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">All candidates</h2>
          </div>
          <span className="badge">{candidates.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-shell">
            <thead>
              <tr>
                <th>SR</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <svg className="h-7 w-7 animate-spin text-cyan-300" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Loading candidates...</span>
                    </div>
                  </td>
                </tr>
              ) : null}

              {!loading && candidates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    No candidates found. Add the first candidate to begin the pipeline.
                  </td>
                </tr>
              ) : null}

              {!loading &&
                candidates.map((candidate, index: number) => (
                  <tr key={candidate.id ?? index}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-sm font-semibold text-cyan-200">
                          {candidate.name?.charAt(0)?.toUpperCase() || "C"}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{candidate.name}</p>
                          <p className="text-xs text-slate-400">Applicant profile</p>
                        </div>
                      </div>
                    </td>
                    <td>{candidate.phoneNumber}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.subject}</td>
                    <td>
                      {candidate.resumeFilePath ? (
                        <button type="button" onClick={() => handleViewResume(candidate.resumeFilePath ?? "")} className="btn-secondary !px-3 !py-2 text-xs">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1 1 0 0 1 0-.644C3.423 7.51 7.36 4.5 12 4.5s8.577 3.01 9.964 7.178a1 1 0 0 1 0 .644C20.577 16.49 16.64 19.5 12 19.5S3.423 16.49 2.036 12.322Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                          Preview
                        </button>
                      ) : (
                        <span className="text-slate-500">Not uploaded</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${candidate.isActive ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" : "border-rose-400/20 bg-rose-500/10 text-rose-200"}`}>
                        <span className={`h-2 w-2 rounded-full ${candidate.isActive ? "bg-emerald-300" : "bg-rose-300"}`} />
                        {candidate.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(candidate.id, candidate.isActive)}
                          className={`btn-secondary !px-3 !py-2 text-xs ${candidate.isActive ? "!border-amber-400/20 !bg-amber-500/10 !text-amber-200" : "!border-emerald-400/20 !bg-emerald-500/10 !text-emerald-200"}`}
                        >
                          {candidate.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button type="button" onClick={() => handleDelete(candidate.id)} className="btn-danger !px-3 !py-2 text-xs">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {showModal ? <AddCandidateModal closeModal={() => setShowModal(false)} refreshCandidates={fetchCandidates} /> : null}

      {showResumeModal && resumeUrl ? (
        <div className="modal-backdrop">
          <div className="modal-card h-[88vh] max-w-6xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">Resume preview</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Candidate document viewer</h3>
              </div>
              <button type="button" onClick={() => setShowResumeModal(false)} className="btn-secondary !px-3 !py-2 text-xs">
                Close
              </button>
            </div>
            <iframe src={resumeUrl} className="h-full w-full bg-white" title="Resume preview" />
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
