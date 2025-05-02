import { BoxPlotChartData, BoxPlotResponse, Bucket, ChartDataset, ElasticResponse, GraphData, InputData, OutputData, PieChartData } from "../../types/chart.types";


export const buildPieDoughnutDatasets = (data: ElasticResponse): PieChartData => {
  const labels: string[] = [];
  const values: number[] = [];

  const xAxisKey = Object.keys(data).find((key) => key.startsWith("xAxis_"));
  if (!xAxisKey) return { labels, datasets: [], xAxisFunction: '' };

  const xAxisData = data[xAxisKey];
  const buckets = xAxisData?.buckets ?? [];

  buckets.forEach((bucket: Bucket) => {
    labels.push(bucket.key);
    values.push(bucket.yAxis_0?.value ?? 0);
  });

  return {
    labels,
    datasets: values,
    xAxisFunction: xAxisData.meta?.xAxisFunction ?? '', 
  };
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertToGraphDatasets = (data: any): GraphData => {
  const meta = data?.xAxis_0?.meta ?? {};
  const xAxisFunction: string = meta?.xAxisFunction ?? '';
  const labels: string[] = [];
  const yAxisData: Record<string, number[]> = {};
  const datasets: ChartDataset[] = [];

  const buckets: Bucket[] = data?.xAxis_0?.buckets ?? [];

  if (meta?.isHeatmap === false) {
    // Breakdown case
    const breakdownKeys = new Set<string>();

    buckets.forEach((bucket, bucketIndex) => {
      labels.push(bucket.key);

      const subBuckets = bucket?.breakDown?.buckets ?? [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      subBuckets.forEach((subBucket: any) => {
        const keyToUse = meta?.field_type === 'boolean' ? 'key_as_string' : 'key';
        const key: string = subBucket[keyToUse];

        if (!breakdownKeys.has(key)) {
          breakdownKeys.add(key);
          datasets.push({
            name: key,
            data: Array(buckets.length).fill(0),
          });
        }

        const index = datasets.findIndex((d) => d.name === key);
        if (index !== -1) {
          datasets[index].data[bucketIndex] = formatValue(subBucket?.yAxis_0?.value);
        }
      });
    });

  } else {
    // Normal (non-breakdown) case
    buckets.forEach((bucket) => {
      const keyToUse = meta?.field_type === 'boolean' ? 'key_as_string' : 'key';
      labels.push(bucket[keyToUse] ?? '');

      Object.keys(bucket)
        .filter((k) => k.startsWith('yAxis_'))
        .forEach((yKey, idx) => {
          if (!yAxisData[idx]) yAxisData[idx] = [];
          yAxisData[idx].push(formatValue(bucket[yKey]?.value));
        });
    });

    Object.keys(yAxisData).forEach((idx) => {
      datasets.push({
        name: meta[`yAxis_${idx}`],
        data: yAxisData[idx],
        group: `apexcharts-axis-${idx}`,
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function formatValue(val: any): number {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : Number(num.toFixed(2));
  }

  return {
    xAxisFunction,
    breakdownFunction: meta?.breakdownFunction,
    labels,
    datasets,
  };
};

export const convertToBoxPlotDatasets = (data: BoxPlotResponse): BoxPlotChartData => {
  const meta = data?.xAxis_0?.meta;
  const buckets = data?.xAxis_0?.buckets ?? [];
  
  return {
    datasets: [
      {
        data: buckets.map((bucket) => {
          const { min, q1, q2: median, q3, max } = bucket.yAxis_0;
          return {
            x: String(bucket.key),
            y: [min, q1, median, q3, max],
          };
        }),
      },
    ],
    labels: Object.keys(meta || {})
      .filter((key) => key.startsWith("yAxis_"))
      .map((key) => meta[key]),
  };
};

export const convertToCoordinateDatasets = (data: InputData): OutputData => {
  const datasets: OutputData['datasets'] = [];
  const meta = data?.xAxis_0?.meta;
  const buckets = data?.xAxis_0?.buckets || [];
  const hasBreakdown = buckets.every((e) => Object.keys(e).includes('breakDown'));
  const allLabels = new Set<string>();

  if (meta?.isHeatmap && hasBreakdown) {
    // Heatmap-specific logic
    const labels: string[] = [];

    buckets.forEach((bucket) => {
      labels.push(bucket.key);
      const breakdownBuckets = bucket.breakDown?.buckets || [];
      breakdownBuckets.forEach((subBucket) => {
        allLabels.add(subBucket.key);
      });
    });

    [...allLabels].forEach((label) => {
      datasets.push({
        name: label,
        data: buckets.map((bucket) => {
          const breakdownBucket = bucket.breakDown?.buckets?.find((b) => b.key === label);
          return breakdownBucket?.yAxis_0?.value || 0;
        }),
        group: 'apexcharts-axis-0',
      });
    });

    return {
      datasets,
      labels,
      xAxisFunction: meta?.xAxisFunction,
    };
  } else {
    // Treemap or standard coordinate logic
    if (hasBreakdown) {
      buckets.forEach((bucket) => {
        datasets.push({
          name: bucket.key,
          data: bucket.breakDown?.buckets?.map((subBucket) => ({
            x: subBucket.key,
            y: subBucket.yAxis_0.value.toFixed(2),
          })) || [],
        });
      });
    } else {
      datasets.push({
        data: buckets.map((bucket) => ({
          x: bucket.key,
          y: bucket.yAxis_0.value.toFixed(2),
        })),
      });
    }

    // Normalize the x values across all datasets
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    datasets.forEach((ds) => ds?.data?.forEach((point: any) => allLabels.add(point.x)));
    datasets.forEach((ds) => {
      ds.data = [...allLabels].map((label) => {
        const match = (ds.data as { x: string; y: string }[]).find((d) => d.x === label);
        return {
          x: label,
          y: match?.y || 0,
        };
      });
    });

    return {
      datasets,
      labels: Array.from(allLabels),
      xAxisFunction: meta?.xAxisFunction,
    };
  }
};


