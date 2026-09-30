import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  History,
  RotateCcw,
  Check,
  ArrowRight,
  Sliders,
  Copy,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { GeneratedProject, ContentVersion } from '../types';
import { formatDateTime } from '../utils/helpers';

interface AIEditorDockProps {
  project: GeneratedProject;
  onApplyEdit: (instruction: string, section?: string) => Promise<void>;
  onRestoreVersion: (version: ContentVersion) => void;
  isApplyingEdit: boolean;
}

export const AIEditorDock: React.FC<AIEditorDockProps> = ({
  project,
  onApplyEdit,
  onRestoreVersion,
  isApplyingEdit,
}) => {
  const [instruction, setInstruction] = useState('');
  const [selectedSection, setSelectedSection] = useState<'all' | 'hook' | 'video' | 'instagram' | 'linkedin' | 'youtube' | 'whatsapp'>('all');
  const [editHistorySummary, setEditHistorySummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const quickCommands = [
    { label: 'Make the hook stronger & punchier', section: 'hook' as const },
    { label: 'Shorten content by 30% for high retention', section: 'all' as const },
    { label: 'Elevate tone to executive professional', section: 'linkedin' as const },
    { label: 'Simplify for complete beginners', section: 'all' as const },
    { label: 'Change CTA to download free resource', section: 'all' as const },
    { label: 'Make thumbnail headline high-contrast', section: 'video' as const },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isApplyingEdit) return;
    const current = instruction;
    setInstruction('');
    setEditHistorySummary(`Editing with: "${current}"...`);
    await onApplyEdit(current, selectedSection);
    setEditHistorySummary(`Applied: "${current}"`);
  };

  const handleQuickCommand = async (cmd: string, section: any) => {
    setSelectedSection(section);
    setEditHistorySummary(`Editing with: "${cmd}"...`);
    await onApplyEdit(cmd, section);
    setEditHistorySummary(`Applied: "${cmd}"`);
  };

  const handleCopyCurrent = () => {
    const textToCopy = project.videoStudio?.completeScript || project.platformVariants?.linkedin?.body || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
      {/* Dock Header */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-100">AI EDIT Studio</h3>
            <p className="text-[11px] text-slate-400">Conversational editing with non-destructive versioning</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCurrent}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Active Content'}</span>
          </button>
        </div>
      </div>

      {/* 3-Panel Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* Left Panel: AI Conversational Controls */}
        <div className="lg:col-span-4 border-r border-slate-800 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Target Area:</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">Entire Project</option>
                <option value="hook">Hook Variants</option>
                <option value="video">Video Studio & Script</option>
                <option value="instagram">Instagram Reel / Post</option>
                <option value="linkedin">LinkedIn Post</option>
                <option value="youtube">YouTube Content</option>
                <option value="whatsapp">WhatsApp Message</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Quick Assistant Commands:
              </div>
              <div className="space-y-1.5">
                {quickCommands.map((q, i) => (
                  <button
                    key={i}
                    disabled={isApplyingEdit}
                    onClick={() => handleQuickCommand(q.label, q.section)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <span className="truncate">{q.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-sky-400 shrink-0 ml-1.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conversational Input Box */}
          <form onSubmit={handleSubmit} className="space-y-2 pt-3 border-t border-slate-800/80">
            {editHistorySummary && (
              <div className="text-[11px] text-sky-400 flex items-center gap-1.5 font-medium truncate">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span className="truncate">{editHistorySummary}</span>
              </div>
            )}
            <div className="relative">
              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Tell AI what to modify... (e.g. 'Make scene 2 more dramatic and punch up the CTA')"
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 resize-none"
              />
              <button
                type="submit"
                disabled={!instruction.trim() || isApplyingEdit}
                className="absolute right-2 bottom-2 p-1.5 rounded-md bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-white transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Center Panel: Live Content Preview & Diff */}
        <div className="lg:col-span-5 p-5 space-y-4 overflow-y-auto max-h-[520px]">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-200">Active Live Content Canvas</span>
            <span className="text-[11px] text-slate-400">Autosaved in project</span>
          </div>

          <div className="space-y-4">
            {/* Hook Section */}
            <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1.5">
              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                Current Hook
              </span>
              <p className="text-xs font-semibold text-white leading-relaxed">
                "{project.videoStudio?.hook || project.hooks?.[0]?.hookText}"
              </p>
            </div>

            {/* Complete Script Section */}
            {project.videoStudio?.completeScript && (
              <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1.5">
                <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider">
                  Video Studio Script
                </span>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                  {project.videoStudio.completeScript}
                </p>
              </div>
            )}

            {/* Instagram / LinkedIn Caption preview */}
            {project.platformVariants?.linkedin?.body && (
              <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1.5">
                <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                  LinkedIn Post
                </span>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                  {project.platformVariants.linkedin.body}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Version History & Restores */}
        <div className="lg:col-span-3 border-l border-slate-800 p-5 space-y-4 bg-slate-900/20">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <History className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-200">Version History</span>
          </div>

          <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
            {(project.versionHistory || []).map((v, idx) => (
              <div
                key={v.id || idx}
                className="p-3 rounded-lg border border-slate-800/90 bg-slate-950/70 space-y-1.5 text-left"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-sky-400">{v.author} Edit</span>
                  <span>{formatDateTime(v.timestamp)}</span>
                </div>
                <p className="text-xs text-slate-200 line-clamp-2 leading-snug">{v.summary}</p>
                <button
                  onClick={() => onRestoreVersion(v)}
                  className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-white font-medium hover:underline pt-0.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore this version</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
