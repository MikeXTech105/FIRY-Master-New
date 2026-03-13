import { useState } from "react";
import toast from "react-hot-toast";
import { addEmails } from "../../services/emailService";

interface Props {
  closeModal: () => void;
  refreshEmails: () => void;
}

export default function AddEmailModal({ closeModal, refreshEmails }: Props) {

  const [emails, setEmails] = useState("");
  const [roleId, setRoleId] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    if (!emails) {
      toast.error("Email is required");
      return;
    }

    try {

      setLoading(true);

      await addEmails({
        emails,
        roleId
      });

      toast.success("Email added successfully");

      refreshEmails();
      closeModal();

    } catch (error) {

      console.error(error);
      toast.error("Failed to add email");

    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

      <div className="bg-white p-6 rounded w-96">

        <h2 className="text-xl font-bold mb-4">
          Add Email
        </h2>

        <input
          type="text"
          placeholder="Enter Email"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <input
          type="number"
          placeholder="Role ID"
          value={roleId}
          onChange={(e) => setRoleId(Number(e.target.value))}
          className="border p-2 w-full mb-4"
        />

        <div className="flex justify-end gap-2">

          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>

        </div>

      </div>

    </div>
  );
}