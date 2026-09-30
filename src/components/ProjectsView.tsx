import React, { useState } from 'react';
import {
  FolderOpen,
  Search,
  Star,
  Copy,
  Trash2,
  Calendar,
  ExternalLink,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  History,
} from 'lucide-react';
import { GeneratedProject, Platform, PostStatus } from '../types';
import { formatDate, getPlatformColor, getPlatformBadgeName } from '../utils/helpers';

interface ProjectsViewProps {
  projects: GeneratedProject[];
  onOpenProject: (project: GeneratedProject) => void;
  onNewProject: () => void;
  onDuplicateProject: (project: GeneratedProject) => void;
  onDeleteProject: (projectId: string) => void;
  onToggleFavorite: (projectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onOpenProject,
  onNewProject,
  onDuplicateProject,
  onDeleteProject,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.originalIdea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlatform =
      platformFilter === 'all' || p.platforms.includes(platformFilter as Platform);

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    const matchesFav = !onlyFavorites || p.isFavorite;

    return matchesSearch && matchesPlatform && matchesStatus && matchesFav;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Content Repository</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Campaign Projects</h1>
          <p className="text-xs text-slate-400">
            Manage your social media campaigns, scripts, visual storyboards, and version histories
          </p>
        </div>

        <button
          onClick={onNewProject}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, hook, or tag..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
            <option value="whatsapp">WhatsApp</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>

          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              onlyFavorites
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/30 space-y-3">
          <FolderOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No campaigns found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search filters or start a brand-new campaign in the AI Content Studio.
          </p>
          <button
            onClick={onNewProject}
            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold"
          >
            Create New Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 transition-all flex flex-col justify-between group space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                      {project.creativeBrief?.recommendedFormat || 'Multi-Platform'}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[11px] text-slate-400">{formatDate(project.updatedAt)}</span>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(project.id)}
                    className="text-slate-400 hover:text-amber-400"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        project.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>
                </div>

                <div
                  onClick={() => onOpenProject(project)}
                  className="cursor-pointer space-y-1.5"
                >
                  <h3 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.creativeBrief?.coreConcept || project.originalIdea}
                  </p>
                </div>

                {/* Platforms Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.platforms.map((p) => (
                    <span
                      key={p}
                      className={`text-[10px] px-2 py-0.5 rounded border capitalize ${getPlatformColor(
                        p
                      )}`}
                    >
                      {getPlatformBadgeName(p)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <History className="w-3.5 h-3.5" />
                  <span className="text-[11px]">
                    {project.versionHistory?.length || 1} versions
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    title="Duplicate project"
                    onClick={() => onDuplicateProject(project)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title="Delete project"
                    onClick={() => onDeleteProject(project.id)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenProject(project)}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-200 font-medium text-xs transition-colors ml-1"
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
