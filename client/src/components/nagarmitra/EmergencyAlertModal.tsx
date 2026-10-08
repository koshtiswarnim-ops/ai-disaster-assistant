import React, { useState } from 'react';
import { AlertTriangle, X, MapPin, Send, Loader2, CheckCircle2, Siren } from 'lucide-react';
import { Language } from './RoleSwitcherBar';

interface EmergencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendEmergency: (data: {
    title: string;
    description: string;
    dangerType: string;
    location: string;
    lat: number;
    lng: number;
  }) => Promise<void>;
  language: Language;
}

const DANGERS = [
  { id: 'electrical', en: 'Exposed Live Wire / Electric Shock Hazard', hi: 'खुला बिजली का तार / करंट का खतरा' },
  { id: 'water_collapse', en: 'Water Main Burst / Road Collapse Risk', hi: 'पाइपलाइन फटना / सड़क धंसने का खतरा' },
  { id: 'manhole', en: 'Open Manhole / Uncovered Sewer Pit', hi: 'खुला मैनहोल / सीवर गड्ढा' },
  { id: 'structural', en: 'Wall / Tree / Structure Imminent Collapse', hi: 'दीवार / पेड़ गिरने का तात्कालिक जोखिम' },
];

export const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({
  isOpen,
  onClose,
  onSendEmergency,
  language,
}) => {
  const [dangerType, setDangerType] = useState(DANGERS[0].id);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleTrigger = async () => {
    setIsSubmitting(true);
    try {
      const selected = DANGERS.find((d) => d.id === dangerType);
      await onSendEmergency({
        title: selected?.en || 'Immediate Civic Emergency',
        description: details || `Immediate life-safety danger reported: ${selected?.en}. Fast municipal dispatch requested.`,
        dangerType: selected?.id || 'hazard',
        location: 'Ward 12, Main Bus Stop, Outer Ring Rd',
        lat: 28.6745,
        lng: 77.2215,
      });
      setSent(true);
      setTimeout(() => {
        setSent(false);
        onClose();
        setDetails('');
      }, 1800);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-scale-in">
      <div className="bg-[#fffbfb] border border-rose-300 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-200 bg-rose-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center animate-pulse">
              <Siren className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-black tracking-wider uppercase text-rose-700">
                {language === 'hi' ? 'तात्कालिक आपातकालीन चेतावनी' : 'PRIORITY 1 LIFE SAFETY ALERT'}
              </span>
              <h2 className="text-lg font-black text-rose-950 tracking-tight">
                {language === 'hi' ? 'गंभीर जोखिम रिपोर्ट' : 'Broadcast Emergency Alert'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-rose-600 animate-bounce" />
            <h3 className="text-xl font-bold text-rose-950">
              {language === 'hi' ? 'आपातकालीन अलर्ट प्रेषित!' : 'EMERGENCY DISPATCH TRIGGERED!'}
            </h3>
            <p className="text-sm text-rose-800 max-w-sm">
              {language === 'hi'
                ? 'वार्ड १२ की त्वरित प्रतिक्रिया टीम को जीपीएस लोकेशन और सायरन अलर्ट भेज दिया गया है।'
                : 'Rapid Response Field Unit dispatched. Live alert broadcasted to Civic Command Desk.'}
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <p className="text-xs text-rose-900 bg-rose-100/70 p-3 rounded-xl border border-rose-200 leading-relaxed font-medium">
              ⚠️ {language === 'hi'
                ? 'यह अलर्ट सीधे म्युनिसिपल कमांड सेंटर और फील्ड रिस्पॉन्डर्स को तत्काल कार्रवाई के लिए भेजा जाएगा।'
                : 'This immediately rings the Municipal Operations Desk and alerts nearest field workers on active duty.'}
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-2">
                {language === 'hi' ? 'खतरे का प्रकार चुनें' : 'Select Hazard Type'}
              </label>
              <div className="space-y-2">
                {DANGERS.map((d) => (
                  <label
                    key={d.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      dangerType === d.id
                        ? 'bg-rose-50 border-rose-600 text-rose-950 font-bold shadow-xs'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-rose-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="dangerType"
                      checked={dangerType === d.id}
                      onChange={() => setDangerType(d.id)}
                      className="accent-rose-600 w-4 h-4"
                    />
                    <span className="text-xs">{language === 'hi' ? d.hi : d.en}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-1">
                {language === 'hi' ? 'अतिरिक्त विवरण (वैकल्पिक)' : 'Specific Hazard Details (Optional)'}
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'उदा. पानी के गड्ढे में तार छू रहा है, तुरंत बिजली बंद करने की आवश्यकता है'
                    : 'e.g., Live wire touching rain puddle near bus stand, shock risk to pedestrians'
                }
                className="w-full bg-white border border-rose-200 rounded-xl px-3.5 py-2.5 text-xs text-rose-950 placeholder:text-stone-400 focus:outline-none focus:border-rose-600"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-600 bg-stone-100 p-2.5 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Location: <strong>Main Bus Stop, Outer Ring Rd, Ward 12</strong> (GPS: 28.6745, 77.2215)</span>
            </div>

            <button
              onClick={handleTrigger}
              disabled={isSubmitting}
              className="w-full bg-rose-700 hover:bg-rose-800 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 text-sm tracking-wide uppercase"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>{language === 'hi' ? 'तत्काल आपातकालीन अलर्ट भेजें' : 'Send Emergency Alert Now'}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
