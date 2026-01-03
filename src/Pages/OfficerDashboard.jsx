import React, { useState, useEffect } from 'react';
import { FileText, Layers, Clock, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { officerAPI } from '../services/api';

export default function OfficerDashboard() {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Mock Cluster Data (Diagram: "Insights on repetitiveness")
  const clusters = [
    { id: 1, title: "Station Road Potholes", count: 14, urgency: "High" },
    { id: 2, title: "Water Cut Ward C", count: 52, urgency: "Critical" },
  ];

        const [tickets, setTickets] = useState([]);

        function updateTicketLocal(id, patch){
                setTickets(prev=> prev.map(t => (t.ticket?.grievance_id||t.id)===id? {...t, ticket:{...t.ticket,...patch}}: t));
        }

        // fetch officer dashboard on mount
        useEffect(() => {
            let mounted = true;
            const load = async () => {
                setLoading(true);
                try {
                    const res = await officerAPI.getDashboard();
                    if (!mounted) return;
                    // expected array of items
                    setTickets(Array.isArray(res.data) ? res.data : []);
                } catch (e) {
                    console.error('Failed to load officer dashboard', e);
                    setError(e?.response?.data || e.message || 'Failed to load');
                } finally {
                    if (mounted) setLoading(false);
                }
            };
            load();
            return () => { mounted = false; };
        }, []);

  return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex">
      
      {/* Sidebar with Stats */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8 text-slate-800">Officer Panel</h2>
        
        {/* CLUSTER INSIGHTS (Diagram Req) */}
        <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                <Layers size={14}/> AI Cluster Insights
            </h3>
            <div className="space-y-3">
                {clusters.map(c => (
                    <div key={c.id} className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 cursor-pointer hover:bg-indigo-100">
                        <div className="flex justify-between items-start">
                            <span className="text-sm font-bold text-indigo-900">{c.title}</span>
                            <span className="bg-indigo-200 text-indigo-800 text-xs px-1.5 rounded-full font-bold">{c.count}</span>
                        </div>
                        <div className="text-xs text-indigo-600 mt-1">Merged into 1 Ticket</div>
                    </div>
                ))}
            </div>
        </div>
      </aside>

            <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Active Grievances</h1>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">ID</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Urgency (AI)</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {tickets.map((t) => (
                        <tr key={t.id} className="hover:bg-blue-50 transition-colors">
                            <td className="p-4 font-medium text-slate-700">{t.id}</td>
                            <td className="p-4"><span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">{t.category}</span></td>
                            <td className="p-4 text-red-600 font-bold">{t.urgency}/10</td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                                                    <button onClick={() => setSelectedTicket(t)} className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-blue-600"><FileText size={12} /> View</button>
                                                                    <button onClick={async () => {
                                                                        const gid = t.ticket?.grievance_id || t.id;
                                                                        try {
                                                                            await officerAPI.updateStatus({ grievance_id: gid, new_status: 'assigned', progress_note: 'Assigned via app' });
                                                                            updateTicketLocal(gid, { status: 'assigned', assigned_at: new Date().toISOString() });
                                                                        } catch (e) { console.error(e); alert('Failed to assign'); }
                                                                    }} className="px-2 py-1 rounded text-xs border">Assign</button>
                                                                    <button onClick={async () => {
                                                                        const gid = t.ticket?.grievance_id || t.id;
                                                                        try {
                                                                            await officerAPI.updateStatus({ grievance_id: gid, new_status: 'in_progress', progress_note: 'Work started' });
                                                                            updateTicketLocal(gid, { status: 'in_progress', started_at: new Date().toISOString() });
                                                                        } catch (e) { console.error(e); alert('Failed to start'); }
                                                                    }} className="px-2 py-1 rounded text-xs border">Start Work</button>
                                                                    <button onClick={async () => {
                                                                        const gid = t.ticket?.grievance_id || t.id;
                                                                        try {
                                                                            await officerAPI.updateStatus({ grievance_id: gid, new_status: 'resolved', progress_note: 'Resolved via app' });
                                                                            updateTicketLocal(gid, { status: 'resolved', resolved_at: new Date().toISOString() });
                                                                        } catch (e) { console.error(e); alert('Failed to resolve'); }
                                                                    }} className="px-2 py-1 rounded text-xs bg-green-50 text-green-600">Resolve</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

                {loading && <div className="mt-4 text-sm text-slate-500">Loading tickets...</div>}
                {error && <div className="mt-4 text-sm text-red-600">{String(error)}</div>}

        {/* AGENT SCRIBE (Diagram Req: "Auto Draft Generation") */}
        {selectedTicket && (
            <div className="mt-6 p-6 bg-white border border-slate-200 rounded-xl shadow-lg animate-in slide-in-from-bottom-4">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Clock size={20} className="text-blue-600"/> Agent Scribe Response
                    </h3>
                    <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-red-500">✕</button>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm text-slate-700 border border-slate-200 mb-4">
                    <p><strong>Subject:</strong> WORK ORDER - IMMEDIATE REPAIR</p>
                    <p><strong>Ref:</strong> {selectedTicket.id}</p>
                    <p className="mt-2">Based on the complaint "{selectedTicket.summary}" and severity score {selectedTicket.urgency}/10, this issue is flagged as critical.</p>
                    <p className="mt-2">Action Required: Deploy Maintenance Team A to Location.</p>
                </div>

                {/* Evidence validation placeholder */}
                <div className="mb-4 bg-white border border-slate-100 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-slate-600">Evidence Photos</div>
                        <div className="text-xs text-slate-500">Geo: 19.04,72.86 • 2025-12-01 09:23</div>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-32 h-20 bg-slate-100 rounded flex items-center justify-center text-slate-400">Before</div>
                        <div className="w-32 h-20 bg-slate-100 rounded flex items-center justify-center text-slate-400">After</div>
                        <div className="flex-1 text-sm text-slate-600">AI Match Confidence: <strong>82%</strong></div>
                    </div>
                    <div className="mt-3 flex gap-3">
                        <button onClick={() => { updateTicket(selectedTicket.id,{evidenceValidated:true}); setSelectedTicket({...selectedTicket, evidenceValidated:true}); }} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">Validate Evidence</button>
                        <button onClick={() => { updateTicket(selectedTicket.id,{status:'More Info Requested'}); setSelectedTicket({...selectedTicket, status:'More Info Requested'}); }} className="bg-white border border-slate-200 px-4 py-2 rounded-lg">Request More Info</button>
                        <button onClick={() => { updateTicket(selectedTicket.id,{escalated:true}); setSelectedTicket({...selectedTicket, escalated:true}); }} className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">Escalate</button>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700">Approve & Send Notice</button>
                    <button className="flex-1 bg-white border border-red-200 text-red-600 py-2 rounded-lg font-bold hover:bg-red-50">Escalate to Senior</button>
                </div>
            </div>
                )}
            </main>
            </div>
        </div>
  );
}