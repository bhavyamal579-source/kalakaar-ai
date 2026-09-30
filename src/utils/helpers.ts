import { GeneratedProject, Platform } from '../types';

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function getPlatformColor(platform: Platform): string {
  switch (platform) {
    case 'instagram':
      return 'text-pink-500 border-pink-500/20 bg-pink-500/10';
    case 'linkedin':
      return 'text-sky-500 border-sky-500/20 bg-sky-500/10';
    case 'youtube':
      return 'text-red-500 border-red-500/20 bg-red-500/10';
    case 'whatsapp':
      return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10';
    default:
      return 'text-slate-400 border-slate-700 bg-slate-800';
  }
}

export function getPlatformBadgeName(platform: Platform): string {
  switch (platform) {
    case 'instagram': return 'Instagram';
    case 'linkedin': return 'LinkedIn';
    case 'youtube': return 'YouTube';
    case 'whatsapp': return 'WhatsApp';
    default: return platform;
  }
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateSRTSubtitles(project: GeneratedProject): string {
  const scenes = project.videoStudio?.scenes || [];
  if (!scenes.length) {
    return `1\n00:00:00,000 --> 00:00:05,000\n${project.videoStudio?.hook || project.title}\n\n2\n00:00:05,000 --> 00:00:25,000\n${project.videoStudio?.completeScript || ''}\n`;
  }

  return scenes
    .map((s, idx) => {
      const startSec = idx * 6;
      const endSec = (idx + 1) * 6;
      const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `00:${m}:${s},000`;
      };
      return `${idx + 1}\n${formatTime(startSec)} --> ${formatTime(endSec)}\n${s.dialogue || s.voiceOver || s.onScreenText}\n`;
    })
    .join('\n');
}

export function generateProjectMarkdown(project: GeneratedProject): string {
  return `# ${project.title}
*Original Idea:* ${project.originalIdea}
*Status:* ${project.status.toUpperCase()}
*Created:* ${formatDate(project.createdAt)}

---

## 1. Creative Strategy & Brief
- **Core Concept:** ${project.creativeBrief?.coreConcept}
- **Content Angle:** ${project.creativeBrief?.contentAngle}
- **Target Audience:** ${project.creativeBrief?.targetAudience}
- **Objective:** ${project.creativeBrief?.contentObjective}
- **Key Message:** ${project.creativeBrief?.keyMessage}
- **Format & Duration:** ${project.creativeBrief?.recommendedFormat} (${project.creativeBrief?.recommendedDuration})
- **Hook Strategy:** ${project.creativeBrief?.hookStrategy}
- **CTA Strategy:** ${project.creativeBrief?.ctaStrategy}
- **Visual Direction:** ${project.creativeBrief?.visualDirection}

---

## 2. Hook Variants Engine
${(project.hooks || []).map((h, i) => `${i + 1}. **[${h.type.toUpperCase()}]** "${h.hookText}"\n   *Rationale:* ${h.rationale}`).join('\n\n')}

---

## 3. Video Studio & Shooting Guide
### Selected Hook:
"${project.videoStudio?.hook}"

### Complete Script:
${project.videoStudio?.completeScript}

### Voice-Over Audio Track:
${project.videoStudio?.voiceOverScript}

### Scene-by-Scene Breakdown:
${(project.videoStudio?.scenes || []).map((s) => `#### Scene ${s.sceneNumber} (${s.timestamp})
- **Shot Type:** ${s.shotType} | **Angle:** ${s.cameraAngle} | **Movement:** ${s.cameraMovement}
- **Dialogue / VO:** ${s.dialogue}
- **Visual & B-Roll:** ${s.visual} (B-Roll: ${s.bRoll})
- **On-Screen Text:** ${s.onScreenText}
- **Audio Cue:** ${s.audio} | **Transition:** ${s.transition}
`).join('\n')}

### Shooting Assistant Instructions:
- **Where to Stand:** ${project.videoStudio?.shootingAssistant?.whereToStand}
- **Framing:** ${project.videoStudio?.shootingAssistant?.howToFrame}
- **Lighting:** ${project.videoStudio?.shootingAssistant?.lightingPosition}
- **Camera Height:** ${project.videoStudio?.shootingAssistant?.cameraHeight}
- **Audio Advice:** ${project.videoStudio?.shootingAssistant?.audioAdvice}
- **What to Say:** ${project.videoStudio?.shootingAssistant?.whatToSay}
- **What Action to Perform:** ${project.videoStudio?.shootingAssistant?.whatActionToPerform}

---

## 4. Multi-Platform Adaptations

### Instagram
**Format:** ${project.platformVariants?.instagram?.format}
**Caption:**
${project.platformVariants?.instagram?.caption}

**Hashtags:** ${project.platformVariants?.instagram?.hashtags?.join(' ')}
**Call to Action:** ${project.platformVariants?.instagram?.callToAction}
**Cover Concept:** ${project.platformVariants?.instagram?.coverConcept}

### LinkedIn
**Format:** ${project.platformVariants?.linkedin?.format}
**Post:**
${project.platformVariants?.linkedin?.body}

**Storytelling Structure:** ${project.platformVariants?.linkedin?.storytellingStructure}
**Hashtags:** ${project.platformVariants?.linkedin?.hashtags?.join(' ')}

### YouTube
**Title Variations:**
${(project.platformVariants?.youtube?.titleVariations || []).map((t) => `- ${t}`).join('\n')}

**Description & Chapters:**
${project.platformVariants?.youtube?.description}

**Keywords:** ${(project.platformVariants?.youtube?.keywords || []).join(', ')}

### WhatsApp Business
**Message:**
${project.platformVariants?.whatsapp?.shortCopy}

**CTA:** ${project.platformVariants?.whatsapp?.callToAction}
**Suggested Quick-Reply Buttons:** ${(project.platformVariants?.whatsapp?.suggestedButtonOptions || []).join(', ')}
`;
}
