import { Table, Dropdown, Popover, Input, Checkbox, Space, Button, Tooltip, } from "antd";
import { useMemo, useState } from "react";
import type { TableColumnsType, TableColumnType } from "antd";
import { SearchOutlined, MoreOutlined, PushpinOutlined, PushpinFilled, AlignLeftOutlined, FieldStringOutlined, FieldBinaryOutlined, ScheduleOutlined ,CheckOutlined} from "@ant-design/icons";
type Row = Record<string, any>;
export default function InnerTable({
    columns,
    datasource,
    schema,
    Height,
    
}: {
    columns: TableColumnsType<Row>;
    datasource: { key: number;[k: string]: any }[];
    schema: Array<Record<string,string>>
    Height?:string | number | undefined

}) {
    const [keyword, setKeyword] = useState("");
    const [pinnedKeys, setPinnedKeys] = useState<string[]>([]);

    const allLeafKeys = useMemo(
        () => (columns as TableColumnType<Row>[]).map(c => String(c.key)),
        [columns]
    );
    // 可见列：默认全可见
    const [visibleKeys, setVisibleKeys] = useState<string[]>(allLeafKeys);

    // —— Pin/Unpin
    const togglePin = (colKey: string) => {
        setPinnedKeys(prev =>
            prev.includes(colKey) ? prev.filter(k => k !== colKey) : [...prev, colKey]
        );
    };

    // —— 显隐列
    const toggleVisible = (colKey: string) => {
        setVisibleKeys(prev =>
            prev.includes(colKey) ? prev.filter(k => k !== colKey) : [...prev, colKey]
        );
    };

    // —— 头部菜单
    const buildHeaderMenuItems = (_colKey: string, _colTitle: string, isPinned: boolean) => [
        { key: "copy", label: "复制列名" },
        {
            key: "format",
            label: "格式",
            children: [
                { key: "format:none", label: "None" },
                { key: "format:url", label: "URL" },
            ]
        },

        { type: "divider" as const },
        { key: "pin", label: isPinned ? "取消PIN列" : "Pin列" },
    ];

    // —— 列选择器（搜索 + 勾选 + Pin）
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerSearch, setPickerSearch] = useState("");

    const filteredForPicker = useMemo(() => {
        const kw = pickerSearch.trim().toLowerCase();
        const colList = (columns as TableColumnType<Row>[]).map(c => ({
            key: String(c.key ?? c.dataIndex),
            title: String(c.title ?? c.key ?? c.dataIndex),
        }));
        if (!kw) return colList;
        return colList.filter(c => c.title.toLowerCase().includes(kw));
    }, [columns, pickerSearch]);

    const ColumnPicker = (
        <div style={{ width: 280 }}>
            <Input
                placeholder="Search for column"
                prefix={<SearchOutlined />}
                value={pickerSearch}
                onChange={e => setPickerSearch(e.target.value)}
                style={{ marginBottom: 8 }}
                allowClear
            />
            <div style={{ maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
                {filteredForPicker.map(({ key, title }) => {
                    const pinned = pinnedKeys.includes(key);
                    const checked = visibleKeys.includes(key);
                    return (
                        <div
                            key={key}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "6px 4px",
                                borderRadius: 6,
                            }}
                        >
                            <Checkbox
                                checked={checked}
                                onChange={() => toggleVisible(key)}
                                style={{ marginRight: 8 }}
                            />
                            <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {title}
                            </div>
                            <Tooltip title={pinned ? "Unpin" : "Pin"}>
                                <Button
                                    type="text"
                                    icon={pinned ? <PushpinFilled /> : <PushpinOutlined />}
                                    onClick={() => togglePin(key)}
                                />
                            </Tooltip>
                        </div>
                    );
                })}
            </div>
            <Space style={{ marginTop: 8 }}>
                <Button size="small" onClick={() => setVisibleKeys(allLeafKeys)}>Select all</Button>
                <Button size="small" onClick={() => setVisibleKeys([])}>Clear</Button>
                <Button
                    size="small"
                    onClick={() => {
                        setPinnedKeys([]);
                    }}
                >
                    Clear pins
                </Button>
            </Space>
        </div>
    );
    const SearchContent = (
        <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索"
            style={{ marginBottom: 0, padding: "4px 8px" }}
        />
    )

    const Tablecolumns = useMemo(() => {
        const leafCols = (columns as TableColumnType<Row>[]).map((c) => {
            const colKey = String(c.key);
            const isPinned = pinnedKeys.includes(colKey);
            const uniqueValues = Array.from(new Set(datasource.map(row => row[c.dataIndex as any])))
            return {
                ...c,
                fixed: isPinned ? "left" : undefined,
                filters: uniqueValues.map(v => ({ text: String(v), value: v })),
                onFilter: (value: any, record: Row) => record[c.dataIndex as any] == value,
                title: (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
                            {(() => {
                                const type = schema.find(it=>it.name === c.dataIndex)?.type
                                return type === "DateTime" ?
                                    <Tooltip title="DateTime">
                                        < ScheduleOutlined />
                                    </Tooltip> :
                                    type === "Number" ?
                                        <Tooltip title="Number">
                                            <FieldBinaryOutlined />
                                        </Tooltip>
                                        :type ==="Text"?
                                        <Tooltip title="Text">
                                            <FieldStringOutlined />

                                        </Tooltip>:
                                        <Tooltip title="Boolean">
                                            <CheckOutlined />
                                        </Tooltip>

                            })()}
                            {String(c.title)}
                        </div>


                        <Dropdown
                            trigger={["click"]}
                            placement="bottomRight"
                            menu={{
                                items: buildHeaderMenuItems(colKey, String(c.title), isPinned),
                                onClick: async ({ key, domEvent }) => {
                                    domEvent.stopPropagation();
                                    if (key === "copy") {
                                        navigator.clipboard.writeText(String(c.title));
                                    }
                                    if (key === "pin") {
                                        togglePin(colKey);
                                    }
                                },
                            }}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <MoreOutlined />
                            </a>
                        </Dropdown>
                    </div>
                ),
            } as TableColumnType<Row>;
        });
        let shown = leafCols.filter(c => visibleKeys.includes(String(c.key ?? c.dataIndex)));
        const orderMap = new Map(pinnedKeys.map((k, i) => [k, i]));
        shown.sort((a, b) => {
            const ak = String(a.key ?? a.dataIndex);
            const bk = String(b.key ?? b.dataIndex);
            const ai = orderMap.has(ak) ? (orderMap.get(ak) as number) : Infinity;
            const bi = orderMap.has(bk) ? (orderMap.get(bk) as number) : Infinity;
            return ai - bi;
        });

        return shown;
    }, [columns, datasource, pinnedKeys, visibleKeys]);

const filteredData = useMemo(() => {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return datasource;

  // 只在当前显示的列里搜索
  const searchFields = Tablecolumns.map(
    c => String(c.dataIndex)
  );

  return datasource.filter(row =>
    searchFields.some(field => {
      const v = row[field];
      return v != null && String(v).toLowerCase().includes(kw);
    })
  );
}, [datasource, keyword, Tablecolumns]);



        const csv = useMemo(() => {
            const header = Tablecolumns.map(c => c.dataIndex).join(",");
            const body = filteredData
                .map(row => Tablecolumns.map(c => row[c.dataIndex as any]).join(","))
                .join("\n");
            return `${header}\n${body}`;
        }, [Tablecolumns, filteredData]);

        const handleDownload = () => {
             const blob = new Blob(
    ["\uFEFF" + csv],
    { type: "text/csv;charset=utf-8;" }
  );
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "table_data.csv";
            a.click();
            URL.revokeObjectURL(url);
        };
        return (
            <>
                <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
                    <Popover
                        arrow={false}
                        open={pickerOpen}
                        onOpenChange={setPickerOpen}
                        trigger="click"
                        placement="bottomRight"
                        content={ColumnPicker}
                    >
                        <Button icon={<AlignLeftOutlined />} />
                    </Popover>
                    <Popover
                        arrow={false}
                        placement="left"
                        trigger="click"
                        content={SearchContent}
                    >
                        <Button icon={<SearchOutlined />}></Button>
                    </Popover>
                    <Button onClick={handleDownload}>
                        导出 CSV
                    </Button>
                </div>

                <Table
                    columns={Tablecolumns as TableColumnsType<Row>}
                    dataSource={filteredData as any}
                    size="small"
                    pagination={false}
                    sticky
                    showSorterTooltip={false}
                    scroll={ {y:Height,  x: "max-content"}}
                   
                />
            </>
        );
    }
