import { useEffect, useState } from "react";
import "./styles.css";
import noteValues from "./noteValues";

const waveTypes = ["sine", "square", "triangle", "sawtooth"];

const AudioContext = window.AudioContext || window.webkitAudioContext;

const context = new AudioContext();

let g = null;
let o = null;

export default function App() {
  const [note, setNote] = useState("440");
  const [type, setType] = useState(waveTypes[0]);
  const [running, setRunning] = useState(false);

  const start = () => {
    o = context.createOscillator();
    g = context.createGain();
    o.type = type;
    o.connect(g);
    o.frequency.value = note;
    g.connect(context.destination);
    o.start(0);
  };

  const stop = () => {
    g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.04);
  };

  const onSelect = (setter) => (e) => {
    setter(e.target.value);
  };

  const onStart = () => {
    start();
    setRunning(true);
  };

  const onStop = () => {
    stop();
    setRunning(false);
    setTimeout(() => {
      o.stop();
    }, 40);
  };

  const onBoing = () => {
    const decay = 1500;
    setRunning(true);
    start();
    g.gain.exponentialRampToValueAtTime(
      0.00001,
      context.currentTime + decay / 1000
    );
    setTimeout(() => {
      setRunning(false);
      onStop();
    }, decay);
  };

  useEffect(() => {
    if (o?.type) o.type = type;
    if (o?.frequency) o.frequency.value = note;
  }, [note, type]);

  return (
    <>
      <h1>
        tuning fork robot
      </h1>
      <div>
        <select aria-label="Note" onChange={onSelect(setNote)} value={note}>
          {Object.keys(noteValues).map((n) => (
            <option key={n} value={noteValues[n]}>
              {n} ({noteValues[n]}Hz)
            </option>
          ))}
        </select>
        <select
          aria-label="Wave type"
          value={type}
          onChange={onSelect(setType)}
        >
          {waveTypes.map((w) => (
            <option value={w} key={w}>
              {w}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button disabled={running} onClick={onBoing}>
          boing
        </button>
        <button disabled={running} onClick={onStart}>
          start
        </button>
        <button disabled={!running} onClick={onStop}>
          stop
        </button>
      </div>
    </>
  );
}
