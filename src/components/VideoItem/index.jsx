import React, { useState, useEffect } from "react";
import axios from "axios";
import { youtube_api } from "../../utils/Api";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import moment from "moment";
import { Avatar } from "antd";
import { abbreviateNumber } from "../../utils/NumberConvert";
import { Link } from "react-router-dom";

const VideoItem = ({ item }) => {
  const [isAvailableUrl, setIsAvailableUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const id = `${item.url.split("https://www.youtube.com/embed/")[1]}`;
        const videoDataRes = await axios.get(
          `${youtube_api}/videos?part=statistics,contentDetails,snippet&id=${id}&key=${process.env.REACT_APP_YOUTUBE_API_KEY_1}`
        );
        setIsAvailableUrl(videoDataRes.data.items.length > 0);
        //setLoading(false);
      } catch (err) {
        //setLoading(false);
      }
    })();
  }, []);
  return (
    <>
      {loading ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {isAvailableUrl ? (
            <Grid key={item.id} item lg={3} md={4} sm={6} xs={12}>
              <Link
                to={`/post/${
                  item.url.split("https://www.youtube.com/embed/")[1]
                }`}
              >
                <img src={item.thumbnail_url} alt="" />
                <Box>
                  <Typography
                    style={{ fontWeight: 600 }}
                    gutterBottom
                    variant="body1"
                    color="textPrimary"
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    display="block"
                    variant="body2"
                    color="textSecondary"
                  >
                    <Avatar
                      shape="rounded"
                      size={32}
                      src={
                        item.channel_id
                          ? item.channel_id.thumbnail_image_url
                          : ""
                      }
                    />{" "}
                    {item.channel_id ? item.channel_id.title : ""}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {`${abbreviateNumber(item.view_count)} views • ${moment(
                      parseInt(item.created_at)
                    ).fromNow()}`}
                  </Typography>
                </Box>
              </Link>
            </Grid>
          ) : null}
        </>
      )}
    </>
  );
};
export default VideoItem;
