export async function generateStoryboardFrames(scenes, { style, mode = "local-svg" }) {
  if (mode === "image-api") {
    return generateWithOptionalImageApiPlaceholder(scenes, { style });
  }

  return {
    frames: scenes.map((scene) => ({
      sceneNumber: scene.sceneNumber,
      title: scene.title,
      svg: renderLocalSvgFrame(scene, style),
      caption: scene.summary
    })),
    warnings: []
  };
}

async function generateWithOptionalImageApiPlaceholder(scenes, { style }) {
  // Plug a paid image API here later. Keep local SVG output as the safe default
  // so the assignment remains reproducible without external image credits.
  return {
    frames: scenes.map((scene) => ({
      sceneNumber: scene.sceneNumber,
      title: scene.title,
      svg: renderLocalSvgFrame(scene, style),
      caption: scene.summary
    })),
    warnings: [
      "Optional image API mode is not configured. Returned local SVG storyboard frames instead."
    ]
  };
}

function renderLocalSvgFrame(scene, style) {
  const palette = paletteFor(style, scene.sceneNumber);
  const characterCount = Math.max(1, Math.min(scene.characters.length, 4));
  const characterBlocks = Array.from({ length: characterCount }, (_item, index) => {
    const x = 110 + index * 72;
    const height = 74 + ((scene.sceneNumber + index) % 3) * 14;
    return `
      <g>
        <circle cx="${x + 20}" cy="${245 - height}" r="18" fill="${palette.character}" opacity="0.95" />
        <rect x="${x}" y="${250 - height}" width="40" height="${height}" rx="10" fill="${palette.character}" opacity="0.92" />
      </g>`;
  }).join("");

  const titleLines = svgTextLines(`${scene.sceneNumber}. ${scene.title}`, 42, 52, 44, 24);
  const settingLines = svgTextLines(`Setting: ${scene.setting}`, 42, 104, 58, 18);
  const captionLines = svgTextLines(scene.summary, 42, 385, 72, 18);
  const visualLines = svgTextLines(scene.visualDescription, 380, 172, 36, 18);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 450" role="img" aria-label="${escapeXml(scene.title)} storyboard frame">
  <defs>
    <linearGradient id="sky-${scene.sceneNumber}" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${palette.skyTop}" />
      <stop offset="100%" stop-color="${palette.skyBottom}" />
    </linearGradient>
    <filter id="soft-shadow-${scene.sceneNumber}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#111827" flood-opacity="0.18" />
    </filter>
  </defs>
  <rect width="720" height="450" fill="${palette.paper}" />
  <rect x="24" y="24" width="672" height="402" rx="8" fill="url(#sky-${scene.sceneNumber})" stroke="${palette.border}" stroke-width="2" />
  <path d="M24 292 C120 255 215 292 310 270 C430 244 520 286 696 252 L696 426 L24 426 Z" fill="${palette.ground}" opacity="0.95" />
  <path d="M52 318 L668 318" stroke="${palette.line}" stroke-width="4" stroke-linecap="round" opacity="0.55" />
  <path d="M92 350 L626 292" stroke="${palette.line}" stroke-width="5" stroke-linecap="round" opacity="0.4" />
  <path d="M140 378 L584 278" stroke="${palette.line}" stroke-width="3" stroke-linecap="round" opacity="0.3" />
  <rect x="34" y="34" width="652" height="96" rx="8" fill="${palette.header}" opacity="0.93" />
  ${titleLines.map((line) => `<text x="${line.x}" y="${line.y}" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="${palette.headerText}">${escapeXml(line.text)}</text>`).join("")}
  ${settingLines.map((line) => `<text x="${line.x}" y="${line.y}" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="600" fill="${palette.headerText}" opacity="0.85">${escapeXml(line.text)}</text>`).join("")}
  <g filter="url(#soft-shadow-${scene.sceneNumber})">
    <rect x="368" y="142" width="286" height="132" rx="8" fill="${palette.note}" opacity="0.96" />
    <text x="384" y="164" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="700" fill="${palette.noteText}">VISUAL BEAT</text>
    ${visualLines.map((line) => `<text x="${line.x}" y="${line.y}" font-family="Inter, Arial, sans-serif" font-size="14" fill="${palette.noteText}" opacity="0.9">${escapeXml(line.text)}</text>`).join("")}
  </g>
  <g>${characterBlocks}</g>
  <circle cx="${530 + scene.sceneNumber * 8}" cy="${218 - scene.sceneNumber * 10}" r="${20 + scene.sceneNumber * 3}" fill="${palette.accent}" opacity="0.75" />
  <rect x="34" y="356" width="652" height="58" rx="8" fill="${palette.captionBg}" opacity="0.96" />
  ${captionLines.map((line) => `<text x="${line.x}" y="${line.y}" font-family="Inter, Arial, sans-serif" font-size="15" fill="${palette.captionText}">${escapeXml(line.text)}</text>`).join("")}
</svg>`.trim();
}

function paletteFor(style, sceneNumber) {
  const palettes = {
    cinematic: {
      paper: "#f8fafc",
      skyTop: "#334155",
      skyBottom: "#d6a85f",
      ground: "#1f2937",
      line: "#f8fafc",
      character: "#f59e0b",
      accent: "#38bdf8",
      header: "#111827",
      headerText: "#f8fafc",
      border: "#111827",
      note: "#f8fafc",
      noteText: "#111827",
      captionBg: "#111827",
      captionText: "#f8fafc"
    },
    anime: {
      paper: "#fff7ed",
      skyTop: "#93c5fd",
      skyBottom: "#fbcfe8",
      ground: "#60a5fa",
      line: "#1e3a8a",
      character: "#be123c",
      accent: "#facc15",
      header: "#1e293b",
      headerText: "#fff7ed",
      border: "#1e293b",
      note: "#fff7ed",
      noteText: "#1e293b",
      captionBg: "#1e293b",
      captionText: "#fff7ed"
    },
    comic: {
      paper: "#fefce8",
      skyTop: "#fde047",
      skyBottom: "#67e8f9",
      ground: "#22c55e",
      line: "#0f172a",
      character: "#dc2626",
      accent: "#2563eb",
      header: "#0f172a",
      headerText: "#fefce8",
      border: "#0f172a",
      note: "#ffffff",
      noteText: "#0f172a",
      captionBg: "#0f172a",
      captionText: "#fefce8"
    },
    "children book": {
      paper: "#fffbeb",
      skyTop: "#bae6fd",
      skyBottom: "#fde68a",
      ground: "#86efac",
      line: "#92400e",
      character: "#0f766e",
      accent: "#f97316",
      header: "#7c2d12",
      headerText: "#fffbeb",
      border: "#7c2d12",
      note: "#fffbeb",
      noteText: "#431407",
      captionBg: "#7c2d12",
      captionText: "#fffbeb"
    },
    realistic: {
      paper: "#f4f4f5",
      skyTop: "#94a3b8",
      skyBottom: "#e5e7eb",
      ground: "#57534e",
      line: "#e7e5e4",
      character: "#0f766e",
      accent: "#b45309",
      header: "#27272a",
      headerText: "#fafafa",
      border: "#27272a",
      note: "#fafafa",
      noteText: "#27272a",
      captionBg: "#27272a",
      captionText: "#fafafa"
    }
  };

  const base = palettes[style] || palettes.cinematic;
  if (sceneNumber % 2 === 0) {
    return {
      ...base,
      accent: base.character,
      character: base.accent
    };
  }
  return base;
}

function svgTextLines(text, x, startY, maxChars, lineHeight) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines.slice(0, 4).map((line, index) => ({
    text: line,
    x,
    y: startY + index * lineHeight
  }));
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

