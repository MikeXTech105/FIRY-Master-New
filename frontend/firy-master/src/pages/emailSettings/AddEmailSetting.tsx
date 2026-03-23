import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createEmailSetting, updateEmailSetting } from "../../services/emailSettingsService";

type Props = {
  closeModal: () => void;
  refreshSettings: () => void;
  editData?: any; // NEW
};

export default function AddEmailSettingModal({ closeModal, refreshSettings, editData }: Props) {

  const isEdit = !!editData; // true hoy to Edit mode

  const [form, setForm] = useState({ key: "", value: "" });
  const [loading, setLoading] = useState(false);

  // Edit mode: pre-fill karo
  useEffect(() => {
    if (editData) {
      setForm({ key: editData.key, value: editData.value });
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (isEdit) {
        await updateEmailSetting({ id: editData.id, key: form.key, value: form.value });
        toast.success("Updated successfully");
      } else {
        await createEmailSetting(form);
        toast.success("Added successfully");
      }

      refreshSettings();
      closeModal();
    } catch {
      toast.error(isEdit ? "Update failed" : "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              {/* Dynamic title */}
              <h2 className="text-base font-semibold text-gray-900">
                {isEdit ? "Edit Email Setting" : "Add Email Setting"}
              </h2>
              <p className="text-xs text-gray-400">
                {isEdit ? "Update the email setting below" : "Configure a new email setting"}
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

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Key</label>
              <input
                placeholder="e.g. SMTP_HOST"
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Value</label>
              <input
                placeholder="e.g. smtp.gmail.com"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
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
                  {isEdit ? "Update Setting" : "Save Setting"}
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}