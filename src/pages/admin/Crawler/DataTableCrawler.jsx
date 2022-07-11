// import React, { useEffect, useState } from 'react';
// import "./posts.css"
//
// import { Button } from '@material-ui/core';
// import { DeleteOutline } from '@material-ui/icons';
// import { Table } from 'antd';
// import moment from 'moment';
// import { abbreviateNumber } from '../../../utils/NumberConvert';

// const columns = [
//     {
//         title: 'Type',
//         dataIndex: 'type',
//         key: 'type',
//         sorter: {
//             compare: (a, b) => {
//                 // a should come before b in the sorted order
//                 if (a.type < b.type) {
//                     return -1;
//                     // a should come after b in the sorted order
//                 } else if (a.type > b.type) {
//                     return 1;
//                     // and and b are the same
//                 } else {
//                     return 0;
//                 }
//             }
//         },
//     },
//     {
//         title: 'Total Posts',
//         dataIndex: 'total_posts',
//         key: 'total_posts',
//         sorter: {
//             compare: (a, b) => {
//                 // a should come before b in the sorted order
//                 if (a.total_posts < b.total_posts) {
//                     return -1;
//                     // a should come after b in the sorted order
//                 } else if (a.total_posts > b.total_posts) {
//                     return 1;
//                     // and and b are the same
//                 } else {
//                     return 0;
//                 }
//             }
//         },
//     },
//     {
//         title: 'Created At',
//         dataIndex: 'created_at',
//         key: 'created_at',
//         sorter: {
//             compare: (a, b) => {
//                 // a should come before b in the sorted order
//                 if (a.created_at < b.created_at) {
//                     return -1;
//                     // a should come after b in the sorted order
//                 } else if (a.created_at > b.created_at) {
//                     return 1;
//                     // and and b are the same
//                 } else {
//                     return 0;
//                 }
//             }
//         },
//     },
//     {
//         title: 'Action',
//         dataIndex: 'action',
//         key: 'action',
//     },
// ];

// const DataTableCrawler = ({ crawlData, handleDialog }) => {
//     const [data, setData] = useState([])

//     useEffect(() => {
//         const temp = []
//         crawlData.forEach((item, i) => {
//             temp.push({
//                 type: item.type,
//                 total_posts: abbreviateNumber(item.total_posts),
//                 created_at: moment(parseInt(item.created_at)).format("DD/MM/YYYY hh:mm"),
//                 action: <Button size="small" color="secondary" onClick={() => handleDialog(item.id)}>
//                     <DeleteOutline fontSize="small" /> Delete
//                         </Button>
//             })

//             if(i === crawlData.length - 1) {
//                 setData(temp)
//             }
//         })
//     }, [])

//     return (
//         <div>
//             <div style={{ margin: 40, width: "100%" }}>
//                 <Table columns={columns} style={{width: "100%"}} dataSource={data}  />
//             </div>
//         </div>
//     )
// }

// export default DataTableCrawler;

import { Button, IconButton, TextField, Tooltip } from "@material-ui/core";
import { DeleteOutline, SearchOutlined } from "@material-ui/icons";
import { Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { abbreviateNumber } from "../../../utils/NumberConvert";
import "./posts.css";

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
  ,
  {
    title: "Published At",
    dataIndex: "last_updated",
    key: "last_updated",
    sorter: {
      compare: (a, b) => {
        // a should come before b in the sorted order
        if (a.last_updated < b.last_updated) {
          return -1;
          // a should come after b in the sorted order
        } else if (a.last_updated > b.last_updated) {
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

const DataTablePost = ({ crawlData, handleDialog }) => {
  const [data, setData] = useState([]);
  const [dataTemp, setDataTemp] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const temp = [];
    crawlData.forEach((item, i) => {
      temp.push({
        key: item.id,
        image: <img style={{ width: "auto" }} src={item.thumbnail_url} alt="" />,
        title: item.title,
        type: item.type,
        duration: item.duration,
        view_count: abbreviateNumber(item.view_count),
        like_count: abbreviateNumber(item.like_count),
        dislike_count: abbreviateNumber(item.dislike_count),
        created_at: moment(parseInt(item.last_updated)).format("DD/MM/YYYY hh:mm A"),
        last_updated: moment(parseInt(item.created_at)).format("DD/MM/YYYY hh:mm A"),
        action: (
          <Button size="small" color="secondary" onClick={() => handleDialog(item.id)}>
            <DeleteOutline fontSize="small" /> Delete
          </Button>
        ),
      });

      if (i === crawlData.length - 1) {
        setData(temp);
        setDataTemp(temp);
      }
    });
  }, [crawlData, handleDialog]);

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

export default DataTablePost;
