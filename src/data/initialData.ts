import {
  BrandKit,
  GeneratedProject,
  ScheduledPost,
  ConnectedAccount,
  TrendTopic,
  ContentIdea,
  AutopilotPlan,
  VisualAsset,
} from '../types';

export const INITIAL_BRAND_KITS: BrandKit[] = [
  {
    id: 'bk-tech',
    name: 'NextGen Tech Studio',
    tagline: 'Demystifying the future of software and AI.',
    colors: ['#0F172A', '#38BDF8', '#818CF8', '#10B981'],
    fontFamily: 'Inter, system-ui, sans-serif',
    tone: 'Direct, analytical, punchy, and zero-fluff',
    language: 'English (US)',
    targetAudience: 'Software engineers, tech founders, and ambitious developers',
    preferredWords: ['production-grade', 'framework', 'architecture', 'high-leverage', 'actionable'],
    blockedWords: ['synergy', 'game-changer', 'revolutionary', 'unbelievable', 'shocking'],
    contentRules: [
      'Always deliver the core takeaway within the first 5 seconds.',
      'Provide concrete examples with numbers, code, or architecture diagrams.',
      'Avoid vague buzzwords or exaggerated hype.',
    ],
  },
  {
    id: 'bk-creator',
    name: 'The Modern Creator',
    tagline: 'Mastering the business of solo entrepreneurship.',
    colors: ['#18181B', '#F59E0B', '#EC4899', '#FAFAFA'],
    fontFamily: 'system-ui, -apple-system, sans-serif',
    tone: 'Conversational, encouraging, transparent, and pragmatic',
    language: 'English (Global)',
    targetAudience: 'Content creators, freelancers, and digital solopreneurs',
    preferredWords: ['proof of work', 'audience', 'sustainable', 'clarity', 'systems'],
    blockedWords: ['passive income guaranteed', 'get rich quick', 'hack'],
    contentRules: [
      'Speak from real personal testing and vulnerable case studies.',
      'Break lessons into 3 easy actionable bullet points.',
    ],
  },
];

export const INITIAL_PROJECTS: GeneratedProject[] = [
  {
    id: 'proj-ai-beginners',
    title: 'How Beginners Can Learn AI for $0 in 2026',
    originalIdea: 'I want to make a 30-second Reel explaining how beginners can start learning AI for free.',
    createdAt: '2026-09-28T14:20:00Z',
    updatedAt: '2026-09-29T09:15:00Z',
    status: 'approved',
    platforms: ['instagram', 'linkedin', 'youtube', 'whatsapp'],
    brandKitId: 'bk-tech',
    tags: ['ai', 'learning', 'education', 'reels', 'viral'],
    isFavorite: true,
    creativeBrief: {
      coreConcept: 'Mastering AI from zero without expensive bootcamps using an inverted 3-step build loop.',
      contentAngle: 'Contrarian wake-up call to replace 40-hour tutorial paralysis with immediate mini prototypes.',
      targetAudience: 'Students, self-taught developers, and career switchers looking for pragmatic AI skills.',
      contentObjective: 'Drive high saves and DMs for the free Notion roadmap template.',
      keyMessage: 'You do not need a $2,000 degree. You need 20 minutes a day and public proof of work.',
      recommendedFormat: 'Instagram 30s Reel & YouTube Short',
      recommendedDuration: '30 seconds',
      hookStrategy: 'Direct monetary comparison ($2,000 vs $0) paired with an urgent visual stop-sign.',
      ctaStrategy: 'Comment "GUIDE" to receive the automated direct message containing the resource vault.',
      visualDirection: 'Crisp studio lighting, kinetic punchy lower-third subtitles, high-contrast screen zooms.',
    },
    hooks: [
      {
        id: 'h-1',
        type: 'curiosity',
        hookText: 'Stop paying $2,000 for courses. Here is how I learned AI from scratch for $0 in 7 days.',
        rationale: 'High psychological curiosity gap with strong monetary anchor.',
        selected: true,
      },
      {
        id: 'h-2',
        type: 'problem',
        hookText: '90% of people trying to learn AI quit in week one because they start completely backwards.',
        rationale: 'Addresses universal tutorial paralysis and promises a corrective path.',
      },
      {
        id: 'h-3',
        type: 'contrarian',
        hookText: 'Unpopular truth: Reading AI research papers will not make you hireable. Building mini-tools will.',
        rationale: 'Challenges academic dogma to provoke immediate comments and debate.',
      },
      {
        id: 'h-4',
        type: 'question',
        hookText: 'If you had to master generative AI with only 20 minutes a day, where would you start?',
        rationale: 'Invites personal self-reflection and sets up an easy step-by-step answer.',
      },
      {
        id: 'h-5',
        type: 'educational',
        hookText: 'The 3-stage AI learning framework that actually works, explained in 30 seconds.',
        rationale: 'Definite time commitment lowers cognitive barrier to finish the video.',
      },
      {
        id: 'h-6',
        type: 'story',
        hookText: '6 months ago I could not write a prompt. Today I build production AI agents. Here is the blueprint.',
        rationale: 'Personal transformation arc builds instant authority and relatability.',
      },
      {
        id: 'h-7',
        type: 'viral',
        hookText: 'Save this video before your competition discovers this AI learning workflow.',
        rationale: 'Triggers platform save algorithms through strategic urgency.',
      },
    ],
    videoStudio: {
      concept: 'High-tempo 30-second educational Reel teaching an inverted 3-step AI learning system.',
      hook: 'Stop paying $2,000 for courses. Here is how I learned AI from scratch for $0 in 7 days.',
      completeScript: `[0:00 - 0:04]
Creator: "Stop paying $2,000 for AI courses. Here is how you can master this for completely free in 7 days."
(Visual: Leaning in close-up, kinetic red "$2,000" slashed through)

[0:04 - 0:12]
Creator: "Step 1: Skip the 40-hour lectures. Go straight to playground documentation and build a 1-click prototype today."
(Visual: Split screen with terminal/browser showing working API call)

[0:12 - 0:22]
Creator: "Step 2: Clone open-source agent templates. Break them down, inspect the prompt chains, and fix the bugs yourself."
(Visual: Screen capture zoom with yellow highlighter circles)

[0:22 - 0:30]
Creator: "Step 3: Publish your proof of work publicly. Comment GUIDE below and I will DM you my entire free Notion roadmap!"
(Visual: Creator holding phone with finished roadmap, smile to lens)`,
      voiceOverScript: 'Stop paying $2,000 for AI courses. Here is how you can master this for completely free in 7 days. Step 1: Skip lectures and build a 1-click prototype. Step 2: Clone open source agent templates. Step 3: Publish proof of work. Comment GUIDE for the free checklist.',
      scenes: [
        {
          sceneNumber: 1,
          timestamp: '0:00 - 0:04',
          dialogue: 'Stop paying $2,000 for AI courses. Here is how you can master this for completely free in 7 days.',
          voiceOver: 'Stop paying $2,000 for AI courses. Here is how you can master this for completely free in 7 days.',
          visual: 'Creator looking directly into lens, leaning forward with energetic expression. Red course price graphic crosses out.',
          shotType: 'close-up',
          cameraAngle: 'eye-level',
          cameraMovement: 'slow push-in',
          onScreenText: '$0 AI ROADMAP',
          bRoll: 'Quick 0.5s cut of sleek laptop screen with browser tabs',
          transition: 'whip zoom into screen',
          audio: 'Punchy bass drop + subtle whoosh',
        },
        {
          sceneNumber: 2,
          timestamp: '0:04 - 0:12',
          dialogue: 'Step 1: Skip the 40-hour lectures. Go straight to playground documentation and build a 1-click prototype today.',
          voiceOver: 'Step 1: Skip the 40-hour lectures. Go straight to playground documentation and build a 1-click prototype today.',
          visual: 'Split screen: creator speaking on left, clean screen capture demonstrating immediate setup on right.',
          shotType: 'medium',
          cameraAngle: 'eye-level',
          cameraMovement: 'static',
          onScreenText: 'STEP 1: BUILD 1ST',
          bRoll: 'Cursor clicking run and seeing instant green output',
          transition: 'slide left',
          audio: 'Soft keyboard click sound effect',
        },
        {
          sceneNumber: 3,
          timestamp: '0:12 - 0:22',
          dialogue: 'Step 2: Clone open-source agent templates. Break them down, inspect the prompt chains, and fix the bugs yourself.',
          voiceOver: 'Step 2: Clone open-source agent templates. Break them down, inspect the prompt chains, and fix the bugs yourself.',
          visual: 'Dynamic screen zoom showing code/prompt structure with highlighted yellow annotations.',
          shotType: 'screen-record',
          cameraAngle: 'eye-level',
          cameraMovement: 'slow push-in',
          onScreenText: 'STEP 2: REVERSE ENGINEER',
          bRoll: 'High-speed code scrolling with glowing brackets',
          transition: 'glitch cut',
          audio: 'Crisp ding sound effect on each key insight',
        },
        {
          sceneNumber: 4,
          timestamp: '0:22 - 0:30',
          dialogue: 'Step 3: Publish your proof of work publicly. Comment GUIDE below and I will DM you my entire free Notion roadmap!',
          voiceOver: 'Step 3: Publish your proof of work publicly. Comment GUIDE below and I will DM you my entire free Notion roadmap!',
          visual: 'Creator smiling back to center camera, holding phone displaying the finished guide.',
          shotType: 'close-up',
          cameraAngle: 'eye-level',
          cameraMovement: 'slow push-in',
          onScreenText: 'COMMENT "GUIDE"',
          bRoll: 'Clean phone mockup showing free PDF download',
          transition: 'fade out to logo mark',
          audio: 'Uplifting synth chord with notification chime',
        },
      ],
      shootingAssistant: {
        whereToStand: 'Stand 1.2m away from phone tripod, framed from mid-chest up.',
        howToFrame: 'Vertical 9:16 ratio. Align your eye line with the upper third line to leave room for subtitles.',
        lightingPosition: 'Ring light or softbox at 45 degrees left. Turn off overhead ceiling lights to avoid unflattering shadows.',
        cameraHeight: 'Set lens at eye level. Avoid low angles from desks.',
        backgroundSetup: 'Minimal clean workspace. Warm 3000K accent light in the back right corner.',
        audioAdvice: 'Clip wireless mic 15cm below chin. Record a 3-second silence test to check for room resonance.',
        whatToSay: 'Speak with crisp enunciation and 10% faster than casual conversation.',
        whatActionToPerform: 'Shake head firmly on "$2,000", hold up index finger on "Step 1", point down on "Comment GUIDE".',
      },
      musicDirection: 'Driving minimal synthwave at 120 BPM, sidechained -12dB under speech.',
      soundEffects: ['Sub whoosh on opening', 'Digital click on step 1', 'Coin chime on step 2', 'Success chime on CTA'],
      editingInstructions: [
        'Cut every silence longer than 150 milliseconds.',
        'Use dynamic kinetic subtitles with yellow accent on keywords.',
        'Apply a 1.08x digital push on sentence transitions.',
      ],
      thumbnailConcept: {
        headline: 'LEARN AI FOR $0',
        visualDescription: 'Creator looking surprised pointing toward glowing futuristic neon diagram.',
        colorPalette: ['#0F172A', '#38BDF8', '#F59E0B'],
        facialExpression: 'High energy, enthusiastic eye contact',
        focalPoint: 'Creator eyes and the $0 badge',
      },
    },
    platformVariants: {
      instagram: {
        format: 'Reel',
        hook: 'Stop paying $2,000 for courses. Here is how to learn AI for free in 2026 👇',
        caption: `Stop paying $2,000 for courses. Here is how to learn AI for free in 2026 👇

Most people spend 6 months reading theory without ever building a single real prototype.

Here is the exact 3-step build system:
1️⃣ Skip 40-hour lectures. Go to interactive playgrounds and build on day one.
2️⃣ Reverse-engineer top GitHub repos and templates. Break them, fix them, master them.
3️⃣ Build in public. One public project beats 50 certificates on a resume.

Drop "GUIDE" in the comments and I will send you my complete curated Notion resource vault for free! 🚀

#learnai #aiagents #productivity #techcareers #softwaredeveloper #selfgrowth`,
        hashtags: ['#learnai', '#aiagents', '#productivity', '#techcareers', '#softwaredeveloper', '#selfgrowth'],
        callToAction: 'Comment "GUIDE" to get the free roadmap in your DMs.',
        visualDirection: 'Vertical 9:16 format with high-contrast text overlay and bold dynamic cuts every 2 seconds.',
        onScreenText: ['$0 AI ROADMAP', 'STEP 1: BUILD 1ST', 'STEP 2: REVERSE ENGINEER', 'COMMENT "GUIDE"'],
        coverConcept: 'Split-screen mockup: Left shows crossed-out "$2,000 Course", Right shows clean "$0 Action Plan".',
        carouselSlides: [
          { slideNumber: 1, title: 'The $0 AI Mastery Roadmap', body: 'How to learn in 7 days what others take 6 months to figure out.', visualNote: 'Bold title slide with dark slate background and cyan accent.' },
          { slideNumber: 2, title: 'Phase 1: Zero-Theory Setup', body: 'Launch a minimal working AI agent in under 30 minutes.', visualNote: 'Screenshot with clean numbered callouts.' },
          { slideNumber: 3, title: 'Phase 2: Reverse Engineering', body: 'Take apart existing solutions to understand prompt chains and memory.', visualNote: 'Code breakdown diagram with key components highlighted.' },
          { slideNumber: 4, title: 'Phase 3: Public Proof of Work', body: 'Publish your project and showcase tangible working software.', visualNote: 'Social proof card with engagement stats.' },
          { slideNumber: 5, title: 'Save This Guide', body: 'Tap the bookmark icon to keep this resource for your weekend sprint.', visualNote: 'Arrow pointing to Instagram bookmark button.' },
        ],
      },
      linkedin: {
        format: 'text_post',
        hook: 'I spent 4 years observing how top engineers and product leaders master AI.\n\nThe top 1% do not learn the way universities teach.',
        body: `I spent 4 years observing how top engineers and product leaders master AI.

The top 1% do not learn the way universities teach.

Here is what happens when 90% of people try to upskill:
→ They buy a 40-hour course.
→ They take pages of notes.
→ They finish 30% of it.
→ They forget everything 2 weeks later.

The top performers use an inverted learning loop:

1. The "Sandbox First" Rule
Instead of studying neural network architecture for weeks, they clone a working template on day one and make one small feature work. Immediate dopamine from building replaces passive consumption.

2. The Error-Driven Curriculum
They intentionally trigger errors. Debugging real API constraints teaches you more in 2 hours than 20 hours of polished tutorial lectures.

3. Public Proof of Work
They do not wait until they feel like an "expert". They publish their rough builds and document what broke. Opportunities find people with visible receipts, not silent perfectionists.

If you are starting your learning journey this quarter:
Stop preparing to start.
Ship a broken first version today.

What is one AI tool you have been wanting to build with? Drop it below.`,
        storytellingStructure: 'Hook -> Contrarian Observation -> Conventional Failure Pattern -> The Inverted Framework -> Pragmatic Call to Action',
        callToAction: 'What is one AI tool you have been wanting to build with? Drop it below.',
        hashtags: ['#ArtificialIntelligence', '#SoftwareEngineering', '#Productivity', '#CareerGrowth', '#Upskilling'],
        visualConcept: 'Clean 4-page PDF document carousel with minimalist typography, dark navy headers, and structured framework cards.',
        documentSlides: [
          { page: 1, title: 'The Inverted AI Learning Loop', bulletPoints: ['Why 90% of bootcamps fail learners', 'The 3-stage sandbox methodology'] },
          { page: 2, title: 'Step 1: Sandbox First', bulletPoints: ['Deploy in 30 minutes', 'Learn on demand, not in case'] },
          { page: 3, title: 'Step 2: Error-Driven Mastery', bulletPoints: ['Inspect raw API responses', 'Fixing runtime errors builds instinct'] },
          { page: 4, title: 'Step 3: Visible Receipts', bulletPoints: ['Real shipped URLs beat course certificates', 'Publish the build log'] },
        ],
      },
      youtube: {
        format: 'Short',
        titleVariations: [
          'How to Learn AI for Free in 2026 (Beginner Roadmap)',
          'Stop Buying Courses! Learn AI for $0 in 7 Days',
          'The 3-Step AI Learning Secret Top Engineers Use',
          'Learn in 30 Seconds What Took Me 2 Years',
          'The $0 AI Blueprint for Students and Creators',
        ],
        hook: 'Stop paying $2,000 for AI courses. Here is how to master this for completely free.',
        completeScript: 'Stop paying $2,000 for AI courses. Here is how you can master this for completely free in 7 days. Step 1: Skip lectures and build a 1-click prototype. Step 2: Clone open source agent templates. Step 3: Publish proof of work. Check the pinned comment for the free full Notion roadmap!',
        description: `In this video, I break down the exact 3-step system you can use to master modern AI for $0 without wasting months on theoretical bootcamps.

📌 FREE RESOURCE BUNDLE:
Download the Notion Roadmap: https://kalakar.studio/free-ai-roadmap

⏱️ CHAPTERS:
0:00 - The $2,000 Course Trap
0:04 - Step 1: The Sandbox Rule
0:12 - Step 2: Reverse-Engineering Workflows
0:22 - Step 3: Public Proof of Work
0:28 - Get the Free Checklist

🔔 Subscribe for weekly breakdowns on AI, productivity, and modern creator workflows.`,
        chapters: [
          { time: '0:00', title: 'The $2,000 Course Trap' },
          { time: '0:04', title: 'Step 1: The Sandbox Rule' },
          { time: '0:12', title: 'Step 2: Reverse-Engineering Workflows' },
          { time: '0:22', title: 'Step 3: Public Proof of Work' },
        ],
        thumbnailConcept: 'Split screen: Left side red cross on "$2000 Bootcamp", Right side glowing cyan "FREE 7-DAY ROADMAP" with expressive creator portrait.',
        keywords: ['learn ai free', 'ai for beginners', 'generative ai tutorial', 'how to learn coding 2026', 'ai roadmap'],
        callToAction: 'Check the pinned comment for the free Notion roadmap and subscribe for more.',
        subtitleText: 'Stop paying $2,000 for AI courses. Here is how you can master this for completely free in 7 days...',
      },
      whatsapp: {
        format: 'Business message',
        shortCopy: `Hey there! 👋

Quick update: We just released our brand-new *7-Day Free AI Mastery Roadmap*.

Instead of spending weeks wading through 40-hour lectures, this distilled 1-page guide gives you:
✅ The exact 3-stage sandbox setup
✅ 10 verified free AI playgrounds & APIs
✅ The public proof-of-work project template

Tap below to get instant access to the guide on WhatsApp:`,
        callToAction: 'Reply "SEND GUIDE" or tap the button below to receive the PDF directly.',
        visualConcept: 'Clean 1080x1080 graphic card featuring the roadmap cover with a verified badge and preview checklist.',
        messageVariations: [
          'Hey [Name]! Are you still looking to learn modern AI tools? We just packed the entire 7-day system into a free 5-minute PDF.',
          'Quick heads up: Our community-favorite AI guide is now live. Reply YES and I\'ll send over the download link right away!',
          'Exclusive for our WhatsApp community: Get direct access to the 7-day roadmap before it goes public on YouTube.',
        ],
        suggestedButtonOptions: ['Get Free Guide', 'Ask a Question', 'View Sample Project'],
      },
    },
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
        source: 'Kalakar Studio',
        creator: 'Kalakar Curated',
        license: 'Commercial Ready',
        attributionRequirement: 'None required',
        resolution: '2048x2048',
        aspectRatio: '1:1',
        type: 'background',
        tags: ['gradient', 'minimal', 'modern', 'clean'],
      },
    ],
    versionHistory: [
      {
        id: 'v-init',
        timestamp: '2026-09-28T14:20:00Z',
        author: 'AI',
        summary: 'Initial multi-platform campaign generated from idea prompt',
        snapshot: {},
      },
      {
        id: 'v-2',
        timestamp: '2026-09-29T09:15:00Z',
        author: 'User',
        summary: 'Selected curiosity hook #1 and applied to video script',
        snapshot: {},
      },
    ],
  },
  {
    id: 'proj-saas-playbook',
    title: 'The 0-to-1K MRR Playbook for Solo Devs',
    originalIdea: 'Create a LinkedIn carousel and Twitter/Instagram breakdown on how solo founders validate ideas before writing code.',
    createdAt: '2026-09-27T10:00:00Z',
    updatedAt: '2026-09-27T11:30:00Z',
    status: 'scheduled',
    platforms: ['linkedin', 'instagram', 'whatsapp'],
    brandKitId: 'bk-creator',
    tags: ['saas', 'startup', 'monetization', 'founders'],
    isFavorite: false,
    creativeBrief: {
      coreConcept: 'Validating software demand with 10 cold conversations before touching an IDE.',
      contentAngle: 'Tactical play-by-play dissecting why building in secret guarantees failure.',
      targetAudience: 'Indie hackers, solo founders, and engineers looking to launch micro-SaaS.',
      contentObjective: 'Position the creator as a lean startup advisor and build newsletter subscribers.',
      keyMessage: 'Customers do not buy code; they buy solutions to problems they already pay to solve.',
      recommendedFormat: 'LinkedIn Document Carousel & Instagram Graphic Guide',
      recommendedDuration: 'N/A (Document)',
      hookStrategy: 'Cost of failure revelation (6 months wasted vs 3 days of outreach).',
      ctaStrategy: 'Download the 10-question customer validation interview script.',
      visualDirection: 'High-contrast black & white minimalism with subtle emerald green highlights.',
    },
    hooks: [
      {
        id: 'h-saas-1',
        type: 'contrarian',
        hookText: 'Writing code is the most expensive way to test if anyone wants your SaaS.',
        rationale: 'Provocative truth that challenges developer defaults.',
        selected: true,
      },
    ],
    videoStudio: {
      concept: 'Quick visual walkthrough of lean customer interviews.',
      hook: 'Writing code is the most expensive way to test if anyone wants your SaaS.',
      completeScript: 'Stop opening your IDE. Spend 3 days talking to 10 potential users first.',
      voiceOverScript: 'Stop opening your IDE. Spend 3 days talking to 10 potential users first.',
      scenes: [],
      shootingAssistant: {
        whereToStand: 'Framed at desk with notebook in hand.',
        howToFrame: 'Landscape or vertical 9:16.',
        lightingPosition: 'Soft window light from side.',
        cameraHeight: 'Chest level.',
        backgroundSetup: 'Clean modern desk.',
        audioAdvice: 'Directional mic.',
        whatToSay: 'Speak with deliberate calm authority.',
        whatActionToPerform: 'Point to blank notebook page.',
      },
      musicDirection: 'Calm lo-fi piano with subtle vinyl crackle.',
      soundEffects: ['Page flip', 'Soft chime'],
      editingInstructions: ['Clean typographic overlays'],
      thumbnailConcept: {
        headline: 'VALIDATE FIRST',
        visualDescription: 'Crossed-out code editor next to signed customer contract.',
        colorPalette: ['#18181B', '#10B981', '#FFFFFF'],
        facialExpression: 'Thoughtful, calm confidence',
        focalPoint: 'Contrasting green checkmark',
      },
    },
    platformVariants: {
      instagram: {
        format: 'Carousel',
        hook: 'Writing code is the most expensive way to test if anyone wants your SaaS 👇',
        caption: `Writing code is the most expensive way to test if anyone wants your SaaS 👇\n\nSwipe to see the 3-day validation framework used by solo founders who reached $10k MRR without outside funding.\n\n#indiehackers #saas #startuplife #entrepreneurship`,
        hashtags: ['#indiehackers', '#saas', '#startuplife', '#entrepreneurship'],
        callToAction: 'Save this post for your next product launch sprint.',
        visualDirection: 'Minimal black & emerald aesthetic.',
        onScreenText: ['VALIDATE 1ST', 'TALK TO 10 USERS', 'PRE-SELL THE SOLUTION'],
        coverConcept: 'Clean typography on matte dark card.',
      },
      linkedin: {
        format: 'carousel',
        hook: 'Writing code is the most expensive way to test if anyone wants your product.',
        body: `Writing code is the most expensive way to test if anyone wants your product.\n\nOver the past 3 years, I watched dozens of brilliant engineers spend 6 months building pristine micro-SaaS applications, only to launch to silence on Twitter.\n\nHere is how top solo founders reverse the order:\n1. Find 10 people actively complaining about a manual workflow.\n2. Hop on a 15-minute call without pitching anything.\n3. Ask: "How much time or money do you lose to this every week?"\n4. Only build if 3 people ask to pay for early access.\n\nCode is cheap once you know the problem is real.`,
        storytellingStructure: 'Observation -> Pattern Analysis -> 4-Step Solution -> Core Takeaway',
        callToAction: 'What was your biggest lesson from your first product launch?',
        hashtags: ['#SaaS', '#Founders', '#IndieHackers', '#ProductManagement'],
        visualConcept: 'Monochrome PDF carousel with clear serif headers and generous white margins.',
      },
      youtube: {
        format: 'Short',
        titleVariations: ['How to Validate a SaaS in 3 Days ($0 Budget)'],
        hook: 'Writing code is the most expensive way to test your idea.',
        completeScript: 'Do not write a single line of code until 3 people offer to pay you.',
        description: 'The lean validation guide for solo developers.',
        chapters: [],
        thumbnailConcept: 'Code editor vs customer interview note.',
        keywords: ['saas validation', 'micro saas', 'indie hacker'],
        callToAction: 'Subscribe for solo founder playbooks.',
        subtitleText: 'Writing code is the most expensive way...',
      },
      whatsapp: {
        format: 'Business message',
        shortCopy: 'Hey founders! New case study: How to test SaaS demand before building. Read the 2-minute breakdown here:',
        callToAction: 'Reply "PITCH" for the interview script template.',
        visualConcept: '1:1 square summary graphic.',
        messageVariations: ['Quick note for indie hackers on testing market demand.'],
        suggestedButtonOptions: ['Read Case Study', 'Get Interview Script'],
      },
    },
    suggestedVisualAssets: [],
    versionHistory: [],
  },
];

export const INITIAL_SCHEDULED_POSTS: ScheduledPost[] = [
  {
    id: 'sch-1',
    projectId: 'proj-ai-beginners',
    title: 'How Beginners Can Learn AI for $0 in 2026',
    platform: 'instagram',
    scheduledDate: '2026-10-01T15:00:00Z',
    status: 'scheduled',
    captionSnippet: 'Stop paying $2,000 for courses. Here is how to learn AI for free in 2026 👇',
    visualPreview: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    autopilotManaged: true,
  },
  {
    id: 'sch-2',
    projectId: 'proj-ai-beginners',
    title: 'How Beginners Can Learn AI (LinkedIn Breakdown)',
    platform: 'linkedin',
    scheduledDate: '2026-10-02T13:30:00Z',
    status: 'approved',
    captionSnippet: 'I spent 4 years observing how top engineers and product leaders master AI...',
    autopilotManaged: true,
  },
  {
    id: 'sch-3',
    projectId: 'proj-ai-beginners',
    title: 'YouTube Short: How to Learn AI for Free',
    platform: 'youtube',
    scheduledDate: '2026-10-03T16:00:00Z',
    status: 'scheduled',
    captionSnippet: 'Stop paying $2,000 for AI courses. Here is the $0 roadmap...',
    visualPreview: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    autopilotManaged: false,
  },
  {
    id: 'sch-4',
    projectId: 'proj-saas-playbook',
    title: 'LinkedIn: The 0-to-1K MRR Playbook',
    platform: 'linkedin',
    scheduledDate: '2026-10-04T12:00:00Z',
    status: 'scheduled',
    captionSnippet: 'Writing code is the most expensive way to test if anyone wants your SaaS...',
    autopilotManaged: false,
  },
  {
    id: 'sch-5',
    projectId: 'proj-ai-beginners',
    title: 'WhatsApp VIP Broadcast: AI Roadmap Launch',
    platform: 'whatsapp',
    scheduledDate: '2026-10-05T10:00:00Z',
    status: 'draft',
    captionSnippet: 'Quick update: We just released our brand-new 7-Day Free AI Mastery Roadmap...',
    autopilotManaged: true,
  },
];

export const INITIAL_CONNECTED_ACCOUNTS: ConnectedAccount[] = [
  {
    platform: 'instagram',
    accountName: 'Kalakar Creator Studio',
    handle: '@kalakar.studio',
    connected: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    followers: 48200,
    lastSync: '2026-09-30T01:30:00Z',
    permissions: ['pages_show_list', 'instagram_basic', 'instagram_content_publish', 'instagram_manage_comments'],
    tokenStatus: 'active',
    publishLogs: [
      {
        id: 'plog-1',
        timestamp: '2026-09-29T15:00:00Z',
        status: 'success',
        message: 'Reel published via Meta Graph API v21.0. Container ID: ig_cnt_89412',
        postTitle: '3 Tools Every Solo Creator Needs',
      },
    ],
  },
  {
    platform: 'linkedin',
    accountName: 'Kalakar Official',
    handle: 'company/kalakar-studio',
    connected: true,
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    followers: 24600,
    lastSync: '2026-09-30T01:40:00Z',
    permissions: ['w_member_social', 'r_organization_social', 'w_organization_social'],
    tokenStatus: 'active',
    publishLogs: [
      {
        id: 'plog-2',
        timestamp: '2026-09-28T12:30:00Z',
        status: 'success',
        message: 'Document carousel broadcast published via LinkedIn Community Management API.',
        postTitle: 'The Architecture of Solo Content Teams',
      },
    ],
  },
  {
    platform: 'youtube',
    accountName: 'Kalakar Academy',
    handle: '@KalakarAcademy',
    connected: true,
    avatarUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80',
    followers: 89400,
    lastSync: '2026-09-30T01:15:00Z',
    permissions: ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.readonly'],
    tokenStatus: 'active',
    publishLogs: [
      {
        id: 'plog-3',
        timestamp: '2026-09-27T16:00:00Z',
        status: 'success',
        message: 'Short uploaded and scheduled for premiere via YouTube Data API v3.',
        postTitle: '30-Second AI Video Production Workflow',
      },
    ],
  },
  {
    platform: 'whatsapp',
    accountName: 'Kalakar Business Updates',
    handle: '+1 (555) 019-2834',
    connected: true,
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    followers: 12400,
    lastSync: '2026-09-30T01:45:00Z',
    permissions: ['whatsapp_business_messaging', 'whatsapp_business_management'],
    tokenStatus: 'active',
    publishLogs: [
      {
        id: 'plog-4',
        timestamp: '2026-09-29T10:00:00Z',
        status: 'success',
        message: 'Template broadcast dispatched to 1,420 opted-in subscribers with 94.2% delivery rate.',
        postTitle: 'Weekly Creator Intelligence Drop #18',
      },
    ],
  },
];

export const INITIAL_TRENDS: TrendTopic[] = [
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
];

export const INITIAL_AUTOPILOT_PLAN: AutopilotPlan = {
  id: 'ap-active-1',
  name: 'Q4 Creator Growth Campaign',
  status: 'active',
  mode: 'approval_mode',
  objective: 'Maintain a 5-post weekly cadence across Instagram, LinkedIn, and YouTube covering AI tutorials and developer productivity while strictly requiring human review before publishing.',
  startDate: '2026-10-01T00:00:00Z',
  endDate: '2026-10-14T23:59:59Z',
  dailyPostingLimit: 2,
  maxTotalPosts: 14,
  currentPostsCreated: 5,
  allowedPlatforms: ['instagram', 'linkedin', 'youtube', 'whatsapp'],
  allowedContentTypes: ['Reel', 'Carousel', 'Short', 'Document Post'],
  blockedTopics: ['crypto speculation', 'politics', 'unverified rumors', 'unaccredited certificates'],
  requireApproval: true,
  activityLog: [
    {
      id: 'alog-1',
      timestamp: '2026-09-30T01:10:00Z',
      action: 'Generated 3-stage campaign on AI tools for students',
      platform: 'instagram',
      status: 'approved',
      details: 'Reviewed and staged in calendar for Oct 1, 15:00 UTC.',
    },
    {
      id: 'alog-2',
      timestamp: '2026-09-30T01:25:00Z',
      action: 'Drafted LinkedIn carousel on inverted learning models',
      platform: 'linkedin',
      status: 'pending_approval',
      details: 'Draft prepared with 4 document slides. Awaiting user click to approve.',
    },
    {
      id: 'alog-3',
      timestamp: '2026-09-30T01:40:00Z',
      action: 'Scheduled YouTube Short script and chapter cards',
      platform: 'youtube',
      status: 'approved',
      details: 'Staged for Oct 3. Asset validation completed.',
    },
  ],
};

export const INITIAL_ASSETS: VisualAsset[] = [
  {
    id: 'ast-1',
    title: 'Minimalist Coding Terminal on Studio Desk',
    previewUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    source: 'Unsplash Stock',
    creator: 'Ilya Pavlov',
    license: 'Commercial Ready',
    attributionRequirement: 'None required',
    resolution: '3840x2160 (4K)',
    aspectRatio: '16:9',
    type: 'photo',
    tags: ['code', 'workspace', 'productivity', 'dark-mode'],
  },
  {
    id: 'ast-2',
    title: 'Creator Portrait with Cinematic Key Light',
    previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    source: 'Pexels Verified',
    creator: 'Andrea Piacquadio',
    license: 'Creative Commons 0',
    attributionRequirement: 'None required',
    resolution: '1080x1920 (9:16 Vertical)',
    aspectRatio: '9:16',
    type: 'portrait',
    tags: ['creator', 'speaking', 'reels', 'shorts'],
  },
  {
    id: 'ast-3',
    title: 'Abstract Geometric Obsidian Wave 3D',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    source: 'Kalakar Studio',
    creator: 'Kalakar 3D Lab',
    license: 'Original Creation',
    attributionRequirement: 'Commercial Ready',
    resolution: '2048x2048 (Square 1:1)',
    aspectRatio: '1:1',
    type: 'background',
    tags: ['3d', 'gradient', 'modern', 'fluid'],
  },
  {
    id: 'ast-4',
    title: 'Smartphone Mobile Interface Showcase',
    previewUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    source: 'Unsplash Stock',
    creator: 'Gilles Lambert',
    license: 'Editorial Free',
    attributionRequirement: 'None required',
    resolution: '1920x1080 (16:9)',
    aspectRatio: '16:9',
    type: 'photo',
    tags: ['mobile', 'app', 'ui', 'technology'],
  },
];
