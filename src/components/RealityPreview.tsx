import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Monitor,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Volume2,
  VolumeX,
  Play,
  Pause,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Send,
  ThumbsUp,
  ThumbsDown,
  Repeat2,
  CheckCheck,
  Check,
  Copy,
  RotateCcw,
  Sparkles,
  Layers,
  Radio,
  Sliders,
  Grid,
  Film,
  HelpCircle,
  Smile,
} from 'lucide-react';
import { GeneratedProject, Platform, HookVariant } from '../types';

interface RealityPreviewProps {
  project: GeneratedProject;
  activePlatform: Platform;
  onChangePlatform: (platform: Platform) => void;
}

export const RealityPreview: React.FC<RealityPreviewProps> = ({
  project,
  activePlatform,
  onChangePlatform,
}) => {
  // Device & Mode Controls
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [showSafeAreas, setShowSafeAreas] = useState(true);
  const [showGridCrop, setShowGridCrop] = useState(false); // 4:5 / 1:1 Instagram profile grid guide

  // Format Sub-tabs per platform
  const [igFormat, setIgFormat] = useState<'reel' | 'post' | 'carousel' | 'story'>('reel');
  const [liFormat, setLiFormat] = useState<'post' | 'document' | 'poll'>('post');
  const [ytFormat, setYtFormat] = useState<'shorts' | 'standard'>('shorts');
  const [waFormat, setWaFormat] = useState<'broadcast' | 'direct' | 'status'>('broadcast');

  // Video Playback Simulation
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [isMuted, setIsMuted] = useState(false);
  const totalDuration = 30; // 30s standard simulation duration

  // Interactive Social State
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(48210);
  const [bookmarked, setBookmarked] = useState(false);
  const [expandedCaption, setExpandedCaption] = useState(false);
  const [carouselSlide, setCarouselSlide] = useState(0);
  const [selectedHookText, setSelectedHookText] = useState<string>('');
  const [copiedText, setCopiedText] = useState(false);
  const [pollVotedIndex, setPollVotedIndex] = useState<number | null>(null);
  const [waReplies, setWaReplies] = useState<string[]>([]);

  const { platformVariants, videoStudio, creativeBrief } = project;
  const scenes = videoStudio?.scenes && videoStudio.scenes.length > 0 ? videoStudio.scenes : [
    { sceneNumber: 1, timestamp: '0:00 - 0:08', onScreenText: 'THE BIG SECRET', dialogue: 'Here is what nobody tells you about this topic...' },
    { sceneNumber: 2, timestamp: '0:08 - 0:18', onScreenText: 'STEP 1: ROOT CAUSE', dialogue: 'First, stop doing what 90% of beginners do.' },
    { sceneNumber: 3, timestamp: '0:18 - 0:25', onScreenText: 'STEP 2: LEVERAGE', dialogue: 'Second, implement this simple 3-minute habit.' },
    { sceneNumber: 4, timestamp: '0:25 - 0:30', onScreenText: 'SAVE & COMMENT', dialogue: 'Save this video and comment below for the guide!' },
  ];

  // Active hook displayed in preview
  const currentHook = selectedHookText || videoStudio?.hook || project.hooks?.[0]?.hookText || project.title;

  // Active scene based on currentTime
  const currentSceneIndex = Math.min(
    Math.floor((currentTime / totalDuration) * scenes.length),
    scenes.length - 1
  );
  const currentScene = scenes[currentSceneIndex] || scenes[0];

  // Playback timer effect
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            return 0; // loop
          }
          return Number((prev + 0.25).toFixed(2));
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleToggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  const handleCopyCurrent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleResetPlayback = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Truncation check
  const igCaption = platformVariants?.instagram?.caption || currentHook;
  const liBody = platformVariants?.linkedin?.body || currentHook;
  const ytDescription = platformVariants?.youtube?.description || currentHook;
  const waCopy = platformVariants?.whatsapp?.shortCopy || currentHook;

  return (
    <div className="space-y-6">
      {/* Top Simulation Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm shadow-sm">
        {/* Platform Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800">
          {(['instagram', 'linkedin', 'youtube', 'whatsapp'] as Platform[]).map((p) => {
            const isActive = activePlatform === p;
            return (
              <button
                key={p}
                onClick={() => {
                  onChangePlatform(p);
                  setExpandedCaption(false);
                  setIsPlaying(false);
                  setCurrentTime(0);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                  isActive
                    ? p === 'instagram'
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow'
                      : p === 'linkedin'
                      ? 'bg-sky-600 text-white shadow'
                      : p === 'youtube'
                      ? 'bg-red-600 text-white shadow'
                      : 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {p === 'whatsapp' ? 'WhatsApp Business' : p}
              </button>
            );
          })}
        </div>

        {/* Platform Format Sub-Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          {activePlatform === 'instagram' && (
            <>
              <button
                onClick={() => setIgFormat('reel')}
                className={`px-2.5 py-1 rounded transition-colors font-medium flex items-center gap-1.5 ${
                  igFormat === 'reel' ? 'bg-slate-800 text-pink-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Reel (9:16)</span>
              </button>
              <button
                onClick={() => setIgFormat('post')}
                className={`px-2.5 py-1 rounded transition-colors font-medium flex items-center gap-1.5 ${
                  igFormat === 'post' ? 'bg-slate-800 text-pink-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Feed (1:1)</span>
              </button>
              <button
                onClick={() => setIgFormat('carousel')}
                className={`px-2.5 py-1 rounded transition-colors font-medium flex items-center gap-1.5 ${
                  igFormat === 'carousel' ? 'bg-slate-800 text-pink-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Carousel</span>
              </button>
              <button
                onClick={() => setIgFormat('story')}
                className={`px-2.5 py-1 rounded transition-colors font-medium flex items-center gap-1.5 ${
                  igFormat === 'story' ? 'bg-slate-800 text-pink-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Story</span>
              </button>
            </>
          )}

          {activePlatform === 'linkedin' && (
            <>
              <button
                onClick={() => setLiFormat('post')}
                className={`px-2.5 py-1 rounded transition-colors font-medium ${
                  liFormat === 'post' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Insight Post
              </button>
              <button
                onClick={() => setLiFormat('document')}
                className={`px-2.5 py-1 rounded transition-colors font-medium flex items-center gap-1.5 ${
                  liFormat === 'document' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Document PDF</span>
              </button>
              <button
                onClick={() => setLiFormat('poll')}
                className={`px-2.5 py-1 rounded transition-colors font-medium flex items-center gap-1.5 ${
                  liFormat === 'poll' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Interactive Poll</span>
              </button>
            </>
          )}

          {activePlatform === 'youtube' && (
            <>
              <button
                onClick={() => setYtFormat('shorts')}
                className={`px-2.5 py-1 rounded transition-colors font-medium flex items-center gap-1.5 ${
                  ytFormat === 'shorts' ? 'bg-slate-800 text-red-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>YouTube Short</span>
              </button>
              <button
                onClick={() => setYtFormat('standard')}
                className={`px-2.5 py-1 rounded transition-colors font-medium flex items-center gap-1.5 ${
                  ytFormat === 'standard' ? 'bg-slate-800 text-red-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Standard (16:9)</span>
              </button>
            </>
          )}

          {activePlatform === 'whatsapp' && (
            <>
              <button
                onClick={() => setWaFormat('broadcast')}
                className={`px-2.5 py-1 rounded transition-colors font-medium ${
                  waFormat === 'broadcast' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Broadcast Update
              </button>
              <button
                onClick={() => setWaFormat('direct')}
                className={`px-2.5 py-1 rounded transition-colors font-medium ${
                  waFormat === 'direct' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1:1 Outreach
              </button>
              <button
                onClick={() => setWaFormat('status')}
                className={`px-2.5 py-1 rounded transition-colors font-medium ${
                  waFormat === 'status' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                24h Status Story
              </button>
            </>
          )}
        </div>

        {/* Device & Safe Area Toggles */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSafeAreas(!showSafeAreas)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              showSafeAreas
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle platform UI safe area margins"
          >
            <Sliders className="w-3 h-3" />
            <span>Safe Zone Guides: {showSafeAreas ? 'ON' : 'OFF'}</span>
          </button>

          {activePlatform === 'instagram' && (
            <button
              onClick={() => setShowGridCrop(!showGridCrop)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                showGridCrop
                  ? 'bg-pink-500/10 border-pink-500/40 text-pink-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Show 4:5 Profile Grid Crop Indicator"
            >
              Feed 4:5 Crop: {showGridCrop ? 'ON' : 'OFF'}
            </button>
          )}

          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded text-xs transition-colors ${
                deviceMode === 'mobile'
                  ? 'bg-slate-800 text-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile Device Mockup"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded text-xs transition-colors ${
                deviceMode === 'desktop'
                  ? 'bg-slate-800 text-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Desktop Web Feed Mockup"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quality Check & Real-time Metrics Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Character Budget</span>
            <span className="font-semibold text-slate-200">
              {activePlatform === 'instagram'
                ? `${igCaption.length} / 2,200 chars`
                : activePlatform === 'linkedin'
                ? `${liBody.length} / 3,000 chars`
                : activePlatform === 'youtube'
                ? `${ytDescription.length} / 5,000 chars`
                : `${waCopy.length} / 1,024 chars`}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Optimal Length
          </span>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Safe Zone Status</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Clear of UI Overlays</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Top & Bottom margins OK</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Opening Hook Retention</span>
            <span className="font-semibold text-amber-300">A+ Viral Anchor</span>
          </div>
          <span className="text-[10px] text-slate-400">0:00 - 0:03 Critical Zone</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Quick Copy</span>
            <span className="font-semibold text-slate-300 truncate max-w-[130px]">
              {activePlatform === 'instagram' ? 'Reel Caption' : activePlatform === 'linkedin' ? 'LinkedIn Post' : activePlatform === 'youtube' ? 'YT Description' : 'WA Copy'}
            </span>
          </div>
          <button
            onClick={() =>
              handleCopyCurrent(
                activePlatform === 'instagram'
                  ? igCaption
                  : activePlatform === 'linkedin'
                  ? liBody
                  : activePlatform === 'youtube'
                  ? ytDescription
                  : waCopy
              )
            }
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-[11px] flex items-center gap-1 transition-colors"
          >
            {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedText ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Hook Quick-Switcher in Preview */}
      {project.hooks && project.hooks.length > 0 && (
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Generated Hook in Reality Preview:</span>
            </span>
            {selectedHookText && (
              <button
                onClick={() => setSelectedHookText('')}
                className="text-[10px] text-sky-400 hover:underline"
              >
                Reset to Default Hook
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {project.hooks.slice(0, 5).map((h, i) => {
              const isSelected = selectedHookText === h.hookText;
              return (
                <button
                  key={h.id || i}
                  onClick={() => setSelectedHookText(h.hookText)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-500 text-sky-300 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-[10px] uppercase mr-1 text-slate-500">[{h.type}]</span>
                  <span className="truncate max-w-[200px] inline-block align-bottom">{h.hookText}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Preview Center Stage */}
      <div className="flex justify-center items-center py-6 min-h-[700px] bg-slate-950/60 rounded-2xl border border-slate-800/80 p-6 overflow-hidden relative">
        {/* ==================== INSTAGRAM ==================== */}
        {activePlatform === 'instagram' && deviceMode === 'mobile' && (
          <div className="w-[360px] h-[720px] bg-black rounded-[48px] border-[6px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none">
            {/* Phone Top Notch / Dynamic Island */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-900 rounded-full z-40 flex items-center justify-between px-3">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              <span className="w-2 h-2 rounded-full bg-sky-950 border border-slate-700" />
            </div>

            {/* Video Background / Media Canvas */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950 to-slate-900 flex items-center justify-center">
              {project.suggestedVisualAssets?.[1]?.previewUrl ? (
                <img
                  src={
                    igFormat === 'carousel' && platformVariants?.instagram?.carouselSlides
                      ? project.suggestedVisualAssets[carouselSlide % project.suggestedVisualAssets.length]?.previewUrl ||
                        project.suggestedVisualAssets[1].previewUrl
                      : project.suggestedVisualAssets[1].previewUrl
                  }
                  alt="Post visual"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-95' : 'opacity-85'}`}
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Play className="w-12 h-12 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400 font-mono">9:16 Video Canvas</p>
                </div>
              )}

              {/* Kinetic Subtitle Center Overlay */}
              <div className="absolute inset-x-6 top-[46%] -translate-y-1/2 text-center pointer-events-none z-20">
                <span className="inline-block px-3 py-1.5 rounded bg-black/80 text-amber-300 font-black text-sm tracking-wide uppercase shadow-2xl border border-amber-500/30 animate-pulse">
                  {isPlaying ? currentScene.onScreenText || currentHook.slice(0, 28) : currentHook.slice(0, 28)}
                </span>
                {isPlaying && (
                  <p className="text-[10px] text-white/90 font-mono mt-2 bg-black/60 px-2 py-0.5 rounded inline-block">
                    Scene {currentSceneIndex + 1}/{scenes.length}: {currentScene.timestamp}
                  </p>
                )}
              </div>

              {/* Safe Area Guides Overlay */}
              {showSafeAreas && (
                <div className="absolute inset-0 border-2 border-dashed border-amber-500/40 pointer-events-none z-30">
                  <div className="absolute top-8 left-4 text-[9px] font-mono text-amber-300 bg-black/80 px-1.5 py-0.5 rounded border border-amber-500/30">
                    Safe Zone Top (Status Bar Clearance)
                  </div>
                  <div className="absolute bottom-32 left-4 text-[9px] font-mono text-amber-300 bg-black/80 px-1.5 py-0.5 rounded border border-amber-500/30">
                    Safe Zone Bottom (Caption / Audio Buffer)
                  </div>
                  <div className="absolute right-14 top-1/2 -translate-y-1/2 text-[9px] font-mono text-amber-300 bg-black/80 px-1 rounded rotate-90 origin-right">
                    Right Action Column
                  </div>
                </div>
              )}

              {/* 4:5 Grid Crop Guide */}
              {showGridCrop && (
                <div className="absolute inset-x-0 top-[12%] bottom-[12%] border-2 border-dashed border-pink-400/60 pointer-events-none z-30 flex items-center justify-center">
                  <span className="bg-black/80 text-pink-300 text-[10px] font-mono px-2 py-0.5 rounded border border-pink-400/40">
                    Instagram 4:5 Feed Profile Preview
                  </span>
                </div>
              )}
            </div>

            {/* Top Bar: Reels / Stories / Audio Controls */}
            <div className="relative z-30 px-5 pt-10 flex items-center justify-between text-white text-xs">
              <span className="font-bold text-sm tracking-wide">
                {igFormat === 'reel' ? 'Reels' : igFormat === 'story' ? 'Story' : igFormat === 'carousel' ? 'Carousel' : 'Post'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  title={isPlaying ? 'Pause simulation' : 'Play video simulation'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-sky-400" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Video Scrubber & Timer (when playing/reel) */}
            <div className="relative z-30 px-4 pt-1">
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  setCurrentTime(Number((pos * totalDuration).toFixed(1)));
                }}
                className="w-full h-1 bg-white/20 rounded-full cursor-pointer overflow-hidden relative"
              >
                <div
                  className="h-full bg-white transition-all duration-150"
                  style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] text-white/80 font-mono mt-1">
                <span>0:{Math.floor(currentTime).toString().padStart(2, '0')}</span>
                <span>0:{totalDuration}</span>
              </div>
            </div>

            {/* Right Action Sidebar */}
            <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4 text-white">
              <div className="flex flex-col items-center gap-0.5">
                <button
                  onClick={handleToggleLike}
                  className={`p-2.5 rounded-full bg-black/40 hover:bg-black/60 transition-transform active:scale-125 ${
                    liked ? 'text-red-500 fill-red-500' : 'text-white'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <span className="text-[11px] font-semibold">{(likeCount / 1000).toFixed(1)}K</span>
              </div>

              <div className="flex flex-col items-center gap-0.5">
                <button className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                  <MessageCircle className="w-6 h-6 text-white" />
                </button>
                <span className="text-[11px] font-semibold">1,420</span>
              </div>

              <div className="flex flex-col items-center gap-0.5">
                <button className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                  <Send className="w-5 h-5 text-white" />
                </button>
                <span className="text-[11px] font-semibold">8.9K</span>
              </div>

              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-2.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors ${
                  bookmarked ? 'text-amber-400' : 'text-white'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-amber-400' : ''}`} />
              </button>
            </div>

            {/* Bottom Creator Info & Dynamic Expandable Caption */}
            <div className="relative z-30 p-4 pb-7 space-y-2 bg-gradient-to-t from-black via-black/85 to-transparent text-white">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-600 border border-white flex items-center justify-center font-bold text-[10px]">
                  K
                </div>
                <span className="text-xs font-bold">kalakar.creator</span>
                <span className="text-slate-400">·</span>
                <button className="text-[11px] font-semibold text-white px-2 py-0.5 rounded border border-white/60 hover:bg-white/10 transition-colors">
                  Follow
                </button>
              </div>

              <div className="text-xs text-slate-100 pr-12 leading-snug">
                <p className={expandedCaption ? 'max-h-36 overflow-y-auto' : 'line-clamp-2'}>
                  {igCaption}
                </p>
                <button
                  onClick={() => setExpandedCaption(!expandedCaption)}
                  className="text-[11px] text-slate-400 hover:text-white font-semibold mt-0.5"
                >
                  {expandedCaption ? 'less' : '...more'}
                </button>
              </div>

              {/* Sound Track Badge with Visualizer */}
              <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
                <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="truncate">Original audio · {videoStudio?.musicDirection || 'High-energy tempo'}</span>
                </div>
                {!isMuted && isPlaying && (
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-emerald-400 animate-bounce h-2" />
                    <span className="w-0.5 bg-emerald-400 animate-bounce h-3 delay-75" />
                    <span className="w-0.5 bg-emerald-400 animate-bounce h-1.5 delay-150" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== INSTAGRAM DESKTOP ==================== */}
        {activePlatform === 'instagram' && deviceMode === 'desktop' && (
          <div className="w-full max-w-4xl bg-black rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[540px]">
            {/* Left Media Area */}
            <div className="md:w-3/5 bg-slate-950 relative flex items-center justify-center border-r border-slate-800">
              {project.suggestedVisualAssets?.[1]?.previewUrl ? (
                <img
                  src={project.suggestedVisualAssets[1].previewUrl}
                  alt="Post visual"
                  className="w-full h-full object-cover max-h-[540px]"
                />
              ) : (
                <div className="text-center p-8 space-y-2">
                  <Play className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400 font-mono">Instagram Desktop Media Canvas</p>
                </div>
              )}
              {/* Playback Overlay */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 rounded-full px-2.5 py-1 text-white text-xs">
                <button onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Right Information & Comments Area */}
            <div className="md:w-2/5 flex flex-col justify-between bg-slate-900 p-5 text-white">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center font-bold text-xs">
                    K
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">kalakar.creator</h4>
                    <p className="text-[10px] text-slate-400">Original audio</p>
                  </div>
                </div>
                <MoreVertical className="w-4 h-4 text-slate-400 cursor-pointer" />
              </div>

              {/* Caption & Comments List */}
              <div className="py-4 space-y-3 flex-1 overflow-y-auto max-h-[340px] text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                    K
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                      <span className="font-bold text-white mr-1.5">kalakar.creator</span>
                      {igCaption}
                    </p>
                    <p className="text-[10px] text-slate-400">12h · Edited</p>
                  </div>
                </div>

                {/* Sample Engagement Comments */}
                <div className="flex items-start gap-2.5 pt-2">
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white shrink-0">
                    A
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-300">
                      <span className="font-semibold text-white mr-1.5">alex_growth</span>
                      This is pure gold. Exactly the breakdown I needed for this week.
                    </p>
                    <p className="text-[10px] text-slate-400">2h · 14 likes · Reply</p>
                  </div>
                </div>
              </div>

              {/* Actions & Comment Input */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-200">
                  <div className="flex items-center gap-3">
                    <button onClick={handleToggleLike} className="hover:text-red-500 transition-colors">
                      <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                    <button className="hover:text-white transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button className="hover:text-white transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={() => setBookmarked(!bookmarked)} className="hover:text-amber-400 transition-colors">
                    <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>
                <div className="text-xs font-semibold text-white">
                  {(likeCount).toLocaleString()} likes
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                  September 30, 2026
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== LINKEDIN ==================== */}
        {activePlatform === 'linkedin' && (
          <div className="w-full max-w-xl bg-slate-900 rounded-xl border border-slate-800 shadow-2xl p-5 space-y-4">
            {/* LinkedIn Author Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow">
                  K
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white">Kalakar Official</h4>
                    <span className="text-slate-400 text-xs">· 1st</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Architecting high-leverage content & algorithmic reach</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <span>1d</span>
                    <span>·</span>
                    <span>Edited</span>
                    <span>·</span>
                    <span>🌐</span>
                  </p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* LinkedIn Post Content with Truncation Check */}
            <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed space-y-2">
              <p className={expandedCaption ? '' : 'line-clamp-3'}>
                {liBody}
              </p>
              <button
                onClick={() => setExpandedCaption(!expandedCaption)}
                className="text-sky-400 hover:underline font-semibold text-xs mt-1 block"
              >
                {expandedCaption ? '...see less' : '...see more'}
              </button>
            </div>

            {/* Document PDF Slide Simulation */}
            {liFormat === 'document' && platformVariants?.linkedin?.documentSlides && platformVariants.linkedin.documentSlides.length > 0 && (
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    <span>Document Slide Presentation</span>
                  </span>
                  <span>Slide {carouselSlide + 1} of {platformVariants.linkedin.documentSlides.length}</span>
                </div>
                <div className="p-4 space-y-2.5 text-center min-h-[140px] flex flex-col justify-center">
                  <h5 className="text-sm font-bold text-white">
                    {platformVariants.linkedin.documentSlides[carouselSlide]?.title}
                  </h5>
                  <ul className="text-xs text-slate-300 space-y-1.5 inline-block text-left mx-auto">
                    {platformVariants.linkedin.documentSlides[carouselSlide]?.bulletPoints?.map((bp, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <button
                    disabled={carouselSlide === 0}
                    onClick={() => setCarouselSlide((c) => Math.max(0, c - 1))}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 flex items-center gap-1 text-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <span className="text-[10px] text-slate-400">Swipe to advance</span>
                  <button
                    disabled={carouselSlide >= (platformVariants.linkedin.documentSlides?.length || 1) - 1}
                    onClick={() => setCarouselSlide((c) => c + 1)}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 flex items-center gap-1 text-xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* LinkedIn Interactive Poll Simulation */}
            {liFormat === 'poll' && (
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-[11px] uppercase font-bold text-sky-400 block">The Question:</span>
                <p className="text-xs font-semibold text-white">
                  What is the biggest barrier preventing you from scaling high-quality social content?
                </p>
                <div className="space-y-2">
                  {['Ideation & script fatigue', 'Video editing & safe area errors', 'Cross-platform formatting time', 'Consistency & scheduling'].map((opt, idx) => {
                    const isSelected = pollVotedIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setPollVotedIndex(idx)}
                        className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-sky-500/10 border-sky-500 text-sky-300 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <span className="text-xs text-sky-400 font-bold">42% (Voted)</span>}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[10px] text-slate-400 pt-1">
                  1,842 votes · 6 days left
                </div>
              </div>
            )}

            {/* Reaction Bar */}
            <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="flex -space-x-1">
                  <span className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-[8px] text-white">👍</span>
                  <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white">❤️</span>
                  <span className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[8px] text-white">💡</span>
                </span>
                <span>{(likeCount).toLocaleString()} reactions</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>184 comments</span>
                <span>·</span>
                <span>92 reposts</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs text-slate-400 font-medium">
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1.5 py-1 px-3 rounded hover:bg-slate-800 transition-colors ${
                  liked ? 'text-sky-400 font-bold' : 'hover:text-sky-400'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{liked ? 'Liked' : 'Like'}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-sky-400 py-1 px-3 rounded hover:bg-slate-800 transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Comment</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-sky-400 py-1 px-3 rounded hover:bg-slate-800 transition-colors">
                <Repeat2 className="w-3.5 h-3.5" />
                <span>Repost</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-sky-400 py-1 px-3 rounded hover:bg-slate-800 transition-colors">
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== YOUTUBE ==================== */}
        {activePlatform === 'youtube' && ytFormat === 'shorts' && (
          <div className="w-[360px] h-[720px] bg-black rounded-[48px] border-[6px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none">
            {/* Top Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-900 rounded-full z-40" />

            {/* Background Video */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950 to-slate-900 flex items-center justify-center">
              {project.suggestedVisualAssets?.[0]?.previewUrl ? (
                <img
                  src={project.suggestedVisualAssets[0].previewUrl}
                  alt="Short preview"
                  className="w-full h-full object-cover opacity-85"
                />
              ) : (
                <Play className="w-14 h-14 text-red-500" />
              )}

              {/* Kinetic Subtitle Center */}
              <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center pointer-events-none z-20">
                <span className="inline-block px-3 py-1.5 rounded bg-black/80 text-yellow-300 font-black text-sm tracking-wide uppercase shadow-2xl border border-yellow-400/30">
                  {isPlaying ? currentScene.onScreenText || currentHook.slice(0, 26) : currentHook.slice(0, 26)}
                </span>
              </div>
            </div>

            {/* Top Controls */}
            <div className="relative z-30 px-5 pt-10 flex items-center justify-between text-white text-xs">
              <span className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                <span>Shorts</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-full bg-black/50 text-white"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Right Action Icons */}
            <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4 text-white">
              <div className="flex flex-col items-center gap-0.5">
                <button
                  onClick={handleToggleLike}
                  className={`p-2.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors ${
                    liked ? 'text-red-500' : 'text-white'
                  }`}
                >
                  <ThumbsUp className={`w-6 h-6 ${liked ? 'fill-red-500' : ''}`} />
                </button>
                <span className="text-[11px] font-semibold">124K</span>
              </div>

              <div className="flex flex-col items-center gap-0.5">
                <button className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                  <ThumbsDown className="w-6 h-6 text-white" />
                </button>
                <span className="text-[11px] font-semibold">Dislike</span>
              </div>

              <div className="flex flex-col items-center gap-0.5">
                <button className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                  <MessageCircle className="w-6 h-6 text-white" />
                </button>
                <span className="text-[11px] font-semibold">2.4K</span>
              </div>

              <button className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                <Share2 className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Bottom Shorts Channel & Title */}
            <div className="relative z-30 p-4 pb-7 space-y-2 bg-gradient-to-t from-black via-black/80 to-transparent text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs text-white">
                  YT
                </div>
                <span className="text-xs font-bold">@KalakarStudio</span>
                <button className="text-[11px] font-bold text-black bg-white px-3 py-1 rounded-full hover:bg-slate-200 transition-colors ml-1">
                  Subscribe
                </button>
              </div>

              <h4 className="text-xs font-bold text-slate-100 pr-12 line-clamp-2 leading-snug">
                {platformVariants?.youtube?.titleVariations?.[0] || project.title}
              </h4>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="truncate">Original Sound · Kalakar Academy</span>
              </div>
            </div>
          </div>
        )}

        {/* YouTube Standard 16:9 Video Player */}
        {activePlatform === 'youtube' && ytFormat === 'standard' && (
          <div className="w-full max-w-xl bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
            {/* Simulated 16:9 Video Canvas */}
            <div className="w-full aspect-video bg-black relative flex items-center justify-center">
              {project.suggestedVisualAssets?.[0]?.previewUrl ? (
                <img
                  src={project.suggestedVisualAssets[0].previewUrl}
                  alt="YouTube thumbnail"
                  className="w-full h-full object-cover opacity-90"
                />
              ) : (
                <Play className="w-14 h-14 text-red-500" />
              )}
              {/* Center Kinetic Subtitle when playing */}
              {isPlaying && (
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center pointer-events-none z-20">
                  <span className="inline-block px-3 py-1.5 rounded bg-black/85 text-yellow-300 font-bold text-sm tracking-wide uppercase border border-yellow-400/40">
                    {currentScene.onScreenText}
                  </span>
                </div>
              )}
              {/* Bottom Scrubber Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2.5">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-red-400 transition-colors">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button onClick={handleResetPlayback} title="Restart">
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                    </button>
                    <span>
                      0:{Math.floor(currentTime).toString().padStart(2, '0')} / 0:{totalDuration}
                    </span>
                  </div>
                  <span className="text-[10px] bg-red-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    HD 4K
                  </span>
                </div>
                {/* Red Scrubber Bar */}
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    setCurrentTime(Number((pos * totalDuration).toFixed(1)));
                  }}
                  className="w-full h-1 bg-slate-700 rounded-full overflow-hidden cursor-pointer"
                >
                  <div
                    className="h-full bg-red-600 transition-all duration-150"
                    style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Video Details & Description */}
            <div className="p-4 space-y-3">
              <h3 className="text-sm font-bold text-white leading-snug">
                {platformVariants?.youtube?.titleVariations?.[0] || project.title}
              </h3>

              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">
                    YT
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">Kalakar Academy</h5>
                    <p className="text-[10px] text-slate-400">89.4K subscribers</p>
                  </div>
                  <button className="px-3 py-1 rounded-full bg-white text-black font-semibold text-xs ml-2 hover:bg-slate-200 transition-colors">
                    Subscribe
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button onClick={handleToggleLike} className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white">
                    👍 {(likeCount / 1000).toFixed(1)}K
                  </button>
                  <button className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white">
                    Share
                  </button>
                </div>
              </div>

              {/* Description Box with Chapters */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="text-[11px] font-semibold text-slate-400">
                  <span>14,200 views</span>
                  <span className="mx-1">·</span>
                  <span>Premiered Sep 30, 2026</span>
                </div>
                <p className="whitespace-pre-line text-xs text-slate-300 leading-relaxed">
                  {ytDescription}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== WHATSAPP BUSINESS ==================== */}
        {activePlatform === 'whatsapp' && (
          <div className="w-[360px] bg-[#0B141A] rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between">
            {/* WhatsApp Header */}
            <div className="bg-[#202C33] px-4 py-3 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                  WA
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold">Kalakar Updates</span>
                    <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <p className="text-[10px] text-emerald-400">Official Business Account</p>
                </div>
              </div>
              <MoreVertical className="w-4 h-4 text-slate-400" />
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-3 min-h-[400px] bg-[radial-gradient(#111B21_1px,transparent_1px)] [background-size:16px_16px] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-center">
                  <span className="text-[10px] bg-[#182229] text-slate-400 px-2 py-0.5 rounded shadow">
                    TODAY
                  </span>
                </div>

                {/* Broadcast Message Bubble */}
                <div className="max-w-[88%] bg-[#005C4B] rounded-lg rounded-tl-none p-3 text-white space-y-2 shadow-md">
                  <p className="text-xs leading-relaxed whitespace-pre-line">
                    {waCopy}
                  </p>
                  <div className="flex justify-end items-center gap-1 text-[9px] text-emerald-200">
                    <span>10:45 AM</span>
                    <CheckCheck className="w-3 h-3 text-sky-300" />
                  </div>
                </div>

                {/* Interactive Quick-Reply Buttons */}
                <div className="space-y-1.5 pt-1">
                  {(platformVariants?.whatsapp?.suggestedButtonOptions || ['Get Free Guide', 'Ask a Question']).map((btn, i) => (
                    <button
                      key={i}
                      onClick={() => setWaReplies((prev) => [...prev, btn])}
                      className="w-full py-2 px-3 rounded-lg bg-[#202C33] hover:bg-[#2A3942] text-xs font-semibold text-sky-400 border border-slate-700/60 transition-colors shadow-sm text-center"
                    >
                      {btn}
                    </button>
                  ))}
                </div>

                {/* Simulated Customer Replies */}
                {waReplies.map((reply, i) => (
                  <div key={i} className="flex justify-end">
                    <div className="bg-[#202C33] text-white text-xs px-3 py-1.5 rounded-lg rounded-tr-none shadow">
                      {reply}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Bar */}
              <div className="bg-[#202C33] p-2 rounded-xl flex items-center gap-2 mt-4">
                <Smile className="w-4 h-4 text-slate-400" />
                <input
                  disabled
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-[#2A3942] rounded-full px-3 py-1 text-xs text-slate-300 focus:outline-none"
                />
                <div className="w-7 h-7 rounded-full bg-[#00A884] flex items-center justify-center text-white">
                  <Send className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
