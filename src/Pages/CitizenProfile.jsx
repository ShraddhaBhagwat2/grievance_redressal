import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CitizenNav from '../components/CitizenNav';
import { useAuth } from '../context/AuthContext';

export default function CitizenProfile(){
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 text-center">
            <p className="text-slate-500">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

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
              <p className="font-medium">{user?.full_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Mobile</p>
              <p className="font-medium">{user?.mobile_number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-medium">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Address</p>
              <p className="font-medium">{user?.residential_address || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Language</p>
              <p className="font-medium">{user?.language_preference || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">User ID</p>
              <p className="font-medium text-xs">{user?.id || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
