import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface BoxPlotDatum {
  x: string;
  y: number[]; // [low, q1, median, q3, high]
}

interface BoxPlotDataset {
  data: BoxPlotDatum[];
}

interface HorizontalBoxPlotChartProps {
  datasets: {
    datasets: BoxPlotDataset[];
    labels?: string[];
    group?: string;
  };
  xAxisTitle?: string;
  yAxisTitle?: string;
  formValues?: { visualizationName?: string };
}

const HorizontalBoxPlotChart: React.FC<HorizontalBoxPlotChartProps> = ({
  datasets,
  xAxisTitle = "",
  yAxisTitle = "",
  formValues
}) => {
  const series = [
    {
      name: datasets.labels?.[0] || "",
      data: datasets.datasets?.[0]?.data || []
    }
  ];

  const options: ApexOptions = {
    chart: {
      type: "boxPlot",
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "40%"
      },
      boxPlot: {
        colors: {
          upper: "#5A91DD",
          lower: "#F26666"
        }
      }
    },
    xaxis: {
      title: {
        text: yAxisTitle
      },
      labels: {
        formatter: (value) => Number(value).toFixed(0)
      }
    },
    yaxis: {
      title: {
        text: xAxisTitle
      }
    },
    title: {
      text: formValues?.visualizationName || "",
      style: {
        fontFamily: "Poppins, sans-serif",
        fontWeight: 600,
        fontSize: "14px",
        color: "#33383D"
      }
    },
    tooltip: {
      y: {
        formatter: (val) => parseFloat(val.toString()).toFixed(2)
      }
    }
  };

  return <Chart options={options} series={series} type="boxPlot" height={350} />;
};

export default HorizontalBoxPlotChart;
