import React from "react";
import Chart from "react-apexcharts";
import { ScatterChartProps } from "../../../types/chartprops.type";


const ScatterChart: React.FC<ScatterChartProps> = ({
  labels,
  datasets,
  xAxisTitle = "",
  yAxisTitle = "",
  formValues
}) => {
  // Convert labels and data to x-y format
  const series = datasets.map((dataset) => ({
    name: dataset.name,
    data: labels.map((label, index) => ({
      x: label,
      y: dataset.data[index],
    })),
  }));

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "scatter",
      zoom: {
        enabled: true,
        type: "xy",
      },
    },
    xaxis: {
      title: {
        text: xAxisTitle,
      },
      labels: {
        rotate: 0,
      },
    },
    yaxis: {
      title: {
        text: yAxisTitle,
      },
    },
    dataLabels: {
      enabled: true,
    },
    legend: {
      position: "top",
    },
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

  return <Chart options={options} series={series} type="scatter" height={350} />;
};

export default ScatterChart;
