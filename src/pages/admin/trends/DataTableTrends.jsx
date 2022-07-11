import { useEffect, useState } from "react";
import "./trends.css";

import { Button, IconButton, TextField, Tooltip } from "@material-ui/core";
import { DeleteOutline, SearchOutlined } from "@material-ui/icons";
import { Table } from "antd";
import moment from "moment";

const columns = [
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    sorter: {
      compare: (a, b) => {
        // a should come before b in the sorted order
        if (a.title < b.title) {
          return -1;
          // a should come after b in the sorted order
        } else if (a.title > b.title) {
          return 1;
          // and and b are the same
        } else {
          return 0;
        }
      },
    },
  },
  {
    title: "Type",
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
    title: "Duration",
    dataIndex: "duration",
    key: "duration",
    sorter: {
      compare: (a, b) => {
        // a should come before b in the sorted order
        if (a.duration < b.duration) {
          return -1;
          // a should come after b in the sorted order
        } else if (a.duration > b.duration) {
          return 1;
          // and and b are the same
        } else {
          return 0;
        }
      },
    },
  },
  {
    title: "View Count",
    dataIndex: "view_count",
    key: "view_count",
    sorter: {
      compare: (a, b) => {
        // a should come before b in the sorted order
        if (a.view_count < b.view_count) {
          return -1;
          // a should come after b in the sorted order
        } else if (a.view_count > b.view_count) {
          return 1;
          // and and b are the same
        } else {
          return 0;
        }
      },
    },
  },
  {
    title: "Like Count",
    dataIndex: "like_count",
    key: "like_count",
    sorter: {
      compare: (a, b) => {
        // a should come before b in the sorted order
        if (a.like_count < b.like_count) {
          return -1;
          // a should come after b in the sorted order
        } else if (a.like_count > b.like_count) {
          return 1;
          // and and b are the same
        } else {
          return 0;
        }
      },
    },
  },
  {
    title: "Dislike Count",
    dataIndex: "dislike_count",
    key: "dislike_count",
    sorter: {
      compare: (a, b) => {
        // a should come before b in the sorted order
        if (a.dislike_count < b.dislike_count) {
          return -1;
          // a should come after b in the sorted order
        } else if (a.dislike_count > b.dislike_count) {
          return 1;
          // and and b are the same
        } else {
          return 0;
        }
      },
    },
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
    sorter: {
      compare: (a, b) => {
        // a should come before b in the sorted order
        if (a.created_at < b.created_at) {
          return -1;
          // a should come after b in the sorted order
        } else if (a.created_at > b.created_at) {
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

const DataTableTrend = ({ trends, handleDialog }) => {
  const [data, setData] = useState([]);
  const [dataTemp, setDataTemp] = useState([]);
  const [search, setSearch] = useState("");

  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
  }

  const initializeData = () => {
    const temp = [];
    trends.forEach((item, i) => {
      temp.push({
        image: <img style={{ width: "auto" }} src={item.thumbnail_url} alt="" />,
        title: item.title,
        type: item.type,
        duration: item.duration,
        view_count: item.view_count,
        like_count: item.like_count,
        dislike_count: item.dislike_count,
        created_at: moment(parseInt(item.created_at)).format("DD/MM/YYYY"),
        action: (
          <Button size="small" color="secondary" onClick={() => handleDialog(item.id)}>
            <DeleteOutline fontSize="small" /> Delete
          </Button>
        ),
      });

      if (i === trends.length - 1) {
        setData(temp);
        setDataTemp(temp);
      }
    });
  };

  useEffect(() => {
    initializeData();
  }, []);

  const searchData = (data) => {
    setSearch(data);
    const searching = dataTemp.filter((item) =>
      item.title.toString().toLowerCase().includes(data.toString().toLowerCase())
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
        <Table columns={columns} dataSource={data} onChange={onChange} />
      </div>
    </div>
  );
};

export default DataTableTrend;
