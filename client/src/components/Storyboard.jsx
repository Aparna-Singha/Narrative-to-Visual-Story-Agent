export default function Storyboard({ frames }) {
  return (
    <section className="result-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Frames</p>
          <h2>Storyboard Frames</h2>
        </div>
        <span>Local SVG renderer</span>
      </div>
      <div className="storyboard-grid">
        {frames.map((frame) => (
          <article className="storyboard-frame" key={frame.sceneNumber}>
            <div className="storyboard-frame-header">
              <span>Scene {frame.sceneNumber}</span>
              <h3>{frame.title}</h3>
            </div>
            <div className="svg-shell">
              <div
                className="svg-frame"
                dangerouslySetInnerHTML={{ __html: frame.svg }}
              />
            </div>
            <div className="frame-caption">
              <p>{frame.caption}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
