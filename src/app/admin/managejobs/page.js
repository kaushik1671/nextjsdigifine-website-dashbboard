"use client";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Briefcase, MapPin, FileText, ExternalLink, Users } from "lucide-react";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import AdminHeader from "../../components/Layout/AdminHeader";

export default function ManageJobsDashboard() {
  const [activeTab, setActiveTab] = useState("jobs"); // "jobs" or "applications"
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State for Adding New Job
  const [formData, setFormData] = useState({
    title: "",
    department: "ENGINEERING",
    location: "Mumbai - Andheri",
    type: "Full-Time",
    experience: "1-3 Years",
    description: "",
    fullDescription: "",
    tags: "",
    responsibilities: "",
    requirements: "",
  });

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        fetch("http://localhost:5000/api/jobs/all"),
        fetch("http://localhost:5000/api/jobs/applications"),
      ]);
      const jobsJson = await jobsRes.json();
      const appsJson = await appsRes.json();

      if (jobsJson.success) setJobs(jobsJson.data);
      if (appsJson.success) setApplications(appsJson.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert comma/line separated strings into arrays
    const payload = {
      ...formData,
      tags: formData.tags.split(",").map((item) => item.trim()).filter(Boolean),
      responsibilities: formData.responsibilities.split("\n").map((item) => item.trim()).filter(Boolean),
      requirements: formData.requirements.split("\n").map((item) => item.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("http://localhost:5000/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

     if (result.success) {
  toast.success("Job posted successfully! 🎉", {
    position: "top-right",
    autoClose: 3000,
    theme: "colored",
  });
        setFormData({
          title: "",
          department: "ENGINEERING",
          location: "Mumbai - Andheri",
          type: "Full-Time",
          experience: "1-3 Years",
          description: "",
          fullDescription: "",
          tags: "",
          responsibilities: "",
          requirements: "",
        });
        fetchData();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Error posting job");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    await fetch(`http://localhost:5000/api/jobs/${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AdminSidebar />
      <div className="ml-64 flex flex-col min-h-screen min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 sm:p-8 pt-6 space-y-6 mt-20">
          {/* Top Navigation Tabs */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab("jobs")}
                className={`px-4 py-2
                   rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  activeTab === "jobs" ? "bg-[#046AED] text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                <Briefcase size={14} /> Manage Job Postings ({jobs.length})
              </button>
              <button
                onClick={() => setActiveTab("applications")}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  activeTab === "applications" ? "bg-[#046AED] text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                <Users size={14} /> Job Applications ({applications.length})
              </button>
            </div>
          </div>

          {activeTab === "jobs" ? (
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left: Create Job Form */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <Plus size={18} className="text-[#046AED]" /> Post New Job
                </h2>
                <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Job Title *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Frontend Developer"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Department *</label>
                      <input
                        required
                        type="text"
                        placeholder="ENGINEERING"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Location *</label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="All">All</option>
                        <option value="Mumbai - Andheri">Mumbai - Andheri</option>
                        <option value="Navi Mumbai - Vashi">Navi Mumbai - Vashi</option>
                        <option value="Hyderabad">Hyderabad</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Job Type *</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Internship">Internship</option>
                        <option value="Part-Time">Part-Time</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Experience *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. 2-4 Years"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Skills / Tags (comma separated) *</label>
                    <input
                      required
                      type="text"
                      placeholder="React, JavaScript, Tailwind CSS"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Short Card Description *</label>
                    <textarea
                      required
                      rows="2"
                      placeholder="Short summary shown on the job card..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Full Role Description *</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="Detailed role overview shown inside the popup..."
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Key Responsibilities (one per line) *</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="Develop responsive UI components&#10;Integrate REST APIs"
                      value={formData.responsibilities}
                      onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Requirements (one per line) *</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="Strong proficiency in React&#10;Experience with Git"
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#046AED] hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer transition-all"
                  >
                    {loading ? "Publishing..." : "Publish Job to Website"}
                  </button>
                </form>
              </div>

              {/* Right: Active Jobs List */}
              <div className="lg:col-span-7 space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold bg-blue-50 text-[#046AED] px-2.5 py-0.5 rounded-full">
                        {job.department}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{job.title}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <MapPin size={12} /> {job.location} • {job.type} • {job.experience}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.tags?.map((tag, i) => (
                          <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer"
                      title="Delete Job"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Tab 2: Applications List */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                      <th className="p-4">Applicant</th>
                      <th className="p-4">Job Applied</th>
                      <th className="p-4">Links</th>
                      <th className="p-4">Cover Letter</th>
                      <th className="p-4 text-right">Resume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{app.first_name} {app.last_name}</div>
                          <div className="text-slate-500 text-[11px]">{app.email} • {app.phone}</div>
                        </td>
                        <td className="p-4 font-semibold text-[#046AED]">{app.job_title}</td>
                        <td className="p-4 space-y-1">
                          <div>
                            <a href={app.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-600 underline inline-flex items-center gap-1">
                              LinkedIn <ExternalLink size={10} />
                            </a>
                          </div>
                          {app.portfolio_url && (
                            <div>
                              <a href={app.portfolio_url} target="_blank" rel="noreferrer" className="text-slate-600 underline inline-flex items-center gap-1">
                                Portfolio <ExternalLink size={10} />
                              </a>
                            </div>
                          )}
                        </td>
                        <td className="p-4 max-w-xs truncate text-slate-600">{app.cover_letter || "-"}</td>
                        <td className="p-4 text-right">
                          {app.resume_path && (
                            <a
                              href={`http://localhost:5000${app.resume_path}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[11px] font-semibold"
                            >
                              <FileText size={12} /> View CV
                            </a>
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