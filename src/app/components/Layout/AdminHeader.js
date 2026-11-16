export default function AdminHeader({ adminUser }) {
  return (
    <header className="fixed top-0 left-64 right-0 z-40 h-20 bg-white border-b border-gray-200">
      <div className="h-full px-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Dashboard
          </h2>

          <p className="text-sm text-gray-500">
            Digifine Academy Admin Dashboard
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {adminUser?.username || "Admin"}
          </p>

          <p className="text-xs text-gray-500">
            Administrator
          </p>
        </div>
      </div>
    </header>
  );
}