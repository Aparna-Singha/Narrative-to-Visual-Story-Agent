import { GoogleGenAI } from "@google/genai";
import { buildStoryPlannerPrompt } from "../prompts/storyPlannerPrompt.js";
import {
  buildFallbackPlan,
  normalizePlan,
  validatePlan
} from "../utils/validatePlan.js";

export async function generateStructuredPlan({ story, style, language }) {
  const warnings = [];

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_key_here") {
    warnings.push(
      "Gemini API key is missing. Used deterministic local fallback planner."
    );
    return {
      plan: buildFallbackPlan({ story, style, language }),
      fallbackUsed: true,
      warnings
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
      contents: buildStoryPlannerPrompt({ story, style, language }),
      config: {
        temperature: 0.1,
        topP: 0.8,
        responseMimeType: "application/json"
      }
    });

    const parsed = parseJsonResponse(response.text);
    const normalized = normalizePlan(parsed, { story, style, language });
    const validation = validatePlan(normalized);

    if (!validation.ok) {
      warnings.push(
        `Gemini returned an invalid plan (${validation.errors.join(" ")}). Used deterministic local fallback planner.`
      );
      return {
        plan: buildFallbackPlan({ story, style, language }),
        fallbackUsed: true,
        warnings
      };
    }

    return {
      plan: normalized,
      fallbackUsed: false,
      warnings
    };
  } catch (err) {
    console.error("[gemini] planning failed:", err.message);
    warnings.push(
      "Gemini planning failed. Used deterministic local fallback planner."
    );
    return {
      plan: buildFallbackPlan({ story, style, language }),
      fallbackUsed: true,
      warnings
    };
  }
}

function parseJsonResponse(text = "") {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Gemini returned an empty response.");
  }

  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(withoutFence);
}

