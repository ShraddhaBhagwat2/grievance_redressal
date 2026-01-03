import React from 'react';
import Navbar from '../components/Navbar';
import CitizenNav from '../components/CitizenNav';

const mockCurrent = [
  {id:'GR-210', title:'Overflowing drain', status:'Assigned', assignedTo:'Officer A', eta:'24 hrs'},
  {id:'GR-211', title:'Streetlight not working', status:'In-Field Action', assignedTo:'Officer B', eta:'12 hrs'},
];

export default function CitizenCurrent(){
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <CitizenNav />
        <h2 className="text-xl font-bold mb-4">Current Grievances</h2>
        <div className="space-y-4">
          {mockCurrent.map(t=> (
            <div key={t.id} className="bg-white p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-slate-500">{t.id}</div>
                  <div className="font-bold text-slate-800">{t.title}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">{t.status}</div>
                  <div className="text-sm text-slate-600">ETA: {t.eta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
