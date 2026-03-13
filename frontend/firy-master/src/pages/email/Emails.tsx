import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import AddEmailModal from "./AddEmailModal";

export default function Emails() {

    const [showModal, setShowModal] = useState(false);

    return (
        <DashboardLayout>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Emails</h1>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add Email
                </button>
            </div>

            {showModal && (
                <AddEmailModal
                    closeModal={() => setShowModal(false)}
                    refreshEmails={() => { }}
                />
            )}

            <div className="bg-white shadow rounded overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">SR</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">RoleId</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td className="p-3 text-gray-500">No emails yet</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>

                </table>

            </div>

        </DashboardLayout>
    );
}