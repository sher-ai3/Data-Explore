export type Field = string;
export const VisualTypeList = [
    "bar", "line", "pie", "area", "histogram", "heatmap", "scatter", "bubble", "box", "combo",
    "cohort", "counter", "detailsView", "funnel", "map(Choropleth)", "map(Markers)",
    "pivotTable", "sankey", "sunburst", "table"
] as const;
export const StackingModeList = ["disable", "stack"] as const;
export const MaptilesList = ["OpenStreetMap", "OpenStreetMap BW", "OpenStreetMap DE", "OpenStreetMap FR", "OpenStreetMap Hot", "Thunderforest", "Thunderforest Spinal", "OpenMapSurfer", "Stamen Toner", "Stamen Toner Background", "Stamen Toner Lite", "OpenTopoMap"]
export const MissingAndNullValuesList = ["Convert to 0 and display in chart", "Do not display in chart"] as const
export const XScaleList = ["x_Automatic", "Datetime", "Linear", "Logarithmic", "Categorical"] as const;
export const YScaleList = ["y_Automatic", "Linear", "Logarithmic"] as const;
export const DirectionList = ["Counterclockwise", "Clockwise"] as const
export const BubbleSizeList = ["Diameter", "Area"] as const
export const LabelDirectionList = ["left", "right"] as const
export const TimeIntervalList = ["Daily", "Weekly", "Monthly"] as const
export const CohortModeList = ["Fill gaps with zero", "Show data as is"]
export const MapList = ["Countries", "USA", "JAPAN"]

export type VisualType = typeof VisualTypeList[number];
export type StackingMode = typeof StackingModeList[number];
export type MissingAndNullValuesMode = typeof MissingAndNullValuesList[number];
export type XScaleType = typeof XScaleList[number]
export type YScaleType = typeof YScaleList[number];
export type Direction = typeof DirectionList[number];
export type BubbleSizeMode = typeof BubbleSizeList[number];
export type LabelDirection = typeof LabelDirectionList[number];
export type TimeInterval = typeof TimeIntervalList[number];
export type CohortMode = typeof CohortModeList[number];
export type Maps = typeof MapList[number]
export type Maptiles = typeof MaptilesList[number]




/*  Se = Select
    Sw=Switch
    In=Input
    Nu=InputNumber
    Cp=ColorPicker

/*CHART_ General*/
export class Base_General {
    Se_Xcolumn: Field | null = null
    Se_Ycolumn: Field[] | null = null
}
export class Matrix_General {
    Cs_Xcolumn: string | null = null
    Cs_Ycolumn: string[] | null = null
    Se_Value_column: Field | null = null
}
export class Line_Bar_General extends Base_General {
    Sw_Horizontal_chart: boolean = false
    Se_stacking: StackingMode = "disable"
    // Se_errorColumn: Field | null = null
    // Sw_normalizeToPercent: boolean = false
    Se_MissingAndNullValues: MissingAndNullValuesMode = "Convert to 0 and display in chart"

}

export class Pie_General extends Base_General {
    Se_Direction: Direction = "Counterclockwise"
    Se_MissingAndNullValues: MissingAndNullValuesMode = "Convert to 0 and display in chart"
}
export class Histogram_General {
    Se_Xcolumn: Field | null = null
    Nu_Number_of_bins: number = 10
}
export class Heatmap_General {
    Se_Xcolumn: Field | null = null
    Se_Ycolumn: Field[] | null = null
    Se_Colorcolumn: Field[] | null = null
}

export class Bubble_General extends Base_General {
    Se_Bubble_size_column: Field | null = null
    In_Bubble_size_coefficient: number = 1
    Se_Bubble_size_proportional_to: BubbleSizeMode = "Diameter"
}
export class Box_General extends Base_General {
    Sw_Horizontal_chart: boolean = false
    Se_Show_all_points: boolean = false
    Se_MissingAndNullValues: MissingAndNullValuesMode = "Convert to 0 and display in chart"

}
export class Combo_General {
    Se_Xcolumn: Field | null = null
    Se_Ycolumn: Field[] | null = null
    Se_MissingAndNullValues: MissingAndNullValuesMode = "Convert to 0 and display in chart"
}

/*CHART_Xaxis (饼状图没有*/

export class Xaxis {
    Se_XScale: XScaleType = "x_Automatic"
    In_XName: string = ""
    Sw_Show_labels: boolean = false
    Sw_Hide_xaxis: boolean = false
}


/*CHART_Yaxis (饼状图没有*/
export class Yaxis {
    Se_YScale: YScaleType = "y_Automatic"
    In_YName: string = ""
    Sw_Hide_yaxis: boolean = false
}

export class Histogram_Yaxis {
    In_Name: string = ""
    Sw_Hide_axis: boolean = false
}

export class Heatmap_Yaxis extends Histogram_Yaxis {
    Sw_Sort_values: boolean = false
    Sw_Reverse_order: boolean = false
}
/*CHART_Series (饼状图没有*/
export class Series {
    // In_Lable:string=""
    Se_Yaxis: "left" | "right" = "left"

}
/*CHART_Colors*/
export class Colors {
    Cp_Colors: string[] = ["#077A9D"]
}
/*CHART_Data_labels*/
export class Data_labels {
    // In_Number_values_format: string = "0,0.[00000]"
    // In_Percent_values_format: string = "0[.]00%"
    // In_Datetime_values_format: string = "DD/MM/YYYY HH:mm"
    In_Data_labels: string = ""
}
export class pie_data_labels extends Data_labels {
    Sw_Show_percent: boolean = false
}
export class CohortColumns {
    Se_Date: Field | null = null
    Se_Stage: Field | null = null
    Se_Bucket_population_Size: Field | null = null
    Se_Stage_value: Field | null = null
}
export class Options {
    Se_Timeinterval: TimeInterval = "Daily"
    Se_Mode: string = "Fill gaps with zero"
}
export class CohortColors {
    Cp_Min_color: string = "#C4CCD6"
    Cp_Max_color: string = "#077A9D"
    Nu_Steps: number = 7
}
export class Appearance {
    In_timeColumnTitle: string = "Time";
    In_peopleColumnTitle: string = "Users";
    In_numberValuesFormat: string = "0,0.[00]";
    In_percentValuesFormat: string = "0.00%";
    In_noValuePlaceholder: string = "-";
    Sw_showTooltips: boolean = false;
    Sw_normalizeValuesToPercentage: boolean = false;
}

export class Counter_General {
    In_Label: string = ""
    Se_Value_column: Field | null = null
    Nu_Row1: number = 1
    Sw_Count_rows: boolean = false
    Se_Target_column: Field | null = null
    Nu_Row2: number = 1
}
export class Counter_Format {
    Nu_FormattingDecimalPlace: number = 0
    In_FormattingDecimalCharacter: string = "."
    In_FormattingThousandsSeparator: string = ","
    In_FormattingStringPrefix: string = ""
    In_FormattingStringSuffix: string = ""
    Sw_FormatTargetValue: boolean = false
}

export class Funnel_General {
    Se_Step_column: Field | null = null
    // In_Step_column_title: string = "Step"
    Se_Value_column: Field | null = null
    In_Value_column_title: string = "Value"
    // Sw_Custom_sorting: boolean = false
}

export class Funnel_Appearance {
    In_Number_values_format: string = "0,0.[00]"
    In_Percent_values_format: string = "0[.]00%"
    Nu_Items_count_limit: number = 100
    Nu_Min_percent_value: number = 0.01
    Nu_Max_percent_value: number = 1000
}





// ChartPreview 暴露的方法
export interface ChartPreviewHandle {
    /** 直接返回内存里最新的构建结果（更干净） */
    getOption: () => any;
    /** 从 echarts 实例读取（包含 run-time merge 后的完整配置） */
    getEchartsOption: () => any | undefined;
}

// DataVisual 暴露给 App 的方法
export interface DataVisualHandle {
    /** 透传下去，顶层直接拿就行 */
    getOption: () => any
    reset: () => any;
    SaveValues: () => any
}



// 中文映射

export const fieldLabelMap: Record<string, string> = {
    // ========== 通用 ==========
    Xcolumn: "X 列字段",
    Ycolumn: "Y 列字段",
    XName: "X 轴名称",
    YName: "Y 轴名称",
    Horizontal_chart: "水平展示",
    stacking: "堆叠方式",
    MissingAndNullValues: "缺失值处理",
    Direction: "方向",
    Show_labels: "显示标签",
    Hide_xaxis: "隐藏X轴",
    Hide_yaxis: "隐藏Y轴",
    Yaxis: "Y轴方向",
    Show_percent: "展示百分比",
    Data_labels: "数据标签",
    Value_column: "值",
    XScale: "X 轴刻度方式",
    YScale: "Y 轴刻度方式",
    AxisLabel: "轴标签",
    LabelDirection: "标签方向",
    smooth: "平滑曲线",
    step: "阶梯折线",
    barWidth: "柱条宽度",
    barGap: "柱间距",
    showLabels: "显示标签",
    labelPosition: "标签位置",
    labelFormatter: "标签格式化",
    colors: "颜色设置",
    Radius: "半径",
    InnerRadius: "内半径",
    roseType: "南丁格尔",
    gap: "间隔",
    sort: "排序方式",
    minSize: "最小尺寸",
    maxSize: "最大尺寸",
    min: "最小值",
    max: "最大值",
    minColor: "最小颜色",
    maxColor: "最大颜色",
};


export const optionLabelMap: Record<string, string> = {
    "disable": "不堆叠",
    "stack": "堆叠",
    "Convert to 0 and display in chart": "转换为 0 并在图表中显示",
    "Do not display in chart": "不显示在图表中",
    "x_Automatic": "自动",
    "Automatic": "自动",
    "Datetime": "时间轴",
    "Linear": "线性",
    "Logarithmic": "对数",
    "Categorical": "类目",
    y_Automatic: "自动",
    "Counterclockwise": "逆时针",
    "Clockwise": "顺时针",
    "left": "左",
    "right": "右"
};

