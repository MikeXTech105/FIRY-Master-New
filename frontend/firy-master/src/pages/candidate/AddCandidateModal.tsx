import { useState } from "react";
import toast from "react-hot-toast";
import { createCandidate } from "../../services/candidateService";

export default function AddCandidateModal({ closeModal, refreshCandidates }: any) {

  const [form, setForm] = useState<any>({});
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createCandidate({ ...form, resumeFile: file });
      toast.success("Candidate created");
      refreshCandidates();
      closeModal();
    } catch {
      toast.error("Create candidate failed");
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
              <h2 className="text-base font-semibold text-gray-900">Add Candidate</h2>
              <p className="text-xs text-gray-400">Fill in the candidate details below</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">

            {/* Row 1 - Name & Role ID */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Full Name</label>
                <input
                  name="name"
                  placeholder="e.g. John Doe"
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Role ID</label>
                <input
                  name="roleId"
                  placeholder="e.g. 3"
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Row 2 - Phone & Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Phone Number</label>
                <input
                  name="phoneNumber"
                  placeholder="e.g. 9876543210"
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Email</label>
                <input
                  name="email"
                  placeholder="e.g. john@email.com"
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* App Password */}
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">App Password</label>
              <input
                name="appPassword"
                placeholder="App password"
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Subject</label>
              <input
                name="subject"
                placeholder="Email subject"
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Body */}
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Body</label>
              <textarea
                name="body"
                placeholder="Email body content..."
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Resume</label>
              <label className="flex items-center gap-3 w-full px-3 py-2.5 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm text-gray-400">
                  {file ? (
                    <span className="text-blue-600 font-medium">{file.name}</span>
                  ) : (
                    "Click to upload resume (PDF)"
                  )}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e: any) => setFile(e.target.files[0])}
                />
              </label>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
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
                  Save Candidate
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}