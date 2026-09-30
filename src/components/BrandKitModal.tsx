import React, { useState } from 'react';
import { Sliders, Plus, Check, X, Trash2 } from 'lucide-react';
import { BrandKit } from '../types';

interface BrandKitModalProps {
  brandKits: BrandKit[];
  activeBrandKit: BrandKit;
  onSelectBrandKit: (kit: BrandKit) => void;
  onSaveBrandKit: (kit: BrandKit) => void;
  onClose: () => void;
}

export const BrandKitModal: React.FC<BrandKitModalProps> = ({
  brandKits,
  activeBrandKit,
  onSelectBrandKit,
  onSaveBrandKit,
  onClose,
}) => {
  const [selectedKit, setSelectedKit] = useState<BrandKit>(activeBrandKit);
  const [name, setName] = useState(selectedKit.name);
  const [tagline, setTagline] = useState(selectedKit.tagline);
  const [tone, setTone] = useState(selectedKit.tone);
  const [targetAudience, setTargetAudience] = useState(selectedKit.targetAudience);
  const [preferredWordInput, setPreferredWordInput] = useState('');
  const [blockedWordInput, setBlockedWordInput] = useState('');
  const [preferredWords, setPreferredWords] = useState<string[]>(selectedKit.preferredWords || []);
  const [blockedWords, setBlockedWords] = useState<string[]>(selectedKit.blockedWords || []);

  const handleSelect = (kit: BrandKit) => {
    setSelectedKit(kit);
    setName(kit.name);
    setTagline(kit.tagline);
    setTone(kit.tone);
    setTargetAudience(kit.targetAudience);
    setPreferredWords(kit.preferredWords || []);
    setBlockedWords(kit.blockedWords || []);
    onSelectBrandKit(kit);
  };

  const handleSave = () => {
    const updated: BrandKit = {
      ...selectedKit,
      name,
      tagline,
      tone,
      targetAudience,
      preferredWords,
      blockedWords,
    };
    onSaveBrandKit(updated);
    onClose();
  };

  const addPreferredWord = () => {
    if (preferredWordInput.trim()) {
      setPreferredWords([...preferredWords, preferredWordInput.trim()]);
      setPreferredWordInput('');
    }
  };

  const addBlockedWord = () => {
    if (blockedWordInput.trim()) {
      setBlockedWords([...blockedWords, blockedWordInput.trim()]);
      setBlockedWordInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-base font-bold text-white">Brand Kit & Voice DNA</h2>
              <p className="text-xs text-slate-400">Kalakar Content Studio auto-aligns every hook, script, and post with this kit</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">
            ×
          </button>
        </div>

        {/* Brand Kit Switcher Tabs */}
        <div className="flex items-center gap-2">
          {brandKits.map((k) => (
            <button
              key={k.id}
              onClick={() => handleSelect(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                selectedKit.id === k.id
                  ? 'bg-sky-500/10 border-sky-500 text-sky-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {k.name}
            </button>
          ))}
        </div>

        {/* Edit Fields */}
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Brand Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Tone of Voice Guidelines</label>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Preferred Words */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Preferred Brand Terminology (AI will emphasize these)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={preferredWordInput}
                onChange={(e) => setPreferredWordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPreferredWord())}
                placeholder="Add term and press Enter..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={addPreferredWord}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {preferredWords.map((w, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs flex items-center gap-1"
                >
                  <span>{w}</span>
                  <button
                    onClick={() => setPreferredWords(preferredWords.filter((_, idx) => idx !== i))}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Blocked Words */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Blocked Words (AI will strictly avoid these)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={blockedWordInput}
                onChange={(e) => setBlockedWordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBlockedWord())}
                placeholder="Add banned buzzword and press Enter..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={addBlockedWord}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {blockedWords.map((w, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-1"
                >
                  <span>{w}</span>
                  <button
                    onClick={() => setBlockedWords(blockedWords.filter((_, idx) => idx !== i))}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md"
          >
            Save Brand Kit
          </button>
        </div>
      </div>
    </div>
  );
};
