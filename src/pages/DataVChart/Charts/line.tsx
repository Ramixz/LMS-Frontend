// src/components/charts/LineChart.tsx
import React from "react";
import Chart from "react-apexcharts";
import { LineChartProps } from "../../../types/chartprops.type";


const LineChart: React.FC<LineChartProps> = ({
  labels,
  datasets,
  xAxisTitle = "",
  yAxisTitle = "",
  formValues
}) => {
  const series = datasets.map((ds) => ({
    name: ds.name,
    data: ds.data,
  }));

  const formattedLabels = labels.map((label) => {
    // Check if timestamp or plain string
    if (typeof label === "number") {
      return new Date(label).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });
    }
    return label;
  });

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      zoom: { enabled: true },
      toolbar: { show: true },
    },
    xaxis: {
      categories: formattedLabels,
      title: { text: xAxisTitle },
    },
    yaxis: {
      title: { text: yAxisTitle },
    },
    stroke: {
      curve: "smooth",
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },
    legend: {
      position: "top",
    },
    dataLabels: {
      enabled: true,
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
  return <Chart options={options} series={series} type="line" height={350} />;
};
export default LineChart;
