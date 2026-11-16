"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../../components/Layout/AdminHeader";
import AdminSidebar from "../../components/Layout/AdminSidebar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const ITEMS_PER_PAGE = 20;

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [error, setError] = useState("");
  const [adminUser, setAdminUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activePage, setActivePage] = useState("dashboard");

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");
      setCurrentPage(1);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(`${API_BASE}/api/enquiries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load enquiries");
      }

      setEnquiries(result.data || []);
    } catch (error) {
      console.error(error);
      setError(error.message || "Unable to load enquiries");
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const user = localStorage.getItem("adminUser");

      if (user) {
        setAdminUser(JSON.parse(user));
      }
    } catch {
      setAdminUser(null);
    }

    fetchEnquiries();
  }, []);

  const totalEnquiries = enquiries.length;

  const todayEnquiries = enquiries.filter((item) => {
    if (!item.created_at) return false;

    const today = new Date().toISOString().split("T")[0];
    const date = new Date(item.created_at)
      .toISOString()
      .split("T")[0];

    return today === date;
  }).length;

  const courseCount = new Set(
    enquiries.map((item) => item.course).filter(Boolean)
  ).size;

  const filteredEnquiries = enquiries.filter((item) => {
    const searchText = searchQuery.toLowerCase();

    const matchesSearch =
      !searchText ||
      String(item.name || "").toLowerCase().includes(searchText) ||
      String(item.email || "").toLowerCase().includes(searchText) ||
      String(item.phone || "").toLowerCase().includes(searchText) ||
      String(item.city || "").toLowerCase().includes(searchText) ||
      String(item.course || "").toLowerCase().includes(searchText);

    const date = item.created_at
      ? new Date(item.created_at).toISOString().split("T")[0]
      : "";

    const matchesFrom = !fromDate || date >= fromDate;
    const matchesTo = !toDate || date <= toDate;

    return matchesSearch && matchesFrom && matchesTo;
  });

  const totalPages = Math.ceil(
    filteredEnquiries.length / ITEMS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedEnquiries = filteredEnquiries.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSearch = () => {
    setSearchQuery(search.trim());
    setCurrentPage(1);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  };

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "-";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        handleLogout={handleLogout}
      />

      <AdminHeader adminUser={adminUser} />

      <main className="ml-64 pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7 mt-8">
            <StatCard
              title="Total Enquiries"
              value={totalEnquiries}
              label="All Enquiries"
              icon="📋"
            />

            <StatCard
              title="Today's Enquiries"
              value={todayEnquiries}
              label="Today"
              icon="📅"
            />

            <StatCard
              title="Courses"
              value={courseCount}
              label="Active Courses"
              icon="🎓"
            />
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Enquiry
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="Search name, email, phone, city or course..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="w-full lg:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>

                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="w-full lg:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full lg:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
              <p>{error}</p>

              <button
                onClick={fetchEnquiries}
                className="mt-2 font-semibold underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Table Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Career Enquiries
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {filteredEnquiries.length} enquiries found
              </p>
            </div>

            <button
              onClick={fetchEnquiries}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                Loading enquiries...
              </div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-3">📭</div>

                <h3 className="font-semibold text-gray-900">
                  No enquiries found
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Try another search or date range.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        ID
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Page UR
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Name
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Email
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Phone
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Location
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Course
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Browser
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        IP Address
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Form Date
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Copy
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
  {paginatedEnquiries.map((item) => (
    <tr key={item.id} className="hover:bg-gray-50">

      <td className="px-4 py-4 text-sm text-gray-700">
        {item.id}
      </td>

      <td className="px-4 py-4 text-sm">
        <a
          href={item.page_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline max-w-[220px] block truncate"
          title={item.page_url}
        >
          {item.page_url || "-"}
        </a>
      </td>

      <td className="px-4 py-4 text-sm font-medium text-gray-900">
        {item.name || "-"}
      </td>

      <td className="px-4 py-4 text-sm text-gray-700">
        {item.email || "-"}
      </td>

      <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
        {item.phone || "-"}
      </td>

      <td className="px-4 py-4 text-sm text-gray-700">
        {item.city || "-"}
      </td>

      <td className="px-4 py-4 text-sm text-gray-700">
        {item.course || "-"}
      </td>

      <td className="px-4 py-4 text-sm text-gray-700">
        {item.browser || "-"}
      </td>

      <td className="px-4 py-4 text-sm text-gray-700">
        {item.ip || "-"}
      </td>

      <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
        {formatDate(item.created_at || item.date_time)}
      </td>

      <td className="px-4 py-4">
        <button
          onClick={() => navigator.clipboard.writeText(
            `${item.name || ""} | ${item.email || ""} | ${item.phone || ""}`
          )}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Copy
        </button>
      </td>

      <td className="px-4 py-4">
        <button
          onClick={() => setSelectedEnquiry(item)}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View
        </button>
      </td>

    </tr>
  ))}
</tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="border-t border-gray-200 px-5 py-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(page - 1, 1)
                      )
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(page + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Details Modal */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Enquiry Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Enquiry #{selectedEnquiry.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Name" value={selectedEnquiry.name} />
              <DetailItem label="Email" value={selectedEnquiry.email} />
              <DetailItem label="Phone" value={selectedEnquiry.phone} />
              <DetailItem label="Location" value={selectedEnquiry.city} />
              <DetailItem label="Course" value={selectedEnquiry.course} />
              <DetailItem label="Mode" value={selectedEnquiry.mode} />
              <DetailItem label="Browser" value={selectedEnquiry.browser} />
              <DetailItem label="Operating System" value={selectedEnquiry.os} />
              <DetailItem label="IP Address" value={selectedEnquiry.ip} />
              <DetailItem
                label="Form Date"
                value={formatDate(
                  selectedEnquiry.created_at ||
                    selectedEnquiry.date_time
                )}
              />

              <div className="md:col-span-2">
                <DetailItem
                  label="Page URL"
                  value={selectedEnquiry.page_url}
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, label, icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {value}
          </h2>

          <p className="text-xs text-gray-500 mt-2">
            {label}
          </p>
        </div>

        <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
      <p className="text-xs font-semibold text-gray-500 uppercase">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-gray-900 break-words">
        {value || "-"}
      </p>
    </div>
  );
}