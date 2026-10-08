import React, { useState } from 'react';
import { X, MapPin, Mic, Camera, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Language } from './RoleSwitcherBar';

interface ReportProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category: string;
    title: string;
    description: string;
    location: string;
    lat: number;
    lng: number;
  }) => Promise<void>;
  language: Language;
}

const CATEGORIES = [
  { id: 'electrical', en: 'Electrical & Street Lighting', hi: 'विद्युत एवं स्ट्रीट लाइट', icon: '💡' },
  { id: 'road', en: 'Road Infrastructure & Potholes', hi: 'सड़क एवं गड्ढे', icon: '🛣️' },
  { id: 'water', en: 'Water Supply & Pipeline Leak', hi: 'जल आपूर्ति एवं पाइपलाइन लीकेज', icon: '🚰' },
  { id: 'sanitation', en: 'Sanitation & Garbage Overflow', hi: 'सफाई एवं कचरा प्रबंधन', icon: '🗑️' },
  { id: 'drainage', en: 'Open Drain & Sewage Hazard', hi: 'खुला नाला एवं सीवर जोखिम', icon: '⚠️' }
];

export const ReportProblemModal: React.FC<ReportProblemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  language,
}) => {
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Ward 12, Main Market Road');
  const [lat, setLat] = useState(28.6745);
  const [lng, setLng] = useState(77.2215);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  if (!isOpen) return null;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocation(`Ward 12 (GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleVoiceRecord = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(language === 'hi' ? 'वॉइस इनपुट इस ब्राउज़र में उपलब्ध नहीं है' : 'Voice recognition not supported in this browser');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.start();
    setIsRecording(true);

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setDescription((prev) => (prev ? `${prev} ${speechToText}` : speechToText));
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedCat = CATEGORIES.find(c => c.id === category)?.en || category;
      await onSubmit({
        category: selectedCat,
        title,
        description: description || title,
        location,
        lat,
        lng,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setTitle('');
        setDescription('');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-scale-in">
      <div className="bg-[#fbf9f4] border border-stone-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-stone-500">
              {language === 'hi' ? 'नागरमित्र • वार्ड १२' : 'NAGARMITRA • WARD 12'}
            </span>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              {language === 'hi' ? 'समस्या की शिकायत दर्ज करें' : 'Report a Civic Problem'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 animate-bounce" />
            <h3 className="text-xl font-bold text-stone-900">
              {language === 'hi' ? 'शिकायत सफलतापूर्वक दर्ज हुई!' : 'Complaint Registered Successfully!'}
            </h3>
            <p className="text-sm text-stone-600 max-w-sm">
              {language === 'hi'
                ? 'वार्ड १२ की टीम को सूचित कर दिया गया है। स्थिति को "My Complaints" में ट्रैक करें।'
                : 'Dispatched to Ward 12 Municipal desk. Tracking ID #NM-1026 has been generated.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                {language === 'hi' ? 'समस्या की श्रेणी' : 'Select Category'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                      category === c.id
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span className="truncate">{language === 'hi' ? c.hi : c.en}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                {language === 'hi' ? 'समस्या का शीर्षक' : 'Problem Title'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'उदा. बस स्टैंड के पास टूटा हुआ स्ट्रीट लाइट'
                    : 'e.g., Broken streetlight near bus stand, water pipeline leak'
                }
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Description & Voice Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  {language === 'hi' ? 'विवरण' : 'Description'}
                </label>
                <button
                  type="button"
                  onClick={handleVoiceRecord}
                  className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium transition-colors ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  <span>{isRecording ? (language === 'hi' ? 'सुन रहा है...' : 'Listening...') : (language === 'hi' ? 'बोल कर लिखें' : 'Voice Input')}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'विस्तार से बताएं कि समस्या क्या है और नागरिकों को क्या असुविधा हो रही है...'
                    : 'Describe what happened, any immediate hazard, and how it is affecting pedestrians or vehicles...'
                }
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Location & GPS */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                {language === 'hi' ? 'स्थान / पता' : 'Location / Address'}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
                >
                  {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                  <span>{language === 'hi' ? 'जीपीएस' : 'Fetch GPS'}</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#262320] hover:bg-stone-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{language === 'hi' ? 'शिकायत जमा करें' : 'Submit Problem Report'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
