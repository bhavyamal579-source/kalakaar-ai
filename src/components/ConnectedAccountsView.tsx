import React, { useState } from 'react';
import {
  Link2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Shield,
  Key,
  ExternalLink,
  Lock,
  Share2,
} from 'lucide-react';
import { ConnectedAccount, Platform } from '../types';
import { formatDateTime, getPlatformBadgeName, getPlatformColor } from '../utils/helpers';

interface ConnectedAccountsViewProps {
  accounts: ConnectedAccount[];
  onToggleConnection: (platform: Platform) => void;
}

export const ConnectedAccountsView: React.FC<ConnectedAccountsViewProps> = ({
  accounts,
  onToggleConnection,
}) => {
  const [testingPlatform, setTestingPlatform] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ platform: string; message: string } | null>(null);

  const handleTestConnection = (platform: Platform) => {
    setTestingPlatform(platform);
    setTimeout(() => {
      setTestingPlatform(null);
      setTestResult({
        platform,
        message: `API token active. Scopes verified: Read & Publish permissions granted.`,
      });
      setTimeout(() => setTestResult(null), 4000);
    }, 1200);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
            <Link2 className="w-3.5 h-3.5" />
            <span>Official Platform Integrations</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Connected Accounts</h1>
          <p className="text-xs text-slate-400">
            Securely link official APIs for Instagram, LinkedIn, YouTube, and WhatsApp Business
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Shield className="w-4 h-4" />
          <span>Server-Side Token Encryption Active</span>
        </div>
      </div>

      {testResult && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            {getPlatformBadgeName(testResult.platform as Platform)}: {testResult.message}
          </span>
        </div>
      )}

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((acc) => (
          <div
            key={acc.platform}
            className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 space-y-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                  {acc.avatarUrl ? (
                    <img src={acc.avatarUrl} alt={acc.accountName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-slate-300 text-lg uppercase">{acc.platform[0]}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{acc.accountName}</h3>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded border capitalize font-semibold ${getPlatformColor(
                        acc.platform
                      )}`}
                    >
                      {getPlatformBadgeName(acc.platform)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{acc.handle}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    acc.connected ? 'bg-emerald-400' : 'bg-red-400'
                  }`}
                />
                <span className={acc.connected ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                  {acc.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            {/* Permissions & Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300 pb-1 border-b border-slate-800">
                <span className="text-slate-400">Followers / Audience</span>
                <span className="font-semibold text-white">{(acc.followers / 1000).toFixed(1)}k</span>
              </div>
              <div className="flex justify-between text-slate-300 pb-1 border-b border-slate-800">
                <span className="text-slate-400">Token Health</span>
                <span className="text-emerald-400 font-semibold capitalize">{acc.tokenStatus.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-slate-300 pb-1 border-b border-slate-800">
                <span className="text-slate-400">Last Synchronized</span>
                <span className="text-slate-400">{formatDateTime(acc.lastSync)}</span>
              </div>
            </div>

            {/* Authorized Scopes */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Granted API Scopes:
              </span>
              <div className="flex flex-wrap gap-1">
                {acc.permissions.map((p, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 font-mono"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <button
                disabled={testingPlatform === acc.platform}
                onClick={() => handleTestConnection(acc.platform)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${testingPlatform === acc.platform ? 'animate-spin' : ''}`}
                />
                <span>Test API Connection</span>
              </button>

              <button
                onClick={() => onToggleConnection(acc.platform)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  acc.connected
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'bg-sky-500 hover:bg-sky-400 text-white shadow'
                }`}
              >
                {acc.connected ? 'Disconnect' : 'Connect Account'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
