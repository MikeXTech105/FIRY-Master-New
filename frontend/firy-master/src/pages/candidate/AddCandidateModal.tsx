import { useState } from "react";
import toast from "react-hot-toast";
import { createCandidate } from "../../services/candidateService";

export default function AddCandidateModal({ closeModal, refreshCandidates }:any) {

  const [form,setForm] = useState<any>({});
  const [file,setFile] = useState<any>(null);

  const handleChange = (e:any) => {
    setForm({...form,[e.target.name]:e.target.value});
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try{

      await createCandidate({
        ...form,
        resumeFile:file
      });

      toast.success("Candidate created");

      refreshCandidates();

      closeModal();

    }catch{
      toast.error("Create candidate failed");
    }
  };

  return (

    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

      <div className="bg-white p-6 rounded w-[500px]">

        <h2 className="text-xl font-bold mb-4">
          Add Candidate
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input name="name" placeholder="Name"
          onChange={handleChange}
          className="w-full border p-2 rounded"/>

          <input name="roleId" placeholder="Role Id"
          onChange={handleChange}
          className="w-full border p-2 rounded"/>

          <input name="phoneNumber" placeholder="Phone"
          onChange={handleChange}
          className="w-full border p-2 rounded"/>

          <input name="email" placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2 rounded"/>

          <input name="appPassword" placeholder="app Password"
          onChange={handleChange}
          className="w-full border p-2 rounded"/>

          <input name="subject" placeholder="Subject"
          onChange={handleChange}
          className="w-full border p-2 rounded"/>

          <textarea name="body" placeholder="Body"
          onChange={handleChange}
          className="w-full border p-2 rounded"/>

          <input
          type="file"
          onChange={(e:any)=>setFile(e.target.files[0])}
          />

          <div className="flex justify-end gap-2">

            <button
            type="button"
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>

            <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded">
              Save
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}