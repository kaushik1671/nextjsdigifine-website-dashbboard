"use client";

import React, { useEffect, useState } from "react";
import { FileText, Mail, Phone, Briefcase, Calendar, GraduationCap, Search, RefreshCw, AlertCircle } from "lucide-react";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import AdminHeader from "../../components/Layout/AdminHeader";

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/career/applications");
      const result = await response.json();

      if (response.ok && result.success) {
        setApplications(result.data);
        setError(null);
      } else {
        setError(result.message || "Failed to fetch applications.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Server connection failed. Make sure your Express backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Sidebar (Fixed on Left) */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="ml-64 flex flex-col min-h-screen min-w-0">
        <AdminHeader />

        {/* Added pt-6 here so content doesn't stick to the top header bar */}
        <main className="flex-1 p-6 sm:p-8 pt-6 space-y-6 overflow-y-auto">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm mt-15">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-[#046AED] uppercase bg-blue-50 px-2.5 py-0.5 rounded-full">
                HR Portal
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Candidate Applications</h1>
              <p className="text-slate-500 text-xs">Manage and review talent submissions from your career portal.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchApplications}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <Search size={18} className="text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Search by candidate name, email, or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
            />
          </div>

          {/* Content Section */}
          {loading ? (
            <div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-slate-200/80">
              <div className="w-6 h-6 border-2 border-[#046AED] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-rose-200 text-center p-6">
              <AlertCircle size={32} className="text-rose-500 mb-2" />
              <p className="text-sm font-bold text-slate-800">Could not load applications</p>
              <p className="text-xs text-slate-500 mt-1">{error}</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
              <p className="text-xs font-medium text-slate-500">No applications found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="p-4">Candidate</th>
                      <th className="p-4">Applying For</th>
                      <th className="p-4">Qualification</th>
                      <th className="p-4">Experience</th>
                      <th className="p-4">Applied On</th>
                      <th className="p-4 text-right">Resume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{app.name}</div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1"><Mail size={11} /> {app.email}</span>
                            <span className="flex items-center gap-1"><Phone size={11} /> {app.mobile}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 font-semibold text-[#046AED] bg-blue-50 px-2.5 py-1 rounded-lg">
                            <Briefcase size={12} /> {app.jobTitle}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <GraduationCap size={14} className="text-slate-400" /> {app.qualification}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-medium">{app.expYears} yrs {app.expMonths} mos</span>
                        </td>
                        <td className="p-4 text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {new Date(app.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {app.resume_path ? (
                            <a
                              href={`http://localhost:5000${app.resume_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold rounded-lg transition-all shadow-sm"
                            >
                              <FileText size={12} />
                              <span>View PDF</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">No Resume</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}