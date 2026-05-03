# Technical Note

## Architecture

The project is split into two small applications:

- `client/`: React + Vite UI for story entry, style selection, generation, and result display
- `server/`: Express API that validates input, plans the story, and renders local storyboard frames

The backend is intentionally stateless. Each request returns a complete JSON response with the original story, metadata, scenes, storyboard frames, and observability data.

## Agent Pipeline

```text
User Story
  -> Story Understanding Agent
  -> Scene Planner Agent
  -> Script Writer Agent
  -> Visual Prompt Agent
  -> Storyboard Renderer
```

The LLM call performs the first four planning roles in one structured prompt. The renderer is deterministic JavaScript so frames can be produced without an external image service.

## Design Decisions

- Gemini is used only for structured planning, not for final rendering.
- The prompt requires strict JSON, 4 to 6 scenes, short dialogue, camera direction, pacing, and image prompts.
- Temperature is set low to improve reproducibility.
- The backend normalizes and validates Gemini output before returning it.
- If Gemini fails, the app falls back to a deterministic local planner.
- SVG frames are generated locally from scene data, keeping the project reproducible for evaluators.

## Trade-Offs

Using local SVG frames means the visual output is symbolic rather than photorealistic. The benefit is reliability: the evaluator can run the full project without paid image APIs, rate limits, or model access issues.

The fallback planner is less creative than Gemini, but it preserves the core assignment flow and demonstrates deterministic behavior when external services are unavailable.

## Why Storyboard Frames Instead Of Generated Video

Generated video would add cost, latency, model availability issues, and unpredictable output. The assignment allows storyboard frames when video generation is constrained, so this implementation makes storyboard frames the main deliverable instead of claiming video generation that is not actually present.

## Reliability And Determinism

- Gemini is called with low temperature.
- The prompt demands JSON only.
- The server validates the returned scene count and required fields.
- The fallback planner produces deterministic scenes for known sample patterns and generic story inputs.
- The SVG renderer uses deterministic colors and layout based on scene number and style.

## Observability And Testability

The backend logs:

- Request received
- Story length
- Scene count
- Whether fallback was used

The API response includes:

- `observability.sceneCount`
- `observability.warnings`
- `observability.determinismNote`

This makes it easy to verify whether Gemini or fallback planning produced the result.

## Deployment Thinking

The app can be deployed as two services:

- Backend on Render, Railway, Fly.io, or another Node host
- Frontend on Vercel, Netlify, or static hosting

For deployment:

- Set `GEMINI_API_KEY` and `CLIENT_ORIGIN` on the backend host
- Set `VITE_API_BASE_URL` on the frontend host
- Keep storyboard rendering on the backend to ensure consistent output across browsers

