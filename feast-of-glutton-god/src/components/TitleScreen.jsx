import { hasSave } from "../gameData/save.js";

export default function TitleScreen({ onNew, onContinue }) {
  return (
    <div className="app">
      <div className="header" style={{ marginTop: "4rem" }}>
        <h1>Feast of the Glutton God</h1>
        <p className="subtitle">You serve the Fat Goddess — the Hunger Beyond the Wheel. The Reach does not know what you are.</p>
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
