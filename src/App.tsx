import { useState } from "react";
import "./App.css";
import Grapher from "./plot";
import functionPlot from "function-plot";

// Utility to get note name from frequency
function getNoteName(frequency: number): string {
  if (!frequency || isNaN(frequency)) return "-";
  const noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const A4 = 440;
  const n = Math.round(12 * Math.log2(frequency / A4));
  // Ensure noteIndex is always positive and valid
  const noteIndex = (((n + 9) % 12) + 12) % 12;
  const octave = 4 + Math.floor((n + 9) / 12);
  return `${noteNames[noteIndex]}${octave}`;
}

function parseSineFormula(formula: string): {
  amplitude: number;
  frequency: number;
} {
  let amplitude = 1;
  let frequency = 1;
  const clean = formula.replace(/\s+/g, "");
  const ampMatch = clean.match(/^([\d.]+)sin\(/);
  if (ampMatch) {
    amplitude = parseFloat(ampMatch[1]);
  }
  const match = clean.match(/sin\((([\d.]+)\*)?x(\*([\d.]+))?\)/);
  if (match) {
    if (match[2]) amplitude *= parseFloat(match[2]);
    if (match[4]) frequency = parseFloat(match[4]);
    if (!match[2] && match[4]) amplitude *= 1;
    if (match[2] && !match[4]) frequency = parseFloat(match[2]);
  }
  return { amplitude, frequency };
}

function App() {
  const [count, setCount] = useState(0);
  const [inputFormula, setInputFormula] = useState("sin(x * 2)");
  const [validFormula, setValidFormula] = useState("sin(x * 2)");

  // Calculate note name from formula
  const { frequency } = parseSineFormula(validFormula);
  const noteName = getNoteName(frequency * 220); // match synth frequency

  return (
    <>
      <h1>Formulae Music Player</h1>
      <h2>Your formula</h2>
      <input
        value={inputFormula}
        onChange={(e) => {
          const newFormula = e.target.value;
          setInputFormula(newFormula);
          try {
            functionPlot({
              target: document.createElement("div"),
              data: [{ fn: newFormula }],
            });
            setValidFormula(newFormula);
          } catch {
            // Do not update validFormula
          }
        }}
        placeholder="Enter formula"
      />
      <div
        style={{
          margin: "10px 0",
          padding: "8px",
          background: "#000000ff",
          borderRadius: "6px",
          width: "fit-content",
        }}
      >
        <strong>Note playing:</strong> {noteName}
      </div>
      <Grapher fn={validFormula} />
    </>
  );
}

export default App;
