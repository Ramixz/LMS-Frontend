import { Card, Grid } from "@mantine/core";
import { memo, useEffect, useState } from "react";
import VerticalBarChart from "./Charts/verticalbar";
import AreaChart from "./Charts/area";
import LineChart from "./Charts/line";
import { DatavChartProps } from "../../types/chart.types";
import PieChart from "./Charts/pie";
import DoughnutChart from "./Charts/doughnut";
import PolarAreaChart from "./Charts/polararea";
import StackedAreaChart from "./Charts/stackedarea";
import HorizontalBarChart from "./Charts/horizontalbar";
import ScatterChart from "./Charts/scatter";
import FunnelChart from "./Charts/funnel";
import BoxPlotChart from "./Charts/BoxPlotChart";
import HorizontalBoxPlotChart from "./Charts/HorizontalBoxPlotChart";
import RadialChart from "./Charts/radical";
import HeatmapChart from "./Charts/HeatmapChart";
import LegacyMetricBarChart from "./Charts/LegacyMetricBarChart";
import { Text } from "@mantine/core";
import RadarChart from "./Charts/radar";
import StackedHorizontalBarChart from "./Charts/stackedhorizontalbar";
import StackedVerticalBarChart from "./Charts/stackedverticalbar";
import StackedPercentageVerticalBarChart from "./Charts/stakedpercentageverticalbar";
import StackedPercentageHorizontalBarChart from "./Charts/stackedpercentagehorizontalbar";
import DataTable from "../../components/DataTable";
import { useLazyGetRawtableDataQuery } from "../../services/connector.api";
import { MRT_ColumnDef } from "mantine-react-table";
const DatavChart = memo(function DatavChart({
  formValues,
  datasets,
  legacycount,
}: DatavChartProps) {
  console.log("formValues_value", formValues);
  console.log("datasets_value", datasets, legacycount);
  const chartType = formValues?.chart?.chartType;
  const xAxisTitle = formValues?.extraOptions?.legend?.xAxisTitle || "";
  const yAxisTitle = formValues?.extraOptions?.legend?.yAxisTitle || "";
  const index = formValues?.connector || "";
  const [
    getRawtableData,
    { data: rawtabledata, isFetching, isLoading, isError },
  ] = useLazyGetRawtableDataQuery();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generateColumns = (columnNames: string[]): MRT_ColumnDef<any>[] => {
    return columnNames?.map((col) => ({
      accessorKey: col,
      header: col,
      filterVariant: col.toLowerCase().includes("date") ? "date" : "text",
    }));
  };
  useEffect(() => {
    if (chartType === "raw-table" && index) {
      getRawtableData({
        page: pagination.pageIndex,
        rowPerPage: pagination.pageSize,
        body: {
          connectorInfo: {
            index: index,
          },
          query: {
            bool: {
              must: [
                {
                  match_all: {},
                },
              ],
            },
          },
        },
      })
        .then((res) => {
          console.log("res", res);
        })
        .catch((err) => console.error(err));
    }
  }, [index, chartType, pagination.pageIndex, pagination.pageSize]);

  return (
    <>
      <Grid>
        <Grid.Col span={6}>
          <Card>
            {chartType === "legacyMetric" && datasets && (
              <Text size="sm" fw={600} c="black">
                {formValues?.visualizationName || ""}
              </Text>
            )}

            {chartType === "verticalBar" && datasets && (
              <VerticalBarChart
                labels={datasets.labels}
                datasets={datasets.datasets}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
                formValues={formValues}
              />
            )}
            {chartType === "area" && datasets && (
              <AreaChart
                labels={datasets.labels}
                datasets={datasets.datasets}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
                formValues={formValues}
              />
            )}
            {chartType === "stackedArea" && datasets && (
              <StackedAreaChart
                labels={datasets.labels}
                datasets={datasets.datasets}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
                formValues={formValues}
              />
            )}
            {chartType === "line" && datasets && (
              <LineChart
                labels={datasets.labels}
                datasets={datasets.datasets}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
                formValues={formValues}
              />
            )}
            {chartType === "pie" && datasets && (
              <PieChart
                labels={datasets.labels}
                datasets={datasets.datasets as number[]} // Make sure it's an array of numbers
                formValues={formValues}
              />
            )}
            {chartType === "doughnut" && datasets && (
              <DoughnutChart
                labels={datasets.labels}
                datasets={datasets.datasets as number[]} // Ensure it's a number array
                formValues={formValues}
              />
            )}
            {chartType === "polarArea" && datasets && (
              <PolarAreaChart
                labels={datasets.labels}
                datasets={datasets.datasets as number[]}
                formValues={formValues}
              />
            )}
            {chartType === "radialBar" && datasets && (
              <RadialChart
                labels={datasets.labels}
                datasets={datasets.datasets as number[]}
                formValues={formValues}
              />
            )}
            {chartType === "horizontalBar" && datasets && (
              <HorizontalBarChart
                labels={datasets.labels}
                datasets={datasets.datasets}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
                formValues={formValues}
              />
            )}
            {chartType === "scatter" && datasets && (
              <ScatterChart
                labels={datasets.labels}
                datasets={datasets.datasets}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
                formValues={formValues}
              />
            )}
            {chartType === "funnel" && datasets && (
              <FunnelChart
                labels={datasets.labels}
                datasets={datasets.datasets}
                formValues={formValues}
              />
            )}

            {chartType === "boxplot" && datasets && (
              <BoxPlotChart
                labels={datasets.labels}
                datasets={datasets.datasets}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
                formValues={formValues}
              />
            )}

            {chartType === "horizontalBoxplot" && datasets && (
              <HorizontalBoxPlotChart
                datasets={datasets}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
                formValues={formValues}
              />
            )}
            {chartType === "heatmap" && datasets && (
              <HeatmapChart
                labels={datasets.labels}
                datasets={datasets.datasets}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
                formValues={formValues}
              />
            )}
            {chartType === "legacyMetric" && datasets && (
              <LegacyMetricBarChart
                labels={datasets.labels}
                datasets={datasets.datasets}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
                formValues={formValues}
                legacycount={legacycount}
              />
            )}
            {chartType === "radar" && datasets && (
              <RadarChart
                labels={datasets.labels}
                datasets={datasets.datasets}
              />
            )}
            {chartType === "stackedHorizontalBar" && datasets && (
              <StackedHorizontalBarChart
                labels={datasets.labels}
                datasets={datasets.datasets}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
              />
            )}
            {chartType === "stackedVerticalBar" && datasets && (
              <StackedVerticalBarChart
                labels={datasets.labels}
                datasets={datasets.datasets}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
              />
            )}
            {chartType === "stackedPercentageVerticalBar" && datasets && (
              <StackedPercentageVerticalBarChart
                labels={datasets.labels}
                datasets={datasets.datasets}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
              />
            )}
            {chartType === "stackedPercentageHorizontalBar" && datasets && (
              <StackedPercentageHorizontalBarChart
                labels={datasets.labels}
                datasets={datasets.datasets}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
              />
            )}
            {chartType === "raw-table" && datasets && (
              <DataTable
                data={rawtabledata?.data || ""}
                columns={generateColumns(rawtabledata?.columnNames) ?? []}
                totalRowCount={rawtabledata?.total_items || ""}
                {...{ isFetching, isLoading, isError }}
                onStateChange={({ pagination }) => {
                  setPagination(pagination); // Update parent state
                }}
              />
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </>
  );
});

export default DatavChart;
