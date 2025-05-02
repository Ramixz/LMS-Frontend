    // src/components/charts/StackedVerticalBarChart.tsx
import React from "react";
import Chart from "react-apexcharts";

interface StackedVerticalBarChartProps {
  labels: string[];
  datasets: {
    name: string;
    data: number[];
  }[];
  xAxisTitle?: string;
  yAxisTitle?: string;
}

const StackedVerticalBarChart: React.FC<StackedVerticalBarChartProps> = ({
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
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false, // Vertical bars
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
    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: (val: number) => `${val.toFixed(2)}`,
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

export default StackedVerticalBarChart;