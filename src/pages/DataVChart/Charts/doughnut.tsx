import React from "react";
import Chart from "react-apexcharts";
import { DoughnutChartProps } from "../../../types/chartprops.type";

const DoughnutChart: React.FC<DoughnutChartProps> = ({ labels, datasets , formValues }) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
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

  return <Chart options={options} series={datasets} type="donut" height={350} />;
};

export default DoughnutChart;
