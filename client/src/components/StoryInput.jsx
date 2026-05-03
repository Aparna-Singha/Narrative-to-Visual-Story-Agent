const STYLE_OPTIONS = [
  "cinematic",
  "anime",
  "comic",
  "children book",
  "realistic"
];

export default function StoryInput({
  story,
  style,
  language,
  loading,
  onStoryChange,
  onStyleChange,
  onLanguageChange,
  onSubmit
}) {
  return (
    <form className="input-panel" onSubmit={onSubmit}>
      <div className="panel-heading">
        <div>
          <p className="section-kicker">Create</p>
          <h2>Create a visual story</h2>
        </div>
        <span className="character-count">{story.trim().length} characters</span>
      </div>
      <p className="panel-helper">
        Paste a narrative idea, choose a style, and generate a structured
        script with storyboard-ready frames.
      </p>

      <label className="field">
        <span>Free-form narrative</span>
        <textarea
          value={story}
          onChange={(event) => onStoryChange(event.target.value)}
          rows={12}
          placeholder="Paste a short story or scene idea..."
        />
      </label>

      <div className="control-row">
        <label className="field">
          <span>Visual style</span>
          <select
            value={style}
            onChange={(event) => onStyleChange(event.target.value)}
          >
            {STYLE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Language</span>
          <input
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
            placeholder="English"
          />
        </label>
      </div>

      <button className="primary-button" type="submit" disabled={loading}>
        <span>{loading ? "Generating..." : "Generate Storyboard"}</span>
      </button>
    </form>
  );
}
