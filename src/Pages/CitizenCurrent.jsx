import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CitizenNav from '../components/CitizenNav';
import api, { grievanceAPI } from '../services/api';

export default function CitizenCurrent(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const tryEndpoints = async () => {
      setLoading(true);
      setError(null);
      // try to detect current user so we can call user-scoped endpoints
      let userId = null;
      try {
        const me = await api.get('/users/me');
        if (me?.data && (me.data.id || me.data.user_id)) userId = me.data.id || me.data.user_id;
      } catch (e) {
        // ignore - unauthenticated or endpoint missing
      }

      // prefer the official /grievance/forms route which returns all submitted forms for the logged-in user
      const endpoints = [];
      if (userId) {
        endpoints.push(`/users/${userId}/grievances`, `/users/${userId}/forms`, `/users/${userId}/tickets`);
      }
      endpoints.push('/grievance/forms','/grievance/list','/grievance/my/forms','/grievance/user/forms','/grievance');
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
            // show only active (non-resolved) grievances as "current"
            const active = list.filter(i => {
              const s = (i.status || i.ticket_status || '').toString().toLowerCase();
              return !s.includes('resolv') && !s.includes('closed') && !s.includes('completed');
            });
            setItems(active.length > 0 ? active : list);
            setLoading(false);
            return;
          }
        } catch (e) {
          // ignore and try next
        }
      }
      // fallback: try to fetch recent submitted form if available via grievanceAPI (no list endpoint)
      try {
        const resp = await grievanceAPI.getSession(localStorage.getItem('last_session_id'));
        if (resp?.data) {
          const d = resp.data;
          if (d?.form_id || d?.session_id) {
            const entry = {
              id: d.form_id || d.session_id,
              title: d.extracted_data?.title || d.extracted_data?.full_description || 'Submitted grievance',
              status: d.is_complete ? 'Submitted' : 'Draft',
              eta: d.is_complete ? '—' : 'Pending',
            };
            if (mounted) setItems([entry]);
          }
        }
      } catch(e) {
        // final fallback: empty
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
        <h2 className="text-xl font-bold mb-4">Current Grievances</h2>
        
        {loading && <div className="p-4 bg-blue-50 border border-blue-100 rounded mb-4">Loading current grievances…</div>}
        {error && <div className="p-4 bg-red-50 border border-red-100 rounded mb-4">{String(error)}</div>}
        <div className="space-y-4">
          {items.length === 0 && !loading && (
            <div className="text-sm text-slate-500">No current grievances found.</div>
          )}
          {items.map((t) => (
            <div key={t.id} className="bg-white p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-slate-500">{t.id}</div>
                  <div className="font-bold text-slate-800">{t.title || t.subject || t.extracted_data?.title}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">{t.status || t.ticket_status || 'Unknown'}</div>
                  <div className="text-sm text-slate-600">ETA: {t.eta || t.estimated_resolution || '—'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
