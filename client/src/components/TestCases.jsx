export const SAMPLE_STORIES = [
  {
    label: "Lonely robot",
    style: "cinematic",
    story:
      "A lonely robot wakes up in an abandoned railway station and tries to find where the last train went.",
    expected:
      "Lonely emotional tone, robot continuity, railway station mystery, 4 to 6 scenes."
  },
  {
    label: "Glowing seed",
    style: "children book",
    story:
      "A village girl discovers a glowing seed during a drought and must decide whether to plant it or sell it.",
    expected:
      "Moral conflict, village drought setting, emotional decision, hopeful ending."
  },
  {
    label: "Mars signal",
    style: "realistic",
    story:
      "Two astronauts on Mars receive a strange signal from beneath the ground.",
    expected:
      "Sci-fi suspense, Mars environment, signal investigation, controlled reveal."
  }
];

export default function TestCases({ onSelect }) {
  return (
    <section className="sample-panel">
      <div className="panel-heading">
        <h2>Sample Tests</h2>
        <span>3 stories</span>
      </div>
      <div className="sample-list">
        {SAMPLE_STORIES.map((sample) => (
          <button
            type="button"
            className="sample-button"
            key={sample.label}
            onClick={() => onSelect(sample)}
          >
            <span>{sample.label}</span>
            <small>{sample.expected}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

