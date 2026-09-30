export type Platform = 'instagram' | 'linkedin' | 'youtube' | 'whatsapp';

export type ContentFormat =
  | 'instagram_reel'
  | 'instagram_carousel'
  | 'instagram_feed'
  | 'instagram_story'
  | 'linkedin_post'
  | 'linkedin_carousel'
  | 'linkedin_video'
  | 'youtube_short'
  | 'youtube_video'
  | 'whatsapp_status'
  | 'whatsapp_broadcast'
  | 'full_campaign';

export type PostStatus =
  | 'idea'
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'failed';

export interface BrandKit {
  id: string;
  name: string;
  tagline: string;
  colors: string[];
  fontFamily: string;
  tone: string;
  language: string;
  targetAudience: string;
  preferredWords: string[];
  blockedWords: string[];
  contentRules: string[];
}

export interface CreativeBrief {
  coreConcept: string;
  contentAngle: string;
  targetAudience: string;
  contentObjective: string;
  keyMessage: string;
  recommendedFormat: string;
  recommendedDuration: string;
  hookStrategy: string;
  ctaStrategy: string;
  visualDirection: string;
}

export interface HookVariant {
  id: string;
  type: 'curiosity' | 'problem' | 'story' | 'question' | 'contrarian' | 'educational' | 'viral';
  hookText: string;
  rationale: string;
  selected?: boolean;
}

export interface SceneBreakdown {
  sceneNumber: number;
  timestamp: string;
  dialogue: string;
  voiceOver: string;
  visual: string;
  shotType: 'close-up' | 'medium' | 'wide' | 'over-the-shoulder' | 'POV' | 'screen-record';
  cameraAngle: 'eye-level' | 'low-angle' | 'high-angle' | 'slight-tilt';
  cameraMovement: 'static' | 'slow push-in' | 'pan right' | 'handheld organic' | 'whip pan';
  onScreenText: string;
  bRoll: string;
  transition: string;
  audio: string;
}

export interface ShootingAssistantGuide {
  whereToStand: string;
  howToFrame: string;
  lightingPosition: string;
  cameraHeight: string;
  backgroundSetup: string;
  audioAdvice: string;
  whatToSay: string;
  whatActionToPerform: string;
}

export interface VideoStudio {
  concept: string;
  hook: string;
  completeScript: string;
  voiceOverScript: string;
  scenes: SceneBreakdown[];
  shootingAssistant: ShootingAssistantGuide;
  musicDirection: string;
  soundEffects: string[];
  editingInstructions: string[];
  thumbnailConcept: {
    headline: string;
    visualDescription: string;
    colorPalette: string[];
    facialExpression: string;
    focalPoint: string;
  };
}

export interface InstagramContent {
  format: 'Reel' | 'Feed Post' | 'Carousel' | 'Story';
  hook: string;
  caption: string;
  hashtags: string[];
  callToAction: string;
  visualDirection: string;
  onScreenText: string[];
  coverConcept: string;
  script?: string;
  carouselSlides?: { slideNumber: number; title: string; body: string; visualNote: string }[];
}

export interface LinkedInContent {
  format: 'text_post' | 'image_post' | 'carousel' | 'video';
  hook: string;
  body: string;
  storytellingStructure: string;
  callToAction: string;
  hashtags: string[];
  visualConcept: string;
  documentSlides?: { page: number; title: string; bulletPoints: string[] }[];
}

export interface YouTubeContent {
  format: 'Short' | 'Long-form';
  titleVariations: string[];
  hook: string;
  completeScript: string;
  description: string;
  chapters: { time: string; title: string }[];
  thumbnailConcept: string;
  keywords: string[];
  callToAction: string;
  subtitleText: string;
}

export interface WhatsAppContent {
  format: 'Status' | 'Business message' | 'Promotional campaign' | 'Product announcement';
  shortCopy: string;
  callToAction: string;
  visualConcept: string;
  messageVariations: string[];
  suggestedButtonOptions: string[];
}

export interface PlatformVariants {
  instagram: InstagramContent;
  linkedin: LinkedInContent;
  youtube: YouTubeContent;
  whatsapp: WhatsAppContent;
}

export interface ContentVersion {
  id: string;
  timestamp: string;
  author: 'AI' | 'User';
  summary: string;
  snapshot: any;
}

export interface GeneratedProject {
  id: string;
  title: string;
  originalIdea: string;
  createdAt: string;
  updatedAt: string;
  status: PostStatus;
  platforms: Platform[];
  brandKitId?: string;
  creativeBrief: CreativeBrief;
  hooks: HookVariant[];
  videoStudio: VideoStudio;
  platformVariants: PlatformVariants;
  suggestedVisualAssets: VisualAsset[];
  versionHistory: ContentVersion[];
  tags: string[];
  isFavorite?: boolean;
}

export interface VisualAsset {
  id: string;
  title: string;
  previewUrl: string;
  source: 'Unsplash Stock' | 'Pexels Verified' | 'Kalakar Studio' | 'AI Generated';
  creator: string;
  license: 'Creative Commons 0' | 'Editorial Free' | 'Commercial Ready' | 'Original Creation';
  attributionRequirement: string;
  resolution: string;
  aspectRatio: '1:1' | '9:16' | '16:9' | '4:5';
  type: 'photo' | 'illustration' | 'background' | 'portrait';
  tags: string[];
}

export interface ScheduledPost {
  id: string;
  projectId: string;
  title: string;
  platform: Platform;
  scheduledDate: string; // ISO date-time string
  status: PostStatus;
  captionSnippet: string;
  visualPreview?: string;
  autopilotManaged?: boolean;
  publishedUrl?: string;
  errorLog?: string;
}

export interface TrendTopic {
  id: string;
  topic: string;
  industry: string;
  niche: string;
  platform: Platform | 'all';
  source: string;
  sourceUrl?: string;
  publicationDate: string;
  whyRelevant: string;
  relatedKeywords: string[];
  contentAngle: string;
  hookIdea: string;
  recommendedFormat: string;
  momentumScore: number;
}

export interface ContentIdea {
  id: string;
  title: string;
  niche: string;
  angle: string;
  targetPlatform: Platform;
  format: string;
  hook: string;
  contentGapResolved: string;
  difficulty: 'Quick' | 'Medium' | 'Deep-Dive';
}

export interface ConnectedAccount {
  platform: Platform;
  accountName: string;
  handle: string;
  connected: boolean;
  avatarUrl: string;
  followers: number;
  lastSync: string;
  permissions: string[];
  tokenStatus: 'active' | 'expiring_soon' | 'disconnected';
  publishLogs: {
    id: string;
    timestamp: string;
    status: 'success' | 'failed' | 'queued';
    message: string;
    postTitle: string;
  }[];
}

export interface AutopilotPlan {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'expired';
  mode: 'approval_mode' | 'autonomous_mode';
  objective: string;
  startDate: string;
  endDate: string;
  dailyPostingLimit: number;
  maxTotalPosts: number;
  currentPostsCreated: number;
  allowedPlatforms: Platform[];
  allowedContentTypes: string[];
  blockedTopics: string[];
  requireApproval: boolean;
  activityLog: {
    id: string;
    timestamp: string;
    action: string;
    platform: Platform;
    status: 'approved' | 'executed' | 'pending_approval' | 'rejected';
    details: string;
  }[];
}

export interface AnalyticsMetric {
  platform: Platform;
  views: number;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  watchTimeHours?: number;
  growthDelta: number;
}
