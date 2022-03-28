import { useState, useEffect } from "react";

function noteDurationToMs(bpm, dur, type) {
  return (60000 * 4 * dur * type) / bpm;
}

function scheduleNote(ac, time, dur) {
  var osc = ac.createOscillator();
  osc.connect(ac.destination);

  osc.start(time);
  osc.stop(time + dur);
}

const ac = new AudioContext();
let to,
  lastNote = 0;

const Metronome = () => {
  const [bpm, setBpm] = useState(100);
  const [dur, setDur] = useState(1);
  const [type, setType] = useState(1);
  const [run, setRun] = useState(false);

  const handleChangeBPM = (e) => {
    const value = e.target.value;
    if (value.match(/^\d*$/)) setBpm(value);
  };

  const handleChangeDur = (e) => {
    setDur(e.target.value);
  };

  const handleChangeType = (e) => {
    setType(e.target.value);
  };

  const step = noteDurationToMs(bpm, dur, type) / 1000;
  const lookAhead = step / 2;

  const timer = () => {
    const diff = ac.currentTime - lastNote;
    if (diff >= lookAhead) {
      const nextNote = lastNote + step;
      scheduleNote(ac, nextNote, 0.025);
      lastNote = nextNote;
    }
  };

  const start = () => {
    ac.resume();
    setRun(true);
  };

  const stop = () => {
    clearInterval(to);
    setRun(false);
  };

  const toggle = () => {
    run ? stop() : start();
  };

  useEffect(() => {
    if (run) {
      clearInterval(to);
      to = setInterval(timer, step / 4);
    }
  });

  return (
    <>
      <h2>Metronome</h2>
      <input
        aria-label="bpm"
        inputMode="numeric"
        onChange={handleChangeBPM}
        value={bpm}
        placeholder="BPM"
      />
      <select aria-label="duration" onChange={handleChangeDur} value={dur}>
        <option value={1}>Whole</option>
        <option value={1 / 2}>Half</option>
        <option value={1 / 4}>Quarter</option>
        <option value={1 / 8}>Eigth </option>
        <option value={1 / 16}>Sixteenth</option>
        <option value={1 / 32}>Thirtysecond</option>
      </select>
      <select aria-label="note type" onChange={handleChangeType} value={type}>
        <option value={1}>Regular</option>
        <option value={3 / 2}>Dotted</option>
        <option value={2 / 3}>Triplet</option>
      </select>
      <button onClick={toggle}>{run ? "stop" : "start"}</button>
    </>
  );
};

export default Metronome;
