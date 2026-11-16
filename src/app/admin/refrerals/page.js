"use client";

import React, { useEffect, useState } from "react";
import { Gift, User, UserPlus, Mail, Phone, Calendar, Search, RefreshCw, Trash2, AlertCircle } from "lucide-react";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import AdminHeader from "../../components/Layout/AdminHeader";

export default function ReferralsDashboard() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/referrals/all");
      const result = await response.json();

      if (response.ok && result.success) {
        setReferrals(result.data);
        setError(null);
      } else {
        setError(result.message || "Failed to fetch referrals.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Server connection failed. Make sure your Express backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this referral entry?")) return;
    await fetch(`http://localhost:5000/api/referrals/${id}`, { method: "DELETE" });
    fetchReferrals();
  };

  const filteredReferrals = referrals.filter((item) =>
    item.your_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.friend_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.your_contact.includes(searchTerm) ||
    item.friend_contact.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AdminSidebar />

      <div className="ml-64 flex flex-col min-h-screen min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 sm:p-8 pt-6 space-y-6 overflow-y-auto mt-16">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-[#046AED] uppercase bg-blue-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <Gift size={11} /> Referral Program
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Student Referrals</h1>
              <p className="text-slate-500 text-xs">Track referrals submitted by students and their referred friends.</p>
            </div>
            
            <button
              onClick={fetchReferrals}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <Search size={18} className="text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Search by referrer name, friend name, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-slate-200/80">
              <div className="w-6 h-6 border-2 border-[#046AED] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-rose-200 text-center p-6">
              <AlertCircle size={32} className="text-rose-500 mb-2" />
              <p className="text-sm font-bold text-slate-800">Could not load referrals</p>
              <p className="text-xs text-slate-500 mt-1">{error}</p>
            </div>
          ) : filteredReferrals.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
              <p className="text-xs font-medium text-slate-500">No referrals found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="p-4">Referred By (Your Details)</th>
                      <th className="p-4">Friend Details (Lead)</th>
                      <th className="p-4">Submitted On</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredReferrals.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <User size={13} className="text-slate-500" /> {item.your_name}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><Phone size={11} /> {item.your_contact}</span>
                            <span className="flex items-center gap-1"><Mail size={11} /> {item.your_email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-[#046AED] flex items-center gap-1.5">
                            <UserPlus size={13} /> {item.friend_name}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 mt-1">
                            <span className="flex items-center gap-1 font-medium"><Phone size={11} /> {item.friend_contact}</span>
                            <span className="flex items-center gap-1"><Mail size={11} /> {item.friend_email}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Referral"
                          >
                            <Trash2 size={15} />
                          </button>
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