/* eslint-disable @typescript-eslint/no-explicit-any */
// Charts/pie.tsx
import React from "react";
import Chart from "react-apexcharts";
import { PieChartProps } from "../../../types/chartprops.type";

const PieChart: React.FC<PieChartProps> = ({
  labels,
  datasets,
  formValues,
}) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: labels,
    legend: {
      position: "right",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 320,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    title: {
      text: formValues?.visualizationName || "",
      style: {
        fontFamily: "Poppins, sans-serif",
        fontWeight: 600,
        fontSize: "14px",
        color: "#33383D", // Optional: set your desired color
      },
    },
  };

  return <Chart options={options} series={datasets} type="pie" height={350} />;
};

export default PieChart;
