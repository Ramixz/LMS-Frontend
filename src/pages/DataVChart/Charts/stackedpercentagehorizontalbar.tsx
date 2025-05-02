// src/components/charts/StackedPercentageHorizontalBarChart.tsx
import React from "react";
import Chart from "react-apexcharts";

interface StackedPercentageHorizontalBarChartProps {
  labels: string[];
  datasets: {
    name: string;
    data: number[];
  }[];
  xAxisTitle?: string;
  yAxisTitle?: string;
}

const StackedPercentageHorizontalBarChart: React.FC<StackedPercentageHorizontalBarChartProps> = ({
  labels,
  datasets,
  xAxisTitle = "",
  yAxisTitle = "",
}) => {
  const series = datasets.map((ds) => ({
    name: ds.name,
    data: ds.data,
  }));

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      stackType: "100%",
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true, // Horizontal bars
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
    },
    xaxis: {
        categories: labels,
      title: {
        text: xAxisTitle,
      },
      labels: {
        formatter: (value: string) => `${value}%`
    },
      max: 100,
    },
    yaxis: {
      
      title: {
        text: yAxisTitle,
      },
    },
    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: (val: number) => `${val.toFixed(2)}%`,
      },
    },
    legend: {
      position: "top",
    },
    fill: {
      opacity: 1,
    },
  };

  return <Chart options={options} series={series} type="bar" height={350} />;
};

export default StackedPercentageHorizontalBarChart;