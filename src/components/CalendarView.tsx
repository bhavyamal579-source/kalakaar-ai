import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Send,
  MoreVertical,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { ScheduledPost, Platform, PostStatus } from '../types';
import { formatDate, getPlatformColor, getPlatformBadgeName } from '../utils/helpers';

interface CalendarViewProps {
  scheduledPosts: ScheduledPost[];
  onReschedulePost: (postId: string, newDate: string) => void;
  onPublishPostNow: (post: ScheduledPost) => Promise<void>;
  onDeleteScheduledPost: (postId: string) => void;
  onNewPostClick: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  scheduledPosts,
  onReschedulePost,
  onPublishPostNow,
  onDeleteScheduledPost,
  onNewPostClick,
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  // Month navigation simulation (October 2026)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const filteredPosts = scheduledPosts.filter((p) => {
    return platformFilter === 'all' || p.platform === platformFilter;
  });

  const handlePublishNow = async (post: ScheduledPost) => {
    setPublishStatus(`Publishing ${post.title} via official ${getPlatformBadgeName(post.platform)} API...`);
    await onPublishPostNow(post);
    setPublishStatus(`Published ${post.title} successfully!`);
    setTimeout(() => setPublishStatus(null), 3500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Calendar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Publishing Orchestration</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Content Calendar</h1>
          <p className="text-xs text-slate-400">
            Schedule, reschedule, preview, and coordinate cross-platform releases
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Buttons */}
          <div className="flex items-center p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            {(['month', 'week', 'list'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded capitalize font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={onNewPostClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {publishStatus && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{publishStatus}</span>
        </div>
      )}

      {/* Month Navigation & Platform Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-white">October 2026</h2>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded border border-slate-800 bg-slate-950 text-slate-400 hover:text-white">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded border border-slate-800 bg-slate-950 text-slate-400 hover:text-white">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Filter Platform:</span>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Channels</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
            <option value="whatsapp">WhatsApp Business</option>
          </select>
        </div>
      </div>

      {/* MONTH VIEW GRID */}
      {viewMode === 'month' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-900/40 text-center text-xs font-semibold text-slate-400 py-2.5">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid (October 2026 starts on Thursday) */}
          <div className="grid grid-cols-7 auto-rows-fr">
            {/* Empty slots for Thu offset */}
            <div className="min-h-[110px] p-2 border-b border-r border-slate-900/60 bg-slate-950/40" />
            <div className="min-h-[110px] p-2 border-b border-r border-slate-900/60 bg-slate-950/40" />
            <div className="min-h-[110px] p-2 border-b border-r border-slate-900/60 bg-slate-950/40" />
            <div className="min-h-[110px] p-2 border-b border-r border-slate-900/60 bg-slate-950/40" />

            {daysInMonth.map((day) => {
              const dayStr = day.toString().padStart(2, '0');
              const dayDateIso = `2026-10-${dayStr}`;
              const postsOnDay = filteredPosts.filter((p) => p.scheduledDate.startsWith(dayDateIso));

              return (
                <div
                  key={day}
                  className="min-h-[110px] p-2 border-b border-r border-slate-900/80 bg-slate-950/70 hover:bg-slate-900/20 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold ${
                        day === 1 ? 'w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px]' : 'text-slate-400'
                      }`}
                    >
                      {day}
                    </span>
                    {postsOnDay.length > 0 && (
                      <span className="text-[10px] text-slate-400">{postsOnDay.length} posts</span>
                    )}
                  </div>

                  {/* Scheduled Post Chips */}
                  <div className="space-y-1">
                    {postsOnDay.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        className={`p-1.5 rounded border text-[11px] font-medium truncate cursor-pointer transition-all hover:scale-[1.02] shadow-sm ${getPlatformColor(
                          post.platform
                        )}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{post.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 transition-all flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2.5 py-1 rounded border capitalize font-semibold ${getPlatformColor(
                    post.platform
                  )}`}
                >
                  {getPlatformBadgeName(post.platform)}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">{post.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{post.captionSnippet}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatDate(post.scheduledDate)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePublishNow(post)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium shadow-sm transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Publish Now</span>
                  </button>
                  <button
                    onClick={() => onDeleteScheduledPost(post.id)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Post Modal / Inspector */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span
                className={`text-xs px-2.5 py-1 rounded border capitalize font-semibold ${getPlatformColor(
                  selectedPost.platform
                )}`}
              >
                {getPlatformBadgeName(selectedPost.platform)} Staged Post
              </span>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">{selectedPost.title}</h3>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed p-3 rounded-lg bg-slate-950 border border-slate-800">
                {selectedPost.captionSnippet}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Scheduled Date</span>
                <span className="text-slate-200 font-semibold">{formatDate(selectedPost.scheduledDate)}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Status</span>
                <span className="text-emerald-400 capitalize font-semibold">{selectedPost.status}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  onDeleteScheduledPost(selectedPost.id);
                  setSelectedPost(null);
                }}
                className="text-xs text-red-400 hover:underline"
              >
                Remove from Calendar
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handlePublishNow(selectedPost);
                    setSelectedPost(null);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow"
                >
                  <Send className="w-3 h-3" />
                  <span>Publish via API Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
