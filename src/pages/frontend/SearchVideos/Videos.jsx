import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import { Avatar } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { youtube_api } from "../../../utils/Api";
import { errorMessage } from "../../../utils/message";
import { abbreviateNumber } from "../../../utils/NumberConvert";

let keys = [
  process.env.REACT_APP_YOUTUBE_API_KEY_1,
  process.env.REACT_APP_YOUTUBE_API_KEY_2,
  process.env.REACT_APP_YOUTUBE_API_KEY_3,
  process.env.REACT_APP_YOUTUBE_API_KEY_4,
  process.env.REACT_APP_YOUTUBE_API_KEY_5,
];

function Videos() {
  const search = new URLSearchParams(useLocation().search).get("search");
  // const { data, error, loading, fetchMore } = useQuery(getPosts(), { variables: { page_no: 0, search } })
  const [loadingMore, setLoadingMore] = useState(true);
  const [searchedData, setSearchedData] = useState([]);
  const [index, setIndex] = useState(0);

  const searchFromYoutubeAPI = async (key) => {
    let arr = [];

    setLoadingMore(true);

    try {
      console.log(key);
      const res = await axios.get(
        `${youtube_api}/search?part=snippet,id&q=${search}&key=${key}&type=video&maxResults=100`
      );

      res.data.items.forEach(async (item, i) => {
        try {
          const videoDataRes = await axios.get(
            `${youtube_api}/videos?part=statistics,contentDetails&id=${item.id.videoId}&key=${key}`
          );
          const channelDataRes = await axios.get(
            `${youtube_api}/channels?part=snippet&id=${item.snippet.channelId}&key=${key}`
          );
          arr.push({
            videoId: item.id.videoId,
            snippet: item.snippet,
            statistics: videoDataRes.data.items[0].statistics,
            details: videoDataRes.data.items[0].contentDetails,
            channelImg: channelDataRes.data.items[0].snippet.thumbnails.default.url,
          });
          if (i === res.data.items.length - 1) {
            setSearchedData(arr);
            setLoadingMore(false);
          }
        } catch (err) {
          if (i === res.data.items.length - 1) {
            if (!err.toString().includes("403")) {
              setLoadingMore(false);
            } else {
              searchFromYoutubeAPI(keys[index + 1]);
              setIndex(index + 1);
            }
          }
          console.log(err.toString());
        }
      });
    } catch (err) {
      if (!err.toString().includes("403")) {
        setLoadingMore(false);
      } else {
        searchFromYoutubeAPI(keys[index + 1]);
        setIndex(index + 1);
      }
      errorMessage(err.toString());
    }
  };

  useEffect(() => {
    searchFromYoutubeAPI(keys[index]);
  }, [search]);

  return (
    <div>
      {loadingMore ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      ) : null}
      <Grid container spacing={4}>
        {searchedData.map((item, index) => (
          <Grid key={item.videoId} item lg={3} md={4} sm={6} xs={12}>
            <Link to={`/post/${item.videoId}`}>
              {/* <Thumbnail item={item} /> */}
              <img
                src={item.snippet.thumbnails.medium.url}
                alt=""
                style={{ height: item.snippet.thumbnails.medium.height, width: item.snippet.thumbnails.medium.width }}
              />
              <Box>
                <Typography style={{ fontWeight: 600 }} gutterBottom variant="body1" color="textPrimary">
                  {item.snippet.title}
                </Typography>

                <Typography display="block" variant="body2" color="textSecondary">
                  <Avatar shape="rounded" size={32} src={item.channelImg} /> {item.snippet.channelTitle}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {`${abbreviateNumber(item.statistics.viewCount)} views • ${moment(
                    item.snippet.publishedAt
                  ).fromNow()}`}
                </Typography>
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Videos;
