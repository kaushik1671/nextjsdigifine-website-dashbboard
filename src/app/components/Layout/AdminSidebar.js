"use client";
import { useRouter, usePathname } from "next/navigation";

export default function AdminSidebar({ handleLogout }) {
  const router = useRouter();
  const pathname = usePathname(); // Ye check karega ki abhi kaunsa URL active hai

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r border-gray-200 flex flex-col font-sans">
      <div className="h-20 px-6 flex items-center border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Digifine Academy
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navigation Links with URL routing */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => router.push("/admin/dashboard")} // Yahan apna dashboard ka URL daalo
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left cursor-pointer transition-all ${
            pathname === "/admin/dashboard"
              ? "bg-[#046AED] text-white shadow-md shadow-blue-500/20"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <span>📊</span>
          Dashboard
        </button>

        <button
          onClick={() => router.push("/admin/careers")} // Yahan careers page ka URL daalo
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left cursor-pointer transition-all ${
            pathname === "/admin/careers"
              ? "bg-[#046AED] text-white shadow-md shadow-blue-500/20"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <span>💼</span>
          Career Applications
        </button>

        <button
          onClick={() => router.push("/admin/managejobs")} // Yahan careers page ka URL daalo
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left cursor-pointer transition-all ${
            pathname === "/admin/managejobs"
              ? "bg-[#046AED] text-white shadow-md shadow-blue-500/20"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <span>💼</span>
          Manage Jobs
        </button>

      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium text-left cursor-pointer transition-all"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}