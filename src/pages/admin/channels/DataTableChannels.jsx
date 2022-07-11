import { useEffect, useState } from "react";
import "./channels.css";

import { Button, IconButton, TextField, Tooltip } from "@material-ui/core";
import { DeleteOutline, SearchOutlined } from "@material-ui/icons";
import { Table } from "antd";

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
    title: "Description",
    dataIndex: "description",
    key: "description",
    sorter: {
      compare: (a, b) => {
        // a should come before b in the sorted order
        if (a.description < b.description) {
          return -1;
          // a should come after b in the sorted order
        } else if (a.description > b.description) {
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

const DataTableChannel = ({ channels, handleDialog }) => {
  const [data, setData] = useState([]);
  const [dataTemp, setDataTemp] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const temp = [];
    channels.forEach((item, i) => {
      temp.push({
        image: <img style={{ width: "auto" }} src={item.thumbnail_image_url} alt="" />,
        title: item.title,
        description: item.description.split("\n").map((item1) => (
          <span>
            {item1}
            <br />
          </span>
        )),
        action: (
          <Button size="small" color="secondary" onClick={() => handleDialog(item.id)}>
            <DeleteOutline fontSize="small" /> Delete
          </Button>
        ),
      });

      if (i === channels.length - 1) {
        setData(temp);
        setDataTemp(temp);
      }
    });
  }, [channels, handleDialog]);

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
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
};

export default DataTableChannel;
