// src/components/charts/StackedPercentageVerticalBarChart.tsx
import React from "react";
import Chart from "react-apexcharts";

interface StackedPercentageVerticalBarChartProps {
  labels: string[];
  datasets: {
    name: string;
    data: number[];
  }[];
  xAxisTitle?: string;
  yAxisTitle?: string;
}

const StackedPercentageVerticalBarChart: React.FC<StackedPercentageVerticalBarChartProps> = ({
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
        horizontal: false,
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
    },
    yaxis: {
      min: 0,
      max: 100,
      title: {
        text: yAxisTitle,
      },
      labels: {
        formatter: (val: number) => `${val}%`,
      },
    },
    tooltip: {
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

export default StackedPercentageVerticalBarChart;