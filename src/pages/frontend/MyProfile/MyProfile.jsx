import { EllipsisOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, List, Tab, Tabs, Typography } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import { Col, Dropdown, Menu, Row } from "antd";
import { useState } from "react";
import ReactPlayer from "react-player";
import { Redirect, useParams, withRouter } from "react-router-dom";
import { deleteComment } from "../../../graphql/mutations/comments";
import { userFollow } from "../../../graphql/mutations/users";
import { getCommentsByUser } from "../../../graphql/queries/comments";
import { getPostsByUser } from "../../../graphql/queries/posts";
import { getCurrentUser } from "../../../graphql/queries/users";
import profile_im from "../../../images/profile.png";
import { getError } from "../../../utils/error";
import { successMessage } from "../../../utils/message";
import { abbreviateNumber } from "../../../utils/NumberConvert";
import { getFromStorage } from "../../../utils/storage";
import UserItem from "./UserItem";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`follow-tabpanel-${index}`}
      aria-labelledby={`follow-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{ padding: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `follow-tab-${index}`,
    "aria-controls": `follow-tabpanel-${index}`,
  };
}

const MyProfile = ({ history }) => {
  const { id } = useParams();
  const { data, error, loading } = useQuery(getCurrentUser());
  const posts = useQuery(getPostsByUser, {
    variables: { id: getFromStorage("user_id") ? getFromStorage("user_id") : getFromStorage("admin_id") },
  });
  const [loading1, setLoading1] = useState(false);
  const [sumLikes, setSumLikes] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [followUsers] = useMutation(userFollow);
  const [delComment] = useMutation(deleteComment);
  const comments = useQuery(getCommentsByUser, {
    variables: { id: getFromStorage("user_id") ? getFromStorage("user_id") : getFromStorage("admin_id") },
  });

  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!getFromStorage("user_token")) {
    return <Redirect to="/login" />;
  }

  if (posts.data && !loading1) {
    let sum1 = 0;
    posts.data.getPostsByUser.forEach((post) => {
      sum1 = sum1 + post.like_count;
    });
    setSumLikes(sum1);
    setLoading1(true);
  }

  //Follow user of post
  const followUser = async () => {
    if (getFromStorage("user_token")) {
      setFollowLoading(true);
      try {
        const res = await followUsers({ variables: { id } });
        console.log(res.data);
        setFollowLoading(false);
      } catch (err) {
        console.log(err);
        getError(err);
        setFollowLoading(false);
      }
    } else {
      history.push("/login");
    }
  };

  //delete comment
  const deleteComent = async (id) => {
    try {
      const res = await delComment({ variables: { id } });
      comments.refetch({ id: getFromStorage("user_id") ? getFromStorage("user_id") : getFromStorage("admin_id") });
      successMessage("Comment Deleted Successfully");
    } catch (err) {
      console.log(err);
      getError(err);
    }
  };

  //Menu for comment
  const menu = (id) => (
    <Menu>
      <Menu.Item onClick={() => deleteComent(id)}>
        <span>Delete</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <div className="root" style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: 0 }}>
        <menu style={{ textAlign: "center" }}>
          {loading && !data ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <CircularProgress />
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <h2 style={{ margin: 0 }}>Profile </h2>
              <SettingsIcon
                style={{ fontSize: 16, cursor: "pointer" }}
                onClick={() => {
                  history.push("/profile_settings");
                }}
              />
            </div>
          )}
          {error ? <div style={{ textAlign: "center", marginTop: "20px", fontSize: "22px" }}>Error !</div> : null}

          {!loading ? (
            <div>
              <br />
              <img
                alt="profile"
                src={
                  data && !data.getCurrentUser.profile_image ? profile_im : data && data.getCurrentUser.profile_image
                }
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
              <br />
              <br />
              <h4>@{data && data.getCurrentUser.name}</h4>
              <div style={{ marginLeft: "15%", marginRight: "15%", textAlign: "center" }}>
                <Row align="middle" justify="center">
                  <Col style={{ margin: 10 }}>
                    <strong style={{ fontSize: "16px" }}>
                      {data && abbreviateNumber(data.getCurrentUser.following.length)}
                    </strong>
                    <br />
                    <span style={{ color: "silver" }}>Following</span>
                  </Col>
                  <Col style={{ margin: 10 }}>
                    <strong style={{ fontSize: "16px" }}>
                      {data && abbreviateNumber(data.getCurrentUser.followers.length)}
                    </strong>
                    <br />
                    <span style={{ color: "silver" }}>Followers</span>
                  </Col>
                  <Col style={{ margin: 10 }}>
                    <strong style={{ fontSize: "16px" }}>{data && abbreviateNumber(sumLikes)}</strong>
                    <br />
                    <span style={{ color: "silver" }}>Likes</span>
                  </Col>
                  <Col style={{ margin: 10 }}>
                    <strong style={{ fontSize: "16px" }}>
                      {data && data.getCurrentUser.view_count ? abbreviateNumber(data.getCurrentUser.view_count) : 0}
                    </strong>
                    <br />
                    <span style={{ color: "silver" }}>Views</span>
                  </Col>
                </Row>
              </div>

              {data && data.getCurrentUser && data.getCurrentUser.followers.includes(getFromStorage("user_id")) ? (
                <Button
                  variant="outlined"
                  disabled={followLoading}
                  onClick={followUser}
                  color="primary"
                  size="medium"
                  style={{ textTransform: "none" }}
                >
                  Unfollow
                </Button>
              ) : (
                <Button
                  variant="contained"
                  disabled={followLoading}
                  onClick={followUser}
                  color="primary"
                  size="medium"
                  style={{ textTransform: "none" }}
                >
                  Follow
                </Button>
              )}

              <div style={{ marginLeft: "15%", marginRight: "15%" }}>
                <Row gutter={[8, 8]} align="middle" justify="center" style={{ margin: 10 }}>
                  {comments.data ? (
                    comments.data.getCommentsByUser.map((comment, i) => (
                      <Col key={i.toString()} span={8} id={comment.id}>
                        {comment.type === "image" ? (
                          <img src={comment.url} alt="" height={"auto"} width={"100%"} />
                        ) : (
                          <>
                            <div
                              style={{
                                position: "absolute",
                                top: "0px",
                                right: "0px",
                                color: "white",
                                background: "rgba(0,0,0,0.7)",
                                zIndex: 999,
                              }}
                            >
                              <Dropdown overlay={() => menu(comment.id)} placement="bottomCenter" arrow>
                                <EllipsisOutlined style={{ fontSize: "20px", color: "white", cursor: "pointer" }} />
                              </Dropdown>
                            </div>
                            <ReactPlayer url={comment.url} height={"auto"} width={"100%"} controls />
                          </>
                        )}
                      </Col>
                    ))
                  ) : (
                    <div>
                      <CircularProgress />
                    </div>
                  )}
                </Row>
              </div>
            </div>
          ) : null}
        </menu>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Following" {...a11yProps(0)} />
              <Tab label="Followers" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
              {data?.getCurrentUser?.following?.map((id) => {
                return <UserItem key={`flwing-${id}`} id={id} />;
              })}
            </List>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
              {data?.getCurrentUser?.followers?.map((id) => {
                return <UserItem key={`flwer-${id}`} id={id} />;
              })}
            </List>
          </TabPanel>
        </Box>
      </div>
    </div>
  );
};

export default withRouter(MyProfile);
