/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams } from "react-router-dom";
import {
  useLazyGetElasticQueryResponseQuery,
  useLazyGetVisualizationsFromDashboardQuery,
} from "../../services/dashboard.api";
import { useEffect, useRef, useState } from "react";
import { useLazyGetSingleVisualizationDataQuery } from "../../services/visualization.api";
import { build1DGraphQuery, buildBarGraphQuery, buildBarGraphQueryWithBreakdown } from "../../lib/enums/elasticQueryBuilder";
import { Card, Group, Title } from "@mantine/core";
import Page from "../../components/Layout/Page";
import { buildPieDoughnutDatasets, convertToBoxPlotDatasets, convertToCoordinateDatasets, convertToGraphDatasets } from "../../lib/enums/elasticResponseBuilder";
import DatavChart from "./DatavChart";
import { ChartData, DashboardResponse, VisualizationId, XAxisItem } from "../../types/chart.types";
import { oneDGraphs, pieLikeGraphs } from "../../types/chartEnums";
import React from "react";
export default function ChartFromVID() {
  const { id } = useParams();
  const [visualizationIds, setVisualizationIds] = useState<string[]>([]);
  const [getViz, { data: vizData }] = useLazyGetSingleVisualizationDataQuery();
  const [getVisualizationsFromDashboard, { data }] =
  useLazyGetVisualizationsFromDashboardQuery<DashboardResponse>();
  const [getElasticQueryResponse, { data: elasticresponse }] =
    useLazyGetElasticQueryResponseQuery();
    console.log("elasticresponse", elasticresponse);
  const extraOptions =
    vizData?.data && JSON.parse(vizData?.data?.visualizationDetails);
  console.log("extraOptions", extraOptions);
  const [datasets, setDatasets] = useState<ChartData | null>(null);
  const [value, setVaule] = React.useState<{ label: string; value: string }>();
  console.log("datasets",datasets);
  const values = JSON.parse(vizData?.data?.visualizationDetails ?? "{}");
 const allowedBreakdown = [
    // 'verticalBar',
    // 'horizontalBar',
    'heatmap',
    // 'radar',
    // 'line',
    // 'area',
    // 'stackedVerticalBar',
    // 'stackedHorizontalBar',
    // 'stackedPercentageVerticalBar',
    // 'stackedPercentageHorizontalBar',
    // 'stackedArea',

  ];
  const formValues = {
    ...values,
    chart: {
      ...values?.chart,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      xAxis: values?.chart?.xAxis?.map((e : any) => {
        return {
          ...e,
          yAxis: e?.order?.yAxis,
          yAxisOrder: e?.order?.yAxisOrder,
        };
      }),
      breakdown: Array.isArray(values?.chart?.breakdown)
      ? values?.chart?.breakdown
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ?.filter((e : any) => Object.keys(e)?.length > 0)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ?.map((e : any) => {
            return {
              ...e,
              yAxis: e?.order?.yAxis,
              yAxisOrder: e?.order?.yAxisOrder,
            };
          })
      : {},
    
    },
  };
  console.log("formValues", formValues);
  console.log("xAxis values:", formValues?.values?.chart?.xAxis);
  const CHART_TYPE = formValues?.values?.chart?.chartType;
  console.log("CHART_TYPE",CHART_TYPE)

  const functionToUse = 
  oneDGraphs.includes(CHART_TYPE)
            ? build1DGraphQuery :
  allowedBreakdown.includes(formValues?.values?.chart?.chartType) &&
  CHART_TYPE?.length > 1
? buildBarGraphQueryWithBreakdown : buildBarGraphQuery;

  const aggrigation = functionToUse({
    xAxis: (formValues?.values?.chart?.xAxis as XAxisItem[])?.map(
      ({
        yAxis,
        yAxisOrder,
        order,
        calendar_interval,
        field_type,
        interval,
        ...e
      }: XAxisItem) => {
        const removeFieldTypeCharts = [
          "pie",
          "doughnut",
          "polarArea",
          "radialBar",
        ];
        if (removeFieldTypeCharts.includes(formValues?.chart?.chartType)) {
          return {
            ...e,
            order,
            ...(e.function === "date_histogram" ? { calendar_interval } : {}),
          };
        }
        if (e.function === "range") {
          return e;
        }
        if (e.function === "histogram") {
          return { interval, order, ...e };
        }
        if (e.function === "date_histogram") {
          return { order, calendar_interval, ...e };
        }
        return { order, ...e };
      }
    ),
    
    yAxis: formValues?.values?.chart?.yAxis,
    breakdown:
    Array.isArray(formValues?.values?.chart?.breakdown) &&
    formValues?.values?.chart?.breakdown?.[0]
        ? ( formValues?.values?.chart?.breakdown as XAxisItem[])?.map(
          ({ yAxis, yAxisOrder,field_type,interval ,order,calendar_interval,min_doc_count,...e }) =>{
          if(e.function === "terms")  {
            return {min_doc_count,order,...e} ;
          }
        else if(e.function ==="date_histogram"){
          return {order,calendar_interval,min_doc_count,...e }
        }
        else if (e.function === "histogram"){
          return {interval,min_doc_count,order, ...e}
        }
        else if(e.function === "range"){
          return e;
        }
        return { order, ...e }; // Retain field_type for other chart types
        },
      )?.[0]
      : Array.isArray(formValues?.values?.chart?.breakdown)
        ? ( formValues?.values?.chart?.breakdown as XAxisItem[])?.map(
          ({ yAxis, yAxisOrder,field_type,interval,order,calendar_interval,min_doc_count, ...e }) => {
            if(e.function === "terms")  {

              return {min_doc_count , e} ;
            }
            else if(e.function ==="date_histogram"){
              return {order,min_doc_count,calendar_interval ,...e }
            }
            else if (e.function === "histogram"){
              return {interval,calendar_interval,order, ...e}
            }
            else if(e.function === "range"){
              return e;
            }
            return { order, ...e }; // Retain field_type for other chart types
            },
            CHART_TYPE == "heatmap",
        )
        : {},
  },
);
  console.log("aggrigation",aggrigation);
  const firstAggregation = {
    index: formValues?.values?.connector,
    query: {
      bool: {
        must: [],
        filter: [
          {
            range: {
              "@timestamp": {
                gte: "now-1y",
              },
            },
          },
        ],
      },
    },
    ...aggrigation,
  };
  const secondAggregationConfig = {
    aggs: {
      xAxis_0: {
        meta: {
          xAxisFunction: 'date_histogram',
          xAxis_0: formValues?.values?.chart?.rangeDateField || '@timestamp',
          yAxis_0: formValues?.values?.chart?.yAxis[0]?.labelName,
        },
        date_histogram: {
          calendar_interval: '1M',
          time_zone: '+05:30',
          min_doc_count: 0,
          field:formValues?.values?.chart?.rangeDateField || '@timestamp',
        },
        aggs: {
          yAxis_0: {
            [formValues?.values?.chart?.yAxis[0]?.function]: {
              field: formValues?.values?.chart?.yAxis[0]?.field,
            },
          },
        },
      },
    },
  };
  const secondQueryConfig = {
    index: formValues?.values?.connector,
    query: {
      bool: {
        must: [],
        filter: [
          {
            range: {
              "@timestamp": {
                gte: "now-1y",
              },
            },
          },
        ],
      },
    },
    size: 0,
    ...secondAggregationConfig,
  };
  console.log("firstAggregation", firstAggregation);

  console.log("aggrigation", aggrigation, firstAggregation);
  useEffect(() => {
    if (id) {
      getVisualizationsFromDashboard({ id });
    }
     
  }, [id]);
   
  useEffect(() => {
    if (data?.data?.visualizationIds) {
      const ids = data.data.visualizationIds.map((vid: VisualizationId) => vid.id);
      setVisualizationIds(ids);
    }
  }, [data]);
  useEffect(() => {
    // Fetch visualization data for each ID
    if (visualizationIds.length > 0) {
      visualizationIds.forEach((id) => {
        getViz({ id }); // Call the API for each ID
      });
    }
  }, [visualizationIds, getViz]);
  const hasFetchedElasticData = useRef(false);
  const fetchChartData = async () => {
    console.log("Fetching data from API...");
  
    try {
      const [res, secondres] = await Promise.all([
        getElasticQueryResponse(firstAggregation),
        oneDGraphs.includes(CHART_TYPE)
          ? getElasticQueryResponse(secondQueryConfig)
          : Promise.resolve(null),
      ]);
      if (pieLikeGraphs.includes(CHART_TYPE)) {
        const pieData = buildPieDoughnutDatasets(res?.data);
        console.log("pieData", pieData);
        setDatasets(pieData);
      } else if (['boxplot', 'horizontalBoxplot'].includes(CHART_TYPE)) {
        setDatasets(convertToBoxPlotDatasets(res?.data));
      } else if (['heatmap'].includes(CHART_TYPE)) {
        setDatasets(convertToCoordinateDatasets(res?.data));

      } 
      else if (oneDGraphs.includes(CHART_TYPE)) {
        setVaule({
          label: formValues?.values?.chart?.yAxis[0]?.labelName,
          value: res?.data?.yAxis_0?.value,
        });
        // setDatasets(convertTo1DDatasets(res.data.yAxis_0.value));
        const chartData = convertToGraphDatasets(secondres?.data);
        console.log("Converted Chart Data:", chartData);
        setDatasets(chartData);
        console.log("secondres",secondres);
      }
      else {
        const chartData = convertToGraphDatasets(res?.data);
        console.log("Converted Chart Data:", chartData);
        setDatasets(chartData);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };
  

  useEffect(() => {
    // Only fetch if firstAggregation is valid and API not yet called
    if (
      firstAggregation?.index && // Make sure index is valid
      !hasFetchedElasticData.current // Prevent re-calling
    ) {
      fetchChartData();
      hasFetchedElasticData.current = true; // Set the flag after first call
    }
  }, [firstAggregation,secondQueryConfig]); // Triggers whenever aggregation changes
  return (
    <>
      <Card padding="sm" mt={12} radius="md">
        <Group justify="space-between" align="center" mb="md" pr="xxs">
          <Title size={24} fw={600}>
            Dashboard
          </Title>
        </Group>
      </Card>
      <Page pageTitle="">
      <DatavChart formValues={formValues?.values} datasets={datasets} legacycount ={value} />
      </Page>
    </>
  );
}