import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  ArrowRight,
  Layers,
  Video,
  FileText,
  Sliders,
  CheckCircle2,
  Copy,
  Download,
  Calendar,
  Eye,
  RefreshCw,
  Send,
  Camera,
  Play,
  Share2,
  Check,
  Palette,
  FileCode,
  AlertCircle,
} from 'lucide-react';
import {
  GeneratedProject,
  BrandKit,
  Platform,
  HookVariant,
  SceneBreakdown,
  ContentVersion,
} from '../types';
import { RealityPreview } from './RealityPreview';
import { AIEditorDock } from './AIEditorDock';
import {
  formatDate,
  downloadFile,
  generateSRTSubtitles,
  generateProjectMarkdown,
  getPlatformColor,
  getPlatformBadgeName,
} from '../utils/helpers';

interface UniversalCreatorViewProps {
  currentProject: GeneratedProject | null;
  brandKits: BrandKit[];
  activeBrandKit: BrandKit;
  onGenerateCampaign: (params: any) => Promise<void>;
  onApplyAIEdit: (instruction: string, section?: string) => Promise<void>;
  onScheduleProject: (project: GeneratedProject, date: string, platform: Platform) => void;
  onPublishSimulate: (platform: Platform, title: string, content: string) => Promise<any>;
  isGenerating: boolean;
  isApplyingEdit: boolean;
}

export const UniversalCreatorView: React.FC<UniversalCreatorViewProps> = ({
  currentProject,
  brandKits,
  activeBrandKit,
  onGenerateCampaign,
  onApplyAIEdit,
  onScheduleProject,
  onPublishSimulate,
  isGenerating,
  isApplyingEdit,
}) => {
  const [ideaPrompt, setIdeaPrompt] = useState(
    currentProject?.originalIdea ||
      'I want to make a 30-second Reel explaining how beginners can start learning AI for free in 2026.'
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    'instagram',
    'linkedin',
    'youtube',
    'whatsapp',
  ]);
  const [contentType, setContentType] = useState('full_campaign');
  const [targetAudience, setTargetAudience] = useState('Students, beginners, and ambitious creators');
  const [tone, setTone] = useState('Direct, high-energy, authoritative and actionable');
  const [duration, setDuration] = useState('30 seconds');
  const [contentGoal, setContentGoal] = useState('High saves, shareability, and lead conversion');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [studioTab, setStudioTab] = useState<
    'video' | 'hooks' | 'platforms' | 'strategy' | 'preview' | 'canvas' | 'edit' | 'export'
  >('video');

  const [activePlatformTab, setActivePlatformTab] = useState<Platform>('instagram');

  const [canvasRatio, setCanvasRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [canvasHeadline, setCanvasHeadline] = useState('LEARN AI FOR $0');
  const [canvasBg, setCanvasBg] = useState('#0F172A');
  const [canvasTextColor, setCanvasTextColor] = useState('#38BDF8');

  const [scheduleDate, setScheduleDate] = useState('2026-10-02T15:00');
  const [schedulePlatform, setSchedulePlatform] = useState<Platform>('instagram');
  const [publishFeedback, setPublishFeedback] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const togglePlatform = (p: Platform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaPrompt.trim() || isGenerating) return;

    await onGenerateCampaign({
      idea: ideaPrompt,
      targetPlatforms: selectedPlatforms,
      contentType,
      targetAudience,
      tone,
      duration,
      contentGoal,
      brandKit: activeBrandKit,
      sourceFilesSummary: uploadedFile ? `File name: ${uploadedFile.name}` : undefined,
    });
  };

  const handleSelectHook = (hook: HookVariant) => {
    if (!currentProject) return;
    onApplyAIEdit(`Use this hook as the primary video hook: "${hook.hookText}"`, 'hook');
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDirectPublish = async (p: Platform) => {
    if (!currentProject) return;
    const content =
      p === 'instagram'
        ? currentProject.platformVariants?.instagram?.caption
        : p === 'linkedin'
        ? currentProject.platformVariants?.linkedin?.body
        : p === 'youtube'
        ? currentProject.platformVariants?.youtube?.completeScript
        : currentProject.platformVariants?.whatsapp?.shortCopy;

    try {
      await onPublishSimulate(p, currentProject.title, content || '');
      setPublishFeedback(`Successfully staged to ${getPlatformBadgeName(p)} via official API.`);
      setTimeout(() => setPublishFeedback(null), 4000);
    } catch (err: any) {
      setPublishFeedback(`Publishing check error: ${err.message}`);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Studio Creation Header & Prompt Bar */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">AI Content Studio</h1>
              <p className="text-xs text-slate-400">
                Turn any idea, video request, or source document into a ready-to-publish campaign
              </p>
            </div>
          </div>

          {currentProject && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Active:</span>
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[220px]">
                {currentProject.title}
              </span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-2">
            <div className="relative rounded-xl border border-slate-700/80 bg-slate-950 p-3 focus-within:border-sky-500 transition-all">
              <textarea
                value={ideaPrompt}
                onChange={(e) => setIdeaPrompt(e.target.value)}
                rows={2}
                placeholder="Describe your idea (e.g. 'I want to make a 30-second Reel explaining how beginners can start learning AI for free in 2026')..."
                className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none resize-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span>{uploadedFile ? uploadedFile.name : 'Upload Source Document'}</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.mp4,.mp3"
                      className="hidden"
                      onChange={(e) => e.target.files && setUploadedFile(e.target.files[0])}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-400" />
                    <span>{showAdvanced ? 'Hide Controls' : 'Studio Controls'}</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!ideaPrompt.trim() || isGenerating}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all active:scale-[0.98]"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Campaign...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Complete Campaign</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Studio Controls Drawer */}
          {showAdvanced && (
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Target Platforms
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['instagram', 'linkedin', 'youtube', 'whatsapp'] as Platform[]).map((p) => {
                    const isSelected = selectedPlatforms.includes(p);
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => togglePlatform(p)}
                        className={`px-2.5 py-1 rounded text-xs capitalize transition-colors border ${
                          isSelected
                            ? 'bg-sky-500/10 border-sky-500/40 text-sky-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {getPlatformBadgeName(p)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Duration / Pacing
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="15 seconds">15 seconds (High impact)</option>
                  <option value="30 seconds">30 seconds (Standard Reel / Short)</option>
                  <option value="60 seconds">60 seconds (Comprehensive breakdown)</option>
                  <option value="3 minutes">3 minutes (Mini-documentary)</option>
                  <option value="10 minutes">10 minutes (Deep dive)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Tone of Voice
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="Direct, high-energy, authoritative and actionable">Direct & Actionable</option>
                  <option value="Storyteller, vulnerable, personal and inspiring">Vulnerable Storyteller</option>
                  <option value="Contrarian, bold, paradigm-challenging">Bold Contrarian</option>
                  <option value="Academic, structured, intellectual and rigorous">Rigorous & Analytical</option>
                  <option value="Casual, witty, self-aware and relatable">Casual & Relatable</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Primary Objective
                </label>
                <select
                  value={contentGoal}
                  onChange={(e) => setContentGoal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="High saves, shareability, and lead conversion">High Saves & Bookmarks</option>
                  <option value="High comments and algorithmic engagement">Comment Bait & Discussion</option>
                  <option value="Direct message inbound lead conversion">Inbound DM Leads</option>
                  <option value="Brand positioning and thought leadership">Authoritative Brand Building</option>
                </select>
              </div>
            </div>
          )}
        </form>
      </section>

      {/* Main Studio Workspace */}
      {currentProject && (
        <section className="space-y-6">
          {/* Studio Navigation Tabs */}
          <div className="border-b border-slate-800 flex items-center justify-between overflow-x-auto pb-px">
            <div className="flex items-center gap-1">
              {[
                { id: 'video', label: 'AI Video Studio', icon: <Video className="w-3.5 h-3.5" /> },
                { id: 'hooks', label: 'Hook Engine (7)', icon: <Sparkles className="w-3.5 h-3.5" /> },
                { id: 'platforms', label: 'Platform Engine', icon: <Share2 className="w-3.5 h-3.5" /> },
                { id: 'strategy', label: 'Strategy Brief', icon: <FileText className="w-3.5 h-3.5" /> },
                { id: 'preview', label: 'Reality Preview', icon: <Eye className="w-3.5 h-3.5 text-sky-400" /> },
                { id: 'canvas', label: 'Visual & Thumbnail Canvas', icon: <Palette className="w-3.5 h-3.5 text-pink-400" /> },
                { id: 'edit', label: 'AI EDIT', icon: <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> },
                { id: 'export', label: 'Publish & Export', icon: <Download className="w-3.5 h-3.5" /> },
              ].map((tab) => {
                const isActive = studioTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStudioTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                      isActive
                        ? 'border-sky-500 text-sky-400 bg-sky-500/5'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {publishFeedback && (
              <span className="text-xs text-emerald-400 font-medium px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                {publishFeedback}
              </span>
            )}
          </div>

          {/* TAB 1: AI VIDEO PRODUCTION STUDIO */}
          {studioTab === 'video' && (
            <div className="space-y-8">
              {/* Video Header & Hook Card */}
              <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-sky-400 tracking-wider">
                      Selected Video Hook
                    </span>
                    <h2 className="text-base font-bold text-white mt-1">
                      "{currentProject.videoStudio?.hook || currentProject.hooks?.[0]?.hookText}"
                    </h2>
                  </div>
                  <button
                    onClick={() => setStudioTab('hooks')}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                  >
                    Change Hook ({currentProject.hooks?.length || 7} variants available)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-3 border-t border-slate-800">
                  <div>
                    <span className="text-slate-400">Duration:</span>{' '}
                    <span className="font-semibold text-slate-200">
                      {currentProject.creativeBrief?.recommendedDuration || '30 seconds'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Audio Direction:</span>{' '}
                    <span className="font-semibold text-slate-200">
                      {currentProject.videoStudio?.musicDirection || 'Modern tech groove, 118 BPM'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Editing Pacing:</span>{' '}
                    <span className="font-semibold text-slate-200">Cut silences &lt; 0.15s, kinetic text</span>
                  </div>
                </div>
              </div>

              {/* Scene Breakdown Table / Storyboard */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Scene-by-Scene Production Breakdown</h3>
                    <p className="text-xs text-slate-400">
                      Shot types, camera movement, dialogue cues, and visual B-roll
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(currentProject.videoStudio?.completeScript || '', 'script')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white"
                  >
                    {copiedKey === 'script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Full Script</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(currentProject.videoStudio?.scenes || []).map((scene) => (
                    <div
                      key={scene.sceneNumber}
                      className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 transition-colors space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-bold">
                            Scene {scene.sceneNumber}
                          </span>
                          <span className="text-xs font-mono text-slate-400">{scene.timestamp}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="capitalize text-slate-300 font-medium">{scene.shotType}</span>
                          <span>·</span>
                          <span className="capitalize">{scene.cameraAngle}</span>
                          <span>·</span>
                          <span className="capitalize">{scene.cameraMovement}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-semibold text-slate-400">
                            Spoken Dialogue / Voice-Over
                          </span>
                          <p className="text-sm font-medium text-slate-100 leading-relaxed bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                            "{scene.dialogue || scene.voiceOver}"
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-semibold text-slate-400">
                            Visual & On-Screen Overlay
                          </span>
                          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 space-y-1.5">
                            <p className="text-xs text-slate-300">{scene.visual}</p>
                            {scene.onScreenText && (
                              <div className="inline-block px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold text-[11px]">
                                TEXT: {scene.onScreenText}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                        <div>
                          <span className="text-slate-400">B-Roll Suggestion:</span>{' '}
                          <span className="text-slate-300">{scene.bRoll}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Audio cue:</span>{' '}
                          <span className="text-slate-300">{scene.audio}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phone Shooting Assistant Guide */}
              <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 space-y-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-sky-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Phone Shooting Assistant</h3>
                    <p className="text-xs text-slate-400">
                      Step-by-step physical setup instructions to record this video on your phone or camera
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-sky-400">Framing & Position</span>
                    <p className="text-slate-300 leading-snug">
                      {currentProject.videoStudio?.shootingAssistant?.howToFrame ||
                        '9:16 vertical ratio. Align eyes with upper third line.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-amber-400">Lighting Setup</span>
                    <p className="text-slate-300 leading-snug">
                      {currentProject.videoStudio?.shootingAssistant?.lightingPosition ||
                        'Key light at 45 degrees. Warm ambient backlight.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-emerald-400">Audio Advice</span>
                    <p className="text-slate-300 leading-snug">
                      {currentProject.videoStudio?.shootingAssistant?.audioAdvice ||
                        'Use lapel mic 15cm from chest. Dampen echo with curtains.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-indigo-400">What to Perform</span>
                    <p className="text-slate-300 leading-snug">
                      {currentProject.videoStudio?.shootingAssistant?.whatActionToPerform ||
                        'Lean forward on hook word. Open hand gestures on steps.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOOK ENGINE (7 Distinct Angles) */}
          {studioTab === 'hooks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">7 Psychologically Proven Hook Angles</h3>
                  <p className="text-xs text-slate-400">
                    Click "Apply to Script" to set as primary video hook and headline
                  </p>
                </div>
                <button
                  onClick={() => onApplyAIEdit('Regenerate 7 fresh hook angles with higher virality and punch', 'hook')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate Hooks</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(currentProject.hooks || []).map((h) => {
                  const isCurrent = (currentProject.videoStudio?.hook || '').includes(h.hookText);
                  return (
                    <div
                      key={h.id}
                      className={`p-5 rounded-xl border transition-all space-y-3 ${
                        isCurrent
                          ? 'border-sky-500 bg-sky-950/20 shadow-lg shadow-sky-500/10'
                          : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                          {h.type} Hook
                        </span>
                        {isCurrent && (
                          <span className="flex items-center gap-1 text-[11px] text-sky-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active in Script</span>
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-white leading-snug">
                        "{h.hookText}"
                      </p>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        <strong className="text-slate-300">Why it works:</strong> {h.rationale}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          onClick={() => handleCopy(h.hookText, h.id)}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          {copiedKey === h.id ? 'Copied!' : 'Copy Hook'}
                        </button>
                        <button
                          onClick={() => handleSelectHook(h)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            isCurrent
                              ? 'bg-sky-500 text-white'
                              : 'bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-300'
                          }`}
                        >
                          {isCurrent ? 'Selected' : 'Apply to Script'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PLATFORM ENGINES */}
          {studioTab === 'platforms' && (
            <div className="space-y-6">
              {/* Platform Sub-Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                {(['instagram', 'linkedin', 'youtube', 'whatsapp'] as Platform[]).map((p) => {
                  const isActive = activePlatformTab === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setActivePlatformTab(p)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all border ${
                        isActive
                          ? `${getPlatformColor(p)} shadow-sm`
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {getPlatformBadgeName(p)} Adaptation
                    </button>
                  );
                })}
              </div>

              {/* Instagram Adaptation Card */}
              {activePlatformTab === 'instagram' && (
                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Instagram Native Post & Reel</h3>
                      <p className="text-xs text-slate-400">
                        Format: {currentProject.platformVariants?.instagram?.format} · Hook-first visual copy
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleCopy(currentProject.platformVariants?.instagram?.caption || '', 'ig-caption')
                        }
                        className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white"
                      >
                        {copiedKey === 'ig-caption' ? 'Copied Caption' : 'Copy Caption'}
                      </button>
                      <button
                        onClick={() => handleDirectPublish('instagram')}
                        className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-sm"
                      >
                        Publish via Meta API
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Caption & Line Breaks</span>
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                      {currentProject.platformVariants?.instagram?.caption}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-pink-400">Call to Action</span>
                      <p className="text-slate-300 font-medium">
                        {currentProject.platformVariants?.instagram?.callToAction}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Cover Concept</span>
                      <p className="text-slate-300">
                        {currentProject.platformVariants?.instagram?.coverConcept}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Hashtags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentProject.platformVariants?.instagram?.hashtags?.map((t, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-pink-300 border border-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LinkedIn Adaptation Card */}
              {activePlatformTab === 'linkedin' && (
                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">LinkedIn Thought Leadership Post</h3>
                      <p className="text-xs text-slate-400">
                        Architecture: {currentProject.platformVariants?.linkedin?.storytellingStructure}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleCopy(currentProject.platformVariants?.linkedin?.body || '', 'li-body')
                        }
                        className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white"
                      >
                        {copiedKey === 'li-body' ? 'Copied Post' : 'Copy Post'}
                      </button>
                      <button
                        onClick={() => handleDirectPublish('linkedin')}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm"
                      >
                        Publish via LinkedIn API
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Structured Post Body</span>
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                      {currentProject.platformVariants?.linkedin?.body}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-sky-400">Visual Concept</span>
                    <p className="text-slate-300">{currentProject.platformVariants?.linkedin?.visualConcept}</p>
                  </div>
                </div>
              )}

              {/* YouTube Adaptation Card */}
              {activePlatformTab === 'youtube' && (
                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">YouTube Video / Short Package</h3>
                      <p className="text-xs text-slate-400">Title testing variations, description & chapters</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleCopy(currentProject.platformVariants?.youtube?.description || '', 'yt-desc')
                        }
                        className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white"
                      >
                        {copiedKey === 'yt-desc' ? 'Copied Desc' : 'Copy Description'}
                      </button>
                      <button
                        onClick={() => handleDirectPublish('youtube')}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm"
                      >
                        Upload via YouTube API v3
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">High-CTR Title Variations</span>
                    <div className="space-y-1.5">
                      {(currentProject.platformVariants?.youtube?.titleVariations || []).map((t, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                        >
                          <span className="font-medium">{t}</span>
                          <button
                            onClick={() => handleCopy(t, `yt-t-${idx}`)}
                            className="text-slate-400 hover:text-white text-[11px]"
                          >
                            {copiedKey === `yt-t-${idx}` ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Description with Timestamps</span>
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                      {currentProject.platformVariants?.youtube?.description}
                    </div>
                  </div>
                </div>
              )}

              {/* WhatsApp Business Adaptation Card */}
              {activePlatformTab === 'whatsapp' && (
                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">WhatsApp Business Broadcast & Status</h3>
                      <p className="text-xs text-slate-400">High-converting direct response messaging</p>
                    </div>
                    <button
                      onClick={() => handleDirectPublish('whatsapp')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm"
                    >
                      Dispatch via WhatsApp Cloud API
                    </button>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Broadcast Copy</span>
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                      {currentProject.platformVariants?.whatsapp?.shortCopy}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Message Variations for Testing</span>
                    <div className="space-y-1.5">
                      {(currentProject.platformVariants?.whatsapp?.messageVariations || []).map((msg, i) => (
                        <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                          {msg}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: STRATEGY BRIEF */}
          {studioTab === 'strategy' && (
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Creative Strategy & Campaign Architecture</h3>
                <p className="text-xs text-slate-400">
                  Strategic intent, audience definition, and psychological anchor
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] uppercase font-semibold text-sky-400">Core Concept</span>
                  <p className="text-slate-200 font-medium leading-relaxed">
                    {currentProject.creativeBrief?.coreConcept}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] uppercase font-semibold text-indigo-400">Content Angle</span>
                  <p className="text-slate-200 leading-relaxed">
                    {currentProject.creativeBrief?.contentAngle}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] uppercase font-semibold text-emerald-400">Target Audience</span>
                  <p className="text-slate-200 leading-relaxed">
                    {currentProject.creativeBrief?.targetAudience}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] uppercase font-semibold text-amber-400">Key Takeaway</span>
                  <p className="text-slate-200 leading-relaxed">
                    {currentProject.creativeBrief?.keyMessage}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Visual & Aesthetic Direction</span>
                <p className="text-slate-300 leading-relaxed">
                  {currentProject.creativeBrief?.visualDirection}
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: REALITY PREVIEW */}
          {studioTab === 'preview' && (
            <RealityPreview
              project={currentProject}
              activePlatform={activePlatformTab}
              onChangePlatform={setActivePlatformTab}
            />
          )}

          {/* TAB 6: VISUAL & THUMBNAIL CANVAS */}
          {studioTab === 'canvas' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 p-6 rounded-xl border border-slate-800 bg-slate-900/40 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white">Visual & Thumbnail Canvas</h3>
                  <p className="text-xs text-slate-400">
                    Design social covers, thumbnails, and quotes with safe area guidance
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Aspect Ratio Preset
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['9:16', '1:1', '16:9'] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => setCanvasRatio(r)}
                          className={`py-1.5 rounded border font-semibold ${
                            canvasRatio === r
                              ? 'bg-sky-500/10 border-sky-500 text-sky-400'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Headline Text
                    </label>
                    <input
                      type="text"
                      value={canvasHeadline}
                      onChange={(e) => setCanvasHeadline(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                        Background Color
                      </label>
                      <input
                        type="color"
                        value={canvasBg}
                        onChange={(e) => setCanvasBg(e.target.value)}
                        className="w-full h-8 bg-slate-950 border border-slate-800 rounded cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                        Accent Text Color
                      </label>
                      <input
                        type="color"
                        value={canvasTextColor}
                        onChange={(e) => setCanvasTextColor(e.target.value)}
                        className="w-full h-8 bg-slate-950 border border-slate-800 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">
                    AI Thumbnail Concept:
                  </span>
                  <p className="text-xs text-slate-300">
                    {currentProject.videoStudio?.thumbnailConcept?.visualDescription ||
                      'Close-up of expressive speaker pointing towards bold text overlay.'}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center min-h-[460px]">
                <div
                  className="rounded-2xl border-2 border-slate-700 shadow-2xl flex flex-col justify-between p-6 text-center relative overflow-hidden transition-all"
                  style={{
                    backgroundColor: canvasBg,
                    width: canvasRatio === '9:16' ? '280px' : canvasRatio === '1:1' ? '360px' : '480px',
                    height: canvasRatio === '9:16' ? '490px' : canvasRatio === '1:1' ? '360px' : '270px',
                  }}
                >
                  <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    CONTENTOS STUDIO
                  </div>

                  <div className="space-y-2 my-auto">
                    <h2
                      className="text-2xl font-black uppercase tracking-tight leading-none"
                      style={{ color: canvasTextColor }}
                    >
                      {canvasHeadline}
                    </h2>
                    <p className="text-xs text-slate-300 font-medium">
                      The Inverted 3-Step Build Loop
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-slate-400 border-t border-white/10 pt-2">
                    <span>@kalakar.studio</span>
                    <span>SAVE THIS POST</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AI EDIT WORKSPACE */}
          {studioTab === 'edit' && (
            <AIEditorDock
              project={currentProject}
              onApplyEdit={onApplyAIEdit}
              onRestoreVersion={(v) => {
                onApplyAIEdit(`Restore project to version: ${v.summary}`);
              }}
              isApplyingEdit={isApplyingEdit}
            />
          )}

          {/* TAB 8: PUBLISH & EXPORT */}
          {studioTab === 'export' && (
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Publishing, Scheduling & Downloads</h3>
                <p className="text-xs text-slate-400">
                  Export complete production assets or stage in your content calendar
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Schedule Card */}
                <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-sky-400" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">Schedule to Content Calendar</h4>
                      <p className="text-[11px] text-slate-400">Choose date, time, and target platform</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Target Platform</label>
                      <select
                        value={schedulePlatform}
                        onChange={(e) => setSchedulePlatform(e.target.value as Platform)}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200"
                      >
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="youtube">YouTube</option>
                        <option value="whatsapp">WhatsApp Business</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Scheduled Date & Time</label>
                      <input
                        type="datetime-local"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200"
                      />
                    </div>

                    <button
                      onClick={() => {
                        onScheduleProject(currentProject, new Date(scheduleDate).toISOString(), schedulePlatform);
                        setPublishFeedback(`Scheduled to calendar for ${new Date(scheduleDate).toLocaleString()}`);
                      }}
                      className="w-full py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow-md transition-colors"
                    >
                      Confirm Schedule
                    </button>
                  </div>
                </div>

                {/* Direct Downloads Card */}
                <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">Download Campaign Files</h4>
                      <p className="text-[11px] text-slate-400">Download formatted assets for editing software</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() =>
                        downloadFile(
                          generateSRTSubtitles(currentProject),
                          `${currentProject.id}-subtitles.srt`
                        )
                      }
                      className="p-3 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-left space-y-1 transition-colors"
                    >
                      <span className="font-semibold text-sky-400 block">SRT Subtitles</span>
                      <span className="text-[10px] text-slate-400 block">Premiere / CapCut / Final Cut</span>
                    </button>

                    <button
                      onClick={() =>
                        downloadFile(
                          generateProjectMarkdown(currentProject),
                          `${currentProject.id}-brief.md`,
                          'text/markdown'
                        )
                      }
                      className="p-3 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-left space-y-1 transition-colors"
                    >
                      <span className="font-semibold text-amber-400 block">Markdown Brief</span>
                      <span className="text-[10px] text-slate-400 block">Full script & all platform copy</span>
                    </button>

                    <button
                      onClick={() =>
                        downloadFile(
                          JSON.stringify(currentProject, null, 2),
                          `${currentProject.id}-data.json`,
                          'application/json'
                        )
                      }
                      className="p-3 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-left space-y-1 transition-colors"
                    >
                      <span className="font-semibold text-emerald-400 block">JSON Export</span>
                      <span className="text-[10px] text-slate-400 block">Raw structured data</span>
                    </button>

                    <button
                      onClick={() =>
                        downloadFile(
                          currentProject.videoStudio?.completeScript || '',
                          `${currentProject.id}-script.txt`
                        )
                      }
                      className="p-3 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-left space-y-1 transition-colors"
                    >
                      <span className="font-semibold text-indigo-400 block">Teleprompter TXT</span>
                      <span className="text-[10px] text-slate-400 block">Spoken dialogue text</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
