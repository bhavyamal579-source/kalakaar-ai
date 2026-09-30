import React, { useState } from 'react';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { UniversalCreatorView } from './components/UniversalCreatorView';
import { ProjectsView } from './components/ProjectsView';
import { CalendarView } from './components/CalendarView';
import { TrendRadarView } from './components/TrendRadarView';
import { AssetLibraryView } from './components/AssetLibraryView';
import { AutopilotView } from './components/AutopilotView';
import { AnalyticsView } from './components/AnalyticsView';
import { ConnectedAccountsView } from './components/ConnectedAccountsView';
import { BrandKitModal } from './components/BrandKitModal';
import {
  INITIAL_BRAND_KITS,
  INITIAL_PROJECTS,
  INITIAL_SCHEDULED_POSTS,
  INITIAL_CONNECTED_ACCOUNTS,
  INITIAL_TRENDS,
  INITIAL_ASSETS,
  INITIAL_AUTOPILOT_PLAN,
} from './data/initialData';
import {
  GeneratedProject,
  BrandKit,
  ScheduledPost,
  ConnectedAccount,
  TrendTopic,
  ContentIdea,
  Platform,
  AutopilotPlan,
  VisualAsset,
} from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isDark, setIsDark] = useState(true);

  // Core Data State
  const [brandKits, setBrandKits] = useState<BrandKit[]>(INITIAL_BRAND_KITS);
  const [activeBrandKit, setActiveBrandKit] = useState<BrandKit>(INITIAL_BRAND_KITS[0]);
  const [showBrandModal, setShowBrandModal] = useState(false);

  const [projects, setProjects] = useState<GeneratedProject[]>(INITIAL_PROJECTS);
  const [currentProject, setCurrentProject] = useState<GeneratedProject | null>(INITIAL_PROJECTS[0]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(INITIAL_SCHEDULED_POSTS);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>(INITIAL_CONNECTED_ACCOUNTS);
  const [trends, setTrends] = useState<TrendTopic[]>(INITIAL_TRENDS);
  const [assets, setAssets] = useState<VisualAsset[]>(INITIAL_ASSETS);
  const [autopilotPlan, setAutopilotPlan] = useState<AutopilotPlan>(INITIAL_AUTOPILOT_PLAN);

  // Loading States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApplyingEdit, setIsApplyingEdit] = useState(false);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);

  // 1. GENERATE CAMPAIGN ACTION
  const handleGenerateCampaign = async (params: any) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to generate campaign from server.');
      }

      const newProject: GeneratedProject = await response.json();
      setProjects((prev) => [newProject, ...prev]);
      setCurrentProject(newProject);
      setCurrentTab('create');
    } catch (err) {
      console.error('Error generating campaign:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. CONVERSATIONAL AI EDIT ACTION
  const handleApplyAIEdit = async (instruction: string, section?: string) => {
    if (!currentProject) return;
    setIsApplyingEdit(true);
    try {
      const response = await fetch('/api/ai/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentProject,
          instruction,
          targetSection: section || 'all',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit content.');
      }

      const result = await response.json();
      const updated = result.project || currentProject;
      setCurrentProject(updated);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      console.error('Error in AI Edit:', err);
    } finally {
      setIsApplyingEdit(false);
    }
  };

  // 3. START CAMPAIGN FROM IDEA SHORTCUT
  const handleStartCampaignWithIdea = (idea: string, format?: string) => {
    setCurrentTab('create');
    handleGenerateCampaign({
      idea,
      contentType: format || 'full_campaign',
      targetPlatforms: ['instagram', 'linkedin', 'youtube', 'whatsapp'],
      brandKit: activeBrandKit,
    });
  };

  // 4. SCHEDULE PROJECT TO CALENDAR
  const handleScheduleProject = (project: GeneratedProject, date: string, platform: Platform) => {
    const newPost: ScheduledPost = {
      id: 'sch-' + Date.now(),
      projectId: project.id,
      title: project.title,
      platform,
      scheduledDate: date,
      status: 'scheduled',
      captionSnippet:
        platform === 'instagram'
          ? project.platformVariants?.instagram?.caption?.slice(0, 140) || ''
          : platform === 'linkedin'
          ? project.platformVariants?.linkedin?.body?.slice(0, 140) || ''
          : platform === 'youtube'
          ? project.platformVariants?.youtube?.titleVariations?.[0] || ''
          : project.platformVariants?.whatsapp?.shortCopy?.slice(0, 140) || '',
      visualPreview: project.suggestedVisualAssets?.[0]?.previewUrl,
      autopilotManaged: autopilotPlan.status === 'active',
    };

    setScheduledPosts((prev) => [newPost, ...prev]);
  };

  // 5. OFFICIAL API PUBLISH SIMULATION
  const handlePublishSimulate = async (platform: Platform, title: string, content: string) => {
    const res = await fetch('/api/publish/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, title, postContent: content }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed publishing check');
    }

    // Append to connected account publish logs
    setConnectedAccounts((prev) =>
      prev.map((acc) => {
        if (acc.platform === platform && data.log) {
          return {
            ...acc,
            publishLogs: [data.log, ...(acc.publishLogs || [])],
          };
        }
        return acc;
      })
    );

    return data;
  };

  // 6. CALENDAR ACTIONS
  const handleReschedulePost = (postId: string, newDate: string) => {
    setScheduledPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, scheduledDate: newDate } : p))
    );
  };

  const handlePublishPostNow = async (post: ScheduledPost) => {
    await handlePublishSimulate(post.platform, post.title, post.captionSnippet);
    setScheduledPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, status: 'published' } : p))
    );
  };

  const handleDeleteScheduledPost = (postId: string) => {
    setScheduledPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // 7. TRENDS & IDEAS
  const handleFetchLiveTrends = async (industry: string, niche: string) => {
    setIsLoadingTrends(true);
    try {
      const res = await fetch('/api/ai/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, niche }),
      });
      const data = await res.json();
      if (data.trends && Array.isArray(data.trends)) {
        setTrends(data.trends);
      }
    } catch (err) {
      console.error('Error fetching trends:', err);
    } finally {
      setIsLoadingTrends(false);
    }
  };

  const handleGenerateIdeas = async (niche: string, count: number): Promise<ContentIdea[]> => {
    try {
      const res = await fetch('/api/ai/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, count }),
      });
      const data = await res.json();
      return data.ideas || [];
    } catch (err) {
      console.error('Error generating ideas:', err);
      return [];
    }
  };

  // 8. PROJECT ACTIONS
  const handleDuplicateProject = (project: GeneratedProject) => {
    const clone: GeneratedProject = {
      ...project,
      id: 'proj-' + Date.now(),
      title: `${project.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
    };
    setProjects((prev) => [clone, ...prev]);
    setCurrentProject(clone);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (currentProject?.id === projectId) {
      setCurrentProject(projects[1] || null);
    }
  };

  const handleToggleFavorite = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  // 9. CONNECTED ACCOUNTS & AUTOPILOT
  const handleToggleConnection = (platform: Platform) => {
    setConnectedAccounts((prev) =>
      prev.map((acc) => (acc.platform === platform ? { ...acc, connected: !acc.connected } : acc))
    );
  };

  const handleUpdateAutopilotStatus = (status: 'active' | 'paused' | 'completed') => {
    setAutopilotPlan((prev) => ({ ...prev, status }));
  };

  const handleUpdateAutopilotMode = (mode: 'approval_mode' | 'autonomous_mode') => {
    setAutopilotPlan((prev) => ({ ...prev, mode }));
  };

  const handleSaveBrandKit = (kit: BrandKit) => {
    setBrandKits((prev) => prev.map((k) => (k.id === kit.id ? kit : k)));
    if (activeBrandKit.id === kit.id) {
      setActiveBrandKit(kit);
    }
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} antialiased font-sans`}>
      {/* Primary Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        brandKits={brandKits}
        activeBrandKit={activeBrandKit}
        onOpenBrandModal={() => setShowBrandModal(true)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Sticky Top Header */}
        <Header
          onNewCampaign={() => {
            setCurrentProject(null);
            setCurrentTab('create');
          }}
          brandKits={brandKits}
          activeBrandKit={activeBrandKit}
          onSelectBrandKit={setActiveBrandKit}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
        />

        {/* View Router */}
        <main className="flex-1">
          {currentTab === 'dashboard' && (
            <DashboardView
              onStartCampaignWithIdea={handleStartCampaignWithIdea}
              onOpenProject={(proj) => {
                setCurrentProject(proj);
                setCurrentTab('create');
              }}
              onNavigateTab={setCurrentTab}
              recentProjects={projects}
              scheduledPosts={scheduledPosts}
              connectedAccounts={connectedAccounts}
              trends={trends}
            />
          )}

          {currentTab === 'create' && (
            <UniversalCreatorView
              currentProject={currentProject}
              brandKits={brandKits}
              activeBrandKit={activeBrandKit}
              onGenerateCampaign={handleGenerateCampaign}
              onApplyAIEdit={handleApplyAIEdit}
              onScheduleProject={handleScheduleProject}
              onPublishSimulate={handlePublishSimulate}
              isGenerating={isGenerating}
              isApplyingEdit={isApplyingEdit}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsView
              projects={projects}
              onOpenProject={(proj) => {
                setCurrentProject(proj);
                setCurrentTab('create');
              }}
              onNewProject={() => {
                setCurrentProject(null);
                setCurrentTab('create');
              }}
              onDuplicateProject={handleDuplicateProject}
              onDeleteProject={handleDeleteProject}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarView
              scheduledPosts={scheduledPosts}
              onReschedulePost={handleReschedulePost}
              onPublishPostNow={handlePublishPostNow}
              onDeleteScheduledPost={handleDeleteScheduledPost}
              onNewPostClick={() => setCurrentTab('create')}
            />
          )}

          {currentTab === 'trends' && (
            <TrendRadarView
              trends={trends}
              onStartCampaignWithIdea={handleStartCampaignWithIdea}
              onFetchLiveTrends={handleFetchLiveTrends}
              onGenerateIdeas={handleGenerateIdeas}
              isLoadingTrends={isLoadingTrends}
            />
          )}

          {currentTab === 'assets' && (
            <AssetLibraryView
              assets={assets}
              onSelectAssetForProject={(ast) => {
                if (currentProject) {
                  setCurrentProject({
                    ...currentProject,
                    suggestedVisualAssets: [ast, ...(currentProject.suggestedVisualAssets || [])],
                  });
                  setCurrentTab('create');
                }
              }}
            />
          )}

          {currentTab === 'autopilot' && (
            <AutopilotView
              plan={autopilotPlan}
              onUpdatePlanStatus={handleUpdateAutopilotStatus}
              onUpdateMode={handleUpdateAutopilotMode}
            />
          )}

          {currentTab === 'analytics' && <AnalyticsView />}

          {currentTab === 'accounts' && (
            <ConnectedAccountsView
              accounts={connectedAccounts}
              onToggleConnection={handleToggleConnection}
            />
          )}
        </main>
      </div>

      {/* Brand Kit Management Modal */}
      {showBrandModal && (
        <BrandKitModal
          brandKits={brandKits}
          activeBrandKit={activeBrandKit}
          onSelectBrandKit={setActiveBrandKit}
          onSaveBrandKit={handleSaveBrandKit}
          onClose={() => setShowBrandModal(false)}
        />
      )}
    </div>
  );
}
