import React from "react";
import Chart from "react-apexcharts";
import { VerticalBarChartProps } from "../../../types/chartprops.type";
import { Box, Center, Grid , Text} from "@mantine/core";

const LegacyMetricBarChart: React.FC<VerticalBarChartProps> = ({
  labels,
  datasets,
  legacycount
//   xAxisTitle = "",
//   yAxisTitle = "",
//   formValues,
}) => {
  const formattedLabels = labels.map((label) =>
    new Date(label).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
    })
  );

  const series = datasets.map((ds) => ({
    name: ds.name,
    data: ds.data,
  }));

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false, // Hide data labels
    },
    stroke: {
      curve: "smooth", // Smooth curve like in your sample
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: formattedLabels,
    
      labels: {
        show: false, // Hide X-axis labels
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      title: {
        text: "",
      },
    },
    yaxis: {
      labels: {
        show: false, // Hide Y-axis labels
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      title: {
        text: "",
      },
    },
    grid: {
      show: false, // Hide grid lines
    },
    legend: {
      show: false, // Hide legend
    },
    title: {
        text:  "",
        style: {
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          fontSize: "14px",
          color: "#33383D", // Optional: set your desired color
        },
      },
    tooltip: {
      enabled: true, // You can keep this true if you want the hover tooltip
    },
  };
return (
    <Grid gutter="lg" align="center" style={{ height: "190px" }}>
      <Grid.Col span={2}>
        <Box>
          <Center style={{ height: "calc(100% - 24px)" }}>
            <Text size="xl" fw={700} c="black">
            {legacycount?.value}
            </Text>
          </Center>
        </Box>
      </Grid.Col>
      <Grid.Col span={10}>
        <Chart options={options} series={series} type="area" height={200} />
      </Grid.Col>
    </Grid>
);
//   return <Chart options={options} series={series} type="area" height={200} />;
};

export default LegacyMetricBarChart;
