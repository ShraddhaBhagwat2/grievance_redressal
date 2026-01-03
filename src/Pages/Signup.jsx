import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, User, Phone, Mail, MapPin, Globe, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
    password: '',
    residential_address: '',
    language_preference: 'English'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signup(formData);
    
    if (result.success) {
      navigate('/citizen');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-center">
          <div className="mx-auto bg-white w-12 h-12 rounded-full flex items-center justify-center mb-3">
            <Shield className="text-blue-600" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-blue-100 text-sm">Join CivicConnect Grievance Portal</p>
        </div>

        {/* Signup Form */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {typeof error === 'string' ? error : JSON.stringify(error)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe" 
                  required
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-blue-500"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <Phone size={18} />
                </div>
                <input 
                  type="tel" 
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  placeholder="+91 98765 43210" 
                  required
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-blue-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com" 
                  required
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <Shield size={18} />
                </div>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  required
                  minLength="6"
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-blue-500"
                />
              </div>
            </div>

            {/* Residential Address */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Residential Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <MapPin size={18} />
                </div>
                <input 
                  type="text" 
                  name="residential_address"
                  value={formData.residential_address}
                  onChange={handleChange}
                  placeholder="123 Main St, Mumbai" 
                  required
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-blue-500"
                />
              </div>
            </div>

            {/* Language Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Language Preference
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <Globe size={18} />
                </div>
                <select 
                  name="language_preference"
                  value={formData.language_preference}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-blue-500"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Marathi</option>
                  <option>Tamil</option>
                  <option>Telugu</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
