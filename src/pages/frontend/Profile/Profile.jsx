import { useMutation, useQuery } from "@apollo/client";
import { Button, CircularProgress } from "@material-ui/core";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams, withRouter } from "react-router-dom";
import { updateViewCount, userFollow } from "../../../graphql/mutations/users";
import { getPostsByUser } from "../../../graphql/queries/posts";
import { getUser } from "../../../graphql/queries/users";
import profile_im from "../../../images/profile.png";
import { getError } from "../../../utils/error";
import { abbreviateNumber } from "../../../utils/NumberConvert";
import { getFromStorage } from "../../../utils/storage";

const Profile = ({ history }) => {
  const { id } = useParams();
  const { data, error, loading, refetch } = useQuery(getUser, { variables: { id } });
  const posts = useQuery(getPostsByUser, { variables: { id } });
  const [loading1, setLoading1] = useState(false);
  const [sumLikes, setSumLikes] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [followUsers, resp] = useMutation(userFollow);
  const [updateViewCounts, re] = useMutation(updateViewCount);

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

  const updateUserView = async () => {
    try {
      const resp = await updateViewCounts({ variables: { id } });
      console.log(resp);
      refetch({ id });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    updateUserView();
  }, []);

  // if (!getFromStorage("user_token")) {
  //     return <Redirect to="/login" />
  // }

  return (
    <div>
      <div className="root" style={{ margin: 0 }}>
        <menu style={{ textAlign: "center" }}>
          {loading && !data ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <CircularProgress />
            </div>
          ) : (
            <h2 style={{ textAlign: "center" }}>Profile</h2>
          )}
          {error ? <div style={{ textAlign: "center", marginTop: "20px", fontSize: "22px" }}>Error !</div> : null}

          {!loading ? (
            <div>
              <br />
              <img
                alt="profile"
                src={data && data.getUser && data.getUser.profile_image ? data.getUser.profile_image : profile_im}
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
              <br />
              <br />
              <h4>@{data && data.getUser && data.getUser.name}</h4>
              <div style={{ marginLeft: "15%", marginRight: "15%", textAlign: "center" }}>
                <Row align="middle" justify="center">
                  <Col style={{ margin: 10 }}>
                    <strong style={{ fontSize: "16px" }}>
                      {data && data.getUser && abbreviateNumber(data.getUser.following.length)}
                    </strong>
                    <br />
                    <span style={{ color: "silver" }}>Following</span>
                  </Col>
                  <Col style={{ margin: 10 }}>
                    <strong style={{ fontSize: "16px" }}>
                      {data && data.getUser && abbreviateNumber(data.getUser.followers.length)}
                    </strong>
                    <br />
                    <span style={{ color: "silver" }}>Followers</span>
                  </Col>
                  <Col style={{ margin: 10 }}>
                    <strong style={{ fontSize: "16px" }}>{data && data.getUser && abbreviateNumber(sumLikes)}</strong>
                    <br />
                    <span style={{ color: "silver" }}>Likes</span>
                  </Col>
                  <Col style={{ margin: 10 }}>
                    <strong style={{ fontSize: "16px" }}>
                      {data && data.getUser && data.getUser.view_count ? abbreviateNumber(data.getUser.view_count) : 0}
                    </strong>
                    <br />
                    <span style={{ color: "silver" }}>Views</span>
                  </Col>
                </Row>
              </div>

              {data && data.getUser && data.getUser.followers.includes(getFromStorage("user_id")) ? (
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
                  {posts.data ? (
                    posts.data.getPostsByUser.map((post, i) => (
                      <Col key={i.toString()} span={8} id={post.id}>
                        {post.type === "image" ? (
                          <img src={post.url} alt="" height={"auto"} width={"auto"} />
                        ) : (
                          <ReactPlayer url={post.url} height={"auto"} width={"auto"} />
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
      </div>
    </div>
  );
};

export default withRouter(Profile);
