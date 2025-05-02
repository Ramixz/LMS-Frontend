import React from "react";
import Chart from "react-apexcharts";
 
interface RadarChartProps {
  labels: string[];
  datasets: {
    name: string;
    data: number[];
  }[];
}
 
const RadarChart: React.FC<RadarChartProps> = ({ labels, datasets }) => {
  const series = datasets.map((ds) => ({
    name: ds.name,
    data: ds.data,
  }));
 
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "radar",
      height: 350,
      toolbar: { show: true },
    },
    xaxis: {
      categories: labels,
    },
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.2,
    },
    dataLabels: {
      enabled: true,
    },
    legend: {
      position: "top",
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toString(),
      },
    },
  };
 
  return <Chart options={options} series={series} type="radar" height={350} />;
};
 
export default RadarChart;
 