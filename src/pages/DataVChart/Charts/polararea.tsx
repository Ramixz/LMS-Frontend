import React from "react";
import Chart from "react-apexcharts";
import { PolarAreaChartProps } from "../../../types/chartprops.type";

const PolarAreaChart: React.FC<PolarAreaChartProps> = ({ labels, datasets , formValues }) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "polarArea",
    },
    labels: labels,
    legend: {
      position: "right",
    },
    stroke: {
      colors: ["#fff"],
    },
    fill: {
      opacity: 0.8,
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

  return <Chart options={options} series={datasets} type="polarArea" height={350} />;
};

export default PolarAreaChart;
