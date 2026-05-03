# Test Instructions

## Local Setup

Install backend dependencies:

```bash
cd story-visual-agent/server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

Optional Gemini key:

```bash
cd ..
copy .env.example server/.env
```

Edit `server/.env` and set `GEMINI_API_KEY`. If no key is set, fallback mode should still work.

## Run Locally

Terminal 1:

```bash
cd story-visual-agent/server
npm run dev
```

Terminal 2:

```bash
cd story-visual-agent/client
npm run dev
```

Open:

```text
http://localhost:5173
```

## API Testing With curl

Health:

```bash
curl http://localhost:5000/api/health
```

Expected:

```json
{ "ok": true }
```

Generate:

```bash
curl -X POST http://localhost:5000/api/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"story\":\"A lonely robot wakes up in an abandoned railway station and tries to find where the last train went.\",\"style\":\"cinematic\",\"language\":\"English\"}"
```

On macOS or Linux:

```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"story":"A lonely robot wakes up in an abandoned railway station and tries to find where the last train went.","style":"cinematic","language":"English"}'
```

Expected characteristics:

- HTTP 200
- `metadata` is present
- `scenes` has 4 to 6 items
- Each scene has dialogue, transition, visual description, camera direction, pacing, and image prompt
- `storyboard` has the same number of frames as `scenes`
- Each storyboard frame includes an SVG string
- `observability.sceneCount` matches `scenes.length`

## Frontend Testing

In the browser:

1. Load each sample story button.
2. Click Generate Storyboard.
3. Verify original story, metadata, scene script, visual plan, storyboard frames, and observability are visible.
4. Change style and generate again.
5. Try a custom unstructured story paragraph.

## Predefined Input Stories

### 1. Lonely Robot

Story:

```text
A lonely robot wakes up in an abandoned railway station and tries to find where the last train went.
```

Expected characteristics:

- 4 to 6 scenes
- Lonely or emotional tone
- Robot and railway station remain visually continuous
- The last train mystery stays central

### 2. Glowing Seed

Story:

```text
A village girl discovers a glowing seed during a drought and must decide whether to plant it or sell it.
```

Expected characteristics:

- Moral conflict
- Village and drought setting
- Emotional decision
- Hopeful ending

### 3. Mars Signal

Story:

```text
Two astronauts on Mars receive a strange signal from beneath the ground.
```

Expected characteristics:

- Sci-fi tone
- Mars environment
- Signal investigation
- Suspenseful reveal

## Invalid Input Tests

### Empty Story

Payload:

```json
{ "story": "", "style": "cinematic", "language": "English" }
```

Expected:

- HTTP 400
- Helpful error explaining that story input is required

### Too Short Story

Payload:

```json
{ "story": "Hi", "style": "cinematic", "language": "English" }
```

Expected:

- HTTP 400
- Helpful error explaining the 20 character minimum

### Out-Of-Scope Request

Payload:

```json
{ "story": "solve my math homework", "style": "cinematic", "language": "English" }
```

Expected:

- HTTP 422
- Helpful error explaining that the agent expects narrative stories

## What Evaluators Should Verify

- The generated scenes are coherent with the input story
- The scene breakdown has storytelling logic
- Unstructured input is handled gracefully
- The response is reproducible enough for repeated testing
- The fallback path works when `GEMINI_API_KEY` is absent
- The README contains clear reproduction instructions
- The project does not claim to generate full video

