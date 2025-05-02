/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Chart from "react-apexcharts";
import { RadialBarChartProps } from "../../../types/chartprops.type";

const RadialChart: React.FC<RadialBarChartProps> = ({ labels, datasets ,  formValues}) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "16px",
          },
          value: {
            fontSize: "14px",
          },
          total: {
            show: true,
            label: "Total",
            formatter: () => {
              const total = datasets.reduce((sum, val) => sum + val, 0);
              return `${total}`;
            },
          },
        },
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
    labels: labels,
  };

  return <Chart options={options} series={datasets} type="radialBar" height={350} />;
};

export default RadialChart;
