import { Button, IconButton, TextField, Tooltip } from "@material-ui/core";
import { DeleteOutline, SearchOutlined } from "@material-ui/icons";
import { Table } from "antd";
import { useEffect, useState } from "react";
import "./reports.css";

const columns = [
  {
    title: "User ID",
    dataIndex: "user",
    key: "user",
  },
  {
    title: "Comment ID",
    dataIndex: "comment_id",
    key: "comment_id",
  },
  {
    title: "Report Type",
    dataIndex: "type",
    key: "type",
    sorter: {
      compare: (a, b) => {
        // a should come before b in the sorted order
        if (a.type < b.type) {
          return -1;
          // a should come after b in the sorted order
        } else if (a.type > b.type) {
          return 1;
          // and and b are the same
        } else {
          return 0;
        }
      },
    },
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
];

const DataTableReport = ({ reports, handleDialog }) => {
  const [data, setData] = useState([]);
  const [dataTemp, setDataTemp] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const temp = [];
    reports.forEach((item, i) => {
      temp.push({
        user: item.user_id,
        comment_id: item.comment_id,
        type: item.type,
        action: (
          <Button size="small" color="secondary" onClick={() => handleDialog(item.id)}>
            <DeleteOutline fontSize="small" /> Delete
          </Button>
        ),
      });

      if (i === reports.length - 1) {
        setData(temp);
        setDataTemp(temp);
      }
    });
  }, []);

  const searchData = (data) => {
    setSearch(data);
    const searching = dataTemp.filter(
      (item) =>
        item.type.toString().toLowerCase().includes(data.toString().toLowerCase()) ||
        item.user_id.toString().toLowerCase().includes(data.toString().toLowerCase()) ||
        item.comment_id.toString().toLowerCase().includes(data.toString().toLowerCase())
    );
    setData(searching);
  };

  return (
    <div>
      <TextField
        value={search}
        onChange={(e) => searchData(e.target.value)}
        id="outlined-basic"
        label="Search"
        variant="outlined"
        style={{ background: "white" }}
      />

      <Tooltip title="Search User">
        <IconButton aria-label="filter list">
          <SearchOutlined />
        </IconButton>
      </Tooltip>
      <div style={{ margin: 40 }}>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
};

export default DataTableReport;
