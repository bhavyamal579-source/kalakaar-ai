import React, { useState } from 'react';
import {
  Bot,
  Shield,
  Play,
  Pause,
  StopCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Lock,
  Plus,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { AutopilotPlan, Platform } from '../types';
import { formatDate, formatDateTime, getPlatformBadgeName, getPlatformColor } from '../utils/helpers';

interface AutopilotViewProps {
  plan: AutopilotPlan;
  onUpdatePlanStatus: (status: 'active' | 'paused' | 'completed') => void;
  onUpdateMode: (mode: 'approval_mode' | 'autonomous_mode') => void;
}

export const AutopilotView: React.FC<AutopilotViewProps> = ({
  plan,
  onUpdatePlanStatus,
  onUpdateMode,
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Bot className="w-3.5 h-3.5" />
            <span>Autonomous Management</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">AI Autopilot</h1>
          <p className="text-xs text-slate-400">
            Permission-controlled autonomous content generation, calendar staging, and publishing management
          </p>
        </div>

        {/* Status Actions */}
        <div className="flex items-center gap-2">
          {plan.status === 'active' ? (
            <button
              onClick={() => onUpdatePlanStatus('paused')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Autopilot</span>
            </button>
          ) : (
            <button
              onClick={() => onUpdatePlanStatus('active')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold shadow transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Resume Autopilot</span>
            </button>
          )}

          <button
            onClick={() => onUpdatePlanStatus('completed')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 text-xs font-semibold transition-colors"
          >
            <StopCircle className="w-3.5 h-3.5" />
            <span>End Mission</span>
          </button>
        </div>
      </div>

      {/* Security Constitution Banner */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Strict Autonomous Safety Boundaries Enforced</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          AI Autopilot operates under strict cryptographic and operational bounds: it cannot exceed your daily post limits, cannot connect unauthorized accounts, cannot modify its own permissions, cannot spend marketing budget, and automatically terminates on the end date.
        </p>
      </div>

      {/* Mission Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Operating Mode */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Operating Mode</span>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white capitalize">
              {plan.mode.replace('_', ' ')}
            </h3>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                plan.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {plan.status}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {plan.mode === 'approval_mode'
              ? 'AI prepares multi-platform content and stages in calendar, but requires human sign-off before publishing.'
              : 'AI is permitted to automatically publish posts that strictly adhere to all configured rules and limits.'}
          </p>
          <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={() =>
                onUpdateMode(plan.mode === 'approval_mode' ? 'autonomous_mode' : 'approval_mode')
              }
              className="text-xs text-sky-400 hover:underline font-medium"
            >
              Switch to {plan.mode === 'approval_mode' ? 'Autonomous Mode' : 'Approval Mode'}
            </button>
          </div>
        </div>

        {/* Card 2: Quota & Limits */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quota Progress</span>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-bold text-lg">
                {plan.currentPostsCreated} / {plan.maxTotalPosts} posts
              </span>
              <span className="text-slate-400">
                {Math.round((plan.currentPostsCreated / plan.maxTotalPosts) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{
                  width: `${(plan.currentPostsCreated / plan.maxTotalPosts) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="text-xs text-slate-400 space-y-1 pt-1">
            <div>Daily Limit: <strong className="text-slate-200">{plan.dailyPostingLimit} posts/day</strong></div>
            <div>Window: <strong className="text-slate-200">{formatDate(plan.startDate)} - {formatDate(plan.endDate)}</strong></div>
          </div>
        </div>

        {/* Card 3: Guardrails */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Safety Filters</span>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Allowed Platforms:</span>
              <span className="capitalize">{plan.allowedPlatforms.join(', ')}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Human Approval:</span>
              <span className="text-emerald-400 font-semibold">{plan.requireApproval ? 'Required' : 'Optional'}</span>
            </div>
            <div className="text-slate-400 pt-1">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block mb-1">Blocked Topics:</span>
              <div className="flex flex-wrap gap-1">
                {plan.blockedTopics.map((t, idx) => (
                  <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-red-300 border border-red-500/20">
                    ✕ {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Activity Log */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Autopilot Execution Audit Log</h3>
            <p className="text-xs text-slate-400">Verifiable trace of every action executed by the autonomous agent</p>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Audited & Signed</span>
          </span>
        </div>

        <div className="space-y-3">
          {plan.activityLog.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border capitalize font-semibold ${getPlatformColor(
                      log.platform
                    )}`}
                  >
                    {getPlatformBadgeName(log.platform)}
                  </span>
                  <span className="font-semibold text-white">{log.action}</span>
                </div>
                <p className="text-slate-400 text-[11px]">{log.details}</p>
              </div>

              <div className="flex items-center gap-3 text-right">
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                    log.status === 'approved' || log.status === 'executed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}
                >
                  {log.status.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {formatDateTime(log.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
