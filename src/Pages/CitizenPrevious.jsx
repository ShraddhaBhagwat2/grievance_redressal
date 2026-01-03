import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CitizenNav from '../components/CitizenNav';
import api from '../services/api';

export default function CitizenPrevious(){
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
      const endpoints = [];
      if (userId) endpoints.push(`/users/${userId}/grievances`, `/users/${userId}/forms`);
      // prefer the official /grievance/forms and then filter for resolved items
      endpoints.push('/grievance/forms','/grievance/forms?status=resolved','/grievance/list','/grievance/my/forms');
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
            // filter resolved
            const resolved = list.filter(i => (i.status || i.ticket_status || '').toLowerCase().includes('resolv') || i.status === 'Resolved');
            setItems(resolved.length > 0 ? resolved : list);
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
            <div key={t.id || t.form_id} className="bg-white p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-slate-500">{t.id || t.form_id}</div>
                  <div className="font-bold text-slate-800">{t.title || t.subject || t.extracted_data?.title}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600">{t.status || t.ticket_status || 'Resolved'}</div>
                  <div className="text-sm text-slate-600">Resolved on: {t.resolved_on || t.resolvedOn || t.closed_at || '—'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
