// src/types/chart.types.ts

export interface VisualizationId {
    id: string;
  }
  
  export interface DashboardResponse {
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: any; // You can replace `any` with a specific type for your dashboard data
      visualizationIds: VisualizationId[];
    };
  }
  
  export interface ChartData {
    xAxisFunction?: string;
    breakdownFunction?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    labels?: any[]; // Consider refining this to a more specific type (e.g., number[] or string[])
    // datasets?: {
    //   name?: string;
    //   data?: number[];
    //   type?: string;
    //   group?: string;
    // }[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    datasets?:any[];
  }
  
  export interface XAxisItem {
    function?: string;
    field?: string;
    order?: string;
    yAxis?: string;
    yAxisOrder?: string;
    calendar_interval?: string;
    field_type?: string;
    interval?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }

 export  interface DatavChartProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formValues?: any; // Replace 'any' with more specific types if known
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    datasets?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    legacycount?:any
  }
  
  export interface YAxis {
    value: number;
  }
  
  export interface SubBucket {
    key: string;
    doc_count: number;
    yAxis_0: YAxis;
  }
  
  export interface Breakdown {
    doc_count_error_upper_bound: number;
    sum_other_doc_count: number;
    buckets: SubBucket[];
  }
  
  export interface MainBucket {
    key: string;
    doc_count: number;
    yAxis_0: YAxis;
    breakDown?: Breakdown;
  }
  
  export interface Meta {
    xAxisFunction: string;
    xAxis_0: string;
    yAxis_0: string;
    isHeatmap?: boolean;
    breakdownFunction?: string;
  }
  
  export interface XAxisDatas {
    meta?: Meta;
    doc_count_error_upper_bound: number;
    sum_other_doc_count: number;
    buckets: MainBucket[];
  }
  
  export interface InputData {
    xAxis_0?: XAxisDatas;
  }
  
  export interface OutputData {
    datasets: {
      name?: string;
      data: { x: string; y: number | string }[] | number[];
      group?: string;
    }[];
    labels: string[];
    xAxisFunction?: string;
  }
  export interface Bucket {
    key: string;
    key_as_string?: string;
    doc_count?: number;
    yAxis_0?: { value: number };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
  
  export interface ChartDataset {
    name: string;
    data: number[];
    group?: string;
  }
  
  export interface GraphData {
    xAxisFunction: string;
    breakdownFunction?: string;
    labels: string[];
    datasets: ChartDataset[];
  }
  
  export interface XAxisData {
    meta: {
      xAxisFunction: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
    doc_count_error_upper_bound: number;
    sum_other_doc_count: number;
    buckets: Bucket[];
  }
  
  export interface ElasticResponse {
    [key: string]: XAxisData;
  }
  
  export interface PieChartData {
    labels?: string[];
    datasets?: number[];
    xAxisFunction?: string;
  }
  
  export interface BoxPlotMeta {
    xAxisFunction: string;
    xAxis_0: string;
    yAxis_0: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
  
  export interface BoxPlotBucket {
    key: string;
    doc_count: number;
    yAxis_0: {
      min: number;
      q1: number;
      q2: number; // median
      q3: number;
      max: number;
      lower?: number;
      upper?: number;
    };
  }
  
  export interface BoxPlotResponse {
    xAxis_0: {
      meta: BoxPlotMeta;
      buckets: BoxPlotBucket[];
    };
  }
  
  export interface BoxPlotChartData {
    datasets: {
      data: {
        x: string;
        y: [number, number, number, number, number];
      }[];
    }[];
    labels: string[];
  }
    