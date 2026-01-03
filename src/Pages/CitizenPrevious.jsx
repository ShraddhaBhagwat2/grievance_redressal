import React from 'react';
import Navbar from '../components/Navbar';
import CitizenNav from '../components/CitizenNav';

const mockPrev = [
  {id:'GR-102', title:'Broken Streetlight', status:'Resolved', resolvedOn:'2025-12-28'},
  {id:'GR-099', title:'Garbage Pileup', status:'Resolved', resolvedOn:'2025-12-20'},
];

export default function CitizenPrevious(){
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <CitizenNav />
        <h2 className="text-xl font-bold mb-4">Previous Grievances</h2>
        <div className="space-y-4">
          {mockPrev.map(t=> (
            <div key={t.id} className="bg-white p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-slate-500">{t.id}</div>
                  <div className="font-bold text-slate-800">{t.title}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600">{t.status}</div>
                  <div className="text-sm text-slate-600">Resolved on: {t.resolvedOn}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
