import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { DeleteOutline, DetailsOutlined } from "@material-ui/icons";
import { List } from "antd";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export default function ThumbnailsPosts({ channels, handleDialog, showModal }) {
  const classes = useStyles();

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
      dataSource={channels}
      footer={null}
      renderItem={(item) => (
        <div className="dib v-top ma3">
          <Link to={`/admin/posts/${item.id}`}>
            <Card key={item.id} className={classes.root} style={{ textAlign: "left" }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt={item.title}
                  height="140"
                  image={item.thumbnail_image_url}
                  title={item.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item.title}
                  </Typography>
                  {/* <Typography variant="body2" color="textSecondary" component="p">
            {item.description}
          </Typography> */}
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
          </Link>
        </div>
      )}
    />
  );
}
