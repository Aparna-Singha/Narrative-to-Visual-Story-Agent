# Narrative-to-Visual Story Agent

Assignment chosen: Task 1, Narrative-to-Visual Story Agent for STAIR x Scaler School of Technology.

## What The System Does

This project accepts a free-form narrative and converts it into:

- A structured script with scenes, dialogue, and transitions
- A visual plan with scene descriptions, pacing, camera direction, and image prompts
- Sequential storyboard frames rendered as local SVG cards

The project does not fake video generation. Storyboard frames are the primary visual output because they are allowed by the assignment when video generation is constrained.

## Features

- React + Vite frontend with textarea input, style selection, samples, loading, and error states
- Node.js + Express backend with `GET /api/health` and `POST /api/generate`
- Gemini planning through `@google/genai` when `GEMINI_API_KEY` is available
- Deterministic local fallback planner when Gemini is unavailable
- Local SVG storyboard renderer that works without paid image APIs
- Optional image API placeholder mode in `server/src/services/storyboardService.js`
- Input validation for empty, too short, too long, and out-of-scope requests
- Observability logs and response warnings

## Architecture Diagram

```text
React Client
  -> POST /api/generate
Express API
  -> Input Validator
  -> Story Understanding Agent
  -> Scene Planner Agent
  -> Script Writer Agent
  -> Visual Prompt Agent
  -> Storyboard Renderer
  -> JSON response with scenes and SVG frames
```

## Tech Stack

- Frontend: React, Vite, CSS
- Backend: Node.js, Express, CORS
- LLM: Google Gemini API using `@google/genai`
- Image/storyboard output: local SVG generation by default
- Storage: local JSON response only, no database

## Setup

Requirements:

- Node.js 20.19 or newer
- npm
- Optional Gemini API key

Clone or open the project folder, then install dependencies:

```bash
cd story-visual-agent/server
npm install

cd ../client
npm install
```

## Add Gemini API Key

Copy `.env.example` into the server folder as `.env`:

```bash
cd story-visual-agent
copy .env.example server/.env
```

On macOS or Linux:

```bash
cp .env.example server/.env
```

Edit `server/.env`:

```env
GEMINI_API_KEY=your_real_key_here
GEMINI_MODEL=gemini-2.0-flash
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

If the key is missing, the backend still works through the deterministic fallback planner.

## Run Backend

```bash
cd story-visual-agent/server
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

## Run Frontend

In a second terminal:

```bash
cd story-visual-agent/client
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

To override the backend URL:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Test Cases

Use the three built-in sample buttons:

1. Lonely robot in an abandoned railway station
2. Village girl with a glowing seed during drought
3. Astronauts on Mars receiving a signal from underground

Expected behavior:

- Output should contain 4 to 6 scenes
- Scenes should stay coherent with the input story
- Dialogue should be short and grounded
- Visual plan should include setting, pacing, camera direction, and image prompt
- Storyboard should render sequential SVG frames
- If Gemini is unavailable, warnings should clearly say fallback was used

## Demo Video Placeholder

Record a short demo showing:

- Backend and frontend startup
- Health endpoint returning `{ "ok": true }`
- One sample story generation
- One custom story generation
- The scene script, visual plan, storyboard frames, and observability section
- Optional: remove the API key temporarily and show fallback behavior

## Limitations

- The default storyboard renderer uses simple SVG shapes, not photorealistic generated images
- No full video generation is included
- No persistent database is used
- Gemini output can vary slightly, although the prompt and temperature are designed for repeatability
- The local fallback planner is deterministic but less expressive than Gemini

## Future Improvements

- Add a real image generation provider behind the placeholder function
- Export storyboard frames as PNG or PDF
- Add project/session saving
- Add per-scene editing before storyboard rendering
- Add deployment configuration for Render, Railway, Vercel, or Netlify

## Submission Checklist

- [x] Working React + Vite frontend
- [x] Working Node.js + Express backend
- [x] Gemini integration with low temperature
- [x] Deterministic fallback when Gemini key is missing
- [x] Structured scenes, dialogue, transitions, visual descriptions, pacing, and camera direction
- [x] Local SVG storyboard frames
- [x] Observability logs and response warnings
- [x] README, technical note, test instructions, and sample inputs
- [x] `.env.example` included
