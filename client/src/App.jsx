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
        <div>
          <p className="eyebrow">STAIR x Scaler School of Technology</p>
          <h1>Narrative-to-Visual Story Agent</h1>
          <p className="subtitle">
            Free-form story in, structured script, visual plan, and sequential
            SVG storyboard frames out.
          </p>
        </div>
        <div className="api-pill">
          <span className="status-dot" />
          API {API_BASE_URL}
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
          <TestCases onSelect={handleSampleSelect} />
        </div>

        <div className="output-column">
          {error ? <div className="alert error">{error}</div> : null}
          {loading ? (
            <div className="loading-panel">
              <div className="loader" />
              <span>Planning scenes and rendering storyboard frames...</span>
            </div>
          ) : null}

          {!result && !loading ? (
            <div className="empty-state">
              <h2>Ready for generation</h2>
              <p>
                Choose a sample or paste your own narrative, then generate the
                scene plan and storyboard.
              </p>
            </div>
          ) : null}

          {result ? (
            <>
              <section className="result-section">
                <div className="section-heading">
                  <h2>Original Story</h2>
                </div>
                <p className="original-story">{result.originalStory}</p>
              </section>

              <section className="result-section">
                <div className="section-heading">
                  <h2>Metadata</h2>
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
                  <h2>Observability</h2>
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
                  <p className="success-text">No warnings returned.</p>
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

