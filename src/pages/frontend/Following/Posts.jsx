import { useQuery } from "@apollo/client";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import { Avatar } from "antd";
import moment from "moment";
import { useState } from "react";
import InfiniteLoader from "react-infinite-loader";
import ReactPlayer from "react-player";
import { getFollowingReactions } from "../../../graphql/queries/comments";
import { abbreviateNumber } from "../../../utils/NumberConvert";

const Reaction = () => {
  const [page, setPage] = useState(0);
  const { data, error, loading, fetchMore } = useQuery(getFollowingReactions(), { variables: { page_no: 0 } });
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    setLoadingMore(true);
    setPage(page + 1);
    fetchMore({
      variables: { page_no: page + 1 },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult.getFollowingReactions.length || fetchMoreResult.getFollowingReactions.length < 20) {
          setHasMore(false);
        }

        fetchMoreResult.getFollowingReactions = [
          ...prevResult.getFollowingReactions,
          ...fetchMoreResult.getFollowingReactions,
        ];

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
      <Grid container spacing={4}>
        {!error && data
          ? data.getFollowingReactions.map((item, index) => (
              <Grid item lg={4} md={6} sm={8} xs={12}>
                <Box>
                  <ReactPlayer
                    url={item.url}
                    width={"100%"}
                    style={{ width: "100px", height: "100px", margin: 10 }}
                    controls
                  />
                  <ReactPlayer
                    url={item.post_id ? item.post_id.url : ""}
                    width={"100%"}
                    controls
                    style={{ height: "100px", width: "100px", margin: 10 }}
                  />
                  <Box style={{ margin: 10 }}>
                    <Typography display="block" variant="body2" color="textSecondary">
                      <Avatar shape="rounded" size={32} src={item.post_id ? item.post_id.thumbnail_url : ""} />{" "}
                      <sapn style={{ fontSize: "18px", color: "black" }}>{item.post_id ? item.post_id.title : ""}</sapn>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {`${abbreviateNumber(item.post_id ? item.post_id.view_count : 0)} views • ${moment(
                        parseInt(item.post_id ? item.post_id.created_at : 12)
                      ).fromNow()}`}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))
          : null}
      </Grid>

      {hasMore ? (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          {!loadingMore && !error && data && data.getFollowingReactions.length ? (
            <InfiniteLoader onVisited={loadMore} />
          ) : !error && loadingMore && data && data.getFollowingReactions.length ? (
            <CircularProgress />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Reaction;
