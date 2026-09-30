import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  ArrowRight,
  Video,
  FileText,
  Calendar,
  Layers,
  Send,
  Lightbulb,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart2,
  Eye,
  Share2,
  Bookmark,
  Plus,
} from 'lucide-react';
import { GeneratedProject, ScheduledPost, ConnectedAccount, TrendTopic } from '../types';
import { formatDate, getPlatformColor, getPlatformBadgeName } from '../utils/helpers';

interface DashboardViewProps {
  onStartCampaignWithIdea: (idea: string, format?: string) => void;
  onOpenProject: (project: GeneratedProject) => void;
  onNavigateTab: (tab: any) => void;
  recentProjects: GeneratedProject[];
  scheduledPosts: ScheduledPost[];
  connectedAccounts: ConnectedAccount[];
  trends: TrendTopic[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartCampaignWithIdea,
  onOpenProject,
  onNavigateTab,
  recentProjects,
  scheduledPosts,
  connectedAccounts,
  trends,
}) => {
  const [heroPrompt, setHeroPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const quickActionTemplates = [
    { label: 'Instagram Reel (30s)', idea: 'Create a 30-second high-energy Instagram Reel explaining how beginners can start learning AI for free in 2026', format: 'instagram_reel', icon: <Video className="w-3.5 h-3.5 text-pink-400" /> },
    { label: 'Instagram Carousel', idea: 'A 5-slide educational carousel breaking down the 3-day validation framework for solo developers', format: 'instagram_carousel', icon: <Layers className="w-3.5 h-3.5 text-pink-400" /> },
    { label: 'LinkedIn Post', idea: 'A contrarian thought leadership post on why writing code is the most expensive way to validate a startup idea', format: 'linkedin_post', icon: <FileText className="w-3.5 h-3.5 text-sky-400" /> },
    { label: 'YouTube Short', idea: 'A punchy 40-second YouTube Short with chapters debunking common productivity myths for creators', format: 'youtube_short', icon: <Video className="w-3.5 h-3.5 text-red-400" /> },
    { label: 'WhatsApp Campaign', idea: 'A high-converting WhatsApp Business broadcast announcing our free Notion resource vault to our VIP list', format: 'whatsapp_broadcast', icon: <Send className="w-3.5 h-3.5 text-emerald-400" /> },
    { label: 'Full 4-Platform Campaign', idea: 'Transform my new product launch idea into a coordinated multi-platform campaign for Instagram, LinkedIn, YouTube, and WhatsApp', format: 'full_campaign', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> },
  ];

  const handleQuickAction = (idea: string, format: string) => {
    setHeroPrompt(idea);
    onStartCampaignWithIdea(idea, format);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroPrompt.trim()) return;
    onStartCampaignWithIdea(heroPrompt);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (!heroPrompt) {
        setHeroPrompt(`Analyze uploaded file "${e.target.files[0].name}" and turn its key insights into a full social campaign.`);
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Creation Studio */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-8 shadow-2xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intelligent Social Production Studio</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What do you want to create today?
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Describe any idea, instruction, or drop your files. Kalakar Content Studio engineers complete creative strategies, 7 hook angles, video scripts, storyboards, and platform-native adaptations ready to publish.
          </p>
        </div>

        {/* Primary Prompt Input */}
        <form onSubmit={handleGenerate} className="mt-6 space-y-3">
          <div className="relative rounded-xl border border-slate-700/80 bg-slate-900/90 p-3 shadow-inner focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-all">
            <textarea
              value={heroPrompt}
              onChange={(e) => setHeroPrompt(e.target.value)}
              rows={3}
              placeholder="Example: I want to make a 30-second Reel explaining how beginners can start learning AI for free, with shooting instructions and a LinkedIn post..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none resize-none"
            />

            {selectedFile && (
              <div className="mb-2 inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-200">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-slate-400 hover:text-white text-xs ml-1"
                >
                  ×
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/70 hover:bg-slate-800 text-xs text-slate-300 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span>Attach Source File</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.mp4,.mp3"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => onNavigateTab('trends')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/70 hover:bg-slate-800 text-xs text-slate-300 transition-colors"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>Use Trending Topic</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={!heroPrompt.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all active:scale-[0.98]"
              >
                <span>Generate Campaign</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>

        {/* Quick Action Chips */}
        <div className="mt-5 space-y-2">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Quick Generation Starters:
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActionTemplates.map((t, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(t.idea, t.format)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition-all text-left group"
              >
                {t.icon}
                <span className="font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Production Overview Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Scheduled Posts</p>
            <h3 className="text-2xl font-bold text-white mt-1">{scheduledPosts.length}</h3>
            <p className="text-[11px] text-emerald-400 mt-0.5">Ready across 4 channels</p>
          </div>
          <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">AI Autopilot</p>
            <h3 className="text-2xl font-bold text-white mt-1">Approval Mode</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Strict limits enforced</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Connected Accounts</p>
            <h3 className="text-2xl font-bold text-white mt-1">4 of 4 Active</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">IG · LinkedIn · YT · WA</p>
          </div>
          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Share2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Weekly Target Reach</p>
            <h3 className="text-2xl font-bold text-white mt-1">140,000+</h3>
            <p className="text-[11px] text-sky-400 mt-0.5">+18% vs last week</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <BarChart2 className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Main Split Grid: Upcoming Posts & Recent Projects */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Recent Projects & Drafts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-100">Recent Campaigns & Projects</h2>
              <p className="text-xs text-slate-400">Active campaigns ready to edit, preview, or publish</p>
            </div>
            <button
              onClick={() => onNavigateTab('projects')}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium"
            >
              View all ({recentProjects.length})
            </button>
          </div>

          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onOpenProject(project)}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700/80 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-semibold text-sky-400 tracking-wider">
                        {project.creativeBrief?.recommendedFormat || 'Multi-Platform'}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[11px] text-slate-400">{formatDate(project.updatedAt)}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[11px] text-emerald-400 capitalize">{project.status}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {project.creativeBrief?.coreConcept || project.originalIdea}
                    </p>

                    {/* Platforms covered */}
                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                      <span className="text-[11px] text-slate-400">Platforms:</span>
                      <div className="flex items-center gap-1.5">
                        {project.platforms.map((p) => (
                          <span
                            key={p}
                            className={`text-[10px] px-2 py-0.5 rounded border capitalize ${getPlatformColor(p)}`}
                          >
                            {getPlatformBadgeName(p)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pt-1">
                    <button className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium text-slate-200 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-all">
                      Open Studio
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Idea Radar Widget */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-slate-100">Fresh Topic Opportunities</h3>
              </div>
              <button
                onClick={() => onNavigateTab('trends')}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium"
              >
                Open Trend Radar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trends.slice(0, 2).map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-amber-400 font-medium">{t.source}</span>
                    <span>Score: {t.momentumScore}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 leading-snug">{t.topic}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{t.contentAngle}</p>
                  <button
                    onClick={() => onStartCampaignWithIdea(t.hookIdea || t.topic)}
                    className="w-full text-center text-xs py-1 rounded bg-slate-900 border border-slate-800 text-sky-400 hover:bg-slate-800 transition-colors font-medium"
                  >
                    Build Campaign
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Content Calendar & Publishing Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-100">Upcoming Schedule</h2>
              <p className="text-xs text-slate-400">Next staged posts</p>
            </div>
            <button
              onClick={() => onNavigateTab('calendar')}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium"
            >
              Full Calendar
            </button>
          </div>

          <div className="space-y-3">
            {scheduledPosts.map((post) => (
              <div
                key={post.id}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border capitalize font-medium ${getPlatformColor(
                      post.platform
                    )}`}
                  >
                    {getPlatformBadgeName(post.platform)}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(post.scheduledDate)}</span>
                  </div>
                </div>

                <h4 className="text-xs font-semibold text-slate-200 truncate">{post.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {post.captionSnippet}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                  <span className="capitalize text-emerald-400 font-medium">Status: {post.status}</span>
                  {post.autopilotManaged && (
                    <span className="text-sky-400 font-medium">Autopilot Managed</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Connected Accounts Snapshot */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-200">Connected Publishing Channels</h3>
              <button
                onClick={() => onNavigateTab('accounts')}
                className="text-[11px] text-sky-400 hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2">
              {connectedAccounts.map((acc) => (
                <div
                  key={acc.platform}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        acc.connected ? 'bg-emerald-400' : 'bg-slate-600'
                      }`}
                    />
                    <span className="font-medium text-slate-200 capitalize">{acc.platform}</span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[100px]">{acc.handle}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{(acc.followers / 1000).toFixed(1)}k followers</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
