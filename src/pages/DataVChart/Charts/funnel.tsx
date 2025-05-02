/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Chart from "react-apexcharts";
import { FunnelChartProps } from "../../../types/chartprops.type";

const FunnelChart: React.FC<FunnelChartProps> = ({ labels, datasets , formValues}) => {
  console.log("labels",labels,datasets,formValues);
  // Format timestamp labels to readable date if they are numbers
  const formattedLabels = labels.map((label) =>
    typeof label === "number"
      ? new Date(label).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        })
      : label
  );
console.log("formattedLabels",formattedLabels);

  const series = datasets.map((ds) => ({
    name: ds.name,
    data: ds.data.map((value, index) => ({
      x: formattedLabels[index],
      y: value,
    })),
  }));

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "60%",
        distributed: true,
        isFunnel: true,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontWeight: "bold",
        colors: ["#000"],
      },
      formatter: (val) => {
        if (typeof val === "number") {
          return val.toFixed(2);
        } else if (typeof val === "string") {
          return val;
        } else if (Array.isArray(val)) {
          return val.map((v) => v.toString()).join(", ");
        }
        return "";        
      }
   },


    tooltip: {
      y: {
        formatter: (val) => val.toFixed(2),
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

  return <Chart options={options} series={series} type="bar" height={400} />;
};

export default FunnelChart;
