import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { DeleteOutline, DetailsOutlined } from "@material-ui/icons";
import { List } from "antd";
import YouTube from "react-youtube";
import { abbreviateNumber } from "../../../utils/NumberConvert";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export default function ThumbnailsPosts({ posts, handleDialog, showModal }) {
  const classes = useStyles();
  const opts = {
    height: "140",
    width: "auto",
    playerVars: {
      autoplay: 0,
    },
  };

  const _onReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 10,
      }}
      dataSource={posts}
      footer={null}
      renderItem={(item) => (
        <div className="dib v-top ma3">
          <Card className={classes.root} style={{ textAlign: "left" }}>
            <CardActionArea>
              {item.type === "image" ? (
                <CardMedia component="img" alt="" height="140" image={item.thumbnail_url} title={item.title} />
              ) : (
                <YouTube
                  videoId={item.url && item.url.split("/")[item.url.split("/").length - 1]}
                  opts={opts}
                  onReady={_onReady}
                />
              )}
              <CardContent>
                <Typography gutterBottom variant="p" component="p"></Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Type: {item.type}
                  <div style={{ marginTop: 10 }}>{abbreviateNumber(item.view_count)} views</div>
                  <div>{abbreviateNumber(item.like_count)} likes</div>
                  <div>{abbreviateNumber(item.dislike_count)} dislikes</div>
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions style={{ justifyContent: "center" }}>
              <Button size="small" color="primary" onClick={() => showModal(item)}>
                <DetailsOutlined fontSize="small" /> Details
              </Button>
              <Button size="small" color="secondary" onClick={() => handleDialog(item.id)}>
                <DeleteOutline fontSize="small" /> Delete
              </Button>
            </CardActions>
          </Card>
        </div>
      )}
    />
  );
}
