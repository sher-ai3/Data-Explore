import DataVisual from "./DataVisual/DataVisual";
import { Tabs, Modal, Button } from "antd";
import { useState, useRef, useMemo, useEffect } from "react";
import type { TableColumnsType } from "antd";
import InnerTable from "./Table/Table";
import ReactECharts from "echarts-for-react";
const data = [
  ["2025-01-01", 120, 35, "手机", "上海市·浦东新区", "张伟（销售部·高级顾问）"],
  ["2025-01-02", 125, 42, "手机", "北京市·朝阳区", "李娜（华北大区·经理）"],
  ["2025-01-03", 130, 50, "手机", "广东省·深圳市", "王强（销售部·顾问）"],
  ["2025-01-04", 118, 38, "手机", "浙江省·杭州市", "赵敏（华东大区·副经理）"],
  ["2025-01-05", 122, 45, "手机", "江苏省·苏州市", "陈晨（销售部·专员）"],
  ["2025-01-06", 128, 55, "手机", "四川省·成都市", "刘洋（西南大区·经理）"],
  ["2025-01-07", 115, 32, "手机", "湖北省·武汉市", "黄磊（销售部·顾问）"],
  ["2025-01-08", 123, 39, "手机", "河南省·郑州市", "马琳（华中大区·专员）"],
  ["2025-01-09", 127, 48, "手机", "安徽省·合肥市", "徐峰（华东·顾问）"],
  ["2025-01-10", 119, 33, "手机", "广西壮族自治区·南宁市", "何静（华南大区·主管）"],
  ["2025-01-11", 132, 58, "手机", "云南省·昆明市", "郭阳（西南·高级顾问）"],
  ["2025-01-12", 126, 44, "手机", "河北省·石家庄市", "宋佳（华北·专员）"],
  ["2025-01-08", 200, 70, "笔记本电脑", "湖南省·长沙市", "周婷（华中大区·主管）"],
  ["2025-01-09", 210, 85, "笔记本电脑", "福建省·厦门市", "孙浩（销售部·顾问）"],
  ["2025-01-10", 220, 95, "笔记本电脑", "重庆市·渝中区", "董洁（西南大区·顾问）"],
  ["2025-01-11", 195, 65, "笔记本电脑", "天津市·和平区", "吴迪（华北·专员）"],
  ["2025-01-12", 205, 78, "笔记本电脑", "陕西省·西安市", "郑爽（西北大区·经理）"],
  ["2025-01-13", 215, 92, "笔记本电脑", "辽宁省·沈阳市", "高飞（东北大区·主管）"],
  ["2025-01-14", 190, 60, "笔记本电脑", "山东省·青岛市", "林涛（华东·顾问）"],
  ["2025-01-15", 208, 82, "笔记本电脑", "江西省·南昌市", "罗丹（华中·顾问）"],
  ["2025-01-16", 225, 105, "笔记本电脑", "广东省·广州市", "谢鹏（华南大区·经理）"],
  ["2025-01-17", 198, 68, "笔记本电脑", "山西省·太原市", "韩梅（华北·主管）"],
  ["2025-01-18", 212, 88, "笔记本电脑", "贵州省·贵阳市", "冯磊（西南·专员）"],
  ["2025-01-19", 202, 75, "笔记本电脑", "黑龙江省·哈尔滨市", "崔健（东北·高级顾问）"]
];


const schema = [
  { name: "订单日期", type: "DateTime" },
  { name: "交易金额", type: "Number" },
  { name: "购买数量", type: "Number" },
  { name: "商品类别", type: "Text" },
  { name: "销售地区", type: "Text" },
  { name: "负责人", type: "Text" }
]


const cols = schema.map((col) => col.name)
const dataset = [cols, ...data]
const columns: TableColumnsType = cols.map((col) => {
  const field = schema.find(s => s.name === col);
  const fieldType = field?.type;
  return {
    title: col,
    dataIndex: col,
    key: col,
    sorter: (a, b) => {
      const va = a[col];
      const vb = b[col];
      if (!isNaN(va) && !isNaN(vb)) {
        return va - vb;
      }
      return String(va).localeCompare(String(vb));
    },
    render: (value: any) => {
      if (fieldType === "Boolean") {
        return value ? "true" : "false";
      }
      return value ?? "";
    },
  };
});

const dataSource = data.map((row, index) => {
  const obj = Object.fromEntries(cols.map((col, i) => [col, row[i]]));
  return { key: index, ...obj };
});
type ChartBag = { values: any; option: any; type: string };





export default function DataExplore({ Height = 350 }: {
  Height?: number,
}) {
  const [charts, setCharts] = useState<Record<string, ChartBag>>({});
  const [activeKey, setActiveKey] = useState("0");

  // 新建弹窗
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 编辑弹窗
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  // 用于生成唯一 key
  const idRef = useRef(1);

  // DataVisual 的 ref（新建）
  const createRef = useRef<any>(null);
  // DataVisual 的 ref（编辑）
  const editRef = useRef<any>(null);

  // 基础的表格 Tab
  const baseTab = useMemo(
    () => [
      {
        label: "TABLE",
        key: "0",
        children: <InnerTable columns={columns} datasource={dataSource} schema={schema} Height={Height} />,
        closable: false,
      },
    ],
    []
  );

  const tabItems = useMemo(() => {
    const chartTabs = Object.entries(charts).map(([k, bag]) => ({
      label: `CHART${k}`,
      key: k,
      children: (
        <>
          <ReactECharts
            key={`chart-${k}`}
            option={{ ...bag.option }}
            notMerge
            lazyUpdate
            style={{ height: 360, maxWidth: 1200, margin: "auto" }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              onClick={() => {
                setEditingKey(k);
                setEditModalOpen(true);
              }}
            >
              Edit Visualization
            </Button>
          </div>
        </>
      ),
      closable: true,
    }));
    return [...baseTab, ...chartTabs];
  }, [charts, baseTab]);



  const onEdit = (targetKey: string | any, action: "add" | "remove") => {
    if (action === "add") setIsModalOpen(true);
    if (action === "remove") removeTab(String(targetKey));
  };

  // 删除 Tab：清 charts + 修正 activeKey
  function removeTab(targetKey: string) {
    setCharts((prev) => {
      const { [targetKey]: _, ...rest } = prev;
      return rest;
    });
  }

  // 当 charts 变化且当前 activeKey 不存在时，自动回退
  useEffect(() => {
    if (activeKey === "0") return;
    if (!charts[activeKey]) {
      const keys = Object.keys(charts);
      setActiveKey(keys[keys.length - 1] ?? "0");
    }
  }, [charts, activeKey]);


  const handleOkCreate = () => {
    const values = createRef.current?.SaveValues();
    const option = createRef.current?.getOption();
    const type = createRef.current?.getType()

    const k = String(idRef.current++);
    setCharts((prev) => ({ ...prev, [k]: { values, option, type } }));
    setActiveKey(k);

    setIsModalOpen(false);
    createRef.current?.reset();
  };

  const handleOkEdit = () => {
    if (!editingKey) return;
    const values = editRef.current?.SaveValues?.();
    const option = editRef.current?.getOption?.();
    const type = editRef.current?.getType?.() ?? "line";


    setCharts((prev) => ({
      ...prev,
      [editingKey]: { values, option, type },
    }));
    setEditModalOpen(false);
  };

  return (
    <>
      <Tabs
        type="editable-card"
        items={tabItems}
        activeKey={activeKey}
        onChange={setActiveKey}
        onEdit={onEdit as any}
      />

      <Modal
        title="Visualization Editor"
        open={isModalOpen}
        onOk={handleOkCreate}
        onCancel={() => {
          setIsModalOpen(false);
          createRef.current?.reset?.();
        }}
        width={Math.min(window.innerWidth * 0.9, 1100)}
        style={{ padding: 0, top: 15 }}
      >
        <DataVisual ref={createRef} dataset={dataset} Schema={schema} />
      </Modal>
      <Modal
        title={`Editor - CHART${editingKey ?? ""}`}
        open={editModalOpen}
        onOk={handleOkEdit}
        onCancel={() => setEditModalOpen(false)}
        width={Math.min(window.innerWidth * 0.9, 1100)}
        style={{ padding: 0, top: 6 }}
      >
        <DataVisual
          Schema={schema}
          dataset={dataset}
          ref={editRef}
          initialValues={editingKey ? charts[editingKey]?.values : undefined}
          initialType={editingKey ? charts[editingKey]?.type : "line"}
        />
      </Modal>
    </>
  );
}
