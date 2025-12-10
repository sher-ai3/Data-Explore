import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { Tabs, Select, Switch, Input, InputNumber, Form, ColorPicker, Tooltip, Cascader } from "antd";
import { FieldStringOutlined, FieldBinaryOutlined, ScheduleOutlined, CheckOutlined } from "@ant-design/icons";
import {
  Funnel_General, Funnel_Appearance, Matrix_General, Base_General,
  Line_Bar_General, Xaxis, XScaleList, StackingModeList, Pie_General, Yaxis, Series, Colors, Data_labels, MissingAndNullValuesList, YScaleList, LabelDirectionList, DirectionList, pie_data_labels
} from "../global";
import "./DataVisual.css";
import { buildOptionsMap } from "../buildoption";
import type { ChartPreviewHandle, DataVisualHandle } from "../global";
import { fieldLabelMap } from "../global";
import ChartPreview from "./ChartPreview ";

type Ctor = new () => Record<string, any>;
type Option = { label: any; value: string };

const Registry = {
  line: [
    { key: "general", label: "通用", ctor: Line_Bar_General as Ctor },
    { key: "xaxis", label: "X轴", ctor: Xaxis as Ctor },
    { key: "yaxis", label: "Y轴", ctor: Yaxis as Ctor },
    { key: "series", label: "系列", ctor: Series as Ctor },
    { key: "colors", label: "颜色", ctor: Colors as Ctor },
    { key: "Data_labels", label: "数据标签", ctor: Data_labels as Ctor },
  ],
  bar: [
    { key: "general", label: "通用", ctor: Line_Bar_General as Ctor },
    { key: "xaxis", label: "X轴", ctor: Xaxis as Ctor },
    { key: "yaxis", label: "Y轴", ctor: Yaxis as Ctor },
    { key: "series", label: "系列", ctor: Series as Ctor },
    { key: "colors", label: "颜色", ctor: Colors as Ctor },
    { key: "Data_labels", label: "数据标签", ctor: Data_labels as Ctor },
  ],
  pie: [
    { key: "general", label: "通用", ctor: Pie_General as Ctor },
    { key: "Data_labels", label: "数据标签", ctor: pie_data_labels as Ctor },
  ],
  funnel: [
    { key: "general", label: "通用", ctor: Funnel_General as Ctor },
    { key: "appearance", label: "外形", ctor: Funnel_Appearance as Ctor },
  ],
  matrix: [
    { key: "general", label: "通用", ctor: Matrix_General as Ctor },

  ],
  area: [
    { key: "general", label: "通用", ctor: Line_Bar_General as Ctor },
    { key: "xaxis", label: "X轴", ctor: Xaxis as Ctor },
    { key: "yaxis", label: "Y轴", ctor: Yaxis as Ctor },
    { key: "series", label: "系列", ctor: Series as Ctor },
    { key: "colors", label: "颜色", ctor: Colors as Ctor },
    { key: "Data_labels", label: "数据标签", ctor: Data_labels as Ctor },
  ],
  scatter: [
    { key: "general", label: "通用", ctor: Base_General as Ctor },
    { key: "xaxis", label: "X轴", ctor: Xaxis as Ctor },
    { key: "yaxis", label: "Y轴", ctor: Yaxis as Ctor },
    { key: "series", label: "系列", ctor: Series as Ctor },
    { key: "colors", label: "颜色", ctor: Colors as Ctor },
    { key: "Data_labels", label: "数据标签", ctor: Data_labels as Ctor },

  ],
} as Record<string, ReadonlyArray<{ key: string; label: string; ctor: Ctor }>>;

type ChartType = keyof typeof Registry;

interface DataVisualProps {
  initialValues?: any;
  initialType?: string;
  dataset: any;
  Schema: any
}
interface csOption {
  value: string | number;
  label: any;
  children?: csOption[];
  disableCheckbox?: boolean;
}
function getUniqueValuesFromDataset(dataset:any[][], fieldName:string) {
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

function AutoForm({
  ctor,
  schema,
  form,
  type,
  dataset
}: {
  form: any;
  ctor: Ctor;
  schema: Record<string, any>[];
  type: string;
  dataset: any[][];
}) {
  const instance = new ctor();
  const keys = Object.keys(instance);
  const isColorsPanel = ctor === Colors;
  const schemaArr = schema.map((col) => col.name)
  const yFields: string[] = Form.useWatch("Ycolumn", form) || [];
  const options: Option[] = schemaArr.map((col: string) => ({
    label: (
      <div>
        {(() => {
          const type = schema.find(it => it.name === col)?.type
          return type === "DateTime" ?
            <Tooltip title="DateTime">
              < ScheduleOutlined />
            </Tooltip> :
            type === "Number" ?
              <Tooltip title="Number">
                <FieldBinaryOutlined />
              </Tooltip>
              : type === "Text" ?
                <Tooltip title="Text">
                  <FieldStringOutlined />

                </Tooltip> :
                <Tooltip title="Boolean">
                  <CheckOutlined />
                </Tooltip>

        })()}
        <span style={{ marginLeft: 10 }}>{col}</span>
      </div>

    ), value: col
  }));
  const CsOptions: csOption[] = schemaArr.map((col: string) => ({
    label: (
      <div>
        {(() => {
          const type = schema.find(it => it.name === col)?.type
          return type === "DateTime" ?
            <Tooltip title="DateTime">
              < ScheduleOutlined />
            </Tooltip> :
            type === "Number" ?
              <Tooltip title="Number">
                <FieldBinaryOutlined />
              </Tooltip>
              : type === "Text" ?
                <Tooltip title="Text">
                  <FieldStringOutlined />

                </Tooltip> :
                <Tooltip title="Boolean">
                  <CheckOutlined />
                </Tooltip>

        })()}
        <span style={{ marginLeft: 10 }}>{col}</span>
      </div>

    ), value: col,
     children: getUniqueValuesFromDataset(dataset,col).map(item=>({
      label: item  as string,
      value: item as string,
     }))
    
  }));

  const OptionsMap = buildOptionsMap({
    XScale: XScaleList,
    YScale: YScaleList,
    stacking: StackingModeList,
    MissingAndNullValues: MissingAndNullValuesList,
    Yaxis: LabelDirectionList,
    Direction: DirectionList
  });

  const getOptions = (k: string) => (OptionsMap[k.slice(3)] ? OptionsMap[k.slice(3)] : options);

  const controlerMap: {
    regex: RegExp;
    render: (key: string) => React.ReactNode;
    itemProps?: (key: string) => Record<string, any>;
  }[] = [
      {
        regex: /^Se_/,
        render: (k) => (
          <Select
          allowClear
            options={getOptions(k)}
            mode={k.slice(3) === "Ycolumn" ? "multiple" : undefined}
          />
        ),
      },
      {
        regex: /^Cs_/,
        render: (_k) => (

          <Cascader
          style={{ width: '100%' }}
          maxTagCount="responsive"
           multiple
            options={CsOptions}
          />
        )
      },
      { regex: /^In_/, render: (_k) => <Input /> },
      { regex: /^Nu_/, render: (_k) => <InputNumber /> },
      { regex: /^Sw_/, render: (_k) => <Switch /> },
      {
        regex: /^Cp_/,
        render: (_k) => <ColorPicker />,
        itemProps: () => ({
          valuePropName: "value",
          getValueFromEvent: (v: any) => v?.toHexString?.() ?? v,
        }),
      },
    ];
  const getMatch = (key: string) => controlerMap.find((r) => r.regex.test(key));

  const value = form.getFieldValue("Xcolumn");
  const [header, ...data] = dataset;
  const index = header.indexOf(value);

  if (isColorsPanel) {
    return (
      <>
        {type === "pie" && index !== -1 ? (
          Array.from(new Set(data.map((v) => v[index]))).map((field) => (
            <Form.Item
              key={field}
              label={field}
              name={["colors", field]}
              valuePropName="value"
              getValueFromEvent={(v) => v.toHexString()}
              style={{ marginBottom: 12 }}
            >
              <ColorPicker />
            </Form.Item>
          ))
        ) : yFields.length === 0 ? (
          <div style={{ opacity: 0.6 }}>请选择  column 后设置颜色</div>
        ) : (
          yFields.map((field) => (
            <Form.Item
              key={field}
              label={field}
              name={["colors", field]}
              valuePropName="value"
              getValueFromEvent={(v) => v.toHexString()}
              style={{ marginBottom: 12 }}
            >
              <ColorPicker />
            </Form.Item>
          ))
        )}
      </>
    );
  }

  return (
    <>
      {keys.map((k) => {
        const name = k.slice(3);
        const m = getMatch(k);
        const extra = m?.itemProps?.(k) ?? {};
        const fieldDefault = (instance as any)[k];
        const label = fieldLabelMap[name] ?? name;
        return (
          <Form.Item
            key={k}
            label={label}
            name={name}
            initialValue={fieldDefault}
            {...extra}
          >
            {m?.render(k)}
          </Form.Item>
        );
      })}
    </>
  );

}

function buildInitialValuesForType(type: ChartType) {
  const panels = Registry[type];
  const merged: Record<string, any> = {};

  panels.forEach((p) => {
    const inst = new p.ctor();
    Object.keys(inst).forEach((k) => {
      const name = k.slice(3);
      if (merged[name] === undefined) {
        merged[name] = (inst as any)[k];
      }
    });
  });

  return merged;
}

const DataVisual = forwardRef<DataVisualHandle, DataVisualProps>(function DataVisual(
  { initialValues, initialType = "line", dataset, Schema },
  ref
) {

  const normalizeType = (t: string): ChartType =>
    (t as ChartType) in Registry ? (t as ChartType) : "line";

  const [form] = Form.useForm();

  // 当前图表类型（会随着 initialType / 下拉选择改变）
  const [type, setType] = useState<ChartType>(normalizeType(initialType));
  // 当前面板的所有表单值（驱动预览用）
  const [panelValues, setPanelValues] = useState<Record<string, any>>({});

  const previewRef = useRef<ChartPreviewHandle>(null);

  // 把“根据类型 + 初始值初始化表单”的逻辑封装一下
  const applyInit = (chartType: ChartType, values?: Record<string, any>) => {
    const defaults = buildInitialValuesForType(chartType);
    const merged = values ? { ...defaults, ...values } : defaults;
    form.resetFields();
    form.setFieldsValue(merged);
    setPanelValues(merged);
  };

  useEffect(() => {
    const nextType = normalizeType(initialType);
    setType(nextType);
    applyInit(nextType, initialValues);
  }, [initialType, initialValues, form]);


  const handleTypeChange = (nextTypeStr: string) => {
    const nextType = nextTypeStr as ChartType;
    const oldValues = form.getFieldsValue();
    const nextDefaults = buildInitialValuesForType(nextType);

    const merged = {
      ...nextDefaults,
      ...oldValues,
    };

    setType(nextType);
    form.setFieldsValue(merged);
    setPanelValues(merged);
  };

  // 监听表单变化，驱动预览
  const handleFormChange = (_changed: Record<string, any>, _all: Record<string, any>) => {
    setPanelValues(_all);
  };

  useImperativeHandle(
  ref,
  () => ({
    getOption: () => previewRef.current?.getOption?.(),
    getType: () => type,
    reset: () => {
      applyInit(type);
    },
    SaveValues: () => {
      const vals = form.getFieldsValue(true);
      console.log("[DataVisual] SaveValues -> form.getFieldsValue(true):", vals);
      // 也打印 keys 以便比对
      console.log("[DataVisual] SaveValues -> keys:", Object.keys(vals));
      return vals;
    },
  }),
  [form, type]
);

  return (
    <div className="main">
      <div className="left">
        <Select
          options={[
            { value: "line", label: "折线图" },
            { value: "bar", label: "柱状图" },
            { value: "pie", label: "饼状图" },
            { value: "funnel", label: "漏斗图" },
            { value: "matrix", label: "矩阵图" },
            { value: "area", label: "面积图" },
            { value: "scatter", label: "散点图" },
          ]}
          value={type}
          onChange={handleTypeChange}
          style={{ width: 220, marginBottom: 12 }}
        />

        <Form
          layout="vertical"
          form={form}
          onValuesChange={handleFormChange}
          preserve={false}
        >
          <Tabs
            items={Registry[type].map((p) => ({
              key: p.key,
              label: p.label,
              children: (
                <AutoForm
                  dataset={dataset}
                  type={type}
                  schema={Schema}
                  ctor={p.ctor}
                  form={form}
                />
              ),
            }))}
          />
        </Form>
      </div>

      <div className="right">
        <ChartPreview ref={previewRef} data={dataset} type={type} values={panelValues} />
      </div>
    </div>
  );
});


export default DataVisual;
