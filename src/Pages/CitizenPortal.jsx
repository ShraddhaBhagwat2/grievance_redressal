import React, { useState, useRef } from 'react';
import { Mic, Camera, Send, CheckCircle, Clock, MessageCircle, Star, History } from 'lucide-react';
import { grievanceAPI } from '../services/api';
import Navbar from '../components/Navbar';

export default function CitizenPortal() {
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'new-complaint'
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [step, setStep] = useState(1); // 1: Input, 2: AI Verify, 3: Success
  const [sessionId, setSessionId] = useState(null);
  const [extractedData, setExtractedData] = useState({});
  const [missingInfo, setMissingInfo] = useState([]);
  const [clarificationQuestions, setClarificationQuestions] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [serverMessage, setServerMessage] = useState('');
  const [textInput, setTextInput] = useState('');
  const [submittedFormResult, setSubmittedFormResult] = useState(null);
  const [formFields, setFormFields] = useState({ category: '', location: '', description: '' });
  const [clarifyAnswers, setClarifyAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rawError, setRawError] = useState(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  

  // Safe serializer for errors (handles circular refs and File objects)
  function safeSerialize(obj) {
    try {
      const seen = new Set();
      return JSON.stringify(obj, function (key, value) {
        // represent File objects in a small form
        try {
          if (typeof File !== 'undefined' && value instanceof File) {
            return { __file__: true, name: value.name, size: value.size, type: value.type };
          }
        } catch (e) {
          // ignore instanceof errors in some environments
        }
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) return '[Circular]';
          seen.add(value);
        }
        return value;
      }, 2);
    } catch (e) {
      try { return String(obj); } catch (e2) { return '[unserializable]'; }
    }
  }

  // Helper: start a grievance session with captured text (or from file upload)
  async function startSessionWithText(spoken) {
    setIsLoading(true);
    setServerMessage('Starting grievance session...');
    try {
      const fd = new FormData();
      fd.append('text', spoken || '');
      // include selected file if present
      if (selectedFile) {
        fd.append('files', selectedFile);
        fd.append('files[]', selectedFile);
      }
      const res = await grievanceAPI.start(fd);
      const data = res.data || {};
      setSessionId(data.session_id || data.sessionId || null);
      const extracted = data.extracted_data || {};
      setExtractedData(extracted);
      setFormFields({
        category: extracted.category || '',
        location: extracted.location || '',
        description: extracted.description || spoken || '',
      });
      setMissingInfo(data.missing_info || []);
      setClarificationQuestions(data.clarification_questions || []);
      setIsComplete(Boolean(data.is_complete));
      setServerMessage(data.message || 'Session started');
      setStep(2);
    } catch (err) {
      console.error('startSession error', err);
      console.debug('startSession response data:', err?.response?.data);
      const msg = err?.response?.data?.message || err?.response?.data || err?.message || 'Failed to start session';
      setServerMessage(String(msg));
      // create a short, safe summary for UI and log full object to console
      try {
        const respData = err?.response?.data;
        let summary = err?.message || 'Error';
        if (respData) {
          if (typeof respData === 'string') summary = respData;
          else if (respData.message) summary = respData.message;
          else if (respData.detail) summary = Array.isArray(respData.detail) ? JSON.stringify(respData.detail) : String(respData.detail);
          else summary = '[server error — see console]';
        }
        setRawError(summary);
        console.debug('full startSession error object:', err?.response?.data || err);
      } catch (e) {
        setRawError(String(err));
      }
    } finally {
      setIsRecording(false);
      setIsLoading(false);
    }
  }

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
            <div className="flex items-center gap-3">
              <a href="/citizen/profile" className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">JD</a>
            </div>
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
               <div className="w-full max-w-lg">
                <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Type or paste your grievance here (or use the mic)..." className="w-full p-3 border rounded-lg h-24 mb-3" />
                <div className="flex items-center gap-3">
                  <div
                    onClick={async () => {
                      // start browser speech recognition (if available) and send transcript to backend
                      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                      if (!SpeechRecognition) {
                        // fallback: use typed text instead — start session with typed text
                        setServerMessage('Speech recognition not supported in this browser. Sending typed text instead.');
                        await startSessionWithText(textInput || '');
                        return;
                      }

                      // don't recreate if already running
                      if (recognitionRef.current) {
                        recognitionRef.current.stop();
                        recognitionRef.current = null;
                        setIsRecording(false);
                        return;
                      }

                      setIsRecording(true);
                      try {
                        const recog = new SpeechRecognition();
                        recog.lang = 'en-US';
                        recog.interimResults = false;
                        recog.maxAlternatives = 1;

                        recog.onresult = async (event) => {
                          const transcript = (event.results[0] && event.results[0][0] && event.results[0][0].transcript) || '';
                          setTextInput(transcript);
                          // send to start session
                          await startSessionWithText(transcript);
                        };

                        recog.onerror = (ev) => {
                          console.error('Speech recognition error', ev);
                          setServerMessage('Speech recognition error: ' + (ev.error || ev.message || 'unknown'));
                          setIsRecording(false);
                          recognitionRef.current = null;
                        };

                        recog.onend = () => {
                          setIsRecording(false);
                          recognitionRef.current = null;
                        };

                        recognitionRef.current = recog;
                        recog.start();
                      } catch (err) {
                        console.error(err);
                        setServerMessage(err.message || 'Failed to start speech recognition');
                        setIsRecording(false);
                        recognitionRef.current = null;
                      }
                    }}
                    className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all ${isRecording ? 'bg-red-100 animate-pulse ring-4 ring-red-200' : 'bg-orange-100'}`}
                  >
                    <Mic size={28} className={isRecording ? 'text-red-500' : 'text-blue-600'} />
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => { setTextInput(''); setServerMessage(''); setRawError(null); }} className="px-3 py-2 bg-slate-100 rounded">Clear</button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Upload photo (optional)</label>
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setSelectedFile(file);
                      setIsLoading(true);
                      setServerMessage('Uploading photo and extracting info...');
                      try {
                        const fd = new FormData();
                        fd.append('text', textInput || '');
                        // include both field names to match backend expectations
                        fd.append('files', file);
                        fd.append('files[]', file);
                        const res = await grievanceAPI.start(fd);
                        const data = res.data || {};
                        setSessionId(data.session_id || null);
                        const extracted = data.extracted_data || {};
                        setExtractedData(extracted);
                        setFormFields({
                          category: extracted.category || formFields.category,
                          location: extracted.location || formFields.location,
                          description: extracted.description || formFields.description,
                        });
                        setMissingInfo(data.missing_info || []);
                        setClarificationQuestions(data.clarification_questions || []);
                        setIsComplete(Boolean(data.is_complete));
                        setServerMessage(data.message || 'Photo processed');
                        setStep(2);
                      } catch (err) {
                        console.error('photo upload error', err);
                        console.debug('photo upload response data:', err?.response?.data);
                        const msg = err?.response?.data?.message || err?.message || 'Photo upload failed';
                        setServerMessage(String(msg));
                        try {
                          const respData = err?.response?.data;
                          let summary = err?.message || 'Error';
                          if (respData) {
                            if (typeof respData === 'string') summary = respData;
                            else if (respData.message) summary = respData.message;
                            else if (respData.detail) summary = Array.isArray(respData.detail) ? JSON.stringify(respData.detail) : String(respData.detail);
                            else summary = '[server error — see console]';
                          }
                          setRawError(summary);
                          console.debug('full photo upload error object:', err?.response?.data || err);
                        } catch(e){ setRawError(String(err)); }
                      } finally {
                        setIsLoading(false);
                      }
                    }} />
                  </div>
                </div>
               </div>
                  <p className="mt-6 text-slate-500">{isRecording ? "Listening..." : "Tap to Speak"}</p>
                  {serverMessage && <div className="mt-3 text-sm text-slate-700">{serverMessage}</div>}
                  {rawError && <pre className="mt-2 p-2 text-xs bg-red-50 border border-red-100 text-red-700 rounded">{rawError}</pre>}
                
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
                {isLoading && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-700">Processing... {serverMessage}</div>
                )}
                <div className="bg-green-50 p-3 rounded-lg flex items-center gap-2 text-green-800 font-bold mb-6">
                    <CheckCircle size={18}/> AI Analyzed your voice
                </div>
                <form className="space-y-4">
                    <div className="text-xs text-slate-500">Session: <strong>{sessionId || '—'}</strong></div>
                    {serverMessage && <div className="text-sm text-slate-600">{serverMessage}</div>}
                    <div>
                        <label className="text-xs font-bold text-slate-400">CATEGORY</label>
                        <input type="text" value={formFields.category} onChange={(e) => setFormFields({...formFields, category: e.target.value})} className="w-full p-3 border rounded-lg font-bold text-slate-800 bg-white" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400">LOCATION</label>
                        <input type="text" value={formFields.location} onChange={(e) => setFormFields({...formFields, location: e.target.value})} className="w-full p-3 border rounded-lg text-slate-800 bg-white" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400">DESCRIPTION</label>
                        <textarea value={formFields.description} onChange={(e) => setFormFields({...formFields, description: e.target.value})} className="w-full p-3 border rounded-lg text-slate-800 bg-white h-24"></textarea>
                    </div>

                    {/* Missing info / Clarifications */}
                    {missingInfo && missingInfo.length > 0 && (
                      <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                        <div className="text-sm font-bold text-yellow-800 mb-2">Missing information detected</div>
                        <ul className="text-xs text-slate-600 space-y-1 mb-2">
                          {missingInfo.map((m) => (
                            <li key={m}>• {m}</li>
                          ))}
                        </ul>
                        {missingInfo.map((m) => (
                          <input key={m} placeholder={`Add ${m}`} value={clarifyAnswers[m] || ''} onChange={(e) => setClarifyAnswers({...clarifyAnswers, [m]: e.target.value})} className="w-full mb-2 p-2 border rounded" />
                        ))}
                          <div className="flex gap-2">
                          <button type="button" onClick={async () => {
                            try {
                              setIsLoading(true);
                              setServerMessage('Sending clarification...');
                              // Normalize answer keys and formats to match backend expectations
                              const normalizeAnswers = (answers) => {
                                const out = {};
                                for (const keyRaw of Object.keys(answers || {})) {
                                  const val = answers[keyRaw];
                                  const key = String(keyRaw).toLowerCase();
                                  if (key.includes('landmark')) {
                                    out['landmark'] = val;
                                  } else if (key.includes('area_ward') || key.includes('ward') || key.includes('area')) {
                                    out['area_ward_name'] = val;
                                  } else if (key.includes('incident') || key.includes('datetime')) {
                                    // convert date-only YYYY-MM-DD to ISO datetime with a safe default time
                                    if (/^\d{4}-\d{2}-\d{2}$/.test(String(val).trim())) {
                                      out['incident_datetime'] = String(val).trim() + 'T09:00:00+05:30';
                                    } else {
                                      out['incident_datetime'] = val;
                                    }
                                  } else if (key.includes('specific') || key.includes('location_hint') || key.includes('location details') || key.includes('location')) {
                                    out['location_hint'] = val;
                                  } else {
                                    out[keyRaw] = val;
                                  }
                                }
                                return out;
                              };

                              const normalized = normalizeAnswers(clarifyAnswers);
                              const payload = { session_id: sessionId, answers: normalized };
                              console.debug('clarify payload:', payload);
                              const resp = await grievanceAPI.clarify(payload);
                              const d = resp.data || {};
                              const extracted = d.extracted_data || {};
                              setExtractedData(extracted);
                              setFormFields({
                                category: extracted.category || formFields.category,
                                location: extracted.location || formFields.location,
                                description: extracted.description || formFields.description,
                              });
                              setMissingInfo(d.missing_info || []);
                              setClarificationQuestions(d.clarification_questions || []);
                              setIsComplete(Boolean(d.is_complete));
                              setServerMessage(d.message || 'Clarification submitted');
                              setRawError(null);
                            } catch (err) {
                              console.error('clarify error', err);
                              console.debug('clarify response data:', err?.response?.data);
                              const respData = err?.response?.data;
                              let summary = err?.message || 'Failed to send clarification';
                              if (respData) {
                                if (typeof respData === 'string') summary = respData;
                                else if (respData.message) summary = respData.message;
                                else if (respData.detail) summary = Array.isArray(respData.detail) ? JSON.stringify(respData.detail) : String(respData.detail);
                                else summary = '[server error — see console]';
                              }
                              setServerMessage(String(summary));
                              try {
                                setRawError(typeof respData === 'object' && respData !== null ? safeSerialize(respData) : String(respData));
                              } catch (e) {
                                setRawError(String(respData || err?.message || 'Error'));
                              }
                            } finally {
                              setIsLoading(false);
                            }
                          }} className="px-4 py-2 bg-blue-600 text-white rounded">Send Clarification</button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 items-center">
                      <div className="text-sm text-slate-500">Estimated SLA: <strong>{sampleTicketProgress.slaHours} hrs</strong></div>
                      <button type="button" onClick={async () => {
                        try {
                          const payload = { session_id: sessionId, confirmed: true, edits: formFields };
                          const res = await grievanceAPI.submit(payload);
                          const d = res.data || {};
                          setSubmittedFormResult(d);
                          // persist last form id for later lookup
                          const fid = d.form_id || d.formId || d.id || d.ticket_id;
                          if (fid) localStorage.setItem('last_form_id', fid);
                          if (sessionId) localStorage.setItem('last_session_id', sessionId);
                          setServerMessage(d.message || 'Submitted');
                          setStep(3);
                        } catch (err) {
                          console.error('submit error', err);
                          const msg = err?.response?.data?.message || err?.message || 'Failed to submit form';
                          setServerMessage(String(msg));
                        }
                      }} className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold">
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
                <p className="text-slate-500 mt-2">Ticket ID: {submittedFormResult?.form_id || sampleTicketProgress.id}</p>
                <p className="text-sm text-slate-500 mt-2">Status: <strong>{submittedFormResult?.status || 'Submitted'}</strong></p>

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