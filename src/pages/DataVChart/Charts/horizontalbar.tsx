import React from "react";
import Chart from "react-apexcharts";
import { HorizontalBarChartProps } from "../../../types/chartprops.type";

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  labels,
  datasets,
  xAxisTitle = "",
  yAxisTitle = "",
  formValues
}) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: labels,
      title: {
        text: yAxisTitle,
      },
    },
    yaxis: {
      title: {
        text: xAxisTitle,
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

  const series = datasets;

  return <Chart options={options} series={series} type="bar" height={350} />;
};

export default HorizontalBarChart;
