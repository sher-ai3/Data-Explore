import ReactECharts from "echarts-for-react";
import { useMemo, useRef, forwardRef, useImperativeHandle } from "react";
import { buildEchartsOption } from "../buildoption";
import type { ChartPreviewHandle } from "../global";

type Props = {
  data: any[][];
  type: string;
  values: Record<string, any>;
};

const ChartPreview = forwardRef<ChartPreviewHandle, Props>(function ChartPreview({ data, type, values }, ref) {
  const chartRef = useRef<any>(null);

  const option = useMemo(() => buildEchartsOption({ data, type, values }), [data, type, values]);

  useImperativeHandle(
    ref,
    () => ({
      getOption: () => option,
      getEchartsOption: () => chartRef.current?.getEchartsInstance()?.getOption(),
    }),
    [option]
  );

  return (
    <ReactECharts
      ref={chartRef}
      option={option}
      style={{ width: "100%", height: 360 }}
      notMerge
      lazyUpdate
    />
  );
});

export default ChartPreview;
