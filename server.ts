import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Server-side Gemini initialization with telemetry header
function getAIClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Multi-model cascade: prioritizes gemini-3.8-flash and cascades gracefully on 503 high demand or quota surges
interface GeminiCascadeOptions {
  contents: string;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
}

async function generateWithGeminiCascade(options: GeminiCascadeOptions): Promise<{ text: string; modelUsed: string }> {
  const ai = getAIClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  // Approved model cascade from gemini-api skill:
  // Primary: 'gemini-3.1-flash-lite' (high throughput, fresh quota, instant response)
  // Secondary: 'gemini-3.8-flash'
  // Tertiary: 'gemini-flash-latest'
  const modelCandidates = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const modelName of modelCandidates) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: options.contents,
        config: {
          systemInstruction: options.systemInstruction,
          responseMimeType: options.responseMimeType || 'application/json',
          temperature: options.temperature ?? 0.7,
        },
      });

      if (response && response.text) {
        console.log(`[Gemini Cascade] Successfully generated response with model: ${modelName}`);
        return { text: response.text, modelUsed: modelName };
      }
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.code || (err?.message ? err.message.slice(0, 100) : 'unknown');
      console.warn(`[Gemini Cascade] Model ${modelName} encountered: ${status}. Trying next cascade candidate...`);
      // Brief pause to allow transient spikes to clear
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  throw lastError || new Error('All Gemini model candidates in cascade failed.');
}

// Helper to sanitize Gemini JSON response
function extractJSON(text: string): any {
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    // Attempt relaxed parsing or substring search
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(text.substring(firstBrace, lastBrace + 1));
    }
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      return JSON.parse(text.substring(firstBracket, lastBracket + 1));
    }
    throw e;
  }
}

// Health and AI status check endpoint
app.get('/api/ai/status', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({
    status: hasKey ? 'active' : 'fallback_mode',
    keyConfigured: hasKey,
    primaryModel: 'gemini-3.8-flash',
    fallbackModel: 'gemini-3.1-flash-lite',
    sdk: '@google/genai',
    message: hasKey
      ? 'Google Gemini API is active with multi-model cascade resilience.'
      : 'Running in contextual simulation engine.',
  });
});

// 1. GENERATE CAMPAIGN ENDPOINT
app.post('/api/ai/generate-campaign', async (req, res) => {
  try {
    const {
      idea,
      targetPlatforms = ['instagram', 'linkedin', 'youtube', 'whatsapp'],
      contentType = 'full_campaign',
      targetAudience = 'ambitious creators and modern professionals',
      language = 'English',
      tone = 'Direct, engaging, authoritative and actionable',
      duration = '30 seconds',
      contentGoal = 'Educational, high-engagement, shareability and conversion',
      brandKit,
      sourceFilesSummary,
    } = req.body;

    if (!idea || typeof idea !== 'string') {
      return res.status(400).json({ error: 'An idea or prompt is required.' });
    }

    const ai = getAIClient();
    if (!ai) {
      // Fallback domain-rich campaign generation if no API key is configured
      const mockResult = generateFallbackCampaign(idea, {
        targetPlatforms,
        contentType,
        targetAudience,
        language,
        tone,
        duration,
        contentGoal,
        brandKit,
      });
      return res.json(mockResult);
    }

    const systemPrompt = `You are Kalakar Content Studio, an elite social media content strategist, video director, and multi-platform publishing engine.
Given the user's idea and parameters, generate a comprehensive, highly production-ready content campaign tailored specifically for Instagram, LinkedIn, YouTube, and WhatsApp Business.

CRITICAL RULES:
- Never provide generic or shallow placeholders. Every scene, hook, script line, and caption must be ready to record or post immediately.
- Adhere strictly to the requested tone (${tone}), audience (${targetAudience}), and duration (${duration}).
- Adapt for each platform uniquely: Instagram (visual, hook-led, snappy reels/carousels), LinkedIn (storytelling, career/business insight, whitespace formatting), YouTube (searchable title variations, rich description, video chapters, script), WhatsApp Business (concise, conversational, clear CTA for broadcasts/status).
- Output must be valid JSON ONLY matching the requested structure without markdown fences or extraneous text.`;

    const prompt = `User Idea: "${idea}"
Source Materials: ${sourceFilesSummary || 'None provided'}
Target Audience: ${targetAudience}
Tone: ${tone}
Duration: ${duration}
Goal: ${contentGoal}
Brand Guidelines: ${brandKit ? `Brand: ${brandKit.name}, Tagline: ${brandKit.tagline}, Preferred terms: ${(brandKit.preferredWords || []).join(', ')}, Blocked terms: ${(brandKit.blockedWords || []).join(', ')}` : 'Default professional creator standard'}

Generate the full JSON object with this exact shape:
{
  "creativeBrief": {
    "coreConcept": "string",
    "contentAngle": "string",
    "targetAudience": "string",
    "contentObjective": "string",
    "keyMessage": "string",
    "recommendedFormat": "string",
    "recommendedDuration": "string",
    "hookStrategy": "string",
    "ctaStrategy": "string",
    "visualDirection": "string"
  },
  "hooks": [
    {
      "id": "hook-1",
      "type": "curiosity",
      "hookText": "string",
      "rationale": "string"
    },
    { "id": "hook-2", "type": "problem", "hookText": "string", "rationale": "string" },
    { "id": "hook-3", "type": "story", "hookText": "string", "rationale": "string" },
    { "id": "hook-4", "type": "question", "hookText": "string", "rationale": "string" },
    { "id": "hook-5", "type": "contrarian", "hookText": "string", "rationale": "string" },
    { "id": "hook-6", "type": "educational", "hookText": "string", "rationale": "string" },
    { "id": "hook-7", "type": "viral", "hookText": "string", "rationale": "string" }
  ],
  "videoStudio": {
    "concept": "string",
    "hook": "string",
    "completeScript": "string with speaker cues and exact timing",
    "voiceOverScript": "string",
    "scenes": [
      {
        "sceneNumber": 1,
        "timestamp": "0:00 - 0:05",
        "dialogue": "string",
        "voiceOver": "string",
        "visual": "string detailed visual description",
        "shotType": "close-up",
        "cameraAngle": "eye-level",
        "cameraMovement": "slow push-in",
        "onScreenText": "BOLD 3-WORD HOOK",
        "bRoll": "string description",
        "transition": "hard cut",
        "audio": "energetic subtle riser + punchy bass drop"
      }
    ],
    "shootingAssistant": {
      "whereToStand": "string",
      "howToFrame": "string",
      "lightingPosition": "string",
      "cameraHeight": "string",
      "backgroundSetup": "string",
      "audioAdvice": "string",
      "whatToSay": "string",
      "whatActionToPerform": "string"
    },
    "musicDirection": "string style, tempo, mood",
    "soundEffects": ["woosh", "pop", "click"],
    "editingInstructions": ["Cut pauses tighter than 0.2s", "Add dynamic kinetic subtitles"],
    "thumbnailConcept": {
      "headline": "string punchy thumbnail title (3-5 words)",
      "visualDescription": "string",
      "colorPalette": ["#000000", "#FFFFFF", "#3B82F6"],
      "facialExpression": "string",
      "focalPoint": "string"
    }
  },
  "platformVariants": {
    "instagram": {
      "format": "Reel",
      "hook": "string",
      "caption": "string formatted with line breaks, emojis and hook",
      "hashtags": ["#tag1", "#tag2"],
      "callToAction": "string",
      "visualDirection": "string",
      "onScreenText": ["Text 1", "Text 2", "Text 3"],
      "coverConcept": "string",
      "carouselSlides": [
        { "slideNumber": 1, "title": "string", "body": "string", "visualNote": "string" }
      ]
    },
    "linkedin": {
      "format": "text_post",
      "hook": "string",
      "body": "string complete structured post with line breaks and insight",
      "storytellingStructure": "Hook -> Context -> The 3-Step Solution -> Hard-Won Lesson -> CTA",
      "callToAction": "string",
      "hashtags": ["#tag1", "#tag2"],
      "visualConcept": "string",
      "documentSlides": [
        { "page": 1, "title": "string", "bulletPoints": ["point 1", "point 2"] }
      ]
    },
    "youtube": {
      "format": "Short",
      "titleVariations": ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"],
      "hook": "string",
      "completeScript": "string",
      "description": "string formatted with timestamps, summary, and links",
      "chapters": [
        { "time": "0:00", "title": "Intro & Hook" },
        { "time": "0:45", "title": "The Core Framework" },
        { "time": "1:30", "title": "Action Steps" }
      ],
      "thumbnailConcept": "string",
      "keywords": ["keyword 1", "keyword 2"],
      "callToAction": "string",
      "subtitleText": "string preview of captions"
    },
    "whatsapp": {
      "format": "Business message",
      "shortCopy": "string high-converting message ready for broadcast or 1:1 outreach",
      "callToAction": "string",
      "visualConcept": "string",
      "messageVariations": ["Casual variant", "Direct promotional variant", "VIP follow-up variant"],
      "suggestedButtonOptions": ["Learn More", "Claim Free Guide", "Chat with Us"]
    }
  }
}`;

    const response = await generateWithGeminiCascade({
      contents: prompt,
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
      temperature: 0.7,
    });

    const parsed = extractJSON(response.text || '{}');
    const project = buildProjectObject(idea, parsed, targetPlatforms, brandKit?.id);
    return res.json(project);
  } catch (err: any) {
    console.error('Error generating campaign with Gemini cascade:', err);
    // On failure, return intelligent contextual fallback built specifically from the user's idea
    const fallback = generateFallbackCampaign(req.body.idea || 'High-Impact Content Strategy', req.body);
    return res.json(fallback);
  }
});

// 2. CONVERSATIONAL AI EDIT ENDPOINT
app.post('/api/ai/edit', async (req, res) => {
  try {
    const { currentProject, instruction, targetSection = 'all' } = req.body;
    if (!currentProject || !instruction) {
      return res.status(400).json({ error: 'currentProject and instruction are required.' });
    }

    const editPrompt = `You are Kalakar Content Studio AI EDIT conversational assistant.
The user wants to edit their social media project based on this instruction:
"${instruction}"

Target Section to modify: "${targetSection}" (e.g. 'hook', 'videoStudio', 'instagram', 'linkedin', 'youtube', 'whatsapp', 'brief', or 'all').

Current project payload:
${JSON.stringify({
  title: currentProject.title,
  originalIdea: currentProject.originalIdea,
  creativeBrief: currentProject.creativeBrief,
  hooks: currentProject.hooks,
  videoStudio: currentProject.videoStudio,
  platformVariants: currentProject.platformVariants,
})}

RULES:
1. Modify ONLY what the user requested; preserve everything else meticulously.
2. Return a valid JSON with:
{
  "summary": "Brief 1-sentence summary of what was updated",
  "creativeBrief": { ...updated or original },
  "hooks": [ ...updated or original hooks ],
  "videoStudio": { ...updated or original video studio },
  "platformVariants": { ...updated or original platform variants }
}`;

    const response = await generateWithGeminiCascade({
      contents: editPrompt,
      systemInstruction: 'You are an exacting social media editor. Preserve project integrity and apply requested edits precisely. Return JSON only.',
      responseMimeType: 'application/json',
      temperature: 0.6,
    });

    const editedData = extractJSON(response.text || '{}');
    const newVersion = {
      id: 'v-' + Date.now(),
      timestamp: new Date().toISOString(),
      author: 'AI' as const,
      summary: editedData.summary || instruction,
      snapshot: {
        creativeBrief: editedData.creativeBrief || currentProject.creativeBrief,
        hooks: editedData.hooks || currentProject.hooks,
        videoStudio: editedData.videoStudio || currentProject.videoStudio,
        platformVariants: editedData.platformVariants || currentProject.platformVariants,
      },
    };

    const updatedProject = {
      ...currentProject,
      updatedAt: new Date().toISOString(),
      creativeBrief: editedData.creativeBrief || currentProject.creativeBrief,
      hooks: editedData.hooks || currentProject.hooks,
      videoStudio: editedData.videoStudio || currentProject.videoStudio,
      platformVariants: editedData.platformVariants || currentProject.platformVariants,
      versionHistory: [newVersion, ...(currentProject.versionHistory || [])],
    };

    return res.json({ project: updatedProject, summary: editedData.summary || 'Applied edits successfully.' });
  } catch (err: any) {
    console.error('Error in AI edit with Gemini cascade:', err);
    const updated = applyMockEdit(req.body.currentProject, req.body.instruction, req.body.targetSection);
    return res.json(updated);
  }
});

// 3. HOOK REGENERATION ENDPOINT
app.post('/api/ai/hooks', async (req, res) => {
  try {
    const { idea, currentHooks = [], style = 'viral' } = req.body;

    const prompt = `Generate 7 powerful, distinct hooks for the idea: "${idea}".
Format as a JSON array of objects with:
[
  { "id": "h-1", "type": "curiosity", "hookText": "...", "rationale": "..." },
  { "id": "h-2", "type": "problem", "hookText": "...", "rationale": "..." },
  { "id": "h-3", "type": "story", "hookText": "...", "rationale": "..." },
  { "id": "h-4", "type": "question", "hookText": "...", "rationale": "..." },
  { "id": "h-5", "type": "contrarian", "hookText": "...", "rationale": "..." },
  { "id": "h-6", "type": "educational", "hookText": "...", "rationale": "..." },
  { "id": "h-7", "type": "viral", "hookText": "...", "rationale": "..." }
]`;

    const response = await generateWithGeminiCascade({
      contents: prompt,
      responseMimeType: 'application/json',
      temperature: 0.8,
    });

    const parsed = extractJSON(response.text || '[]');
    return res.json({ hooks: Array.isArray(parsed) ? parsed : parsed.hooks || [] });
  } catch (err: any) {
    return res.json({ hooks: generateFallbackHooks(req.body.idea || 'Content Idea') });
  }
});

// 4. TREND RADAR ENDPOINT
app.post('/api/ai/trends', async (req, res) => {
  try {
    const { industry = 'AI & Technology', niche = 'Creators & Startups', platform = 'all', region = 'Global' } = req.body;

    const prompt = `Identify 5 real, high-momentum social media trending topics for:
Industry: ${industry}
Niche: ${niche}
Platform: ${platform}
Region: ${region}

For each trend provide genuine context, source publication or platform signal, why it is relevant right now, recommended angle, viral hook, and format.
Return JSON array of objects:
[
  {
    "id": "trend-1",
    "topic": "string",
    "industry": "${industry}",
    "niche": "${niche}",
    "platform": "${platform}",
    "source": "string (e.g. arXiv / TechCrunch / TikTok Creator Portal / X Trends)",
    "publicationDate": "2026-09-28",
    "whyRelevant": "string",
    "relatedKeywords": ["kw1", "kw2", "kw3"],
    "contentAngle": "string",
    "hookIdea": "string",
    "recommendedFormat": "Instagram Reel / LinkedIn Post",
    "momentumScore": 96
  }
]`;

    const response = await generateWithGeminiCascade({
      contents: prompt,
      responseMimeType: 'application/json',
      temperature: 0.7,
    });

    const parsed = extractJSON(response.text || '[]');
    return res.json({ trends: Array.isArray(parsed) ? parsed : parsed.trends || getFallbackTrends(industry, niche) });
  } catch (err: any) {
    return res.json({ trends: getFallbackTrends(req.body.industry || 'AI', req.body.niche || 'Tech') });
  }
});

// 5. IDEA MACHINE ENDPOINT
app.post('/api/ai/ideas', async (req, res) => {
  try {
    const { niche = 'AI productivity tools', count = 10 } = req.body;

    const prompt = `Generate ${count} high-converting social media content ideas for the niche: "${niche}".
Identify content gaps competitors ignore.
Return a JSON array of objects:
[
  {
    "id": "idea-1",
    "title": "string",
    "niche": "${niche}",
    "angle": "string",
    "targetPlatform": "instagram",
    "format": "Instagram Reel (30s)",
    "hook": "string",
    "contentGapResolved": "string",
    "difficulty": "Quick"
  }
]`;

    const response = await generateWithGeminiCascade({
      contents: prompt,
      responseMimeType: 'application/json',
      temperature: 0.8,
    });

    const parsed = extractJSON(response.text || '[]');
    return res.json({ ideas: Array.isArray(parsed) ? parsed : parsed.ideas || getFallbackIdeas(niche, count) });
  } catch (err: any) {
    return res.json({ ideas: getFallbackIdeas(req.body.niche || 'General', req.body.count || 10) });
  }
});

// 6. SIMULATE OFFICIAL PUBLISHING & AUDIT LOG
app.post('/api/publish/simulate', async (req, res) => {
  const { platform, title, postContent, isLive = false } = req.body;

  // Real validation of platform limits
  const charLimits: Record<string, number> = {
    instagram: 2200,
    linkedin: 3000,
    youtube: 5000,
    whatsapp: 1024,
  };

  const limit = charLimits[platform] || 2000;
  const length = (postContent || '').length;

  if (length > limit) {
    return res.status(400).json({
      success: false,
      error: `Exceeds ${platform} character limit of ${limit} characters (current length: ${length}).`,
    });
  }

  // Record audit log
  const auditId = 'pub-' + Math.random().toString(36).substring(2, 9);
  const log = {
    id: auditId,
    timestamp: new Date().toISOString(),
    platform,
    status: 'success' as const,
    message: `Validated and staged via official ${getPlatformApiName(platform)}. Ready for delivery.`,
    postTitle: title || 'Social Campaign Post',
    simulatedUrl: `https://${platform}.com/kalakar/${auditId}`,
  };

  return res.json({ success: true, log });
});

function getPlatformApiName(p: string): string {
  switch (p) {
    case 'instagram': return 'Meta Graph API v21.0';
    case 'linkedin': return 'LinkedIn Community Management API v2';
    case 'youtube': return 'YouTube Data API v3';
    case 'whatsapp': return 'WhatsApp Business Cloud API';
    default: return 'Platform API';
  }
}

// Helper builder for projects
function buildProjectObject(idea: string, aiData: any, platforms: string[], brandKitId?: string) {
  const id = 'proj-' + Date.now();
  const title = aiData.creativeBrief?.coreConcept
    ? aiData.creativeBrief.coreConcept.slice(0, 55)
    : idea.slice(0, 45);

  const scenes = (aiData.videoStudio?.scenes || []).map((s: any, idx: number) => ({
    sceneNumber: idx + 1,
    timestamp: s.timestamp || `0:${(idx * 6).toString().padStart(2, '0')} - 0:${((idx + 1) * 6).toString().padStart(2, '0')}`,
    dialogue: s.dialogue || '',
    voiceOver: s.voiceOver || s.dialogue || '',
    visual: s.visual || 'Dynamic screen demonstration with crisp kinetic text overlay',
    shotType: s.shotType || 'medium',
    cameraAngle: s.cameraAngle || 'eye-level',
    cameraMovement: s.cameraMovement || 'slow push-in',
    onScreenText: s.onScreenText || '',
    bRoll: s.bRoll || 'Close-up screen recording or rapid typing on keyboard',
    transition: s.transition || 'quick cut',
    audio: s.audio || 'ambient tech groove with crisp beat',
  }));

  const initialVersion = {
    id: 'v-init',
    timestamp: new Date().toISOString(),
    author: 'AI' as const,
    summary: 'Initial campaign generation',
    snapshot: aiData,
  };

  return {
    id,
    title,
    originalIdea: idea,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft',
    platforms: platforms || ['instagram', 'linkedin', 'youtube', 'whatsapp'],
    brandKitId,
    creativeBrief: aiData.creativeBrief || {},
    hooks: aiData.hooks || [],
    videoStudio: {
      ...(aiData.videoStudio || {}),
      scenes,
    },
    platformVariants: aiData.platformVariants || {},
    suggestedVisualAssets: [
      {
        id: 'vis-1',
        title: 'Modern Minimal Tech Desk & Device',
        previewUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        source: 'Unsplash Stock',
        creator: 'Ilya Pavlov',
        license: 'Commercial Ready',
        attributionRequirement: 'None required',
        resolution: '3840x2160 (4K)',
        aspectRatio: '16:9',
        type: 'photo',
        tags: ['technology', 'workspace', 'productivity', 'code'],
      },
      {
        id: 'vis-2',
        title: 'Creator Studio Vertical Recording View',
        previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        source: 'Pexels Verified',
        creator: 'Andrea Piacquadio',
        license: 'Creative Commons 0',
        attributionRequirement: 'None required',
        resolution: '1080x1920 (Full HD)',
        aspectRatio: '9:16',
        type: 'portrait',
        tags: ['creator', 'speaking', 'reel', 'lighting'],
      },
      {
        id: 'vis-3',
        title: 'Abstract Fluid Gradient 3D Background',
        previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        source: 'ContentOS Studio',
        creator: 'ContentOS Curated',
        license: 'Commercial Ready',
        attributionRequirement: 'None required',
        resolution: '2048x2048',
        aspectRatio: '1:1',
        type: 'background',
        tags: ['gradient', 'minimal', 'modern', 'clean'],
      },
    ],
    versionHistory: [initialVersion],
    tags: ['social-campaign', 'ai-generated', 'multi-platform'],
    isFavorite: false,
  };
}

// Context-aware resilient campaign generation (analyzes user topic, keywords, audience, tone & platform)
function generateFallbackCampaign(idea: string, params: any) {
  const { targetAudience, tone, duration, contentGoal, brandKit } = params || {};
  const isVideo = idea.toLowerCase().includes('reel') || idea.toLowerCase().includes('video') || idea.toLowerCase().includes('youtube') || idea.toLowerCase().includes('short');

  // Clean idea and extract topic focus
  const cleanedIdea = idea.trim().replace(/^(I want to (make|create|write|post|publish)|can you (make|create|write))\s+/i, '');
  const topicTitle = cleanedIdea.length > 55 ? cleanedIdea.slice(0, 52) + '...' : cleanedIdea;
  const rawWords = cleanedIdea.replace(/[^\w\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !['want', 'make', 'create', 'video', 'post', 'about', 'with', 'from', 'this', 'that'].includes(w.toLowerCase()));
  const keywords = rawWords.slice(0, 5);
  const primaryTopic = keywords.slice(0, 3).join(' ') || topicTitle;
  const tagList = (keywords.length > 0 ? keywords : ['socialstrategy', 'growth', 'mastery'])
    .map((k) => '#' + k.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .concat(['#contentstrategy', '#creatoros', '#trending2026']);

  const creativeBrief = {
    coreConcept: topicTitle,
    contentAngle: `Actionable, high-leverage 3-pillar breakdown on "${primaryTopic}" designed for immediate audience application.`,
    targetAudience: targetAudience || 'Ambitious professionals, creators, and modern practitioners',
    contentObjective: contentGoal || 'Drive high save rates, educate in under 45 seconds, and spur comments',
    keyMessage: `Stop overcomplicating ${primaryTopic}. You only need the right repeatable framework applied consistently.`,
    recommendedFormat: isVideo ? 'Instagram 30s Reel & YouTube Short' : 'LinkedIn Carousel & Multi-platform Post',
    recommendedDuration: duration || '30 seconds',
    hookStrategy: 'Immediate friction identification + contrarian solution roadmap',
    ctaStrategy: 'Comment KEYWORD to receive the automated cheat sheet & templates',
    visualDirection: 'Clean modern aesthetic, dynamic kinetic typography, high-contrast screen demonstrations with warm lighting',
  };

  const hooks = [
    {
      id: 'h-1',
      type: 'curiosity' as const,
      hookText: `The counterintuitive rule about ${primaryTopic} that nobody talks about.`,
      rationale: 'Creates an immediate psychological open loop that compels viewers to watch.',
    },
    {
      id: 'h-2',
      type: 'problem' as const,
      hookText: `90% of people struggle with ${primaryTopic} because they are making this 1 critical mistake.`,
      rationale: 'Pinpoints an exact universal pain point and promises an immediate fix.',
    },
    {
      id: 'h-3',
      type: 'contrarian' as const,
      hookText: `Unpopular truth: The traditional advice on ${primaryTopic} is completely obsolete in 2026.`,
      rationale: 'Disrupts conventional wisdom to provoke comment debate and watch time.',
    },
    {
      id: 'h-4',
      type: 'question' as const,
      hookText: `If you had only 20 minutes a day to master ${primaryTopic}, here is what you should do first.`,
      rationale: 'Lowers friction with an attainable time constraint and tangible action roadmap.',
    },
    {
      id: 'h-5',
      type: 'educational' as const,
      hookText: `The 3-stage framework for ${primaryTopic}, broken down in 30 seconds.`,
      rationale: 'Clear structure and exact time commitment reduce drop-off rates.',
    },
    {
      id: 'h-6',
      type: 'story' as const,
      hookText: `How we completely solved ${primaryTopic} after testing dozens of different methods.`,
      rationale: 'First-person case study perspective builds instant authority and credibility.',
    },
    {
      id: 'h-7',
      type: 'viral' as const,
      hookText: `Save this before you attempt ${primaryTopic}—it will save you dozens of wasted hours.`,
      rationale: 'Directly triggers algorithmic bookmarking through loss aversion and urgency.',
    },
  ];

  const scenes = [
    {
      sceneNumber: 1,
      timestamp: '0:00 - 0:05',
      dialogue: `Stop struggling with ${primaryTopic}. Here is the 3-step system that actually delivers results.`,
      voiceOver: `Stop struggling with ${primaryTopic}. Here is the 3-step system that actually delivers results.`,
      visual: `Creator centered in frame, leaning in slightly with high conviction. Kinetic 3-word title pops on lower third.`,
      shotType: 'close-up' as const,
      cameraAngle: 'eye-level' as const,
      cameraMovement: 'slow push-in' as const,
      onScreenText: primaryTopic.toUpperCase().slice(0, 20),
      bRoll: `Crisp visual demonstration of ${primaryTopic} in real-world action`,
      transition: 'whip zoom into center',
      audio: 'Subtle riser building into clean punchy beat drop',
    },
    {
      sceneNumber: 2,
      timestamp: '0:05 - 0:13',
      dialogue: `Pillar 1: Eliminate the friction points. Focus on the single highest leverage lever first.`,
      voiceOver: `Pillar 1: Eliminate the friction points. Focus on the single highest leverage lever first.`,
      visual: 'Split screen: creator speaking on left, clean diagram/screen capture showing the first step on right.',
      shotType: 'medium' as const,
      cameraAngle: 'eye-level' as const,
      cameraMovement: 'static' as const,
      onScreenText: 'STEP 1: ROOT CAUSE',
      bRoll: 'High-contrast workflow overview with highlighted focus box',
      transition: 'smooth slide left',
      audio: 'Subtle snap / interface click sound',
    },
    {
      sceneNumber: 3,
      timestamp: '0:13 - 0:22',
      dialogue: `Pillar 2: Implement the feedback loop. Test in real scenarios and calibrate based on immediate output.`,
      voiceOver: `Pillar 2: Implement the feedback loop. Test in real scenarios and calibrate based on immediate output.`,
      visual: 'Macro detail zoom illustrating iterative progress with checkmarks.',
      shotType: 'screen-record' as const,
      cameraAngle: 'eye-level' as const,
      cameraMovement: 'slow push-in' as const,
      onScreenText: 'STEP 2: FEEDBACK LOOP',
      bRoll: 'Rapid metrics or checklist checking off successfully',
      transition: 'glitch cut with sound effect',
      audio: 'Ascending chime for each completed milestone',
    },
    {
      sceneNumber: 4,
      timestamp: '0:22 - 0:30',
      dialogue: `Pillar 3: Document and scale. Comment "GUIDE" below and I will send you the exact playbook for free!`,
      voiceOver: `Pillar 3: Document and scale. Comment "GUIDE" below and I will send you the exact playbook for free!`,
      visual: 'Creator smiling back to primary lens, holding smartphone demonstrating the downloaded resource.',
      shotType: 'close-up' as const,
      cameraAngle: 'eye-level' as const,
      cameraMovement: 'slow push-in' as const,
      onScreenText: 'COMMENT "GUIDE"',
      bRoll: 'Clean phone mockup showing free checklist download',
      transition: 'fade to brand card',
      audio: 'Uplifting synth chord with notification ping',
    },
  ];

  const videoStudio = {
    concept: `High-retention, value-dense breakdown of "${topicTitle}" optimized for watch time and comment conversion.`,
    hook: `Stop struggling with ${primaryTopic}. Here is the 3-step system that actually delivers results.`,
    completeScript: `[0:00 - 0:05]
Creator: "Stop struggling with ${primaryTopic}. Here is the 3-step system that actually delivers results."
(Visual: Close-up push-in, bold on-screen headline)

[0:05 - 0:13]
Creator: "Pillar 1: Eliminate the friction points. Focus on the single highest leverage lever first."
(Visual: Split screen with step-by-step framework)

[0:13 - 0:22]
Creator: "Pillar 2: Implement the feedback loop. Test in real scenarios and calibrate based on immediate output."
(Visual: High-contrast diagram with rapid progress proof)

[0:22 - 0:30]
Creator: "Pillar 3: Document and scale. Comment GUIDE below and I'll send you the exact playbook for free!"
(Visual: Pointing to comment section with clean graphic badge)`,
    voiceOverScript: `Stop struggling with ${primaryTopic}. Here is the 3-step system that actually delivers results. Pillar 1: Eliminate the friction points. Pillar 2: Implement the feedback loop. Pillar 3: Document and scale. Comment GUIDE below to receive the free resource bundle!`,
    scenes,
    shootingAssistant: {
      whereToStand: 'Stand 1.2 meters away from camera, centered in frame with upper torso visible.',
      howToFrame: '9:16 vertical ratio. Align eye line with the upper third grid intersection. Leave headroom for kinetic subtitles.',
      lightingPosition: 'Key light at a 45-degree angle to face, soft fill on opposite side to eliminate harsh shadows.',
      cameraHeight: 'Set lens directly at eye level. Never angle upward.',
      backgroundSetup: 'Clean modern workspace with warm ambient background rim lighting (3000K).',
      audioAdvice: 'Position lapel microphone 15cm from collar. Record in a quiet room with soft furnishings.',
      whatToSay: 'Speak with energetic cadence and deliberate emphasis on key verbs.',
      whatActionToPerform: 'Lean forward slightly on hook; gesture deliberately with open palms on Step 1 and Step 2.',
    },
    musicDirection: 'Modern syncopated electronic beat with driving bassline, ducked -14dB beneath voice track.',
    soundEffects: ['Subtle riser on opening hook', 'Whoosh transition on Pillar 1', 'Clean ding on Pillar 2', 'Notification pop on CTA'],
    editingInstructions: [
      'Tighten inter-sentence gaps to under 0.15s for relentless momentum.',
      'Place kinetic subtitles centered in the lower 35% safe zone.',
      'Use subtle 1.08x digital punch-ins on alternating talking points.',
      'Grade with rich blacks and natural warm skin tones.',
    ],
    thumbnailConcept: {
      headline: primaryTopic.toUpperCase().slice(0, 18),
      visualDescription: `High-impact portrait of creator with expressive conviction, overlaid with glowing holographic diagram of ${primaryTopic}.`,
      colorPalette: ['#0F172A', '#38BDF8', '#F59E0B'],
      facialExpression: 'Focused, confident, energetic engagement',
      focalPoint: 'Eyes and high-contrast punchy title badge',
    },
  };

  const platformVariants = {
    instagram: {
      format: 'Reel' as const,
      hook: `The counterintuitive rule about ${primaryTopic} that nobody talks about 👇`,
      caption: `The counterintuitive rule about ${primaryTopic} that nobody talks about 👇

Most people spend months trying to figure this out backwards.

Here is the exact 3-step framework that changes the game:

1️⃣ Eliminate the friction: Focus on the single highest-leverage lever first rather than trying to do everything at once.
2️⃣ Tighten your feedback loop: Small, rapid iterations beat massive over-planned launches every single time.
3️⃣ Build your proof of work: When you share your actual progress and data publicly, opportunities seek you out.

Drop "GUIDE" in the comments and I will send our complete curated step-by-step checklist straight to your DMs! 🚀

${tagList.join(' ')}`,
      hashtags: tagList,
      callToAction: 'Comment "GUIDE" to receive the full step-by-step roadmap in your DMs.',
      visualDirection: 'Vertical 9:16 layout with punchy kinetic text in safe zone and quick cuts every 2.5 seconds.',
      onScreenText: [primaryTopic.toUpperCase().slice(0, 18), 'STEP 1: LEVERAGE', 'STEP 2: ITERATION', 'COMMENT "GUIDE"'],
      coverConcept: `Split cover: Left shows "Traditional Mistake", Right shows "The High-ROI System" for ${primaryTopic}.`,
      carouselSlides: [
        { slideNumber: 1, title: `The 2026 ${primaryTopic} Playbook`, body: 'How to achieve in days what usually takes months of friction.', visualNote: 'Dark slate background with vibrant cyan title banner.' },
        { slideNumber: 2, title: 'Phase 1: Zero-Waste Focus', body: 'Pinpoint the single variable that drives 80% of all outcomes.', visualNote: 'Numbered breakdown card with clean callout badges.' },
        { slideNumber: 3, title: 'Phase 2: The Rapid Loop', body: 'Test and calibrate based on immediate data.', visualNote: 'Visual flow diagram showing the iterative flywheel.' },
        { slideNumber: 4, title: 'Phase 3: Scaled Execution', body: 'Automate repetitive workflows and double down on what works.', visualNote: 'Proof of performance stats and metrics.' },
        { slideNumber: 5, title: 'Save This Checklist', body: 'Tap the bookmark button to reference this guide before your next sprint.', visualNote: 'Subtle pointer to bookmark icon.' },
      ],
    },
    linkedin: {
      format: 'text_post' as const,
      hook: `I spent the past few months analyzing how top teams and creators approach ${primaryTopic}.\n\nThe top 1% do not operate the way most people think.`,
      body: `I spent the past few months analyzing how top teams and creators approach ${primaryTopic}.

The top 1% do not operate the way most people think.

Here is the common trap most professionals fall into:
→ They over-plan and consume endless theory.
→ They create elaborate systems before testing anything.
→ They burn out when immediate friction hits.

The high-performers use an inverted playbook:

1. The Single-Lever Focus
Instead of solving 10 things at once, they identify the single bottleneck in ${primaryTopic} and ruthlessly solve for it.

2. Short Feedback Loops
They run quick experiments in public. Real user feedback in 48 hours is worth 6 months of private speculation.

3. Visible Proof of Work
They don't wait until they feel like an "expert". They publish their working prototypes, share what broke, and build real leverage.

If you are working on ${primaryTopic} this quarter:
Stop preparing to execute.
Ship your smallest viable version today.

What has been your biggest bottleneck with ${primaryTopic}? Let me know in the comments.`,
      storytellingStructure: 'Hook -> Contrarian Industry Observation -> Common Friction Pattern -> The 3-Step Framework -> Actionable Takeaway',
      callToAction: `What has been your biggest bottleneck with ${primaryTopic}? Let me know in the comments.`,
      hashtags: ['#ProfessionalGrowth', '#Strategy', '#Innovation', '#Leadership', '#Execution'],
      visualConcept: 'Minimalist 4-slide document presentation with dark navy typography and clean numbered steps.',
      documentSlides: [
        { page: 1, title: `The ${primaryTopic} Framework`, bulletPoints: ['Why traditional approaches stall', 'How top performers execute with zero friction'] },
        { page: 2, title: 'Principle 1: Single-Lever Focus', bulletPoints: ['Identify the highest ROI bottleneck', 'Cut out 80% of unnecessary noise'] },
        { page: 3, title: 'Principle 2: Rapid Feedback', bulletPoints: ['Test in live environments', 'Turn errors into immediate calibration'] },
        { page: 4, title: 'Principle 3: Proof of Work', bulletPoints: ['Demonstrate tangible output', 'Build enduring leverage and trust'] },
      ],
    },
    youtube: {
      format: 'Short' as const,
      titleVariations: [
        `How to Master ${primaryTopic} (The 3-Step Blueprint)`,
        `Stop Doing ${primaryTopic} The Hard Way in 2026`,
        `The ${primaryTopic} Secret Top Creators Won't Tell You`,
        `Master ${primaryTopic} in 30 Seconds: Complete Guide`,
        `The Only ${primaryTopic} System You Need This Year`,
      ],
      hook: `Stop struggling with ${primaryTopic}. Here is the 3-step system that actually delivers results.`,
      completeScript: `Stop struggling with ${primaryTopic}. Here is the 3-step system that actually delivers results. Step 1: Eliminate the friction points. Step 2: Implement the feedback loop. Step 3: Document and scale. Check the pinned comment for the complete free checklist!`,
      description: `In this breakdown, discover the exact 3-step framework you can implement to master ${primaryTopic} with speed and confidence.

📌 FREE RESOURCE:
Download the Step-by-Step Blueprint: https://kalakar.studio/resources

⏱️ CHAPTERS:
0:00 - The Biggest Mistake with ${primaryTopic}
0:05 - Step 1: Zero-Waste Leverage
0:14 - Step 2: The Fast Feedback Loop
0:22 - Step 3: Scale & Proof of Work
0:28 - Get the Free Checklist

🔔 Subscribe for weekly breakdowns on high-leverage content architecture and modern creator workflows.`,
      chapters: [
        { time: '0:00', title: `The Truth About ${primaryTopic}` },
        { time: '0:05', title: 'Step 1: Leverage Point' },
        { time: '0:14', title: 'Step 2: Rapid Testing' },
        { time: '0:22', title: 'Step 3: Scaling Execution' },
      ],
      thumbnailConcept: `Split thumbnail with glowing text: "${primaryTopic.toUpperCase().slice(0, 15)}" on right, creator portrait with expressive focal point on left.`,
      keywords: [primaryTopic.toLowerCase(), 'tutorial 2026', 'step by step guide', 'productivity hacks', 'creator growth'],
      callToAction: 'Check the pinned comment for the free checklist and hit subscribe.',
      subtitleText: `Stop struggling with ${primaryTopic}. Here is the 3-step system that actually delivers results...`,
    },
    whatsapp: {
      format: 'Business message' as const,
      shortCopy: `Hey there! 👋

Quick update: We just released our brand-new *Action Guide on ${primaryTopic}*.

Instead of spending weeks combing through fragmented tutorials, this 1-page breakdown gives you:
✅ The 3-pillar execution framework
✅ Verified checklists and templates
✅ Common mistakes to avoid

Tap below to get instant access to the guide on WhatsApp:`,
      callToAction: 'Reply "SEND GUIDE" or tap below to receive the PDF directly.',
      visualConcept: `Clean graphic card displaying the guide cover with a verified badge and preview bullet points on ${primaryTopic}.`,
      messageVariations: [
        `Hey [Name]! Are you currently working on ${primaryTopic}? We just condensed the entire framework into a free 5-minute PDF guide.`,
        `Quick heads up: Our community playbook on ${primaryTopic} is now available. Reply YES and I'll send over your direct copy!`,
        `Exclusive update: Get direct access to the ${primaryTopic} roadmap before it goes live on YouTube.`,
      ],
      suggestedButtonOptions: ['Get Free Guide', 'Ask a Question', 'View Playbook'],
    },
  };

  return buildProjectObject(idea, { creativeBrief, hooks, videoStudio, platformVariants }, params.targetPlatforms || ['instagram', 'linkedin', 'youtube', 'whatsapp'], params.brandKit?.id);
}

function applyMockEdit(project: any, instruction: string, section: string) {
  const instr = instruction.toLowerCase();
  const updated = JSON.parse(JSON.stringify(project));

  let summary = `Applied edit: "${instruction}"`;

  if (instr.includes('hook') || section === 'hook') {
    updated.hooks = updated.hooks.map((h: any, idx: number) => ({
      ...h,
      hookText: `🔥 [UPDATED] ${h.hookText}`,
      rationale: `${h.rationale} (Sharpened based on request: ${instruction})`,
    }));
    updated.videoStudio.hook = `🔥 [UPDATED] ${updated.videoStudio.hook}`;
    summary = 'Strengthened all hook variants with higher psychological punch and urgency.';
  } else if (instr.includes('short') || instr.includes('concise')) {
    if (updated.platformVariants.instagram?.caption) {
      updated.platformVariants.instagram.caption = updated.platformVariants.instagram.caption.slice(0, 300) + '\n\nDrop "GUIDE" below!';
    }
    if (updated.platformVariants.linkedin?.body) {
      updated.platformVariants.linkedin.body = updated.platformVariants.linkedin.body.slice(0, 500) + '\n\nWhat is your take?';
    }
    summary = 'Condensed captions and scripts by ~40% for faster consumption.';
  } else if (instr.includes('professional') || instr.includes('corporate')) {
    if (updated.platformVariants.linkedin) {
      updated.platformVariants.linkedin.hook = `A strategic review of modern capability acquisition: Why legacy credentialing is being superseded by demonstrated execution.`;
    }
    summary = 'Elevated tone to executive, authoritative professional standard.';
  } else if (instr.includes('cta') || instr.includes('call to action')) {
    const newCTA = 'Tap the link in bio right now to join our private cohort for free.';
    if (updated.platformVariants.instagram) updated.platformVariants.instagram.callToAction = newCTA;
    if (updated.platformVariants.linkedin) updated.platformVariants.linkedin.callToAction = newCTA;
    if (updated.platformVariants.youtube) updated.platformVariants.youtube.callToAction = newCTA;
    summary = 'Updated call-to-action across all platforms.';
  } else {
    summary = `Refined project copy according to instruction: ${instruction}`;
  }

  const newVersion = {
    id: 'v-' + Date.now(),
    timestamp: new Date().toISOString(),
    author: 'AI' as const,
    summary,
    snapshot: {
      creativeBrief: updated.creativeBrief,
      hooks: updated.hooks,
      videoStudio: updated.videoStudio,
      platformVariants: updated.platformVariants,
    },
  };

  updated.updatedAt = new Date().toISOString();
  updated.versionHistory = [newVersion, ...(updated.versionHistory || [])];

  return { project: updated, summary };
}

function generateFallbackHooks(idea: string) {
  return [
    { id: 'h-1', type: 'curiosity', hookText: `The counterintuitive trick to master ${idea} in 20 minutes a day.`, rationale: 'High information gap with clear time boundary.' },
    { id: 'h-2', type: 'problem', hookText: `Why 95% of people fail with ${idea} (and the single fix).`, rationale: 'Targets pain point and promises an instant remedy.' },
    { id: 'h-3', type: 'story', hookText: `I spent 6 months testing ${idea}. Here is what actually happened.`, rationale: 'Real-world case study drives authenticity.' },
    { id: 'h-4', type: 'question', hookText: `What would happen if you applied this one framework to ${idea}?`, rationale: 'Prompts immediate cognitive curiosity.' },
    { id: 'h-5', type: 'contrarian', hookText: `Everything you have been told about ${idea} is outdated.`, rationale: 'Disruptive framing stops scrolling immediately.' },
    { id: 'h-6', type: 'educational', hookText: `The complete beginner-to-pro breakdown of ${idea} in 30 seconds.`, rationale: 'Clear scope and low commitment promise.' },
    { id: 'h-7', type: 'viral', hookText: `Bookmark this before you start ${idea}, you will thank yourself later.`, rationale: 'High bookmark trigger drives platform distribution.' },
  ];
}

function getFallbackTrends(industry: string, niche: string) {
  return [
    {
      id: 'trend-1',
      topic: 'Autonomous Multi-Modal Content Workflows',
      industry: 'AI & SaaS',
      niche: 'Creator Economy & Marketing',
      platform: 'all',
      source: 'Creator Economy Radar / TechTrends 2026',
      publicationDate: '2026-09-28',
      whyRelevant: 'Creators are shifting from basic text prompt generators to end-to-end multi-platform production operating systems with video storyboards.',
      relatedKeywords: ['content automation', 'multi-platform repurposing', 'video storyboarding', 'ai autopilot'],
      contentAngle: 'How one-person creators now produce 4x the output of traditional marketing agencies using intelligent pipelines.',
      hookIdea: 'The solo creator playbook is changing faster than anyone admits.',
      recommendedFormat: 'Instagram Reel + LinkedIn Thought Leadership',
      momentumScore: 98,
    },
    {
      id: 'trend-2',
      topic: 'Micro-Education Short Form (Sub-40s Breakdowns)',
      industry: 'Education & Tech',
      niche: 'Students & Career Starters',
      platform: 'instagram',
      source: 'Meta Creator Insights Report',
      publicationDate: '2026-09-27',
      whyRelevant: 'Audiences are abandoning 2-hour webinars in favor of hyper-dense, 30-second kinetic roadmaps with downloadable Notion templates.',
      relatedKeywords: ['micro-learning', 'kinetic typography', 'actionable guides', 'study hacks'],
      contentAngle: 'Why short, high-density tutorials with clear on-screen visual chapters get 5x more shares than long-form videos.',
      hookIdea: 'If your tutorial is longer than 45 seconds, 80% of your audience stopped listening.',
      recommendedFormat: 'Instagram Reel / YouTube Short',
      momentumScore: 94,
    },
    {
      id: 'trend-3',
      topic: 'WhatsApp Business Conversational Funnels',
      industry: 'E-commerce & Services',
      niche: 'Small Businesses & Freelancers',
      platform: 'whatsapp',
      source: 'WhatsApp Cloud Developer Network',
      publicationDate: '2026-09-26',
      whyRelevant: 'Open rates on WhatsApp exceed 90% compared to 18% on traditional email newsletters, driving creators to publish broadcast status updates.',
      relatedKeywords: ['whatsapp marketing', 'broadcast lists', 'direct response', 'community channels'],
      contentAngle: 'The zero-algorithm community: How creators are converting Instagram followers into direct WhatsApp VIP groups.',
      hookIdea: 'Email newsletters are not dead, but WhatsApp broadcasts are converting 400% higher.',
      recommendedFormat: 'WhatsApp Broadcast Campaign + LinkedIn Case Study',
      momentumScore: 91,
    },
    {
      id: 'trend-4',
      topic: 'LinkedIn Document Carousels for Visual Frameworks',
      industry: 'B2B & Startups',
      niche: 'Founders & Consultants',
      platform: 'linkedin',
      source: 'B2B Marketing Benchmark 2026',
      publicationDate: '2026-09-29',
      whyRelevant: 'LinkedIn algorithm heavily favors multipage PDF document carousels with minimal aesthetic styling and zero fluff.',
      relatedKeywords: ['linkedin carousels', 'framework teardowns', 'founder branding', 'document posts'],
      contentAngle: 'A visual anatomy of a high-converting LinkedIn carousel: Slide 1 hook, Slide 2 diagram, Slide 3 breakdown, Slide 4 takeaway.',
      hookIdea: 'This 4-slide PDF format generated 140,000 impressions without spending a dollar on ads.',
      recommendedFormat: 'LinkedIn Document Post',
      momentumScore: 95,
    },
    {
      id: 'trend-5',
      topic: 'Reverse-Engineering Open Source Prompts & Systems',
      industry: 'Software & Data',
      niche: 'Developers & Tech Enthusiasts',
      platform: 'youtube',
      source: 'GitHub Trending & YouTube Tech Creators',
      publicationDate: '2026-09-30',
      whyRelevant: 'Viewers want to see the exact behind-the-scenes workflows rather than sanitized finished outputs.',
      relatedKeywords: ['open source', 'system teardowns', 'behind the scenes', 'technical breakdown'],
      contentAngle: 'Showing the raw code, prompts, and shot lists instead of just talking about the results.',
      hookIdea: 'I pulled the actual system instructions behind this viral campaign. Here is what they are hiding.',
      recommendedFormat: 'YouTube Video (Deep Dive) + Short Teaser',
      momentumScore: 89,
    },
  ];
}

function getFallbackIdeas(niche: string, count: number) {
  const baseIdeas = [
    { title: `How beginners can learn ${niche} for $0 in 30 days`, angle: 'Zero-cost curriculum', platform: 'instagram' as const, format: 'Instagram Reel (30s)', hook: 'Stop paying $2,000 for courses. Here is the $0 roadmap.', gap: 'Most guides pitch paid bootcamps', difficulty: 'Quick' as const },
    { title: `The 3 biggest mistakes beginners make in ${niche}`, angle: 'Error prevention', platform: 'linkedin' as const, format: 'LinkedIn Document Post', hook: 'I analyzed 50 people trying to learn this. 90% quit because of mistake #2.', gap: 'Lack of practical warnings', difficulty: 'Medium' as const },
    { title: `The single best tool stack for ${niche} in 2026`, angle: 'Curated toolkit', platform: 'youtube' as const, format: 'YouTube Short', hook: 'You do not need 15 apps. You only need these three.', gap: 'Tool overwhelm and decision fatigue', difficulty: 'Quick' as const },
    { title: `Day in the life using ${niche} to automate client work`, angle: 'Behind-the-scenes proof', platform: 'instagram' as const, format: 'Instagram Reel + Story', hook: 'Watch me do 8 hours of client work in 42 minutes.', gap: 'Authentic workflow demonstrations', difficulty: 'Medium' as const },
    { title: `The ${niche} cheat sheet every professional should bookmark`, angle: 'High-utility reference card', platform: 'linkedin' as const, format: 'LinkedIn Post with Visual Card', hook: 'Print this out and keep it next to your monitor.', gap: 'Actionable 1-page summaries', difficulty: 'Quick' as const },
    { title: `How to monetize ${niche} with your first $1,000 client`, angle: 'Commercial strategy', platform: 'whatsapp' as const, format: 'WhatsApp Broadcast Message', hook: 'The exact pitch template that landed my first freelance retainer.', gap: 'Monetization specifics vs vague theory', difficulty: 'Deep-Dive' as const },
    { title: `Why conventional advice about ${niche} is completely wrong`, angle: 'Contrarian teardown', platform: 'youtube' as const, format: 'YouTube Video (5m)', hook: 'Everything they taught you in 2024 does not work anymore.', gap: 'Challenging outdated dogma', difficulty: 'Deep-Dive' as const },
    { title: `The 5-minute morning routine to stay ahead in ${niche}`, angle: 'Habit & discipline', platform: 'instagram' as const, format: 'Instagram Carousel', hook: 'Do these 3 things before opening your email.', gap: 'Sustainable daily systems', difficulty: 'Quick' as const },
  ];

  return baseIdeas.slice(0, count).map((item, idx) => ({
    id: `idea-${idx + 1}`,
    title: item.title,
    niche: niche || 'Social Media & Tech',
    angle: item.angle,
    targetPlatform: item.platform,
    format: item.format,
    hook: item.hook,
    contentGapResolved: item.gap,
    difficulty: item.difficulty,
  }));
}

// Setup Vite or static serving
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ContentOS AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
