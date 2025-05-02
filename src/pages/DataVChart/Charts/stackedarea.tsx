import React from "react";
import Chart from "react-apexcharts";
import { StackedAreaChartProps } from "../../../types/chartprops.type";

const StackedAreaChart: React.FC<StackedAreaChartProps> = ({
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
      type: "area",
      height: 350,
      stacked: true,
      zoom: { enabled: false },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
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
    tooltip: {
      shared: true,
      intersect: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.1,
      },
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

  return <Chart options={options} series={series} type="area" height={350} />;
};

export default StackedAreaChart;
