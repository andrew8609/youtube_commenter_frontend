import { useQuery } from "@apollo/client";
import { useState } from "react";
import "react-grid-layout/css/styles.css";
import { getCommentsByPostID } from "../../../graphql/queries/comments";

const Thumbnail = ({ item }) => {
  const [loading1, setLoading1] = useState(false);
  const res = useQuery(getCommentsByPostID, { variables: { id: item.id, page_no: 0 } });

  // layout is an array of objects
  const layout = [
    { i: "0", x: 0, y: 0, w: 1, h: 2, static: true },
    { i: "1", x: 1, y: 0, w: 1, h: 2, static: true },
    { i: "2", x: 2, y: 0, w: 1, h: 2, static: true },
    { i: "3", x: 3, y: 0, w: 1, h: 2, static: true },
    { i: "4", x: 4, y: 0, w: 1, h: 2, static: true },
    { i: "5", x: 5, y: 0, w: 1, h: 2, static: true },
    { i: "6", x: 6, y: 0, w: 1, h: 2, static: true },
    { i: "7", x: 6, y: 2, w: 1, h: 2, static: true },
    { i: "8", x: 6, y: 4, w: 1, h: 2, static: true },
    { i: "9", x: 6, y: 6, w: 1, h: 2, static: true },
    { i: "10", x: 0, y: 2, w: 1, h: 2, static: true },
    { i: "11", x: 0, y: 4, w: 1, h: 2, static: true },
    { i: "12", x: 0, y: 6, w: 1, h: 2, static: true },
    { i: "n", x: 1, y: 2, w: 5, h: 6, static: true },
  ];

  const [data, setData] = useState([]);

  if (res.loading) {
    return <div></div>;
  }

  if (!res.loading && res.data && !loading1) {
    setData(res.data.getCommentsByPostID);
    setLoading1(true);
  }

  return (
    <div>
      <img
        src={item.snippet.thumbnails.medium.url}
        alt=""
        style={{ height: item.snippet.thumbnails.medium.height, width: item.snippet.thumbnails.medium.width }}
      />
    </div>
  );
};

export default Thumbnail;
