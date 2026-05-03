export default function Storyboard({ frames }) {
  return (
    <section className="result-section">
      <div className="section-heading">
        <h2>Storyboard Frames</h2>
        <span>Local SVG renderer</span>
      </div>
      <div className="storyboard-grid">
        {frames.map((frame) => (
          <article className="storyboard-frame" key={frame.sceneNumber}>
            <div
              className="svg-frame"
              dangerouslySetInnerHTML={{ __html: frame.svg }}
            />
            <div className="frame-caption">
              <span>Frame {frame.sceneNumber}</span>
              <h3>{frame.title}</h3>
              <p>{frame.caption}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

