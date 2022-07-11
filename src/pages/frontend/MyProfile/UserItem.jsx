import { useQuery } from "@apollo/client";
import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import { Fragment } from "react";
import { getUser } from "../../../graphql/queries/users";

export default function UserItem({ id }) {
  const { data: userData } = useQuery(getUser, {
    variables: { id: id },
  });

  return (
    <ListItem key={id} alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt="User Profile Image" src={userData?.getUser.profile_image || "/static/images/avatar/1.jpg"} />
      </ListItemAvatar>
      <ListItemText
        primary={userData?.getUser.name}
        secondary={
          <Fragment>
            <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
              @{userData?.getUser.name}
            </Typography>
          </Fragment>
        }
      />
    </ListItem>
  );
}
