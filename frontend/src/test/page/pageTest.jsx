import { Chart } from "chart.js/auto";
import React, { useEffect, useRef } from "react";

export const PageTest = () => {
  const chartRef = useRef(null);
  const chartBar = useRef(null);

  useEffect(() => {
    const myChart = new Chart(chartRef.current.getContext("2d"), {
      type: "line",
      data: {
        labels: [0.5, 0.4, 0.3, 0.2, 0.1, 0.09, 0.08, 0.07, 0.06, 0.05],
        datasets: [
          {
            label: "",
            data: [64, 512, 1024, 512, "", 256, 128, 64, 32, 16],
            borderWidth: 1,
            tension: 0,
            borderColor: "rgba(255,150,0)",
            backgroundColor: "rgba(10,200,255)",
          },
        ],
      },
      options: {},
      plugins: [],
    });
    const barChart = new Chart(chartBar.current.getContext("2d"), {
      type: "bar",
      data: {
        labels: [0.5, 0.4, 0.3, 0.2, 0.1, 0.09, 0.08, 0.07, 0.06, 0.05],
        datasets: [
          {
            label: "bar",
            data: [64, 512, 1024, 512, 256, 128, 64, 32, 16],
            backgroundColor: [
              "rgb(255,25,255,.2)",
              "rgb(25,255,255,.2)",
              "rgb(255,255,25,.2)",
            ],
            borderColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 159, 64)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {},
      plugins: [],
    });

    return () => {
      // Cleanup code
      myChart.destroy(0);
      barChart.destroy(0);
    };
  }, []);
  return (
    <div>
      <h1>Test Page JSX</h1>
      <div style={{ display: "flex", width: "500px", height: "500px" }}>
        <canvas ref={chartRef}></canvas>
        <canvas ref={chartBar}></canvas>
      </div>
    </div>
  );
};
