import { hasSave } from "../gameData/save.js";

export default function TitleScreen({ onNew, onContinue }) {
  return (
    <div className="app">
      <div className="header" style={{ marginTop: "4rem" }}>
        <h1>Feast of the Glutton God</h1>
        <p className="subtitle">Gorgara the Everfull is awakening. Spread her gospel of abundance.</p>
      </div>
      <div className="panel" style={{ textAlign: "center", maxWidth: 480, margin: "2rem auto" }}>
        <p className="prose" style={{ marginBottom: "1.5rem" }}>
          An open-world text adventure of irresistible, pleasurable growth.
          Choose your class, wander the heartlands, feed the faithful,
          and conquer through abundance on a tactical feast-grid.
        </p>
        <div className="btn-grid" style={{ justifyContent: "center" }}>
          <button className="primary" onClick={onNew}>New Game</button>
          {hasSave() && <button onClick={onContinue}>Continue</button>}
        </div>
      </div>
    </div>
  );
}
