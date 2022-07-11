import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import ReactPlayer from "react-player";
import { getPosts } from "../../../graphql/queries/posts";
import { useQuery } from "@apollo/client";
import InfiniteLoader from "react-infinite-loader";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  gridList: {
    width: 500,
  },
}));

const tileData = [
  {
    url: "https://i.imgur.com/7QTYauD.jpg",
    title: "video",
    type: "image",
    author: "author",
    cols: 2,
  },
  {
    url: "https://i.imgur.com/7QTYauD.jpg",
    title: "Image",
    type: "image",
    author: "author",
    cols: 1,
  },
  {
    url: "https://i.imgur.com/7QTYauD.jpg",
    title: "Image",
    type: "image",
    author: "author",
    cols: 1,
  },
  {
    url: "https://i.imgur.com/7QTYauD.jpg",
    title: "video",
    type: "video",
    author: "author",
    cols: 2,
  },
  {
    url: "https://i.imgur.com/7QTYauD.jpg",
    title: "Image",
    type: "image",
    author: "author",
    cols: 1,
  },
];

export default function ImageGridList({ posts }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const { data, error, loading, fetchMore } = useQuery(getPosts(), {
    variables: { page_no: 0, search: "", posted_as: "self" },
  });
  const [load, setLoad] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    setLoadingMore(true);
    setPage(page + 1);
    fetchMore({
      variables: { page_no: page + 1, posted_as: "self", search: "" },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult.getPosts.length || fetchMoreResult.getPosts.length < 20) {
          setHasMore(false);
        }

        fetchMoreResult.getPosts = [...prevResult.getPosts, ...fetchMoreResult.getPosts];

        setLoadingMore(false);
        return fetchMoreResult;
      },
    });
  };

  return (
    <div>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      ) : null}
      <div className={classes.root}>
        <GridList cellHeight={"auto"} className={classes.gridList} cols={3}>
          {!error && data
            ? data.getPosts.map((item) => (
                <GridListTile key={item.url} cols={item.type === "video" ? 2 : 1} style={{ cursor: "pointer" }}>
                  {item.type === "image" ? (
                    <div>
                      <Link to={`/post/${item.id}`}>
                        <img src={item.url} alt={item.title} style={{ height: "auto", width: "100%" }} />
                      </Link>
                    </div>
                  ) : item.type === "video" ? (
                    <div>
                      <Link to={`/post/${item.id}`}>
                        <ReactPlayer url={item.url} height={"auto"} width="100%" />
                      </Link>
                    </div>
                  ) : null}
                </GridListTile>
              ))
            : null}
        </GridList>
      </div>
      {hasMore ? (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          {loadingMore && !error && data ? <InfiniteLoader onVisited={loadMore} /> : null}
        </div>
      ) : null}
    </div>
  );
}
