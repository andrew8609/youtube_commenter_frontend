import { useQuery } from "@apollo/client";
import { CircularProgress, Grid } from "@material-ui/core";
import { useState } from "react";
import InfiniteLoader from "react-infinite-loader";
import VideoItem from "../../../components/VideoItem";
import { getCrawledTrendingData } from "../../../graphql/queries/crawler";
import { getTrends } from "../../../graphql/queries/trends";

function Videos() {
  const { data, error, loading, fetchMore } = useQuery(getTrends(), {
    variables: { page_no: 0, search: "" },
  });
  const crawledData = useQuery(getCrawledTrendingData);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const loadMore = () => {
    setLoadingMore(true);
    setPage(page + 1);
    fetchMore({
      variables: { page_no: page + 1, search: "" },
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
      {loadingMore || loading || crawledData.loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      ) : null}
      <Grid container spacing={4}>
        {!error && data && data.getTrends
          ? data.getTrends.map((item, index) => {
              return <VideoItem key={item.url} item={item} />;
            })
          : null}
        {hasMore ? (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            {!loadingMore && !error && data && data.getTrends && data.getTrends.length >= 20 ? (
              <InfiniteLoader onVisited={loadMore} />
            ) : loadingMore ? (
              <CircularProgress />
            ) : null}
          </div>
        ) : null}
        {!crawledData.error && crawledData && crawledData.data && crawledData.data.getCrawledTrendingData
          ? crawledData.data.getCrawledTrendingData.map((item, index) =>
              !data.getTrends.find((item1) => item1.url === item.url) ? <VideoItem key={item.url} item={item} /> : null
            )
          : null}
      </Grid>
    </div>
  );
}

export default Videos;
