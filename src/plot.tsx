import { useEffect, useRef } from "react";
import functionPlot from "function-plot";
import * as Tone from "tone";

function parseSineFormula(formula: string): {
  amplitude: number;
  frequency: number;
} {
  // Example: 2sin(x*4), sin(x*4), sin(3*x), sin(x)
  // Default amplitude = 1, frequency = 1
  let amplitude = 1;
  let frequency = 1;
  const clean = formula.replace(/\s+/g, "");
  // Match amplitude before sin, e.g. 2sin(...)
  const ampMatch = clean.match(/^([\d.]+)sin\(/);
  if (ampMatch) {
    amplitude = parseFloat(ampMatch[1]);
  }
  // Match sin(A * x * B) or sin(A * x) or sin(x * B) or sin(x)
  const match = clean.match(/sin\((([\d.]+)\*)?x(\*([\d.]+))?\)/);
  if (match) {
    if (match[2]) amplitude *= parseFloat(match[2]);
    if (match[4]) frequency = parseFloat(match[4]);
    // If only one number before x, treat as frequency
    if (!match[2] && match[4]) amplitude *= 1;
    if (match[2] && !match[4]) frequency = parseFloat(match[2]);
  }
  return { amplitude, frequency };
}

interface GrapherProps {
  fn: string;
}

function Grapher({ fn }: GrapherProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const synthRef = useRef<Tone.Oscillator | null>(null);

  useEffect(() => {
    functionPlot({
      target: ref.current as HTMLDivElement,
      data: [{ fn }],
      grid: true,
      yAxis: { domain: [-5, 5] },
    });

    // Parse formula for sine wave
    const { amplitude, frequency } = parseSineFormula(fn);

    // Stop previous synth
    if (synthRef.current) {
      synthRef.current.dispose();
      synthRef.current = null;
    }

    // Only play if formula is a sine wave, possibly with a factor before sin
    if (/^[\d.]*sin\(/.test(fn.replace(/\s+/g, ""))) {
      const synth = new Tone.Oscillator({
        type: "sine",
        frequency: frequency * 220, // Map frequency to Hz (220Hz base)
      }).toDestination();
      const gain = new Tone.Gain(Math.pow(amplitude, 2) * 0.1).toDestination();
      synth.connect(gain);
      synth.start();
      synthRef.current = synth;
      // Stop after 1 second
      setTimeout(() => {
        synth.stop();
        synth.dispose();
        synthRef.current = null;
      }, 1000);
    }
  }, [fn]);

  return <div ref={ref} style={{ width: 500, height: 500 }} />;
}

export default Grapher;
