import { EllipsisOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, CircularProgress, Divider } from "@material-ui/core";
import {
  Mic,
  MicOff,
  SendRounded,
  ThumbDownAltOutlined,
  ThumbDownAltSharp,
  ThumbUpAltOutlined,
  ThumbUpAltSharp,
  Videocam,
  VideocamOff,
} from "@material-ui/icons";
import AgoraRTC from "agora-rtc-sdk";
import { Avatar, Dropdown, Input, Menu, Modal, Radio, Space } from "antd";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useParams, withRouter } from "react-router-dom";
import ScrollableFeed from "react-scrollable-feed";
import socketIOClient from "socket.io-client";
import { Cell, Grid } from "styled-css-grid";
import { likeOrDislikePost } from "../../../graphql/mutations/posts";
import { createReport } from "../../../graphql/mutations/reports";
import { userFollow } from "../../../graphql/mutations/users";
import { getCrawledPostByYoutubeId } from "../../../graphql/queries/crawler";
import { getPost, getPostByYoutubeId } from "../../../graphql/queries/posts";
import { getUser } from "../../../graphql/queries/users";
import profile_img from "../../../images/profile.png";
import { getError } from "../../../utils/error";
import { errorMessage, successMessage } from "../../../utils/message";
import { abbreviateNumber } from "../../../utils/NumberConvert";
import { getFromStorage } from "../../../utils/storage";
import "./canvas.css";

function LiveVideo({ history, setIsUserLive, isExit, setIsExit, setIsLiveMode }) {
  const { id } = useParams();
  const [clickedLoad, setClickedLoad] = useState(false);
  const idRes = useQuery(getPostByYoutubeId, { variables: { id } });
  const { data, error, loading, fetchMore } = useQuery(getPost, {
    variables: { id: idRes.data ? idRes.data.getPostByYoutubeId && idRes.data.getPostByYoutubeId.id : "" },
  });
  const userprofile = useQuery(getUser, { variables: { id: getFromStorage("user_id") } });
  const [likeOrUnlikePosts, response1] = useMutation(likeOrDislikePost);
  const crawlIdRes = useQuery(getCrawledPostByYoutubeId, { variables: { id } });
  const [followUsers, resp] = useMutation(userFollow);
  const [followLoading, setFollowLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [joinBtn, setJoinBtn] = useState(false);
  const channel = id;
  const videoProfile = "480p_4";
  const appId = process.env.REACT_APP_AGORA_APP_ID;
  const [uid, setUid] = useState(getFromStorage("user_id") ? getFromStorage("user_id") : null);
  const [client, setClient] = useState({});
  let localStream = {};
  const [localStreamm, setLocalStreamm] = useState({});
  const [camera, setCamera] = useState(true);
  const [mic, setMic] = useState(true);
  const [streamList, setStreamList] = useState([]);
  const [readyState, setReadyState] = useState(false);
  const [isViewer, setIsViewer] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [messages, setMessages] = useState([]);
  const [viewers, setViewers] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [reportUserIdValue, setReportUserIdValue] = useState("");
  const [reportVideo, reportResp] = useMutation(createReport);
  const [reportValue, setReportValue] = useState("");
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [isSendingReport, setIsSendingReport] = useState(false);
  const playerRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    // Creates a WebSocket connection
    socketRef.current = socketIOClient(process.env.REACT_APP_BACKEND_URL, { transports: ["websocket"], query: { id } });
    console.log(getFromStorage("user_id"));
    //Get duration
    socketRef.current.emit("getDuration", { isNew: true, id: getFromStorage("user_id") });

    // Listens for incoming messages
    socketRef.current.on("playStream", (data) => {
      console.log(data);
      if (data >= 3) setPlaying(true);
    });

    //Track live duration
    socketRef.current.on("trackLive", (data) => {
      if (data.duration - duration > 3 && playerRef.current) {
        playerRef.current.seekTo(data.duration);
      }
    });

    // Get Messages
    socketRef.current.on("getMessages", (data) => {
      setMessages([...data]);
    });

    //Get duration
    socketRef.current.on("getDuration", (duration) => {
      console.log(duration);
      const totalDuration = data && data.getPost ? moment.duration(data.getPost.duration).asSeconds() : 0;
      if (duration.duration >= totalDuration) {
        setIsEnd(true);
      }
    });

    //Get Viewers
    socketRef.current.on("getViewers", (data) => {
      setViewers(data);
    });

    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.disconnect();
    };
  }, [id]);

  //send message
  const sendMessage = () => {
    const messageData = {
      message,
      username: userprofile && userprofile.data ? userprofile.data.getUser.name.split(" ")[0] : "",
      profile_img: userprofile && userprofile.data ? userprofile.data.getUser.profile_image : profile_img,
      senderId: getFromStorage("user_id"),
    };
    socketRef.current.emit("sendMessage", messageData);
    setMessage("");
  };

  useEffect(() => {
    getVideoAudioPermission();
  }, []);

  //Get Video and Audio Allow Permission
  const getVideoAudioPermission = () => {
    if (navigator && navigator.getUserMedia) {
      navigator.getUserMedia(
        // constraints
        {
          video: true,
          audio: true,
        },

        // successCallback
        function (localMediaStream) {
          console.log("success");
          handleJoin("video");
          setIsUserLive(true);
        },

        // errorCallback
        function (err) {
          console.log(err.name);
          handleJoin("audience");
          setIsUserLive(true);
        }
      );
    } else {
      handleJoin("audience");
      setIsUserLive(true);
    }
  };

  //Join video call
  const handleJoin = (attendeeMode) => {
    if (getFromStorage("user_token")) {
      socketRef.current.emit("addViewer", {});
      if (attendeeMode === "video") {
        setIsViewer(false);
      } else {
        setIsViewer(true);
      }
      // init AgoraRTC local client
      if (!appId) {
        errorMessage("Agora AppId api require");
        setJoinBtn(false);
        return;
      }
      const clientt = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setClient(clientt);
      clientt.init(appId, () => {
        console.log("AgoraRTC client initialized");
        subscribeStreamEvents(clientt);

        clientt.join(appId, channel, uid, (uid) => {
          setUid(uid);
          console.log("User " + uid + " join channel successfully");
          console.log("At " + new Date().toLocaleTimeString());
          // create local stream
          // It is not recommended to setState in function addStream
          localStream = streamInit(uid, attendeeMode);
          setLocalStreamm(localStream);
          console.log(localStream);
          localStream.init(
            () => {
              if (attendeeMode !== "audience") {
                addStream(localStream, true);
                clientt.publish(localStream, (err) => {
                  console.log("Publish local stream error: " + err);
                });
              } else {
                console.log("abc");
              }

              setReadyState(true);
              setJoinBtn(false);
            },
            (err) => {
              console.log("getUserMedia failed", err);
              setJoinBtn(false);
              setReadyState(true);
              // errorMessage(err.info)
            }
          );
        });
      });
    } else {
      errorMessage("Login first");
    }
  };

  useEffect(() => {
    console.log(streamList);

    streamList.map((item, index) => {
      if (index < 12) {
        let element = document.querySelector(`#player_text_${index + 1}`);
        if (element) {
          element.parentNode.removeChild(element);
        }
        if (item.play) item.play("ag-item-" + index);
      }
    });
  });

  //Stream Init
  const streamInit = (uid, attendeeMode) => {
    let defaultConfig = {
      streamID: uid,
      audio: true,
      video: true,
      screen: false,
    };

    switch (attendeeMode) {
      case "audience":
        defaultConfig.video = false;
        defaultConfig.audio = false;
        break;
      default:
      case "video":
        break;
    }
    let stream = AgoraRTC.createStream(defaultConfig);
    stream.setVideoProfile(videoProfile);
    return stream;
  };

  //Subcribe stream events
  const subscribeStreamEvents = (clientt) => {
    clientt.on("stream-added", function (evt) {
      let stream = evt.stream;
      console.log("New stream added: " + stream.getId());
      console.log("At " + new Date().toLocaleTimeString());
      console.log("Subscribe ", stream);
      clientt.subscribe(stream, function (err) {
        console.log("Subscribe stream failed", err);
      });
    });

    clientt.on("peer-leave", function (evt) {
      console.log("Peer has left: " + evt.uid);
      console.log(new Date().toLocaleTimeString());
      console.log(evt);
      removeStream(evt.uid);
    });

    clientt.on("stream-subscribed", function (evt) {
      let stream = evt.stream;
      console.log("Got stream-subscribed event");
      console.log(new Date().toLocaleTimeString());
      console.log("Subscribe remote stream successfully: " + stream.getId());
      console.log(evt);
      addStream(stream, false);
    });

    clientt.on("stream-removed", function (evt) {
      let stream = evt.stream;
      console.log("Stream removed: " + stream.getId());
      console.log(new Date().toLocaleTimeString());
      console.log(evt);
      removeStream(stream.getId());
    });
  };

  //remove stream
  const removeStream = (uid) => {
    if (!isViewer) {
      streamList.forEach((item, index) => {
        console.log(item.getId(), uid);
        if (item.getId() === uid) {
          item.close();

          console.log("#player_" + item.player.id);
          let element = document.querySelector("#player_" + item.player.id);
          if (element) {
            element.parentNode.removeChild(element);
          }
        }

        if (streamList.length - 1 === index) {
          let tempList = streamList.filter((item) => item.getId() !== uid);
          console.log(streamList.filter((item) => item.getId() !== uid));
          setStreamList(streamList.filter((item) => item.getId() !== uid));
        }
      });
    } else {
      streamList.forEach((item, index) => {
        console.log("#player_" + item.player.id);
        let element = document.querySelector("#player_" + item.player.id);
        if (element) {
          element.parentNode.removeChild(element);
        }
        if (streamList.length - 1 === index) {
          setStreamList([]);
        }
      });
    }
  };

  //current user remove stream
  const currentRemoveStream = (uid) => {
    streamList.forEach((item, index) => {
      if (item.getId() === uid) {
        item.close();
      }
      console.log("#player_" + item.player.id);
      let element = document.querySelector("#player_" + item.player.id);
      if (element) {
        element.parentNode.removeChild(element);
      }
      if (streamList.length - 1 === index) {
        setStreamList([]);
      }
    });
  };

  //add stream
  const addStream = (stream, push) => {
    console.log(
      "Stream ID ",
      stream.getId(),
      "Stream List ID: ",
      streamList[0] && streamList[0].getId(),
      "Push: ",
      push
    );
    let repeatition = streamList.some((item) => {
      return item.getId() === stream.getId();
    });
    if (repeatition) {
      return;
    }
    if (streamList.length < 12) {
      const temp = streamList;
      console.log(stream);
      temp.push(stream);
      setStreamList([...temp]);
    }
    if (data && data.getPost) {
      console.log(streamList);
      socketRef.current.emit("playStream", {
        body: { streamList, duration: moment.duration(data.getPost.duration).asSeconds(), users: streamList.length },
        senderId: socketRef.current.id,
      });
    }
  };

  //Exit video
  const handleExit = () => {
    try {
      console.log(client);
      client && client.unpublish && client.unpublish(localStreamm);
      localStreamm && localStreamm.close && localStreamm.close();

      client &&
        client.leave &&
        client.leave(
          () => {
            removeStream(uid);
            currentRemoveStream(uid);
            console.log("Client succeed to leave.");
          },
          () => {
            console.log("Client failed to leave.");
          }
        );
    } finally {
      setReadyState(false);
      setClient({});
      setLocalStreamm({});
      localStream = {};
      setUid(null);
      if (getFromStorage("path")) {
        history.replace(getFromStorage("path"));
      } else {
        setIsExit(false);
        setIsUserLive(false);
        setIsLiveMode();
      }
    }
  };

  //Mic handler
  const handleMic = (isAudioOn) => {
    isAudioOn ? localStreamm && localStreamm.enableAudio() : localStreamm && localStreamm.disableAudio();

    setMic(isAudioOn);
  };

  //Camera Handler
  const handleCamera = (isVideoOn) => {
    isVideoOn ? localStreamm && localStreamm.enableVideo() : localStreamm && localStreamm.disableVideo();
    setCamera(isVideoOn);
  };

  //Function for progress player
  const likeOrUnlikePost = async (is_like, is_dislike, id) => {
    if (getFromStorage("user_token")) {
      setClickedLoad(true);
      try {
        console.log(is_like, is_dislike, id);
        const { data } = await likeOrUnlikePosts({
          variables: { id, liked_by: getFromStorage("user_id"), is_like, is_dislike },
        });
        console.log(data);
        setClickedLoad(false);
      } catch (err) {
        console.log(err);
        getError(err);
        setClickedLoad(false);
      }
    } else {
      history.push("/login");
    }
  };

  //Follow user of post
  const followUser = async (id) => {
    console.log(data);
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

  //Repost to admin
  const reportModalOpen = (user_id) => {
    setIsReportVisible(!isReportVisible);
    setReportUserIdValue(user_id);
  };

  //Report to Admin
  const sendReport = async () => {
    if (!getFromStorage("user_token")) {
      errorMessage("Login First");
    } else {
      if (reportValue.length !== 0) {
        setIsSendingReport(true);
        try {
          const { data, errors } = await reportVideo({
            variables: { type: reportValue, user_id: reportUserIdValue, comment_id: "" },
          });
          setIsSendingReport(false);
          setIsReportVisible(false);
          setReportValue("");
          setReportUserIdValue("");
          successMessage("Report to admin sent successfully");
        } catch (err) {
          errorMessage("Error In Sending Report");
        }
      } else {
        setIsSendingReport(false);
        errorMessage("Reporting Option Required");
      }
    }
  };

  //Menu for comment
  const menu = (index) => (
    <Menu>
      <Menu.Item>
        {streamList && streamList.length ? (
          <Link to={`/profile/${streamList[index] ? streamList[index].userId : ""}`}>Profile</Link>
        ) : (
          <span>Profile</span>
        )}
      </Menu.Item>
      <Menu.Item onClick={() => removeStream(streamList[index] ? streamList[index].userId : "")}>Remove</Menu.Item>

      <Menu.Item disabled={followLoading}>
        {data.getPost &&
        data.getPost.user_id &&
        data.getPost.user_id.followers &&
        data.getPost.user_id.followers.includes(getFromStorage("user_id")) ? (
          <span onClick={() => followUser(streamList[index].userId)}>Unfollow</span>
        ) : (
          <span onClick={() => followUser(streamList[index].userId)}>Follow</span>
        )}
      </Menu.Item>

      <Menu.Item onClick={() => reportModalOpen(streamList[index] ? streamList[index].userId : "")}>Report</Menu.Item>
    </Menu>
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ marginLeft: 6, marginRight: 6 }}>
      <>
        <Modal title="Confirmation" visible={isExit} onOk={handleExit} onCancel={() => setIsExit(false)}>
          <p>Are you sure to leave live stream?</p>
        </Modal>
        <Modal
          title="Report Comment"
          visible={isReportVisible}
          okText="Send"
          cancelText="No"
          onCancel={() => setIsReportVisible(false)}
          onOk={sendReport}
        >
          <Radio.Group onChange={(e) => setReportValue(e.target.value)} value={reportValue}>
            <Space direction="vertical">
              <Radio value={"Sexual content"}>Sexual content</Radio>
              <Radio value={"Violent or repulsive content"}>Violent or repulsive content</Radio>
              <Radio value={"Hateful or abusive content"}>Hateful or abusive content</Radio>
              <Radio value={"Harmful or dangerous acts"}>Harmful or dangerous acts</Radio>
              <Radio value={"Spam or misleading"}>Spam or misleading</Radio>
            </Space>
          </Radio.Group>
        </Modal>
        {!isEnd ? (
          <>
            <Grid flow="row" columns={7}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) =>
                index !== 2 ? (
                  <Cell id={`ag-item-${index > 2 ? index - 1 : index}`} width={1} key={index} height={1}>
                    <div id={`player_text_${index > 2 ? index : index + 1}`} style={{ textAlign: "center" }}>
                      <CircularProgress size={20} />
                      <br />
                      {item + 1 <= 2 ? item + 1 : item} / 12
                      <br />
                      Waiting
                    </div>
                    {streamList[index >= 2 ? index + 1 : index] &&
                      getFromStorage("user_id") !== streamList[index >= 2 ? index + 1 : index].userId && (
                        <div
                          style={{
                            position: "absolute",
                            color: "white",
                            background: "rgba(0,0,0,0.7)",
                            display: "block",
                            zIndex: 999,
                          }}
                        >
                          <Dropdown overlay={() => menu(index >= 2 ? index + 1 : index)} placement="bottomCenter" arrow>
                            <EllipsisOutlined style={{ fontSize: "20px", color: "white", cursor: "pointer" }} />
                          </Dropdown>
                        </div>
                      )}
                  </Cell>
                ) : (
                  <Cell width={3} key={index} height={3}>
                    {!playing && <div style={{ background: "black", width: "100%", height: "400px" }} />}
                    {playing && (
                      <ReactPlayer
                        ref={playerRef}
                        url={`https://www.youtube.com/embed/${id}`}
                        onProgress={(duration) => setDuration(duration.playedSeconds)}
                        controls={false}
                        playing={playing}
                        onPlay={() => setPlaying(playing)}
                        onPause={() => setPlaying(playing)}
                        width={"100%"}
                        height={"400px"}
                      />
                    )}
                  </Cell>
                )
              )}
            </Grid>

            <Grid columns={9} style={{ marginTop: 10 }}>
              <Cell width={5}>
                <div style={{ fontSize: "20px" }}>
                  {data && data.getPost && data.getPost.channel_id
                    ? data.getPost.title
                    : crawlIdRes.data &&
                      crawlIdRes.data.getCrawledPostByYoutubeId &&
                      crawlIdRes.data.getCrawledPostByYoutubeId.channel_id
                    ? crawlIdRes.data.getCrawledPostByYoutubeId.title
                    : ""}
                </div>
                <Divider />
                <div style={{ margin: 5 }}>
                  <Grid>
                    <Cell>
                      <Avatar
                        src={
                          data &&
                          data.getPost &&
                          data.getPost.channel_id &&
                          data.getPost.channel_id.thumbnail_image_url &&
                          data.getPost.channel_id.thumbnail_image_url.length
                            ? data.getPost.channel_id.thumbnail_image_url
                            : crawlIdRes.data &&
                              crawlIdRes.data.getCrawledPostByYoutubeId &&
                              crawlIdRes.data.getCrawledPostByYoutubeId.channel_id &&
                              crawlIdRes.data.getCrawledPostByYoutubeId.channel_id.thumbnail_image_url &&
                              crawlIdRes.data.getCrawledPostByYoutubeId.channel_id.thumbnail_image_url.length
                            ? crawlIdRes.data.getCrawledPostByYoutubeId.channel_id.thumbnail_image_url
                            : profile_img
                        }
                      />
                    </Cell>
                    {(data && data.getPost) ||
                      (crawlIdRes.data && crawlIdRes.data.getCrawledPostByYoutubeId && (
                        <Cell width={10}>
                          <Link
                            to={`/profile/${
                              data && data.getPost
                                ? data.getPost.user_id && data.getPost.user_id.id
                                : crawlIdRes.data && crawlIdRes.data.getCrawledPostByYoutubeId
                                ? crawlIdRes.data.getCrawledPostByYoutubeId.user_id &&
                                  crawlIdRes.data.getCrawledPostByYoutubeId.user_id.id
                                : ""
                            }`}
                          >
                            <div style={{ fontWeight: "bold", fontSize: "14px", color: "black" }}>
                              {data && data.getPost && data.getPost.channel_id
                                ? data.getPost.channel_id.title
                                : crawlIdRes.data &&
                                  crawlIdRes.data.getCrawledPostByYoutubeId &&
                                  crawlIdRes.data.getCrawledPostByYoutubeId.channel_id
                                ? crawlIdRes.data.getCrawledPostByYoutubeId.channel_id.title
                                : ""}
                            </div>
                          </Link>
                          <div style={{ color: "silver" }}>
                            {abbreviateNumber(
                              data && data.getPost
                                ? data.getPost.view_count
                                : crawlIdRes.data && crawlIdRes.data.getCrawledPostByYoutubeId
                                ? crawlIdRes.data.getCrawledPostByYoutubeId.view_count
                                : 0
                            )}{" "}
                            views -{" "}
                            {moment(
                              data && data.getPost
                                ? parseInt(data.getPost.created_at)
                                : crawlIdRes.data && crawlIdRes.data.getCrawledPostByYoutubeId
                                ? parseInt(crawlIdRes.data.getCrawledPostByYoutubeId.created_at)
                                : 0
                            ).fromNow()}{" "}
                            by{" "}
                            {data && data.getPost && data.getPost.channel_id
                              ? data.getPost.channel_id.title
                              : crawlIdRes.data &&
                                crawlIdRes.data.getCrawledPostByYoutubeId &&
                                crawlIdRes.data.getCrawledPostByYoutubeId.channel_id
                              ? crawlIdRes.data.getCrawledPostByYoutubeId.channel_id.title
                              : ""}
                          </div>
                        </Cell>
                      ))}
                    {(data && data.getPost) ||
                      (crawlIdRes.data && crawlIdRes.data.getCrawledPostByYoutubeId && getFromStorage("user_token") && (
                        <Cell>
                          {(data &&
                            data.getPost &&
                            data.getPost.user_id &&
                            data.getPost.user_id.followers &&
                            data.getPost.user_id.followers.includes(getFromStorage("user_id"))) ||
                          (crawlIdRes.data &&
                            crawlIdRes.data.getCrawledPostByYoutubeId &&
                            crawlIdRes.data.getCrawledPostByYoutubeId.user_id &&
                            crawlIdRes.data.getCrawledPostByYoutubeId.user_id.followers &&
                            crawlIdRes.data.getCrawledPostByYoutubeId.user_id.followers.includes(
                              getFromStorage("user_id")
                            )) ? (
                            <Button
                              disabled={followLoading}
                              onClick={followUser}
                              variant="contained"
                              color="primary"
                              size="small"
                              style={{ float: "right", color: "white", fontSize: "12px", textTransform: "none" }}
                            >
                              Unfollow
                            </Button>
                          ) : (
                            <Button
                              disabled={followLoading}
                              onClick={followUser}
                              variant="contained"
                              color="secondary"
                              size="small"
                              style={{ float: "right", color: "white", fontSize: "12px", textTransform: "none" }}
                            >
                              Follow
                            </Button>
                          )}
                        </Cell>
                      ))}
                  </Grid>
                </div>
              </Cell>

              <Cell>
                {data &&
                  data.getPost &&
                  (data.getPost &&
                  data.getPost.liked_by &&
                  data.getPost.liked_by.includes(getFromStorage("user_id")) ? (
                    <ThumbUpAltSharp
                      style={{ fontSize: "25px", color: "blue", marginLeft: 10, cursor: "pointer" }}
                      onClick={() => {
                        if (!clickedLoad) likeOrUnlikePost(false, null, data.getPost ? data.getPost.id : null);
                      }}
                    />
                  ) : (
                    <ThumbUpAltOutlined
                      style={{ fontSize: "25px", color: "blue", marginLeft: 10, cursor: "pointer" }}
                      onClick={() => {
                        if (!clickedLoad) likeOrUnlikePost(true, null, data.getPost ? data.getPost.id : null);
                      }}
                    />
                  ))}
                {data &&
                  data.getPost &&
                  (data.getPost &&
                  data.getPost.disliked_by &&
                  data.getPost.disliked_by.includes(getFromStorage("user_id")) ? (
                    <ThumbDownAltSharp
                      style={{ fontSize: "25px", color: "blue", marginLeft: 10, cursor: "pointer" }}
                      onClick={() => {
                        if (!clickedLoad) likeOrUnlikePost(null, false, data.getPost ? data.getPost.id : null);
                      }}
                    />
                  ) : (
                    <ThumbDownAltOutlined
                      style={{ fontSize: "25px", color: "blue", marginLeft: 10, cursor: "pointer" }}
                      onClick={() => {
                        if (!clickedLoad) likeOrUnlikePost(null, true, data.getPost ? data.getPost.id : null);
                      }}
                    />
                  ))}
              </Cell>
              {!isEnd && (
                <Cell>
                  {!readyState ? (
                    <></>
                  ) : (
                    <>
                      {/* {!isViewer && <PhoneDisabled style={{color: "red", cursor: "pointer"}} onClick={handleExit} />} */}
                      {!isViewer && !mic ? (
                        <MicOff
                          style={{ color: "blue", marginLeft: 10, cursor: "pointer" }}
                          onClick={() => handleMic(true)}
                        />
                      ) : (
                        !isViewer && (
                          <Mic
                            style={{ color: "blue", marginLeft: 10, cursor: "pointer" }}
                            onClick={() => handleMic(false)}
                          />
                        )
                      )}
                      {!isViewer && camera ? (
                        <Videocam
                          style={{ color: "green", marginLeft: 10, cursor: "pointer" }}
                          onClick={() => handleCamera(false)}
                        />
                      ) : (
                        !isViewer && (
                          <VideocamOff
                            style={{ color: "green", marginLeft: 10, cursor: "pointer" }}
                            onClick={() => handleCamera(true)}
                          />
                        )
                      )}
                    </>
                  )}
                  <h3 style={{ marginTop: !readyState ? 18 : 14 }}>Current Viewers</h3>
                </Cell>
              )}

              {!isEnd && (
                <Cell width={2}>
                  {readyState && <br />}
                  {/* {readyState && <br/>} */}
                  {!readyState && <br />}
                  <h3 style={{ color: "lightGreen" }}>{viewers}</h3>
                  <div style={{ height: 200, overflowY: "auto", background: "white" }}>
                    <ScrollableFeed>
                      {messages.map((item, i) => (
                        <div style={{ margin: 8 }} key={i}>
                          <Avatar size="small" src={item.profile_image} />
                          <span style={{ color: "gray", marginLeft: 5, fontWeight: "bold", fontSize: 12 }}>
                            {item.username}
                          </span>{" "}
                          <span style={{ marginLeft: 5, fontSize: 12 }}>{item.message}</span>
                        </div>
                      ))}
                    </ScrollableFeed>
                  </div>
                  <div>
                    <Input
                      placeholder="Message"
                      suffix={<SendRounded color="blue" style={{ cursor: "pointer" }} onClick={sendMessage} />}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onPressEnter={sendMessage}
                    />
                  </div>
                </Cell>
              )}
            </Grid>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>Lobby is busy</div>
        )}
      </>
    </div>
  );
}

export default withRouter(LiveVideo);
