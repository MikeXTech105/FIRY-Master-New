export default function Header() {
  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-100 px-8 py-4 shadow-sm">

      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Dashboard
      </h1>

      <div className="flex items-center gap-3">

        <button className="relative flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          Notifications
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-semibold">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 leading-tight">Admin</span>
            <span className="text-xs text-gray-400 leading-tight">Administrator</span>
          </div>
        </div>

      </div>

    </div>
  );
}