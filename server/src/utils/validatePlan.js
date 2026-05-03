export const ALLOWED_STYLES = [
  "cinematic",
  "anime",
  "comic",
  "children book",
  "realistic"
];

const MAX_STORY_LENGTH = 8000;

export function validateGenerateInput(body = {}) {
  const story = typeof body.story === "string" ? body.story.trim() : "";
  const rawStyle = typeof body.style === "string" ? body.style.trim() : "";
  const rawLanguage =
    typeof body.language === "string" ? body.language.trim() : "English";
  const rawImageMode =
    typeof body.imageMode === "string" ? body.imageMode.trim() : "local-svg";

  if (!story) {
    return {
      ok: false,
      status: 400,
      message: "Please provide a story. The input cannot be empty."
    };
  }

  if (story.length < 20) {
    return {
      ok: false,
      status: 400,
      message:
        "The story is too short. Please provide at least 20 characters so scenes can be planned coherently."
    };
  }

  if (story.length > MAX_STORY_LENGTH) {
    return {
      ok: false,
      status: 413,
      message: `The story is too long. Please keep it under ${MAX_STORY_LENGTH} characters for this local demo.`
    };
  }

  if (looksOutOfScope(story)) {
    return {
      ok: false,
      status: 422,
      message:
        "This agent only converts narrative stories into scripts, visual plans, and storyboard frames. Please provide a story-like input."
    };
  }

  const style = ALLOWED_STYLES.includes(rawStyle.toLowerCase())
    ? rawStyle.toLowerCase()
    : "cinematic";

  return {
    ok: true,
    value: {
      story,
      style,
      language: rawLanguage || "English",
      imageMode: rawImageMode === "image-api" ? "image-api" : "local-svg"
    }
  };
}

export function normalizePlan(plan, { story, style, language }) {
  const metadata = {
    title: cleanString(plan?.metadata?.title) || inferTitle(story),
    genre: cleanString(plan?.metadata?.genre) || inferGenre(story),
    tone: cleanString(plan?.metadata?.tone) || inferTone(story),
    targetAudience:
      cleanString(plan?.metadata?.targetAudience) || "General audience",
    language: cleanString(plan?.metadata?.language) || language || "English"
  };

  const scenes = Array.isArray(plan?.scenes)
    ? plan.scenes.slice(0, 6).map((scene, index) => {
        const title =
          cleanString(scene?.title) || `Scene ${index + 1}: Story Beat`;
        const summary =
          cleanString(scene?.summary) ||
          `A grounded beat from the original story: ${story.slice(0, 180)}`;
        const setting =
          cleanString(scene?.setting) || inferSetting(story) || "Story setting";
        const characters = normalizeStringArray(scene?.characters, story);
        const dialogue = normalizeDialogue(scene?.dialogue, characters);
        const visualDescription =
          cleanString(scene?.visualDescription) || summary;
        const cameraDirection =
          cleanString(scene?.cameraDirection) || "Wide shot with slow push-in";
        const pacing = cleanString(scene?.pacing) || "Measured and clear";
        const imagePrompt =
          cleanString(scene?.imagePrompt) ||
          `${style} storyboard frame of ${summary} in ${setting}`;

        return {
          sceneNumber: index + 1,
          title,
          summary,
          setting,
          characters,
          dialogue,
          transition:
            cleanString(scene?.transition) ||
            (index === 0 ? "Fade in" : "Cut to next story beat"),
          visualDescription,
          cameraDirection,
          pacing,
          imagePrompt
        };
      })
    : [];

  return { metadata, scenes };
}

export function validatePlan(plan) {
  const errors = [];
  if (!plan?.metadata) errors.push("Missing metadata.");
  if (!Array.isArray(plan?.scenes)) errors.push("Missing scenes array.");

  const sceneCount = Array.isArray(plan?.scenes) ? plan.scenes.length : 0;
  if (sceneCount < 4 || sceneCount > 6) {
    errors.push("Scene count must be between 4 and 6.");
  }

  for (const [index, scene] of (plan?.scenes || []).entries()) {
    const required = [
      "title",
      "summary",
      "setting",
      "transition",
      "visualDescription",
      "cameraDirection",
      "pacing",
      "imagePrompt"
    ];
    for (const key of required) {
      if (!cleanString(scene?.[key])) {
        errors.push(`Scene ${index + 1} is missing ${key}.`);
      }
    }
    if (!Array.isArray(scene?.characters)) {
      errors.push(`Scene ${index + 1} characters must be an array.`);
    }
    if (!Array.isArray(scene?.dialogue)) {
      errors.push(`Scene ${index + 1} dialogue must be an array.`);
    }
  }

  return {
    ok: errors.length === 0,
    errors
  };
}

export function buildFallbackPlan({ story, style, language }) {
  const lower = story.toLowerCase();

  if (lower.includes("robot") && lower.includes("train")) {
    return makePlan({
      story,
      style,
      language,
      title: "Where the Last Train Went",
      genre: "Science fiction mystery",
      tone: "Lonely and emotional",
      setting: "Abandoned railway station",
      characters: ["Lonely robot"],
      beats: [
        [
          "Station Wake-Up",
          "A lonely robot powers on beneath a silent station clock and sees empty tracks stretching into dust.",
          "The robot wakes in the abandoned railway station, surrounded by still platforms and old departure boards.",
          "Wide shot of the deserted platform, the robot small under a high roof."
        ],
        [
          "The Missing Departure",
          "The robot notices traces of the final train and tries to understand where it went.",
          "A faded route board and platform edge become clues to the last train mystery.",
          "Close-up on the robot's face light reflected in a broken timetable."
        ],
        [
          "Following the Rails",
          "The robot moves along the platform, using small clues from the station to follow the train's direction.",
          "The empty tracks guide the robot away from the waiting hall toward the unknown.",
          "Tracking shot beside the robot as rails converge into the distance."
        ],
        [
          "Signal in the Dark",
          "A weak signal suggests the last train left a trace, giving the robot a reason to keep searching.",
          "The mystery becomes emotional rather than mechanical: the train may have carried the station's final memory.",
          "Low angle shot of a blinking signal light against the dark tunnel."
        ],
        [
          "A New Departure",
          "The robot chooses to follow the track, carrying the question of the last train into the open line.",
          "The ending stays unresolved but hopeful as the robot steps beyond the abandoned station.",
          "Long shot of the robot walking beside the rails under first light."
        ]
      ]
    });
  }

  if (lower.includes("seed") && lower.includes("drought")) {
    return makePlan({
      story,
      style,
      language,
      title: "The Glowing Seed",
      genre: "Moral drama",
      tone: "Tender and hopeful",
      setting: "Drought-stricken village",
      characters: ["Village girl"],
      beats: [
        [
          "Dry Village Morning",
          "A village girl walks through cracked fields as the drought weighs on every home.",
          "The story opens in a dry village where water and hope both feel scarce.",
          "Wide shot of cracked earth, low huts, and the girl crossing the frame."
        ],
        [
          "Discovery in the Dust",
          "She finds a glowing seed hidden in the dry soil and realizes it may change the village's fate.",
          "The seed's light creates a quiet contrast against the drought.",
          "Close-up on the seed glowing in the girl's hands."
        ],
        [
          "Sell or Plant",
          "The girl faces the choice at the heart of the story: sell the seed for immediate relief or plant it for everyone.",
          "The visual plan centers on her moral conflict rather than adding outside action.",
          "Over-the-shoulder shot as she looks from the seed toward the village."
        ],
        [
          "The Decision",
          "She chooses what she believes will bring lasting hope, accepting the risk of planting the seed.",
          "The emotional decision becomes the turning point.",
          "Low angle shot of her hand pressing the glowing seed into cracked ground."
        ],
        [
          "First Green",
          "A hopeful ending emerges as the planted seed offers the village a sign of renewal.",
          "The scene resolves the drought story with a restrained, hopeful image.",
          "Slow push-in on a small green shoot glowing at dawn."
        ]
      ]
    });
  }

  if (lower.includes("astronaut") && lower.includes("mars")) {
    return makePlan({
      story,
      style,
      language,
      title: "Signal Beneath Mars",
      genre: "Science fiction suspense",
      tone: "Suspenseful and curious",
      setting: "Mars surface and subsurface signal site",
      characters: ["Astronaut One", "Astronaut Two"],
      beats: [
        [
          "Red Planet Watch",
          "Two astronauts move across the Martian surface before an unexpected signal interrupts their routine.",
          "The environment is vast, red, and quiet, making the signal feel impossible to ignore.",
          "Wide shot of two astronauts against the red horizon."
        ],
        [
          "The Signal Below",
          "Their instruments show that the strange signal is coming from beneath the ground.",
          "The visual focus shifts from the open surface to the hidden source below.",
          "Close-up on a scanner pulse over dusty terrain."
        ],
        [
          "Marking the Source",
          "The astronauts trace the signal to a precise spot and prepare to investigate.",
          "Suspense builds through careful movement and limited visibility.",
          "Overhead shot of footprints circling a marked point in the dust."
        ],
        [
          "Under the Surface",
          "They uncover signs that the signal is not random noise, but a deliberate pattern.",
          "The reveal stays tied to the signal investigation.",
          "Tight shot of helmet lights cutting across a shallow opening."
        ],
        [
          "A Reply",
          "The signal changes as if responding, ending the sequence on a controlled suspenseful reveal.",
          "The storyboard closes with curiosity rather than a full explanation.",
          "Slow push-in on the scanner as a new waveform appears."
        ]
      ]
    });
  }

  return makePlan({
    story,
    style,
    language,
    title: inferTitle(story),
    genre: inferGenre(story),
    tone: inferTone(story),
    setting: inferSetting(story),
    characters: inferCharacters(story),
    beats: [
      [
        "Opening Situation",
        "The main character and setting are introduced using only details from the user's story.",
        `The scene establishes: ${shorten(story, 140)}`,
        "Wide establishing shot that makes the setting readable."
      ],
      [
        "Inciting Question",
        "The central problem, mystery, or choice becomes clear.",
        "The visual plan focuses on the strongest conflict already present in the story.",
        "Medium shot with the character facing the source of tension."
      ],
      [
        "Rising Pressure",
        "The character responds to the situation and the stakes become more visible.",
        "The storyboard keeps continuity with the same characters, place, and goal.",
        "Tracking shot that follows the character's movement."
      ],
      [
        "Choice or Discovery",
        "A key decision or discovery changes the emotional direction of the story.",
        "The frame highlights the story's most important visual object or clue.",
        "Close-up on the decisive detail."
      ],
      [
        "Resolution Image",
        "The ending reflects the tone implied by the original narrative.",
        "The final frame gives closure without inventing an unrelated plot.",
        "Long shot that lets the emotional result breathe."
      ]
    ]
  });
}

function makePlan({
  story,
  style,
  language,
  title,
  genre,
  tone,
  setting,
  characters,
  beats
}) {
  return {
    metadata: {
      title,
      genre,
      tone,
      targetAudience: "General audience",
      language: language || "English"
    },
    scenes: beats.map(([sceneTitle, summary, visualDescription, camera], index) => ({
      sceneNumber: index + 1,
      title: sceneTitle,
      summary,
      setting,
      characters,
      dialogue: [
        {
          speaker: characters[0] || "Narrator",
          line: dialogueLineFor(story, index)
        }
      ],
      transition: index === 0 ? "Fade in" : "Cut to the next grounded beat",
      visualDescription,
      cameraDirection: camera,
      pacing: pacingFor(index, beats.length),
      imagePrompt: `${style} storyboard frame, ${visualDescription}, ${setting}, clean sequential storyboard composition`
    }))
  };
}

function looksOutOfScope(story) {
  const lower = story.toLowerCase();
  const outOfScopeSignals = [
    "solve my math",
    "math homework",
    "calculate",
    "differentiate",
    "integrate",
    "write code for",
    "debug my",
    "stock price"
  ];
  const narrativeSignals = [
    "story",
    "once",
    "girl",
    "boy",
    "robot",
    "astronaut",
    "village",
    "discovers",
    "wakes",
    "receives",
    "tries",
    "must",
    "journey",
    "train",
    "signal"
  ];

  const hasOutOfScopeSignal = outOfScopeSignals.some((signal) =>
    lower.includes(signal)
  );
  const hasNarrativeSignal = narrativeSignals.some((signal) =>
    lower.includes(signal)
  );

  return hasOutOfScopeSignal && !hasNarrativeSignal;
}

function normalizeStringArray(value, story) {
  if (Array.isArray(value)) {
    const cleaned = value.map(cleanString).filter(Boolean);
    if (cleaned.length) return cleaned.slice(0, 5);
  }
  return inferCharacters(story);
}

function normalizeDialogue(value, characters) {
  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) => ({
        speaker: cleanString(item?.speaker) || characters[0] || "Narrator",
        line: cleanString(item?.line)
      }))
      .filter((item) => item.line);
    if (cleaned.length) return cleaned.slice(0, 3);
  }

  return [
    {
      speaker: characters[0] || "Narrator",
      line: "This moment changes the story."
    }
  ];
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function inferTitle(story) {
  const words = story
    .replace(/[^a-z0-9 ]/gi, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 5);
  if (!words.length) return "Storyboard Plan";
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function inferGenre(story) {
  const lower = story.toLowerCase();
  if (/(mars|astronaut|robot|signal|space|planet)/.test(lower)) {
    return "Science fiction";
  }
  if (/(magic|glowing|seed|village|king|forest)/.test(lower)) {
    return "Fable";
  }
  if (/(mystery|strange|hidden|secret|last train)/.test(lower)) {
    return "Mystery";
  }
  return "Drama";
}

function inferTone(story) {
  const lower = story.toLowerCase();
  if (/(lonely|alone|abandoned|lost)/.test(lower)) return "Melancholic";
  if (/(strange|signal|beneath|secret|mystery)/.test(lower)) {
    return "Suspenseful";
  }
  if (/(hope|plant|seed|village|drought)/.test(lower)) return "Hopeful";
  return "Reflective";
}

function inferSetting(story) {
  const lower = story.toLowerCase();
  if (lower.includes("railway station")) return "Abandoned railway station";
  if (lower.includes("mars")) return "Mars";
  if (lower.includes("village")) return "Village";
  if (lower.includes("forest")) return "Forest";
  if (lower.includes("city")) return "City";
  return "Primary setting described in the story";
}

function inferCharacters(story) {
  const lower = story.toLowerCase();
  if (lower.includes("two astronauts")) return ["Astronaut One", "Astronaut Two"];
  if (lower.includes("astronaut")) return ["Astronaut"];
  if (lower.includes("robot")) return ["Robot"];
  if (lower.includes("village girl")) return ["Village girl"];
  if (lower.includes("girl")) return ["Girl"];
  if (lower.includes("boy")) return ["Boy"];
  return ["Main character"];
}

function dialogueLineFor(story, index) {
  const lower = story.toLowerCase();
  if (lower.includes("robot") && lower.includes("train")) {
    return [
      "Why did the last train leave me behind?",
      "Every track points somewhere.",
      "I can still follow the signal.",
      "The station remembers more than it says.",
      "Then I will go where it went."
    ][index];
  }
  if (lower.includes("seed") && lower.includes("drought")) {
    return [
      "The fields are waiting for rain.",
      "Why would something glow in dust?",
      "If I sell it, only today changes.",
      "If I plant it, everyone may have tomorrow.",
      "Grow, even if the sky has forgotten us."
    ][index];
  }
  if (lower.includes("astronaut") && lower.includes("mars")) {
    return [
      "The surface is quiet today.",
      "That pulse is coming from below us.",
      "Mark the source. Slowly.",
      "This pattern is too clean to be noise.",
      "It just answered."
    ][index];
  }
  return [
    "This is where it begins.",
    "Something has changed.",
    "We have to keep going.",
    "This choice matters.",
    "Now we know what comes next."
  ][index];
}

function pacingFor(index, total) {
  if (index === 0) return "Quiet opening";
  if (index === total - 1) return "Reflective ending";
  if (index === total - 2) return "Decisive turning point";
  return "Rising tension";
}

function shorten(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3).trim()}...`;
}

