export default function Header() {
  return (
    <div className="flex items-center justify-between bg-white shadow px-6 py-3">

      <h1 className="text-xl font-semibold">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">

        <button className="bg-gray-200 px-3 py-1 rounded">
          Notifications
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500"></div>
          <span>Admin</span>
        </div>

      </div>

    </div>
  );
}