import { useMemo, useState } from "react";
import { generateStoryPlan, API_BASE_URL } from "./api.js";
import StoryInput from "./components/StoryInput.jsx";
import SceneScript from "./components/SceneScript.jsx";
import VisualPlan from "./components/VisualPlan.jsx";
import Storyboard from "./components/Storyboard.jsx";
import TestCases, { SAMPLE_STORIES } from "./components/TestCases.jsx";

const DEFAULT_STORY = SAMPLE_STORIES[0].story;

export default function App() {
  const [story, setStory] = useState(DEFAULT_STORY);
  const [style, setStyle] = useState("cinematic");
  const [language, setLanguage] = useState("English");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const metadataItems = useMemo(() => {
    if (!result?.metadata) return [];
    return Object.entries(result.metadata);
  }, [result]);

  const activeSampleLabel = useMemo(() => {
    const activeSample = SAMPLE_STORIES.find(
      (sample) => sample.story === story && sample.style === style
    );
    return activeSample?.label || "";
  }, [story, style]);

  async function handleGenerate(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await generateStoryPlan({ story, style, language });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSampleSelect(sample) {
    setStory(sample.story);
    setStyle(sample.style);
    setError("");
  }

  return (
    <main className="app-shell">
      <section className="masthead">
        <div className="masthead-copy">
          <p className="eyebrow">STAIR x Scaler School of Technology</p>
          <h1>Narrative-to-Visual Story Agent</h1>
          <p className="subtitle">
            Convert free-form stories into structured scripts, visual plans,
            and storyboard frames.
          </p>
          <div className="hero-badges" aria-label="Project attributes">
            <span>Task 1 Submission</span>
            <span>Storyboard-first</span>
            <span>Deterministic Agent Pipeline</span>
          </div>
        </div>
        <div className="api-card">
          <div className="api-pill">
            <span className="status-dot" />
            <span>API endpoint</span>
          </div>
          <strong>{API_BASE_URL}</strong>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="input-column">
          <StoryInput
            story={story}
            style={style}
            language={language}
            loading={loading}
            onStoryChange={setStory}
            onStyleChange={setStyle}
            onLanguageChange={setLanguage}
            onSubmit={handleGenerate}
          />
          <TestCases
            activeSampleLabel={activeSampleLabel}
            onSelect={handleSampleSelect}
          />
        </div>

        <div className="output-column">
          {error ? <div className="alert error">{error}</div> : null}
          {loading ? (
            <LoadingState />
          ) : null}

          {!result && !loading ? (
            <EmptyState />
          ) : null}

          {result ? (
            <>
              <section className="result-section overview-card">
                <div className="section-heading">
                  <div>
                    <p className="section-kicker">Output Overview</p>
                    <h2>Generated Story Package</h2>
                  </div>
                  <span>{result.observability.sceneCount} scenes</span>
                </div>
                <p className="original-story">{getExcerpt(result.originalStory)}</p>
                <div className="overview-metrics">
                  <Metric label="Genre" value={result.metadata.genre} />
                  <Metric label="Tone" value={result.metadata.tone} />
                  <Metric
                    label="Audience"
                    value={result.metadata.targetAudience}
                  />
                  <Metric label="Language" value={result.metadata.language} />
                </div>
              </section>

              <section className="result-section">
                <div className="section-heading">
                  <div>
                    <p className="section-kicker">Metadata</p>
                    <h2>Story Classification</h2>
                  </div>
                </div>
                <dl className="metadata-grid">
                  {metadataItems.map(([key, value]) => (
                    <div key={key} className="metadata-item">
                      <dt>{formatLabel(key)}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <SceneScript scenes={result.scenes} />
              <VisualPlan scenes={result.scenes} />
              <Storyboard frames={result.storyboard} />

              <section className="result-section">
                <div className="section-heading">
                  <div>
                    <p className="section-kicker">Observability</p>
                    <h2>Runtime Notes</h2>
                  </div>
                  <span>{result.observability.sceneCount} scenes</span>
                </div>
                <p className="determinism">
                  {result.observability.determinismNote}
                </p>
                {result.observability.warnings.length ? (
                  <ul className="warning-list">
                    {result.observability.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="success-text">No warnings reported.</p>
                )}
              </section>
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function formatLabel(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

function getExcerpt(text) {
  if (!text || text.length <= 260) return text;
  return `${text.slice(0, 257).trim()}...`;
}

function Metric({ label, value }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value || "Not specified"}</strong>
    </div>
  );
}

function EmptyState() {
  const steps = ["Understand story", "Plan scenes", "Render storyboard"];
  const previews = [
    {
      title: "Script",
      subtitle: "Scene breakdown",
      variant: "script"
    },
    {
      title: "Visual Plan",
      subtitle: "Style + pacing",
      variant: "visual"
    },
    {
      title: "Storyboard",
      subtitle: "SVG frames",
      variant: "storyboard"
    }
  ];

  return (
    <section className="empty-state">
      <div className="empty-preview-grid" aria-hidden="true">
        {previews.map((preview) => (
          <article className="empty-preview-card" key={preview.title}>
            <div className={`empty-preview-icon ${preview.variant}`}>
              <span />
              <span />
              <span />
            </div>
            <strong>{preview.title}</strong>
            <small>{preview.subtitle}</small>
          </article>
        ))}
      </div>
      <h2>Ready to turn your story into a visual plan</h2>
      <p>
        Choose a sample story or paste your own narrative to generate a
        structured script, scene plan, and sequential storyboard frames.
      </p>
      <ol className="empty-steps">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}

function LoadingState() {
  const stages = [
    "Understanding narrative...",
    "Planning scenes...",
    "Rendering storyboard frames..."
  ];

  return (
    <section className="loading-panel" aria-live="polite">
      <div className="loading-header">
        <div className="loader" />
        <div>
          <h2>Generating...</h2>
          <p>Building a grounded story plan from your narrative.</p>
        </div>
      </div>
      <div className="loading-steps">
        {stages.map((stage) => (
          <div className="loading-step" key={stage}>
            <span />
            <strong>{stage}</strong>
          </div>
        ))}
      </div>
      <div className="skeleton-grid" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}
