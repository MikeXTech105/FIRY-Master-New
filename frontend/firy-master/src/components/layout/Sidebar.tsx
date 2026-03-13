import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">

      {/* Logo */}
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        FiryMaster 🚀
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition ${isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition ${isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          👤 Users
        </NavLink>

        <NavLink
          to="/roles"
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition ${isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          🛡 Roles
        </NavLink>

        <NavLink
          to="/candidate"
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition ${isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          🧑‍💼 Candidates
        </NavLink>
        <NavLink
          to="/emails"
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition ${isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          📧 Emails
        </NavLink>

      </nav>

    </div>
  );
}