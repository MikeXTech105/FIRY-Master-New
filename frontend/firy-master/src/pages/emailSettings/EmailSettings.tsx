import { useEffect, useState } from "react";
import { getEmailSettings, deleteEmailSetting } from "../../services/emailSettingsService";
import DashboardLayout from "../../layouts/DashboardLayout";
import toast from "react-hot-toast";
import AddEmailSettingModal from "../emailSettings/AddEmailSetting";

export default function EmailSettings() {
  const [settings, setSettings] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editSetting, setEditSetting] = useState<any | null>(null); // NEW

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getEmailSettings();
      setSettings(data);
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete?")) return;
    try {
      await deleteEmailSetting(id);
      toast.success("Deleted successfully");
      fetchSettings();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your email configuration keys</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm shadow-blue-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Email Setting
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Key</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
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
                    <span className="text-sm">Loading settings...</span>
                  </div>
                </td>
              </tr>
            )}

            {!loading && settings.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <span className="text-sm font-medium">No settings found</span>
                    <span className="text-xs text-gray-300">Click "Add Email Setting" to get started</span>
                  </div>
                </td>
              </tr>
            )}

            {!loading && settings.map((item: any) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">

                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
                    {item.key}
                  </span>
                </td>

                <td className="px-5 py-3.5">
                  <span className="text-sm text-gray-700">{item.value}</span>
                </td>

                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">

                    {/* Edit Button — NEW */}
                    <button
                      onClick={() => setEditSetting(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-all duration-200"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z" />
                      </svg>
                      {/* Edit */}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all duration-200"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                  </div>
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {/* Modal — Add ya Edit dono handle kare */}
      {(showModal || editSetting) && (
        <AddEmailSettingModal
          closeModal={() => { setShowModal(false); setEditSetting(null); }}
          refreshSettings={fetchSettings}
          editData={editSetting} // NEW prop
        />
      )}

    </DashboardLayout>
  );
}