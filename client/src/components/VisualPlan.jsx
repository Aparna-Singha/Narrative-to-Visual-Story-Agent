export default function VisualPlan({ scenes }) {
  return (
    <section className="result-section">
      <div className="section-heading">
        <h2>Visual Plan</h2>
      </div>
      <div className="visual-plan-list">
        {scenes.map((scene) => (
          <article className="visual-row" key={scene.sceneNumber}>
            <div className="visual-index">Scene {scene.sceneNumber}</div>
            <div>
              <h3>{scene.title}</h3>
              <p>{scene.visualDescription}</p>
              <dl>
                <div>
                  <dt>Camera</dt>
                  <dd>{scene.cameraDirection}</dd>
                </div>
                <div>
                  <dt>Pacing</dt>
                  <dd>{scene.pacing}</dd>
                </div>
                <div>
                  <dt>Image prompt</dt>
                  <dd>{scene.imagePrompt}</dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

