export default function SceneScript({ scenes }) {
  return (
    <section className="result-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Script</p>
          <h2>Scene-by-scene Script</h2>
        </div>
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
            <div className="character-pills" aria-label="Characters">
              {scene.characters.map((character) => (
                <span key={character}>{character}</span>
              ))}
            </div>
            <div className="dialogue-block">
              <span className="block-label">Dialogue</span>
              {scene.dialogue.map((line, index) => (
                <p key={`${line.speaker}-${index}`}>
                  <strong>{line.speaker}:</strong> {line.line}
                </p>
              ))}
            </div>
            <p className="transition">
              <span>Transition</span>
              {scene.transition}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
