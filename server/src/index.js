import "dotenv/config";
import cors from "cors";
import express from "express";
import storyRouter from "./routes/story.js";

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*"
  })
);
app.use(express.json({ limit: "128kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", storyRouter);

app.use((err, _req, res, _next) => {
  console.error("[api:error]", err);
  const status = err.statusCode || 500;
  res.status(status).json({
    error:
      status === 500
        ? "Something went wrong while generating the story plan."
        : err.message
  });
});

app.listen(port, () => {
  console.log(`[server] Story Visual Agent API running on port ${port}`);
});

