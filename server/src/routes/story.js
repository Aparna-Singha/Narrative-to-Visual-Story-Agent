import express from "express";
import { generateStructuredPlan } from "../services/geminiService.js";
import { generateStoryboardFrames } from "../services/storyboardService.js";
import { validateGenerateInput } from "../utils/validatePlan.js";

const router = express.Router();

router.post("/generate", async (req, res, next) => {
  try {
    const validation = validateGenerateInput(req.body);
    if (!validation.ok) {
      return res.status(validation.status).json({ error: validation.message });
    }

    const { story, style, language, imageMode } = validation.value;
    console.log("[api:generate] request received");
    console.log(`[api:generate] story length: ${story.length}`);

    const planning = await generateStructuredPlan({ story, style, language });
    const storyboard = await generateStoryboardFrames(planning.plan.scenes, {
      style,
      mode: imageMode
    });

    const warnings = [...planning.warnings, ...storyboard.warnings];
    const sceneCount = planning.plan.scenes.length;

    console.log(`[api:generate] scene count: ${sceneCount}`);
    console.log(`[api:generate] fallback used: ${planning.fallbackUsed}`);

    res.json({
      originalStory: story,
      metadata: planning.plan.metadata,
      scenes: planning.plan.scenes,
      storyboard: storyboard.frames,
      observability: {
        sceneCount,
        warnings,
        determinismNote: "Temperature set low for repeatable structure."
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;

