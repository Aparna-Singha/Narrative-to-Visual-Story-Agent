export default function SceneScript({ scenes }) {
  return (
    <section className="result-section">
      <div className="section-heading">
        <h2>Scene Script</h2>
        <span>{scenes.length} planned scenes</span>
      </div>
      <div className="scene-list">
        {scenes.map((scene) => (
          <article className="scene-card" key={scene.sceneNumber}>
            <div className="scene-card-header">
              <span className="scene-number">{scene.sceneNumber}</span>
              <div>
                <h3>{scene.title}</h3>
                <p>{scene.setting}</p>
              </div>
            </div>
            <p>{scene.summary}</p>
            <div className="dialogue-block">
              {scene.dialogue.map((line, index) => (
                <p key={`${line.speaker}-${index}`}>
                  <strong>{line.speaker}:</strong> {line.line}
                </p>
              ))}
            </div>
            <p className="transition">Transition: {scene.transition}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

