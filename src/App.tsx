import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Grapher from "./plot";
import functionPlot from "function-plot";

function App() {
  const [count, setCount] = useState(0);
  const [inputFormula, setInputFormula] = useState("sin(x * 2)");
  const [validFormula, setValidFormula] = useState("sin(x * 2)");

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
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
      <Grapher fn={validFormula} />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
