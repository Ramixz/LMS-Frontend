import React from "react";
import Chart from "react-apexcharts";
import { HeatmapChartProps } from "../../../types/chartprops.type";

const HeatmapChart: React.FC<HeatmapChartProps> = ({
  labels,
  datasets,
  xAxisTitle = "",
  yAxisTitle = "",
  formValues
}) => {
  const series = datasets.map((ds) => ({
    name: ds.name,
    data: ds.data.map((val, i) => ({
      x: labels[i],
      y: val,
    })),
  }));

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "heatmap",
      height: 350,
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: true,
        // colorScale: {
        //   ranges: [
        //     { from: 0, to: 0, color: "#f2f2f2", name: "No Value" },
        //     { from: 1, to: 1000000, color: "#ebd334", name: "Low" },
        //     { from: 1000001, to: 3000000, color: "#eb7d34", name: "Medium" },
        //     { from: 3000001, to: 99999999, color: "#37eb34", name: "High" },
        //   ],
        // },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "category",
      title: {
        text: xAxisTitle,
      },
    },
    yaxis: {
      title: {
        text: yAxisTitle,
      },
    },
    title: {
      text: formValues?.visualizationName || "",
      style: {
        fontFamily: "Poppins, sans-serif",
        fontWeight: 600,
        fontSize: "14px",
        color: "#33383D",
      },
    },
    legend: {
      position: "top",
    },
  };

  return <Chart options={options} series={series} type="heatmap" height={350} />;
};

export default HeatmapChart;
