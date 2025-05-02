import React from "react";
import Chart from "react-apexcharts";
import { AreaChartProps } from "../../../types/chartprops.type";

const AreaChart: React.FC<AreaChartProps> = ({
  labels,
  datasets,
  formValues, 
  xAxisTitle = "",
  yAxisTitle = "",
}) => {
  const series = datasets.map((ds) => ({
    name: ds.name,
    data: ds.data,
  }));
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      height: 350,
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

export default AreaChart;
