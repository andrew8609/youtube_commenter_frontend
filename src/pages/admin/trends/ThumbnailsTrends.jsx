import { Button } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { DeleteOutline } from "@material-ui/icons";
import { Fragment } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    textAlign: "center",
  },
  inline: {
    display: "inline",
  },
}));

export default function AlignItemsList(props) {
  const classes = useStyles();

  return (
    <List className={classes.root} style={{ cursor: "pointer", textAlign: "center" }}>
      <ListItem alignItems="flex-end">
        <ListItemAvatar>
          <img
            src="https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
            alt=""
            style={{ width: "200px" }}
          />
        </ListItemAvatar>
        <ListItemText
          primary="Brunch this weekend?"
          style={{ marginLeft: "20px" }}
          secondary={
            <Fragment>
              <Typography component="span" variant="body2" color="textPrimary">
                Ali Connors
              </Typography>
              {" — I'll be in your neighborhood doing errands this…"}
            </Fragment>
          }
        />
        <ListItemText
          primary=""
          style={{ marginLeft: "40px" }}
          secondary={
            <Fragment>
              <Button size="small" color="secondary" onClick={() => props.handleDialog(1)}>
                <DeleteOutline fontSize="small" /> Delete
              </Button>
            </Fragment>
          }
        />
      </ListItem>
    </List>
  );
}
