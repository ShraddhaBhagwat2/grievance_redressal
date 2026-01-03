import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Smartphone, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('citizen'); // citizen, officer, admin

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'citizen') navigate('/citizen');
    if (role === 'officer') navigate('/officer');
    if (role === 'admin') navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-center">
          <div className="mx-auto bg-white w-12 h-12 rounded-full flex items-center justify-center mb-3">
            <Shield className="text-blue-600" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">CivicConnect AI</h1>
          <p className="text-blue-100 text-sm">Grievance Redressal System</p>
        </div>

        {/* Login Form */}
        <div className="p-8">
          {/* Role Selector (For Hackathon Demo Speed) */}
          <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
            {['citizen', 'officer', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-bold capitalize rounded-md transition-all ${
                  role === r ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                {role === 'citizen' ? 'Mobile Number / Email' : 'Official ID'}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  {role === 'citizen' ? <Smartphone size={18} /> : <Shield size={18} />}
                </div>
                <input 
                  type="text" 
                  placeholder={role === 'citizen' ? "+91 98765 43210" : "EMP-ID-2024"} 
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password / OTP</label>
              <input 
                type="password" 
                placeholder="••••••" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-blue-500"
              />
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
              Login as {role} <ArrowRight size={18} />
            </button>
          </form>

          {role === 'citizen' && (
            <div className="mt-4 text-center text-xs text-slate-400">
              Or login via <span className="text-green-600 font-bold cursor-pointer">WhatsApp</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}