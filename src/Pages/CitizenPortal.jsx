import React, { useState } from 'react';
import { Mic, Camera, Send, CheckCircle, Clock, MessageCircle, Star, History } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function CitizenPortal() {
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'new-complaint'
  const [isRecording, setIsRecording] = useState(false);
  const [step, setStep] = useState(1); // 1: Input, 2: AI Verify, 3: Success

  // Mock History Data (Diagram Requirement: "Previous Grievances")
  const history = [
    { id: 101, title: "Broken Streetlight", status: "Resolved", date: "2 days ago", feedbackGiven: false },
    { id: 102, title: "Garbage Pileup", status: "In Progress", date: "Today", feedbackGiven: false },
  ];

  const sampleTicketProgress = {
    id: 'GR-2024-99',
    steps: ['Received', 'Triaged', 'Assigned', 'In-Field Action', 'Resolved'],
    current: 2,
    slaHours: 48,
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white p-4 shadow-sm rounded-md flex justify-between items-center sticky top-24 z-10">
          <h1 className="text-lg font-bold text-slate-800">Citizen Portal</h1>
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">JD</div>
        </div>
        <div className="mt-4">
          <div className="bg-white p-6 rounded-xl border border-slate-100">
            <h2 className="text-lg font-bold mb-2">Welcome to your portal</h2>
            <p className="text-sm text-slate-600">Use the links below to view profile, current or previous grievances, and track status.</p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <a href="/citizen/profile" className="p-3 bg-slate-50 rounded-md text-sm font-medium text-slate-700 border border-slate-100">Profile</a>
              <a href="/citizen/current" className="p-3 bg-slate-50 rounded-md text-sm font-medium text-slate-700 border border-slate-100">Current Grievances</a>
              <a href="/citizen/previous" className="p-3 bg-slate-50 rounded-md text-sm font-medium text-slate-700 border border-slate-100">Previous Grievances</a>
              <a href="/citizen/status" className="p-3 bg-slate-50 rounded-md text-sm font-medium text-slate-700 border border-slate-100">Status Tracker</a>
            </div>
          </div>
        </div>
      
      

      {/* VIEW 1: DASHBOARD (History & Status) */}
      {view === 'dashboard' && (
        <div className="p-4 space-y-6">
          
          {/* WhatsApp Bot Promo (Diagram Requirement) */}
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-3">
            <div className="bg-green-500 text-white p-2 rounded-full"><MessageCircle size={20}/></div>
            <div>
              <div className="font-bold text-green-900 text-sm">Use WhatsApp Bot</div>
              <div className="text-green-700 text-xs">Send photo to +91-999-888-777</div>
            </div>
          </div>

          {/* Current Status Cards */}
          <h2 className="text-sm font-bold text-slate-500 uppercase">Recent Activity</h2>
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800">{item.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded font-bold ${item.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>{item.date}</span>
                  {item.status === 'Resolved' && !item.feedbackGiven && (
                    <button className="text-blue-600 font-bold flex items-center gap-1">
                      <Star size={12} /> Give Feedback
                    </button>
                  )}
                </div>

                {item.status === 'Resolved' && (
                  <div className="mt-3 border-t pt-3 flex items-center gap-3">
                    <div className="w-20 h-14 bg-slate-100 rounded overflow-hidden flex items-center justify-center text-slate-400">Photo</div>
                    <div className="flex-1 text-xs text-slate-600">Officer uploaded "After" photo. Evidence geo-tagged & time-stamped.</div>
                    <button className="text-sm text-green-600 font-bold">View & Confirm</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Floating Action Button for New Complaint */}
          <button 
            onClick={() => setView('new-complaint')}
            className="fixed bottom-8 right-8 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
            aria-label="New complaint"
          >
            <Mic size={24} />
          </button>
        </div>
      )}

      {/* VIEW 2: NEW COMPLAINT FLOW (NLP -> Form -> Verify) */}
      {view === 'new-complaint' && (
        <div className="p-6 h-screen flex flex-col">
          <button onClick={() => setView('dashboard')} className="text-slate-400 mb-4 text-sm font-bold">← Back</button>
          
          {/* Step 1: Speak */}
          {step === 1 && (
            <div className="flex-1 flex flex-col items-center justify-center">
               <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">What is the issue?</h2>
               <div 
                  onClick={() => { setIsRecording(!isRecording); if(!isRecording) setTimeout(() => setStep(2), 2000); }}
              className={`w-32 h-32 rounded-full flex items-center justify-center cursor-pointer transition-all ${isRecording ? 'bg-red-100 animate-pulse ring-4 ring-red-200' : 'bg-orange-100'}`}
                >
                  <Mic size={40} className={isRecording ? 'text-red-500' : 'text-blue-600'} />
                </div>
                <p className="mt-6 text-slate-500">{isRecording ? "Listening..." : "Tap to Speak"}</p>
                
                <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                    <button className="p-4 bg-slate-100 rounded-xl font-bold text-slate-600 text-sm flex flex-col items-center gap-2">
                        <Camera size={20} /> Upload Photo
                    </button>
                    <button className="p-4 bg-slate-100 rounded-xl font-bold text-slate-600 text-sm flex flex-col items-center gap-2">
                        <Send size={20} /> Type Text
                    </button>
                </div>
            </div>
          )}

          {/* Step 2: AI Verify (Diagram: "NLP -> Form -> Edit") */}
          {step === 2 && (
            <div className="animate-in slide-in-from-bottom-10">
                <div className="bg-green-50 p-3 rounded-lg flex items-center gap-2 text-green-800 font-bold mb-6">
                    <CheckCircle size={18}/> AI Analyzed your voice
                </div>
                <form className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400">CATEGORY</label>
                        <input type="text" defaultValue="Sanitation" className="w-full p-3 border rounded-lg font-bold text-slate-800 bg-white" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400">LOCATION</label>
                        <input type="text" defaultValue="Chembur Naka, Mumbai" className="w-full p-3 border rounded-lg text-slate-800 bg-white" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400">DESCRIPTION</label>
                        <textarea defaultValue="Garbage not picked up for 3 days." className="w-full p-3 border rounded-lg text-slate-800 bg-white h-24"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-3 items-center">
                      <div className="text-sm text-slate-500">Estimated SLA: <strong>{sampleTicketProgress.slaHours} hrs</strong></div>
                      <button type="button" onClick={() => setStep(3)} className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold">
                          Confirm & Submit
                      </button>
                    </div>
                </form>
            </div>
          )}

           {/* Step 3: Success */}
           {step === 3 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Complaint Registered!</h2>
                <p className="text-slate-500 mt-2">Ticket ID: {sampleTicketProgress.id}</p>
                <p className="text-sm text-slate-500 mt-2">Estimated resolution: <strong>{sampleTicketProgress.slaHours} hrs</strong></p>

                <div className="w-full max-w-md mt-6">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    {sampleTicketProgress.steps.map((s, i) => (
                      <div key={s} className={`flex-1 text-center ${i <= sampleTicketProgress.current ? 'text-slate-900 font-bold' : ''}`}>{s}</div>
                    ))}
                  </div>
                  <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 bg-orange-500 rounded-full" style={{width: `${((sampleTicketProgress.current+1)/sampleTicketProgress.steps.length)*100}%`}} />
                  </div>
                </div>

                <button onClick={() => setView('dashboard')} className="mt-8 text-orange-600 font-bold">Go to Dashboard</button>
            </div>
           )}
        </div>
      )}
      </div>
    </div>
  );
}