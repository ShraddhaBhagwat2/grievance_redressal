import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CitizenNav from '../components/CitizenNav';
import api, { grievanceAPI } from '../services/api';

export default function CitizenPrevious(){
  // Helper to robustly resolve an identifier for a grievance item
  const resolveId = (it) => {
    if (!it) return null;
    return (
      it.form_id || it.id || it._id?.$oid || it._id || it.formId || it.ticket_id || it.ticketId || null
    );
  };
  const [expandedId, setExpandedId] = React.useState(null);
  const formatDate = (v) => {
    if (!v) return '-';
    try {
      const raw = (typeof v === 'string') ? v : (v?.$date || v);
      const d = new Date(raw);
      if (isNaN(d)) return String(v);
      return d.toLocaleString();
    } catch (e) { return String(v); }
  };
  const buildImageUrl = (p) => {
    if (!p) return null;
    if (typeof p !== 'string') return null;
    if (p.startsWith('http')) return p;
    const cleaned = p.replace(/^\.\/?/, '').replace(/\\/g, '/');
    return `${api.defaults.baseURL.replace(/\/$/, '')}/${cleaned}`;
  };
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const tryEndpoints = async () => {
      setLoading(true);
      setError(null);
      // detect current user and prefer user-scoped endpoints
      let userId = null;
      try {
        const me = await api.get('/users/me');
        if (me?.data && (me.data.id || me.data.user_id)) userId = me.data.id || me.data.user_id;
      } catch (e) {
        // ignore
      }
      // prefer official grievance endpoints first
      const endpoints = ['/grievance/forms', '/grievance/forms?status=resolved', '/grievance/list', '/grievance/my/forms'];
      if (userId) endpoints.push(`/users/${userId}/grievances`, `/users/${userId}/forms`);
      for (const ep of endpoints) {
        try {
          const res = await api.get(ep);
          const data = res.data;
          let list = [];
          if (Array.isArray(data)) list = data;
          else if (data && Array.isArray(data.items)) list = data.items;
          else if (data && Array.isArray(data.results)) list = data.results;
          if (list.length > 0) {
            if (!mounted) return;
            // filter resolved/completed/closed
            const resolved = list.filter(i => {
              const s = (i.status || i.ticket_status || '').toString().toLowerCase();
              return s.includes('resolv') || s.includes('resolved') || s.includes('completed') || s.includes('closed') || s.includes('complete');
            });
            setItems(resolved.length > 0 ? resolved : []);
            setLoading(false);
            return;
          }
        } catch (e) {
          // ignore
        }
      }
      if (mounted) setLoading(false);
    };
    tryEndpoints();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <CitizenNav />
        <h2 className="text-xl font-bold mb-4">Previous Grievances</h2>
        
        {loading && <div className="p-4 bg-blue-50 border border-blue-100 rounded mb-4">Loading previous grievances…</div>}
        {error && <div className="p-4 bg-red-50 border border-red-100 rounded mb-4">{String(error)}</div>}
        <div className="space-y-4">
          {items.length === 0 && !loading && (
            <div className="text-sm text-slate-500">No previous grievances found.</div>
          )}
          {items.map(t=> (
            <div key={resolveId(t) || Math.random()} onClick={async () => {
                try {
                  const id = resolveId(t);
                  if (!id) return;
                  const res = await (await import('../services/api')).grievanceAPI.getForm(id);
                  const updated = res?.data || res;
                  setItems(prev => prev.map(p => ((resolveId(p) === id) ? { ...p, ...updated, form_id: updated.form_id || id } : p)));
                  setExpandedId(id);
                } catch (e) {
                  console.error('Failed to refresh grievance', e);
                }
              }} className="bg-white p-4 rounded-xl border border-slate-100 cursor-pointer hover:shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-slate-500">{resolveId(t)}</div>
                  <div className="font-bold text-slate-800">{t.title || t.subject || t.extracted_data?.title}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600">{t.status || t.ticket_status || 'Resolved'}</div>
                  <div className="text-sm text-slate-600">Resolved on: {t.resolved_at || t.resolved_on || t.resolvedOn || t.closed_at || '—'}</div>
                </div>
              </div>
              {resolveId(t) === expandedId && (
                <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Category:</strong> {t.category || '-'}</div>
                    <div><strong>Priority:</strong> {t.priority || '-'}</div>
                    <div><strong>Assigned:</strong> {t.assigned_officer_name || '-'}</div>
                    <div><strong>Status:</strong> {t.status || '-'}</div>
                    <div><strong>ETA:</strong> {t.estimated_response_time || t.eta || '—'}</div>
                    <div><strong>Resolved:</strong> {t.resolved_at ? formatDate(t.resolved_at?.$date || t.resolved_at) : '-'}</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-800 line-clamp-4">{(t.full_description || t.original_text || '').slice(0,200)}{(t.full_description||t.original_text||'').length>200?'...':''}</div>
                  {t.resolution_photos && t.resolution_photos[0] && (
                    <img src={buildImageUrl(t.resolution_photos[0])} alt="resolution" className="w-44 h-32 object-cover rounded mt-3" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
