import { useQuery } from "@apollo/client";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import { Avatar } from "antd";
import moment from "moment";
import { useState } from "react";
import InfiniteLoader from "react-infinite-loader";
import { Link } from "react-router-dom";
import { getFollowingCrawledData } from "../../../graphql/queries/crawler";
import { getFollowingPosts } from "../../../graphql/queries/posts";
import { abbreviateNumber } from "../../../utils/NumberConvert";

function Videos() {
  const [page, setPage] = useState(0);
  const crawledData = useQuery(getFollowingCrawledData(), { variables: { page_no: 0, search: "" } });
  const { data, error, loading, fetchMore } = useQuery(getFollowingPosts(), { variables: { page_no: 0, search: "" } });
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    setLoadingMore(true);
    setPage(page + 1);
    fetchMore({
      variables: { page_no: page + 1, search: "" },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult.getFollowingPosts.length || fetchMoreResult.getFollowingPosts.length < 20) {
          setHasMore(false);
        }

        fetchMoreResult.getFollowingPosts = [...prevResult.getFollowingPosts, ...fetchMoreResult.getFollowingPosts];

        setLoadingMore(false);
        return fetchMoreResult;
      },
    });
  };

  const returnData = (item) => {
    return (
      <Grid key={item.id} item lg={3} md={4} sm={6} xs={12}>
        <Link to={`/post/${item.url.split("https://www.youtube.com/embed/")[1]}`}>
          {/* <Thumbnail item={item} /> */}
          <img src={item.thumbnail_url} alt="" />
          <Box>
            <Typography style={{ fontWeight: 600 }} gutterBottom variant="body1" color="textPrimary">
              {item.title}
            </Typography>

            <Typography display="block" variant="body2" color="textSecondary">
              <Avatar shape="rounded" size={32} src={item.channel_id ? item.channel_id.thumbnail_image_url : ""} />{" "}
              {item.channel_id ? item.channel_id.title : ""}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {`${abbreviateNumber(item.view_count)} views • ${moment(parseInt(item.created_at)).fromNow()}`}
            </Typography>
          </Box>
        </Link>
      </Grid>
    );
  };

  return (
    <div>
      {loading || crawledData.loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      ) : null}
      <Grid container spacing={4}>
        {!error && data && data.getFollowingPosts
          ? data.getFollowingPosts.map((item, index) => returnData(item))
          : null}
        {hasMore ? (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            {!loadingMore && !error && data && data.getFollowingPosts && data.getFollowingPosts.length >= 20 ? (
              <InfiniteLoader onVisited={loadMore} />
            ) : loadingMore ? (
              <CircularProgress />
            ) : null}
          </div>
        ) : null}

        {!crawledData.error && crawledData.data && crawledData.data.getFollowingCrawledData
          ? crawledData.data.getFollowingCrawledData.map((item, index) =>
              data && data.getFollowingPosts && !data.getFollowingPosts.find((item1) => item1.url === item.url)
                ? returnData(item)
                : null
            )
          : null}
      </Grid>
    </div>
  );
}

export default Videos;
