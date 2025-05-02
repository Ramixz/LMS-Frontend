/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from 'moment';

export interface AggregationFunction {
  function?: string;
  field?: string;
  size?: number;
  order?: {
    yAxis?: string;
    yAxisOrder?: 'asc' | 'desc';
  };
  calendar_interval?: string;
  format?: string;
  ranges?: { min: number; max: number }[];
  labelName?: string;
  min_doc_count?: number;
  interval?: number;
  field_type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface AggregationArguments {
  xAxis: AggregationFunction[];
  yAxis: AggregationFunction[];
}

const generateMeta = (axes: AggregationArguments) => {
  const xAxis = axes?.xAxis?.reduce(
    (prev, axis, index) => ({
      ...prev,
      [`xAxis_${index}`]:
        axis?.labelName != null ? axis?.labelName : axis?.field,
    }),
    {},
  );
  const yAxis = axes?.yAxis?.reduce(
    (prev, axis, index) => ({
      ...prev,
      [`yAxis_${index}`]:
        axis?.labelName != null ? axis?.labelName : axis?.field,
    }),
    {},
  );
  return { ...xAxis, ...yAxis };
};

const generateMetaForSorting = (axes: AggregationArguments) => {
  const xAxis = axes?.xAxis?.reduce(
    (prev, axis, index) => ({
      ...prev,
      [`xAxis_${index}`]:
        axis?.labelName != null ? axis?.labelName : axis?.field,
    }),
    {},
  );
  const yAxis = axes?.yAxis?.reduce(
    (prev, axis, index) => ({
      ...prev,
      [`yAxis_${index}`]: axis?.field != null ? axis?.field : axis?.labelName,
    }),
    {},
  );
  return { ...xAxis, ...yAxis };
};

function buildBarGraphQuery(
  aggregationArgs: AggregationArguments,
  timeUnitValue: string = '1y'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> {
  const { xAxis, yAxis } = aggregationArgs;
  const xAxisFirst = Array.isArray(xAxis) && xAxis.length > 0 ? xAxis[0] : null;

  if (!xAxisFirst) {
    console.warn('buildBarGraphQuery: xAxis is missing or empty');
    return {};
  }

  const {
    function: xAxisFunction,
    order,
    calendar_interval,
    format,
    ranges,
    labelName,
    size,
    min_doc_count,
    interval,
    field_type,
    ...rest
  } = xAxisFirst;

  const metaObj = generateMetaForSorting({ xAxis, yAxis });

  const getKeyFromValue = (meta: Record<string, string>, value?: string): string => {
    if (!value) return '_key';
    const matchedKey = Object.keys(meta).find(
      (key) => key.startsWith('y') && meta[key] === value
    );
    return matchedKey ?? '_key';
  };

  const orderKey: string =
    order?.yAxis === '_key' ? '_key' : getKeyFromValue(metaObj, order?.yAxis);
    if (!xAxisFunction) {
      throw new Error('xAxisFunction is required but was undefined');
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: Record<string, any> = {
    size: 0,
    aggs: {
      xAxis_0: {
        meta: {
          xAxisFunction,
          ...generateMeta({ xAxis, yAxis }),
          field_type,
        },
        [xAxisFunction]: {
          order: order?.yAxis && orderKey
            ? { [order?.yAxis === '_key' ? order?.yAxis : orderKey]: order?.yAxisOrder }
            : undefined,
          calendar_interval:
            xAxisFunction === 'terms'
              ? undefined
              : calendar_interval === 'auto'
              ? timeUnitValue
              : calendar_interval,
          time_zone: xAxisFunction === 'date_histogram' ? moment().format('Z') : undefined,
          format: xAxisFunction === 'date_histogram' ? format : undefined,
          min_doc_count:
            xAxisFunction === 'date_histogram'
              ? 0
              : xAxisFunction === 'range'
              ? undefined
              : min_doc_count,
          interval: xAxisFunction === 'histogram' ? interval : undefined,
          ranges:
            xAxisFunction === 'range'
              ? ranges?.map((e) => ({ from: e.min, to: e.max }))
              : undefined,
          size: xAxisFunction === 'terms' ? size : undefined,
          ...rest,
        },
        aggs: {},
      },
    },
  };

  yAxis?.forEach((y, i) => {
    if (y.function) {
      query.aggs.xAxis_0.aggs[`yAxis_${i}`] = {
        [y.function]: {
          field: y.field,
        },
      };
    } else {
      // Handle the case where y.function is undefined
      // For example, you might throw an error or assign a default function
      throw new Error(`y.function is undefined for yAxis index ${i}`);
    }
  });

  console.log('querybuilder', query);
  return query;
}
export interface BreakdownAggregationArguments {
  xAxis: AggregationFunction[];
  yAxis: AggregationFunction[];
  breakdown: AggregationFunction;
}
function buildBarGraphQueryWithBreakdown(
  aggregationArgs: BreakdownAggregationArguments,
  timeUnitValue: string = 'now-1y',
  isHeatmap: boolean = true
): Record<string, unknown> {
  console.log("aggregationArgs", aggregationArgs);

  const { xAxis: ogXAxis, yAxis, breakdown: ogBreakDown } = aggregationArgs;

  const xAxis = isHeatmap ? [ogBreakDown] : ogXAxis;
  const breakdown = isHeatmap ? ogXAxis[0] : ogBreakDown;
  console.log("aggregationArgsxAxis",breakdown);

  const {
    function: xAxisFunction,
    order,
    calendar_interval,
    format,
    size,
    labelName,
    ranges,
    min_doc_count,
    interval,
    ...rest
  } = xAxis[0];

  const {
    function: breakdownFunction,
    order: breakdownOrder,
    format: bdformat,
    labelName: bdLabelName,
    size: bdSize,
    ranges: bdRanges,
    calendar_interval: calendar_interval2,
    ...bdrest
  } = breakdown;

  if (!breakdownFunction) {
    // fallback when breakdown is empty
    return buildBarGraphQuery({ xAxis, yAxis });
  }

  const metaObj = generateMetaForSorting({ xAxis, yAxis });

  const getKeyFromValue = (meta: Record<string, string>, value: string): string => {
    for (const key in meta) {
      if (key.startsWith('y') && meta[key] === value) {
        return key;
      }
    }
    return '_key';
  };

  const orderKey = order?.yAxis === '_key' ? '_key' : getKeyFromValue(metaObj, order?.yAxis || '');
  const breakdownOrderKey =
    breakdownOrder?.yAxis === '_key' ? '_key' : getKeyFromValue(metaObj, breakdownOrder?.yAxis || '');
    // if (!xAxisFunction) {
    //   throw new Error('xAxisFunction is required but was undefined');
    // }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aggs: Record<string, any> = {
    size: 0,
    aggs: {
      xAxis_0: {
        meta: {
          xAxisFunction,
          ...generateMeta({ xAxis, yAxis }),
          isHeatmap,
          breakdownFunction,
        },
        [xAxisFunction]: {
          // order: order?.yAxis && orderKey ? { [orderKey]: order?.yAxisOrder } : undefined,
          calendar_interval: xAxisFunction === 'terms' ? undefined : calendar_interval === 'auto' ? timeUnitValue : calendar_interval,
          time_zone: xAxisFunction === 'date_histogram' ? moment().format('Z') : undefined,
          format: xAxisFunction === 'date_histogram' ? format : undefined,
          extended_bounds: xAxisFunction === 'date_histogram' ? { min: timeUnitValue, max: 'now' } : undefined,
          interval: xAxisFunction === 'histogram' ? interval : undefined,
          ranges: xAxisFunction === 'range' ? ranges?.map(r => ({ from: r.min, to: r.max })) : undefined,
          size: xAxisFunction === 'terms' ? size : undefined,
          ...rest,
        },
        aggs: {
          breakDown: {
            [breakdownFunction]: {
              order: breakdownOrder?.yAxisOrder && breakdownOrderKey ? { [breakdownOrderKey]: breakdownOrder?.yAxisOrder } : undefined,
              ranges: breakdownFunction === 'range' ? bdRanges?.map(r => ({ from: r.min, to: r.max })) : undefined,
              size: breakdownFunction === 'terms' ? bdSize : undefined,
              extended_bounds: breakdownFunction === 'date_histogram' ? { min: timeUnitValue, max: 'now' } : undefined,
              interval: breakdownFunction === 'histogram' && !isHeatmap ? interval : undefined,
              calendar_interval: breakdownFunction === 'terms' ? undefined : calendar_interval2,
              ...bdrest,
            },
            aggs: {},
          },
        },
      },
    },
  };

  yAxis.forEach((y, index) => {
    aggs.aggs.xAxis_0.aggs[`yAxis_${index}`] = {
      [y.function!]: {
        field: y.field,
      },
    };
  });

  yAxis.forEach((y, index) => {
    aggs.aggs.xAxis_0.aggs.breakDown.aggs[`yAxis_${index}`] = {
      [y.function!]: {
        field: y.field,
      },
    };
  });

  return aggs;
}

function build1DGraphQuery(
  aggregationArgs: AggregationArguments,
  fromDashVisChartType?: string,
  chartType?: string,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  console.log("buildgraph",aggregationArgs,fromDashVisChartType,chartType)
  const { yAxis } = aggregationArgs;
  const fieldType = yAxis?.[0]?.field_type; // Ensure field_type is retrieved correctly
  const fieldFunction = yAxis?.[0]?.function;

  const yAxis_0 = {
      [yAxis?.[0]?.function as string]: {
      field: yAxis?.[0]?.field,
    },
  };
  const stats = {
    stats: {
      field: yAxis?.[0]?.field,
    },
  };

  console.log("yAxis_0",yAxis_0,stats);
  let query;
  if (chartType === 'legacyMetric' || fromDashVisChartType === 'legacyMetric') {
    query = {
      size: 0,
      meta: { ...generateMeta(aggregationArgs) },
      aggs: {
        yAxis_0,
        // stats: ["value_count", "cardinality",]?.includes(yAxis?.[0]?.function) ? stats : undefined
      },
    };
  } else {
    query = {
      size: 0,
      meta: { ...generateMeta(aggregationArgs) },
      aggs: {
        yAxis_0,
        // Stats should only be added if the field_type is NOT "string"
        ...(fieldType !== 'string' && fieldFunction && ['value_count', 'cardinality'].includes(fieldFunction)
        ? stats 
        : undefined),

      },
    };
  }

  return query;
}
export { buildBarGraphQuery ,
  buildBarGraphQueryWithBreakdown,
  build1DGraphQuery
};
