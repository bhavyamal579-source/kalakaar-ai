import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Sun,
  Moon,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { BrandKit } from '../types';

interface HeaderProps {
  onNewCampaign: () => void;
  brandKits: BrandKit[];
  activeBrandKit: BrandKit;
  onSelectBrandKit: (kit: BrandKit) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewCampaign,
  brandKits,
  activeBrandKit,
  onSelectBrandKit,
  isDark,
  onToggleTheme,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBrandMenu, setShowBrandMenu] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Campaign Generated',
      message: '30-second AI Beginners Reel is staged in calendar.',
      time: '10 min ago',
      type: 'success',
    },
    {
      id: 'notif-2',
      title: 'Autopilot Mission Active',
      message: 'Scheduled 3 posts this week under strict approval mode.',
      time: '1 hour ago',
      type: 'info',
    },
    {
      id: 'notif-3',
      title: 'Trend Alert',
      message: 'Autonomous Multi-Modal Content surged +98% momentum score.',
      time: '3 hours ago',
      type: 'trend',
    },
  ];

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Search / Command trigger */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search projects, scripts, trends, hooks..."
          className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 transition-colors"
        />
      </div>

      {/* Right Action Suite */}
      <div className="flex items-center gap-3">
        {/* Gemini Engine Active Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-[11px] tracking-wide">Gemini 3.8 Flash Active</span>
        </div>

        {/* Brand Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowBrandMenu(!showBrandMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: activeBrandKit.colors[0] || '#38BDF8' }}
            />
            <span className="font-medium truncate max-w-[120px]">{activeBrandKit.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showBrandMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50">
              <div className="px-2.5 py-1 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Switch Brand Profile
              </div>
              {brandKits.map((kit) => (
                <button
                  key={kit.id}
                  onClick={() => {
                    onSelectBrandKit(kit);
                    setShowBrandMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                    kit.id === activeBrandKit.id
                      ? 'bg-sky-500/10 text-sky-400 font-medium'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: kit.colors[0] || '#38BDF8' }}
                    />
                    <span className="truncate">{kit.name}</span>
                  </div>
                  {kit.id === activeBrandKit.id && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-sky-500 absolute top-1.5 right-1.5 ring-2 ring-slate-950" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-200">Studio Activity</span>
                <span className="text-[10px] text-sky-400 cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-slate-200">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* New Campaign Primary Button */}
        <button
          onClick={onNewCampaign}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-sm shadow-sky-500/25 transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Campaign</span>
        </button>
      </div>
    </header>
  );
};
