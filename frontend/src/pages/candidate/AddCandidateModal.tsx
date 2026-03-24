import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createCandidate, updateCandidate } from "../../services/candidateService";
import { getRoles } from "../../services/roleService";

export default function AddCandidateModal({ closeModal, refreshCandidates, editData }: any) {

  const isEdit = !!editData; // true hoy to Edit mode

  const [form, setForm] = useState<any>({});
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    fetchRoles();

    // Edit mode: form pre-fill karo
    if (editData) {
      setForm({
        name: editData.name,
        phoneNumber: editData.phoneNumber,
        email: editData.email,
        appPassword: editData.appPassword,
        subject: editData.subject,
        body: editData.body,
      });
      setSelectedRole(editData.roleId?.toString() || "");
    }
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (isEdit) {
        await updateCandidate({
          ...form,
          id: editData.id,
          roleId: Number(selectedRole),
          resumeFile: file,
          resumeFilePath: editData.resumeFilePath,
          isActive: editData.isActive,
        });
        toast.success("Candidate updated");
      } else {
        await createCandidate({
          ...form,
          roleId: Number(selectedRole),
          resumeFile: file,
        });
        toast.success("Candidate created");
      }

      refreshCandidates();
      closeModal();
    } catch {
      toast.error(isEdit ? "Update failed" : "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              {/* Title dynamically change thay */}
              <h2 className="text-base font-semibold text-gray-900">
                {isEdit ? "Edit Candidate" : "Add Candidate"}
              </h2>
              <p className="text-xs text-gray-400">
                {isEdit ? "Update the candidate details below" : "Fill in the candidate details below"}
              </p>
            </div>
          </div>
          <button type="button" onClick={closeModal}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body — same form, value prop add thay pre-fill mate */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Full Name</label>
                <input name="name" placeholder="e.g. John Doe"
                  value={form.name || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Role</label>
                <div className="relative">
                  <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white appearance-none cursor-pointer pr-10">
                    <option value="">Select Role</option>
                    {roles?.map((role: any) => (
                      <option key={role.id} value={role.id}>{role.roleName}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Phone Number</label>
                <input name="phoneNumber" placeholder="e.g. 9876543210"
                  value={form.phoneNumber || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Email</label>
                <input name="email" placeholder="e.g. john@email.com"
                  value={form.email || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">App Password</label>
              <input name="appPassword" placeholder="App password"
                value={form.appPassword || ""}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Subject</label>
              <input name="subject" placeholder="Email subject"
                value={form.subject || ""}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Body</label>
              <textarea name="body" placeholder="Email body content..."
                value={form.body || ""}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none" />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Resume</label>
              <label className="flex items-center gap-3 w-full px-3 py-2.5 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm text-gray-400">
                  {file ? (
                    <span className="text-blue-600 font-medium">{file.name}</span>
                  ) : isEdit && editData?.resumeFilePath ? (
                    <span className="text-green-600 font-medium">Current resume uploaded — click to replace</span>
                  ) : (
                    "Click to upload resume (PDF)"
                  )}
                </span>
                <input type="file" className="hidden" onChange={(e: any) => setFile(e.target.files[0])} />
              </label>
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button type="button" onClick={closeModal}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-all duration-200">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-blue-200">
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
                  {isEdit ? "Update Candidate" : "Save Candidate"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}