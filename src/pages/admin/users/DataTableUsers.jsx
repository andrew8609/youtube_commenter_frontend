import { Button, IconButton, TextField, Tooltip } from "@material-ui/core";
import { DeleteOutline, SearchOutlined } from "@material-ui/icons";
import { Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import profile from "../../../images/profile.png";
import "./users.css";

const DataTableUser = ({ users, handleDialog }) => {
  const [data, setData] = useState([]);
  const [dataTemp, setDataTemp] = useState([]);
  const [search, setSearch] = useState("");
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: {
        compare: (a, b) => {
          // a should come before b in the sorted order
          if (a.name < b.name) {
            return -1;
            // a should come after b in the sorted order
          } else if (a.name > b.name) {
            return 1;
            // and and b are the same
          } else {
            return 0;
          }
        },
      },
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      sorter: {
        compare: (a, b) => {
          // a should come before b in the sorted order
          if (a.dob < b.dob) {
            return -1;
            // a should come after b in the sorted order
          } else if (a.dob > b.dob) {
            return 1;
            // and and b are the same
          } else {
            return 0;
          }
        },
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: {
        compare: (a, b) => {
          // a should come before b in the sorted order
          if (a.email < b.email) {
            return -1;
            // a should come after b in the sorted order
          } else if (a.email > b.email) {
            return 1;
            // and and b are the same
          } else {
            return 0;
          }
        },
      },
    },
    {
      title: "Activated",
      dataIndex: "is_activated",
      key: "is_activated",
      sorter: {
        compare: (a, b) => {
          // a should come before b in the sorted order
          if (a.is_activated < b.is_activated) {
            return -1;
            // a should come after b in the sorted order
          } else if (a.is_activated > b.is_activated) {
            return 1;
            // and and b are the same
          } else {
            return 0;
          }
        },
      },
    },
    {
      title: "Verified",
      dataIndex: "is_verified",
      key: "is_verified",
      sorter: {
        compare: (a, b) => {
          // a should come before b in the sorted order
          if (a.is_verified < b.is_verified) {
            return -1;
            // a should come after b in the sorted order
          } else if (a.is_verified > b.is_verified) {
            return 1;
            // and and b are the same
          } else {
            return 0;
          }
        },
      },
    },
    {
      title: "Last Signed IP",
      dataIndex: "last_signed_ip",
      key: "last_signed_ip",
      sorter: {
        compare: (a, b) => {
          // a should come before b in the sorted order
          if (a.last_signed_ip < b.last_signed_ip) {
            return -1;
            // a should come after b in the sorted order
          } else if (a.last_signed_ip > b.last_signed_ip) {
            return 1;
            // and and b are the same
          } else {
            return 0;
          }
        },
      },
    },
    {
      title: "Last SIgned Date",
      dataIndex: "last_signed_date",
      key: "last_signed_date",
      sorter: {
        compare: (a, b) => {
          // a should come before b in the sorted order
          if (a.last_signed_date < b.last_signed_date) {
            return -1;
            // a should come after b in the sorted order
          } else if (a.last_signed_date > b.last_signed_date) {
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

  function onChange(pagination, filters, sorter, extra) {
    console.log("params", filters);
  }

  const initializeData = () => {
    const temp = [];
    users.forEach((item, i) => {
      temp.push({
        key: i,
        image: (
          <img
            style={{ width: "auto" }}
            src={item.profile_image && item.profile_image.length ? item.profile_image : profile}
            alt=""
          />
        ),
        name: item.name,
        dob: item.dob,
        email: item.email,
        is_activated: item.is_activated ? "Yes" : "No",
        is_verified: item.is_verified ? "Yes" : "No",
        last_signed_ip: item.last_signed_ip,
        last_signed_date: moment(parseInt(item.last_signed_date)).format("DD/MM/YYYY hh:mm"),
        action: (
          <Button size="small" color="secondary" onClick={() => handleDialog(item.id)}>
            <DeleteOutline fontSize="small" /> Delete
          </Button>
        ),
      });

      if (i === users.length - 1) {
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
    const searching = dataTemp.filter(
      (item) =>
        item.name.toString().toLowerCase().includes(data.toString().toLowerCase()) ||
        item.email.toString().toLowerCase().includes(data.toString().toLowerCase())
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

export default DataTableUser;
