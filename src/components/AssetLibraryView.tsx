import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Search,
  Filter,
  Download,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { VisualAsset } from '../types';

interface AssetLibraryViewProps {
  assets: VisualAsset[];
  onSelectAssetForProject?: (asset: VisualAsset) => void;
}

export const AssetLibraryView: React.FC<AssetLibraryViewProps> = ({
  assets,
  onSelectAssetForProject,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAssets = assets.filter((ast) => {
    const matchesType = filterType === 'all' || ast.type === filterType;
    const matchesSearch =
      ast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ast.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 uppercase tracking-wider">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Visual Discovery</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Asset Library</h1>
          <p className="text-xs text-slate-400">
            Licensed stock photos, verified media, and AI-generated social assets with full commercial rights
          </p>
        </div>

        {/* Commercial Licensing Banner */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>All assets verified for commercial social distribution</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets by keywords (code, creator, portrait, gradient)..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          {['all', 'photo', 'portrait', 'background'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded capitalize font-medium transition-colors ${
                filterType === t
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden hover:border-slate-700 hover:bg-slate-900/80 transition-all flex flex-col justify-between group shadow-sm"
          >
            {/* Image Preview with Aspect Ratio */}
            <div className="relative aspect-video bg-black overflow-hidden">
              <img
                src={asset.previewUrl}
                alt={asset.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-semibold text-white">
                {asset.aspectRatio}
              </span>
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm text-[10px] text-slate-300">
                {asset.resolution}
              </span>
            </div>

            {/* Asset Metadata */}
            <div className="p-4 space-y-2">
              <h4 className="text-xs font-bold text-white truncate">{asset.title}</h4>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>By {asset.creator}</span>
                <span className="text-emerald-400">{asset.license}</span>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {asset.tags.map((tag, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs">
              <a
                href={asset.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </a>

              {onSelectAssetForProject && (
                <button
                  onClick={() => onSelectAssetForProject(asset)}
                  className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-white font-medium text-[11px] shadow-sm"
                >
                  Use in Studio
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
