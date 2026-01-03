import React, { useState } from 'react';
import { ShieldAlert, Users, Plus, Settings, TrendingUp, Building2, UserPlus, X } from 'lucide-react';
// ... import Navbar or use a specific Admin Navbar if needed

export default function AdminDashboard() {
  const [showAddEmployee, setShowAddEmployee] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Admin Navbar */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
           <span className="font-bold text-lg tracking-wide">ADMIN CONTROL PANEL</span>
           <div className="flex gap-4 text-sm">
              <span className="text-slate-400">Logged in as: <strong>System Admin</strong></span>
           </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">System Overview</h1>
                <p className="text-slate-500 text-sm">Manage Logic, Resources & Audits</p>
            </div>
            <div className="flex gap-3">
                <button 
                  onClick={() => setShowAddEmployee(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all"
                >
                    <Plus size={18} /> Add Resource
                </button>
            </div>
        </header>

        {/* --- MODAL: ADD EMPLOYEE / DEPT (From your Diagram) --- */}
        {showAddEmployee && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2"><UserPlus size={20}/> Onboard New Resource</h3>
                <button onClick={() => setShowAddEmployee(false)} className="hover:text-red-400"><X size={24}/></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <button className="p-4 border-2 border-blue-600 bg-blue-50 text-blue-700 rounded-xl font-bold flex flex-col items-center gap-2">
                      <UserPlus /> Add Employee
                   </button>
                   <button className="p-4 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold flex flex-col items-center gap-2">
                      <Building2 /> Add Department
                   </button>
                </div>
                
                {/* Form Inputs */}
                <div className="space-y-3">
                   <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                      <input type="text" className="w-full p-2 border rounded font-medium" placeholder="Ex: Rajesh Kumar" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Department</label>
                          <select className="w-full p-2 border rounded font-medium">
                            <option>Roads</option>
                            <option>Sanitation</option>
                            <option>Water</option>
                          </select>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                          <select className="w-full p-2 border rounded font-medium">
                            <option>Junior Engineer</option>
                            <option>Ward Officer</option>
                            <option>Zone Head</option>
                          </select>
                      </div>
                   </div>
                </div>

                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 mt-4">
                  Confirm Onboarding
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Same stats code as before... */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-bold">Pending Escalations</div>
                <div className="text-3xl font-bold text-red-600 mt-2">12</div>
                <div className="text-xs text-red-400 mt-1">Due to SLA Breach</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-bold">Total Departments</div>
                <div className="text-3xl font-bold text-slate-800 mt-2">8</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-bold">Response Quality</div>
                <div className="text-3xl font-bold text-green-600 mt-2">92%</div>
            </div>
        </div>

        {/* SLA Policy Manager & Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">SLA Policy Manager</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                <div>
                  <div className="font-medium">Sanitation</div>
                  <div className="text-xs text-slate-500">Triage within 4 hours</div>
                </div>
                <button className="text-xs text-blue-600 font-bold">Edit</button>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                <div>
                  <div className="font-medium">Roads</div>
                  <div className="text-xs text-slate-500">Triage within 6 hours</div>
                </div>
                <button className="text-xs text-blue-600 font-bold">Edit</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
            <h3 className="font-bold text-slate-800 mb-4">Geospatial Heatmap (Hotspots)</h3>
            <div className="w-full h-56 bg-slate-50 border border-slate-100 rounded flex items-center justify-center text-slate-400">
              Map placeholder — integrate Leaflet / Mapbox here
            </div>
          </div>
        </div>

        {/* LOGIC & FEEDBACK SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <ShieldAlert size={18} className="text-orange-500"/> Escalation Rules (Logic)
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                        <span className="text-sm font-medium text-slate-700">If <strong>Urgency &gt; 8</strong> AND <strong>Unresolved &gt; 24hrs</strong></span>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">Escalate to Zone Head</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                        <span className="text-sm font-medium text-slate-700">If <strong>Cluster Count &gt; 50</strong></span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">Alert Commissioner</span>
                    </div>
                </div>
            </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-500"/> Recent Citizen Feedback
                </h3>
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex justify-between mb-1">
                            <span className="text-xs font-bold text-slate-500">Ticket #102</span>
                            <span className="text-xs font-bold text-green-600">★★★★★</span>
                        </div>
                        <p className="text-sm text-slate-700 italic">"Fastest resolution I have ever seen!"</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}