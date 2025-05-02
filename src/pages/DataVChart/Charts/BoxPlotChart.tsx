// src/components/charts/BoxPlotChart.tsx
import React from "react";
import Chart from "react-apexcharts";
import { BoxPlotChartProps } from "../../../types/chartprops.type";

const BoxPlotChart: React.FC<BoxPlotChartProps> = ({
  datasets,
  xAxisTitle = "",
  yAxisTitle = "",
  formValues,
}) => {
  const series = datasets;
  console.log("yAxisTitle", yAxisTitle, xAxisTitle, datasets);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "boxPlot",
      height: 350,
    },
    plotOptions: {
      boxPlot: {
        colors: {
          upper: "#5C93FF",
          lower: "#FF4560",
        },
      },
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
      labels: {
        formatter: (value) => Math.round(value).toString(),
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
  };

  return (
    <Chart options={options} series={series} type="boxPlot" height={350} />
  );
};

export default BoxPlotChart;
