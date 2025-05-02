import { IconAdjustmentsHorizontal, IconChartArcs3, IconChartArea, IconChartArrows, IconChartArrowsVertical, IconChartBubble, IconChartCandle, IconChartDonut, IconChartFunnel, IconChartLine, IconChartPie, IconChartRadar, IconChartScatter, IconChartTreemap, IconGauge, IconGraph, IconTable } from "@tabler/icons-react";

export const visualizationTypeIcons: Record<string, JSX.Element> = {
    verticalBar: <IconChartArrowsVertical size={22} stroke={1}/>,
    horizontalBar: <IconChartArrows size={22} stroke={1}/>, // Need to change
    stackedVerticalBar: <IconChartArrowsVertical size={22} stroke={1}/>, // Need to change
    stackedHorizontalBar: <IconChartArrows size={22} stroke={1}/>, // Need to change
    stackedPercentageVerticalBar: <IconChartArrowsVertical size={22} stroke={1}/>, // Need to change
    stackedPercentageHorizontalBar: <IconChartArrows size={22} stroke={1}/>, // Need to change
    line: <IconChartLine size={22} stroke={1}/>,
    area: <IconChartArea size={22} stroke={1}/>,
    stackedArea: <IconChartArea size={22} stroke={1}/>, // Need to verify
    pie: <IconChartPie size={22} stroke={1}/>,
    doughnut: <IconChartDonut size={22} stroke={1}/>,
    polarArea: <IconChartArcs3 size={22} stroke={1}/>, // Need to change
    radialBar: <IconChartArcs3 size={22} stroke={1}/>,
    radar: <IconChartRadar size={22} stroke={1}/>,
    bubble: <IconChartBubble size={22} stroke={1}/>,
    heatmap: <IconChartTreemap size={22} stroke={1}/>,
    treemap: <IconChartTreemap size={22} stroke={1}/>,
    boxplot: <IconChartCandle size={22} stroke={1}/>,
    horizontalBoxplot: <IconAdjustmentsHorizontal size={22} stroke={1}/>,
    scatter: <IconChartScatter size={22} stroke={1}/>,
    funnel: <IconChartFunnel size={22} stroke={1}/>,
    gauge: <IconGauge size={22} stroke={1}/>,
    legacyMetric: <IconGraph size={22} stroke={1}/>,
    Table: <IconTable size={22} stroke={1}/>,
    "raw-table": <IconTable size={22} stroke={1}/>
  };