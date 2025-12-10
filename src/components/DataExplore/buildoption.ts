
import * as echarts from 'echarts';
import { optionLabelMap } from "./global";

export type BuildOptionParams = {
    data: any[][];
    type: string;
    values: Record<string, any>;
};
export function buildEchartsOption({
    data,
    type,
    values,
}: BuildOptionParams): echarts.EChartsOption {
    const xField: string | undefined = values?.Xcolumn;
    const rawY = values?.Ycolumn;
    const Val = values?.Value_column;
    const yFields: string[] = Array.isArray(rawY) ? rawY : rawY ? [rawY] : [];
    const horizontal: boolean = !!values?.Horizontal_chart;
    const colorsMap: Record<string, string> = values?.colors || {};
    const stack: string | undefined =
        values?.stacking === "stack" ? "total" : undefined;
    const isPie = type === "pie";
    const isFunnel = type === "funnel";
    const isArea = type === "area";
    const isMatrix = type === "matrix";
    const isBox = type === "box"
    const pieDirection = values?.Direction;

    const connectNulls: boolean | undefined =
        type === "line"
            ? values?.MissingAndNullValues === "Do not display in chart"
                ? false
                : undefined
            : undefined;

    const xName = { name: values?.XName, nameLocation: "middle" as const };
    const yName = { name: values?.YName, nameLocation: "middle" as const };
    const xaxishide = { show: !values?.Hide_xaxis };
    const yaxishide = { show: !values?.Hide_yaxis };
    const Showlabels = { axisLabel: { show: values?.Show_labels } };
    const yPosition = { position: values?.Yaxis };

    const funnelNamecol: string | undefined = values?.Step_column;
    const funnelvalcol: string | undefined = values?.Value_column;

    const Data_labels = {
        label: {
            show: !!values?.Data_labels,
            formatter: values?.Data_labels || "{c}",
        },
    };

    const pieLabel = values?.Show_percent
        ? {
            label: {
                show: true,
                formatter: "{b}: {d}%",
            },
        }
        : Data_labels;

    const scaleMap: Record<string, any> = {
        x_Automatic: "category",
        y_Automatic: "value",
        Categorical: "category",
        Datetime: "time",
        Linear: "value",
        Logarithmic: "log",
    };

    const dimXAxisType = scaleMap[values?.XScale] ?? "category";
    const dimYAxisType = scaleMap[values?.YScale] ?? "value";


    function getUniqueValuesFromDataset(dataset: any[][], fieldName: string) {
        const headers = dataset[0];

        const index = headers.indexOf(fieldName);
        if (index === -1) return [];

        const set = new Set();

        for (let i = 1; i < dataset.length; i++) {
            const row = dataset[i];
            set.add(row[index]);
        }

        return [...set];
    }




    // 默认最终返回的 option
    let finalOption: echarts.EChartsOption = {};

    if (Object.keys(finalOption).length > 0) {
        return finalOption; // 错误情况统一在此 return
    }

    // 通用 base
    const base: echarts.EChartsOption = {
        dataset: { source: data },
        title: {
            text: values?.Value_column_title,
        },
        tooltip: {
            trigger: isPie || isFunnel ? "item" : "axis",
        },
        legend: {},
        ...(isPie || isFunnel
            ? {}
            : {
                grid: {
                    top: 40,
                    right: 20,
                    bottom: 40,
                    left: 50,
                    containLabel: true,
                },
            }),
    };

    const axisCommon = { axisLine: { show: true }, axisTick: { show: true } };

    const axes = horizontal
        ? {
            xAxis: {
                type: dimYAxisType,
                ...axisCommon,
                ...yName,
                ...yaxishide,
                ...yPosition,
            },
            yAxis: {
                type: dimXAxisType,
                ...axisCommon,
                ...xName,
                ...xaxishide,
                ...Showlabels,
            },
        }
        : {
            xAxis: {
                type: dimXAxisType,
                ...axisCommon,
                ...xName,
                ...xaxishide,
                ...Showlabels,
            },
            yAxis: {
                type: dimYAxisType,
                ...axisCommon,
                ...yName,
                ...yaxishide,
                ...yPosition,
            },
        };

    let series: any[] = [];

    // ---------------- PIE ----------------
    if (isPie) {
        series = [
            {
                type: "pie",
                name: xField,
                clockwise: pieDirection !== "Counterclockwise",
                encode: {
                    itemName: xField,
                    value: yFields[0],
                },
                radius: "50%",
                ...pieLabel,
            },
        ];

        finalOption = { ...base, series };
    }

    // ---------------- FUNNEL ----------------
    else if (isFunnel) {
        series = [
            {
                type: "funnel",
                name: funnelvalcol,
                encode: {
                    itemName: funnelNamecol,
                    value: funnelvalcol,
                },
                minSize: "0%",
                maxSize: "100%",
                gap: 2,
                sort: "descending",
                left: "10%",
                top: 20,
                bottom: 20,
                width: "80%",
                ...Data_labels,
            },
        ];

        finalOption = { ...base, series };
    }
    else if (isMatrix) {
        interface MatrixItem {
            value: string;
            children: string[];
        }

        interface Matrix {
            x: { data: MatrixItem[] };
            y: { data: MatrixItem[] };
        }


        function generateFilters(matrix: Matrix) {
            const filters: Record<string, string[]> = {};

            const processData = (data: MatrixItem[]) => {
                data.forEach(item => {
                    filters[item.value] = item.children;
                });
            };

            processData(matrix.x.data);
            processData(matrix.y.data);

            return filters;
        }
        const xField: string[][] = values?.Xcolumn ?? [];
        const yField: string[][] = values?.Ycolumn ?? []
        const matrix: Matrix = {
            x: { data: [] },
            y: { data: [] },
        };

        xField.forEach(it => {
            if (it.length === 1) {
                matrix.x.data.push({
                    value: it[0],
                    children: getUniqueValuesFromDataset(data, it[0]) as any
                });
            } else if (it.length === 2) {
                let target = matrix.x.data.find(item => item.value === it[0]);
                if (target) {
                    // 避免重复添加
                    if (!target.children.includes(it[1])) {
                        target.children.push(it[1]);
                    }
                } else {
                    matrix.x.data.push({
                        value: it[0],
                        children: [it[1]]
                    });
                }
            }
        });
        yField.forEach(it => {
            if (it.length === 1) {
                matrix.y.data.push({
                    value: it[0],
                    children: getUniqueValuesFromDataset(data, it[0]) as any
                });
            } else if (it.length === 2) {
                let target = matrix.y.data.find(item => item.value === it[0]);
                if (target) {
                    // 避免重复添加
                    if (!target.children.includes(it[1])) {
                        target.children.push(it[1]);
                    }
                } else {
                    matrix.y.data.push({
                        value: it[0],
                        children: [it[1]]
                    });
                }
            }
        });
        const filters = generateFilters(matrix);
        const keys = Object.keys(filters)
        const displayColumns = [...keys, Val]
        const header = data[0];
        const filterIndexes: Record<string, any> = {};
        for (const key in filters) {
            filterIndexes[key] = header.indexOf(key)
        }
        let filteredData = data.slice(1).filter(row => {
            return keys.every(key => filters[key].includes(row[filterIndexes[key]]));
        });
        const displayIndexes = displayColumns.map(col => header.indexOf(col));
        const seriesDatas = filteredData.map(row => displayIndexes.map(idx => row[idx]));


        const visualMap = {
            type: 'continuous',
            min: 0,
            max: 999,
            top: 'middle',
            dimension: 2,
            calculable: true
        };

        const series = {
            type: 'heatmap',
            coordinateSystem: 'matrix',
            data: seriesDatas,
            label: {
                show: true
            }
        };

        finalOption = {
            ...base,
            matrix: matrix as any,
            visualMap: visualMap as any,
            series: series as any
        };
    } else if (isBox) {
        
      //要计算groupby 引入相关函数方法 比较复杂 
    }

    // ---------------- LINE / BAR / AREA ----------------
    else {
        series = yFields.map((field) => ({
            type: isArea ? "line" : type,
            name: field,
            encode: horizontal ? { x: field, y: xField } : { x: xField, y: field },
            ...(colorsMap[field] ? { itemStyle: { color: colorsMap[field] } } : {}),
            emphasis: { focus: "series" as const },
            stack,
            ...Data_labels,
            ...(connectNulls !== undefined ? { connectNulls } : {}),
            ...(type === "area" ? { areaStyle: {} } : {}),
        }));

        finalOption = { ...base, ...axes, series };
    }

    // ------ 所有逻辑结束：统一 return ------
    return finalOption;
}







export function makeOptions(list: readonly string[]) {
    return list.map(item => ({
        label: optionLabelMap[item] ?? item,
        value: item,
    }));
}


export function buildOptionsMap(lists: Record<string, readonly string[]>) {
    const map: Record<string, { label: string; value: string }[]> = {};

    Object.keys(lists).forEach((key) => {
        map[key] = makeOptions(lists[key]);
    });

    return map;
}


