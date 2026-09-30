import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  FolderOpen,
  Calendar,
  TrendingUp,
  Image as ImageIcon,
  Bot,
  BarChart3,
  Link2,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { BrandKit } from '../types';

export type NavigationTab =
  | 'dashboard'
  | 'create'
  | 'projects'
  | 'calendar'
  | 'trends'
  | 'assets'
  | 'autopilot'
  | 'analytics'
  | 'accounts';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  brandKits: BrandKit[];
  activeBrandKit: BrandKit;
  onOpenBrandModal: () => void;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeBrandKit,
  onOpenBrandModal,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; highlight?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'create', label: 'AI Content Studio', icon: <Sparkles className="w-4 h-4 text-sky-400" />, highlight: true },
    { id: 'projects', label: 'Projects', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'calendar', label: 'Content Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'trends', label: 'Trend Radar', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'assets', label: 'Asset Library', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'autopilot', label: 'AI Autopilot', icon: <Bot className="w-4 h-4 text-emerald-400" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'accounts', label: 'Connected Accounts', icon: <Link2 className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm shadow-sky-500/20">
              K
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-100 tracking-tight text-sm">Kalakar</span>
                <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[140px]">Content Studio</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          <div className="px-3 pt-2 pb-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Workspace
          </div>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left group ${
                  isActive
                    ? 'bg-slate-800/90 text-white shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                }`}
              >
                <span className={`transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {item.icon}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Kit Card & Profile */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <button
          onClick={onOpenBrandModal}
          className="w-full p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Active Brand Kit</span>
            <Sliders className="w-3 h-3 text-slate-400 group-hover:text-slate-200" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {(activeBrandKit.colors || ['#0F172A', '#38BDF8']).slice(0, 3).map((c, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full border border-slate-950 inline-block"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-slate-200 truncate flex-1">{activeBrandKit.name}</span>
          </div>
        </button>

        {/* User Account Info */}
        <div className="px-2 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-medium text-[10px]">
              B
            </div>
            <span className="truncate max-w-[130px]">bhavyamal579</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Pro</span>
        </div>
      </div>
    </aside>
  );
};
