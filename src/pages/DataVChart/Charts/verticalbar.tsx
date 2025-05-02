// src/components/charts/VerticalBarChart.tsx
import React from "react";
import Chart from "react-apexcharts";
import { VerticalBarChartProps } from "../../../types/chartprops.type";

const VerticalBarChart: React.FC<VerticalBarChartProps> = ({
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
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: labels,
      title: {
        text: xAxisTitle,
      },
    },
    yaxis: {
      title: {
        text: yAxisTitle,
      },
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
  return <Chart options={options} series={series} type="bar" height={350} />;
};

export default VerticalBarChart;
