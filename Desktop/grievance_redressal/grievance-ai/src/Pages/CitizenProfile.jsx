import React from 'react';
import Navbar from '../components/Navbar';
import CitizenNav from '../components/CitizenNav';

export default function CitizenProfile(){
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <CitizenNav />
        <div className="bg-white p-6 rounded-xl border border-slate-100">
          <h2 className="text-xl font-bold mb-2">My Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Name</p>
              <p className="font-medium">J. D'Souza</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Mobile</p>
              <p className="font-medium">+91-999-888-777</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-medium">citizen@example.gov.in</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Address</p>
              <p className="font-medium">Zone 4, Ward 12</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            This profile is a local mock. Connect to backend to enable editing and authentication.
          </div>
        </div>
      </div>
    </div>
  );
}
