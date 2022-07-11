import { Avatar, Box, Button, Grid, Typography } from "@material-ui/core";
import { abbreviateNumber } from "../../../utils/NumberConvert";
import moment from "moment";

const Reaction = ({ posts }) => {
  return (
    <Grid container spacing={4}>
      <Grid item lg={4} md={6} sm={8} xs={12}>
        {/* <Thumbnail /> */}

        <Box>
          <Grid container spacing={4}>
            <Grid item lg={4} md={6} sm={8} xs={12}>
              <Typography display="block" variant="body2" color="textSecondary">
                <img
                  src="https://media.gettyimages.com/photos/mausoleum-of-pakistans-founder-mohammad-ali-jinnah-picture-id157611973?s=612x612"
                  style={{ width: "150px", height: "170px" }}
                  alt=""
                />
              </Typography>
            </Grid>
            <Grid item lg={6} md={4} sm={6} xs={12}>
              <Avatar style={{ height: "auto", width: "30px" }} />
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>Our Stupid Reaction</span>
              <Typography display="block" variant="body2" color="textSecondary" style={{ fontSize: "12px" }}>
                96k Subscribers
              </Typography>
              <br />
              <div style={{ fontSize: "14px" }}>Here is our reaction</div>
            </Grid>
          </Grid>
          <img
            src="https://media.gettyimages.com/photos/mausoleum-of-pakistans-founder-mohammad-ali-jinnah-picture-id157611973?s=612x612"
            style={{ width: "100%" }}
            alt=""
          />
          <Typography variant="body2" color="textSecondary">
            <img
              src="https://media.gettyimages.com/photos/mausoleum-of-pakistans-founder-mohammad-ali-jinnah-picture-id157611973?s=612x612"
              style={{ width: "80px" }}
              alt=""
            />{" "}
            <span style={{ marginRight: "2px" }}>
              {" "}
              {`${abbreviateNumber(4324325)} views • ${moment(parseInt(432432432432)).fromNow()}`}
            </span>
            <Button
              variant="contained"
              color="secondary"
              style={{ color: "white", textTransform: "none", float: "right", marginTop: "10px" }}
              size="small"
            >
              Follow
            </Button>
          </Typography>
        </Box>
      </Grid>
      <Grid item lg={4} md={6} sm={8} xs={12}>
        {/* <Thumbnail /> */}

        <Box>
          <Grid container spacing={4}>
            <Grid item lg={4} md={6} sm={8} xs={12}>
              <Typography display="block" variant="body2" color="textSecondary">
                <img
                  src="https://media.gettyimages.com/photos/mausoleum-of-pakistans-founder-mohammad-ali-jinnah-picture-id157611973?s=612x612"
                  style={{ width: "150px", height: "170px" }}
                  alt=""
                />
              </Typography>
            </Grid>
            <Grid item lg={6} md={4} sm={6} xs={12}>
              <Avatar style={{ height: "auto", width: "30px" }} />
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>Our Stupid Reaction</span>
              <Typography display="block" variant="body2" color="textSecondary" style={{ fontSize: "12px" }}>
                96k Subscribers
              </Typography>
              <br />
              <div style={{ fontSize: "14px" }}>Here is our reaction</div>
            </Grid>
          </Grid>
          <img
            src="https://media.gettyimages.com/photos/mausoleum-of-pakistans-founder-mohammad-ali-jinnah-picture-id157611973?s=612x612"
            style={{ width: "100%" }}
            alt=""
          />
          <Typography variant="body2" color="textSecondary">
            <img
              src="https://media.gettyimages.com/photos/mausoleum-of-pakistans-founder-mohammad-ali-jinnah-picture-id157611973?s=612x612"
              style={{ width: "80px" }}
              alt=""
            />{" "}
            <span style={{ marginRight: "2px" }}>
              {" "}
              {`${abbreviateNumber(4324325)} views • ${moment(parseInt(432432432432)).fromNow()}`}
            </span>
            <Button
              variant="contained"
              color="secondary"
              style={{ color: "white", textTransform: "none", float: "right", marginTop: "10px" }}
              size="small"
            >
              Follow
            </Button>
          </Typography>
        </Box>
      </Grid>
      <Grid item lg={4} md={6} sm={8} xs={12}>
        {/* <Thumbnail /> */}

        <Box>
          <Grid container spacing={4}>
            <Grid item lg={4} md={6} sm={8} xs={12}>
              <Typography display="block" variant="body2" color="textSecondary">
                <img
                  src="https://media.gettyimages.com/photos/mausoleum-of-pakistans-founder-mohammad-ali-jinnah-picture-id157611973?s=612x612"
                  style={{ width: "150px", height: "170px" }}
                  alt=""
                />
              </Typography>
            </Grid>
            <Grid item lg={6} md={4} sm={6} xs={12}>
              <Avatar style={{ height: "auto", width: "30px" }} />
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>Our Stupid Reaction</span>
              <Typography display="block" variant="body2" color="textSecondary" style={{ fontSize: "12px" }}>
                96k Subscribers
              </Typography>
              <br />
              <div style={{ fontSize: "14px" }}>Here is our reaction</div>
            </Grid>
          </Grid>
          <img
            src="https://media.gettyimages.com/photos/mausoleum-of-pakistans-founder-mohammad-ali-jinnah-picture-id157611973?s=612x612"
            style={{ width: "100%" }}
            alt=""
          />
          <Typography variant="body2" color="textSecondary">
            <img
              src="https://media.gettyimages.com/photos/mausoleum-of-pakistans-founder-mohammad-ali-jinnah-picture-id157611973?s=612x612"
              style={{ width: "80px" }}
              alt=""
            />{" "}
            <span style={{ marginRight: "2px" }}>
              {" "}
              {`${abbreviateNumber(4324325)} views • ${moment(parseInt(432432432432)).fromNow()}`}
            </span>
            <Button
              variant="contained"
              color="secondary"
              style={{ color: "white", textTransform: "none", float: "right", marginTop: "10px" }}
              size="small"
            >
              Follow
            </Button>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Reaction;
