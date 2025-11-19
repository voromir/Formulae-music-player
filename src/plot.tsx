import { useEffect, useRef } from "react";
import functionPlot from "function-plot";

function Grapher({ fn }) {
  const ref = useRef();

  useEffect(() => {
    functionPlot({
      target: ref.current,
      data: [{ fn }],
      grid: true,
    });
  }, [fn]);

  return <div ref={ref} style={{ width: 500, height: 500 }} />;
}

export default Grapher;
