export interface AreaChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datasets: any[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues?:any;
}

export interface DoughnutChartProps {
  labels: string[];
  datasets: number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues?: any;
}

export interface FunnelChartProps {
  labels: (string | number)[];
  datasets: {
    name: string;
    data: number[];
  }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues : any;
}
export interface HorizontalBarChartProps {
  labels: string[];
  datasets: {
    name: string;
    data: number[];
  }[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues?:any;
}
export interface LineChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datasets: any[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues?:any;
}
export interface PieChartProps {
  labels: string[];
  datasets: number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues?: any;
}

export interface PolarAreaChartProps {
  labels: string[];
  datasets: number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues?: any ;
}
export interface RadialBarChartProps {
  labels: string[];
  datasets: number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues?: any;
}
export interface ScatterChartProps {
  labels: string[];
  datasets: {
    name: string;
    data: number[];
  }[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues?:any;
}
export interface StackedAreaChartProps {
  labels: string[];
  datasets: { name: string; data: number[] }[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues?:any;
}

export interface VerticalBarChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datasets: any[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues?:any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  legacycount?:any;
}

export interface BoxPlotChartProps {
  datasets: {
    data: {
      x: string;
      y: [number, number, number, number, number]; // min, q1, median, q3, max
    }[];
  }[];
  labels?: string[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  formValues?: {
    visualizationName?: string;
  };
}
export interface Dataset {
  name: string;
  data: number[] | { x: string; y: number }[];
  group?: string;
}

export interface BaseChartProps {
  labels: string[];
  datasets: Dataset[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  formValues?: {
    visualizationName?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export type HeatmapChartProps = BaseChartProps;

