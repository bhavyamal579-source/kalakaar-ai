import React, { useState } from 'react';
import {
  TrendingUp,
  Lightbulb,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ArrowRight,
  Filter,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { TrendTopic, ContentIdea, Platform } from '../types';
import { getPlatformColor, getPlatformBadgeName } from '../utils/helpers';

interface TrendRadarViewProps {
  trends: TrendTopic[];
  onStartCampaignWithIdea: (idea: string, format?: string) => void;
  onFetchLiveTrends: (industry: string, niche: string) => Promise<void>;
  onGenerateIdeas: (niche: string, count: number) => Promise<ContentIdea[]>;
  isLoadingTrends: boolean;
}

export const TrendRadarView: React.FC<TrendRadarViewProps> = ({
  trends,
  onStartCampaignWithIdea,
  onFetchLiveTrends,
  onGenerateIdeas,
  isLoadingTrends,
}) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'ideas'>('trends');
  const [selectedIndustry, setSelectedIndustry] = useState('AI & Technology');
  const [selectedNiche, setSelectedNiche] = useState('Creators & Solo Developers');
  const [generatedIdeas, setGeneratedIdeas] = useState<ContentIdea[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [ideasCount, setIdeasCount] = useState(10);

  const handleRefreshTrends = () => {
    onFetchLiveTrends(selectedIndustry, selectedNiche);
  };

  const handleGenerateIdeas = async () => {
    setIsGeneratingIdeas(true);
    try {
      const ideas = await onGenerateIdeas(selectedNiche, ideasCount);
      setGeneratedIdeas(ideas);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Market Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Trend Radar & Idea Machine</h1>
          <p className="text-xs text-slate-400">
            Source high-momentum topics with verified origins, content angles, and gap analysis
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors ${
              activeTab === 'trends'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trend Radar
          </button>
          <button
            onClick={() => {
              setActiveTab('ideas');
              if (generatedIdeas.length === 0) handleGenerateIdeas();
            }}
            className={`px-3 py-1.5 rounded font-semibold transition-colors ${
              activeTab === 'ideas'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Idea Machine
          </button>
        </div>
      </div>

      {/* Filter / Trigger Controls */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Industry</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 focus:outline-none"
            >
              <option value="AI & Technology">AI & Technology</option>
              <option value="SaaS & Developer Tools">SaaS & Developer Tools</option>
              <option value="Creator Economy">Creator Economy</option>
              <option value="Finance & Growth">Finance & Growth</option>
              <option value="Education & Upskilling">Education & Upskilling</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Niche Focus</label>
            <input
              type="text"
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              placeholder="e.g. Solo Developers"
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {activeTab === 'trends' ? (
          <button
            onClick={handleRefreshTrends}
            disabled={isLoadingTrends}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTrends ? 'animate-spin' : ''}`} />
            <span>Scan Live Trends</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <select
              value={ideasCount}
              onChange={(e) => setIdeasCount(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200"
            >
              <option value={10}>10 Ideas</option>
              <option value={20}>20 Ideas</option>
              <option value={30}>30 Ideas</option>
            </select>
            <button
              onClick={handleGenerateIdeas}
              disabled={isGeneratingIdeas}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Ideas</span>
            </button>
          </div>
        )}
      </div>

      {/* TREND RADAR TAB */}
      {activeTab === 'trends' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {trends.map((trend) => (
              <div
                key={trend.id}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Momentum: {trend.momentumScore}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">{trend.source}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white leading-snug">{trend.topic}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{trend.whyRelevant}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1 text-xs">
                    <span className="text-[10px] uppercase font-semibold text-sky-400">Content Angle:</span>
                    <p className="text-slate-200">{trend.contentAngle}</p>
                    <div className="pt-1 text-[11px] text-slate-400">
                      <strong>Viral Hook:</strong> "{trend.hookIdea}"
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {trend.relatedKeywords.map((kw, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Format: {trend.recommendedFormat}
                  </span>
                  <button
                    onClick={() => onStartCampaignWithIdea(trend.hookIdea || trend.topic)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow-sm transition-all"
                  >
                    <span>Create Campaign</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IDEA MACHINE TAB */}
      {activeTab === 'ideas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(generatedIdeas.length > 0 ? generatedIdeas : []).map((idea) => (
              <div
                key={idea.id}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border capitalize font-semibold ${getPlatformColor(
                        idea.targetPlatform
                      )}`}
                    >
                      {getPlatformBadgeName(idea.targetPlatform)}
                    </span>
                    <span className="text-[10px] text-slate-400">{idea.difficulty}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">{idea.title}</h4>
                  <p className="text-xs text-slate-300">
                    <strong className="text-amber-400">Hook:</strong> "{idea.hook}"
                  </p>

                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                    <span className="text-sky-400 font-semibold block">Content Gap:</span>
                    {idea.contentGapResolved}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">{idea.format}</span>
                  <button
                    onClick={() => onStartCampaignWithIdea(idea.hook || idea.title, idea.format)}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-200 text-xs font-semibold transition-colors"
                  >
                    Build
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
