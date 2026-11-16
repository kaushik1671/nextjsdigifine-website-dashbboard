'use client';

import { useState, useEffect } from 'react';

// Jab bhi aap naya section/feature banao (e.g. Blogs), bas uski entry yahan add kar do
const AVAILABLE_SECTIONS = [
  { id: 'dashboard', label: 'Dashboard Access' },
  { id: 'blogs', label: 'Blog Management' },
  { id: 'leads', label: 'Leads Management' },
  { id: 'invoices', label: 'Invoices & Billing' },
];

export default function AdminControlsPage() {
  const [adminList, setAdminList] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Admin list database se fetch karna
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/list');
      const data = await res.json();
      if (data.success) {
        setAdminList(data.admins);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // User select hone par uski existing permissions load karna
  const handleUserSelect = (email) => {
    setSelectedEmail(email);
    const user = adminList.find((a) => a.email === email);
    if (user && user.permissions) {
      const perms = typeof user.permissions === 'string' 
        ? JSON.parse(user.permissions) 
        : user.permissions;
      setSelectedPermissions(perms);
    } else {
      setSelectedPermissions([]);
    }
  };

  // Checkbox Selection Toggle
  const handlePermissionToggle = (sectionId) => {
    if (selectedPermissions.includes(sectionId)) {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== sectionId));
    } else {
      setSelectedPermissions([...selectedPermissions, sectionId]);
    }
  };

  // Save/Assign Access
  const handleAssignControl = async (e) => {
    e.preventDefault();
    if (!selectedEmail) {
      alert('Please select an admin email!');
      return;
    }

    const res = await fetch('/api/admin/assign-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: selectedEmail,
        permissions: selectedPermissions,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert(`Access permissions updated for ${selectedEmail}`);
      fetchAdmins(); // Table refresh
    } else {
      alert('Failed to update access');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Particular Person Access Assign Box */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Assign Section Control</h2>
          <form onSubmit={handleAssignControl} className="space-y-4">
            
            {/* Particular Admin Select Dropdown / Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Admin Person</label>
              <select
                value={selectedEmail}
                onChange={(e) => handleUserSelect(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none"
                required
              >
                <option value="">-- Choose Admin --</option>
                {adminList.map((admin) => (
                  <option key={admin.id} value={admin.email}>
                    {admin.full_name ? `${admin.full_name} (${admin.email})` : admin.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Checkbox Section for Access */}
            <div className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50/50">
              <p className="text-sm font-semibold text-gray-700">Give Access To:</p>
              {AVAILABLE_SECTIONS.map((section) => (
                <label key={section.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(section.id)}
                    onChange={() => handlePermissionToggle(section.id)}
                    className="h-4 w-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700 text-sm font-medium">{section.label}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition"
            >
              Assign Control
            </button>
          </form>
        </div>

        {/* Updated Admin List Showing Sections Access */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Access Overview</h2>
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-3 text-left font-semibold text-gray-700 border-r border-gray-200">ID</th>
                <th className="p-3 text-left font-semibold text-gray-700 border-r border-gray-200">Email</th>
                <th className="p-3 text-left font-semibold text-gray-700">Allowed Sections</th>
              </tr>
            </thead>
            <tbody>
              {adminList.map((item) => {
                let perms = [];
                try {
                  perms = typeof item.permissions === 'string' 
                    ? JSON.parse(item.permissions) 
                    : item.permissions || [];
                } catch (e) {
                  perms = [];
                }

                return (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="p-3 border-r border-gray-200">{item.id}</td>
                    <td className="p-3 border-r border-gray-200">{item.email}</td>
                    <td className="p-3">
                      {perms.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {perms.map((p) => (
                            <span key={p} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {p}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">No Access Assigned</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}