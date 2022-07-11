import { EllipsisOutlined, HeartFilled, HeartOutlined, LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, CircularProgress, Divider, LinearProgress } from "@material-ui/core";
import {
  ThumbDownAltOutlined,
  ThumbDownAltSharp,
  ThumbUpAltOutlined,
  ThumbUpAltSharp,
  VolumeOff,
  VolumeUp,
} from "@material-ui/icons";
import { Avatar, Badge, Dropdown, Menu, Modal, Radio, Space } from "antd";
import axios from "axios";
import moment from "moment";
import React, { createRef, useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import ReactPlayer from "react-player";
import { useRecordWebcam } from "react-record-webcam";
import { Link, useParams, withRouter } from "react-router-dom";
import { Cell, Grid } from "styled-css-grid";
import { createChannel } from "../../../graphql/mutations/channels";
import { createComment, likeOrUnlikeComment } from "../../../graphql/mutations/comments";
import { createPost, likeOrDislikePost } from "../../../graphql/mutations/posts";
import { createReport } from "../../../graphql/mutations/reports";
import { registerUser, userFollow } from "../../../graphql/mutations/users";
import { getChannelByYoutubeChannelId } from "../../../graphql/queries/channels";
import { getCommentsByPostID, getCommentsCount } from "../../../graphql/queries/comments";
import { getCrawledPostByYoutubeId } from "../../../graphql/queries/crawler";
import { getPost, getPostByYoutubeId } from "../../../graphql/queries/posts";
import { getUserByEmail } from "../../../graphql/queries/users";
import profile_img from "../../../images/profile.png";
import { youtube_api } from "../../../utils/Api";
import { getError } from "../../../utils/error";
import { errorMessage, successMessage } from "../../../utils/message";
import { abbreviateNumber } from "../../../utils/NumberConvert";
import { getFromStorage } from "../../../utils/storage";

function LaptopMode({ history, isRecord, setIsRecord, isPlayedMode, setIsPlayedMode }) {
  const params = useParams();
  const [id, setId] = useState("");
  const [page_no, setPageNo] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muteComment, setMuteComment] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [isSwapDisable, setIsSwapDisable] = useState(false);
  const [isHover, setIsHover] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [clickedLoad, setClickedLoad] = useState(false);
  const idRes = useQuery(getPostByYoutubeId, { variables: { id: params.id } });
  const crawlIdRes = useQuery(getCrawledPostByYoutubeId, { variables: { id: params.id } });
  const { data, error, loading, fetchMore } = useQuery(getPost, {
    variables: {
      id: idRes.data ? idRes.data.getPostByYoutubeId && idRes.data.getPostByYoutubeId.id : "000000000000000000000000",
    },
  });
  const findUser = useQuery(getUserByEmail);
  const findChannel = useQuery(getChannelByYoutubeChannelId);
  const [likeOrUnlikeComments, response] = useMutation(likeOrUnlikeComment);
  const [likeOrUnlikePosts, response1] = useMutation(likeOrDislikePost);
  const [skipLimit, setSkipLimit] = useState({ skip: 0, limit: 0 });
  const [isSkipAll, setIsSkipAll] = useState(true);
  const res = useQuery(getCommentsByPostID, {
    variables: { id: data && data.getPost ? data.getPost.id : "000000000000000000000000", skip: 0, limit: 12 },
  });
  const [isRecording, setIsRecording] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [tempDuration, setTempDuration] = useState([]);
  const [durationArr, setDurationArr] = useState([]);
  const playerRef = useRef([
    createRef(),
    createRef(),
    createRef(),
    createRef(),
    createRef(),
    createRef(),
    createRef(),
    createRef(),
    createRef(),
    createRef(),
    createRef(),
    createRef(),
    createRef(),
    createRef(),
  ]);
  const [uniqueData, setUniqueData] = useState([]);
  const [followUsers, resp] = useMutation(userFollow);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [createComments, cmntResponse] = useMutation(createComment);
  const [followLoading, setFollowLoading] = useState(false);
  const [pausing, setPausing] = useState(false);
  const [initCam, setInitCam] = useState(false);
  const [reportUserIdValue, setReportUserIdValue] = useState("");
  const [reportCommentIdValue, setReportCommentIdValue] = useState("");
  const [reportComment, reportResp] = useMutation(createReport);
  const [reportValue, setReportValue] = useState("");
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [isSendingReport, setIsSendingReport] = useState(false);
  const [youtubeVideoData, setYoutubeVideoData] = useState(null);
  const [isCommentUploading, setIsCommentUploading] = useState(false);
  const comment_count_res = useQuery(getCommentsCount(), {
    variables: { id: data && data.getPost ? data.getPost.id : "000000000000000000000000" },
  });
  const [createUser, userRes] = useMutation(registerUser);
  const [createChannel1, channelRes] = useMutation(createChannel);
  const [createPost1, postRes] = useMutation(createPost);
  const [isPost, setIsPost] = useState(false);

  //Check if browser is Safari
  var isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(!window["safari"] || (typeof safari !== "undefined" && window["safari"].pushNotification));

  //Webcam recorder variable
  const recordWebcam = useRecordWebcam();

  //Check first browser and useEffect will run first
  useEffect(() => {
    if (isSafari && typeof MediaRecorder === "undefined") {
      alert(
        "MediaRecorder not Supported. Enable Media Recorder first from Develop > Experimental Features > MediaRecorder and then reload."
      );
    }
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
        },

        // errorCallback
        function (err) {
          console.log("error", err.name);
        }
      );
    }
  };

  //Media Recorder
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ video: true });

  //Swap Comment one by one
  const onSwap = (index, skipCom, limitCom, isSkipAl) => {
    setIsSwapDisable(true);
    res.fetchMore({
      variables: { id: data && data.getPost ? data.getPost.id : "", skip: skipCom, limit: limitCom },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        let temp = { getCommentsByPostID: [] };
        console.log(fetchMoreResult);
        if (fetchMoreResult.getCommentsByPostID.length) {
          setIsSkipAll(isSkipAl);
          setSkipLimit({ skip: skipCom, limit: limitCom });
          if (index !== null) {
            prevResult.getCommentsByPostID.forEach((item, i) => {
              if (index === i) {
                temp.getCommentsByPostID.push(fetchMoreResult.getCommentsByPostID[0]);
              } else {
                temp.getCommentsByPostID.push(item);
              }
            });
            setIsSwapDisable(false);
            return temp;
          } else {
            setIsSwapDisable(false);
            return fetchMoreResult;
          }
        } else {
          setIsSwapDisable(true);
          return prevResult;
        }
      },
    });

    setPageNo(page_no + 1);
  };

  //Like comment or unlike comment
  const likeCommentHandle = async (is_like, id) => {
    if (getFromStorage("user_token")) {
      setClickedLoad(true);
      try {
        const { data } = await likeOrUnlikeComments({
          variables: { id, liked_by: getFromStorage("user_id"), is_like },
        });
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

  //Hover for comment icons
  const isHoverHandle = (index, hover) => {
    const temp = isHover;
    temp[index] = hover;
    setIsHover([...temp]);
  };

  //Mute or Unmute comment video
  const muteCommentHandle = (index) => {
    const temp = muteComment;
    temp[index] = !temp[index];
    setMuteComment([...temp]);
  };

  //like or unlike post
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

  //Function for progress player
  const onProgress = (duration, index) => {
    if (isRecording) {
      tempDuration.push(duration);
    }
    if (playerRef.current[index] && playing && index !== 8) {
      console.log(playerRef.current[index]);
      playerRef.current[index].current.seekTo(playerRef.current[8].current.getCurrentTime());
    }
  };

  //Open camera
  if (isRecord && !initCam) {
    recordWebcam.open();
    setInitCam(true);
  }

  //Pause video
  const onPause = () => {
    console.log(isRecord && isRecording && typeof MediaRecorder !== "undefined");
    if (isRecord && isRecording && typeof MediaRecorder !== "undefined") {
      stopRecording();
      setIsRecording(false);
      onStopRecording();
      setPausing(true);
    }
    setPlaying(false);
  };

  //Play video
  const onPlay = (index) => {
    setPlaying(true);
    if (isRecord && typeof MediaRecorder !== "undefined") {
      onStartRecording();
      startRecording();
      setIsRecording(true);
    }
    if (playerRef.current[index] && playing && index !== 8) {
      console.log(playerRef.current[index].current.getCurrentTime());
      playerRef.current[index].current.seekTo(playerRef.current[8].current.getCurrentTime());
    }
  };

  //Start Recording
  const onStartRecording = () => {
    setIsRecording(true);
    setPlaying(true);
  };

  //Stop Recording
  const onStopRecording = () => {
    setIsRecording(false);
    setPlaying(false);
  };

  //When recording complete
  const onRecordingComplete = (videoBlob) => {
    var reader = new FileReader();
    reader.readAsDataURL(videoBlob);
    let found = false;
    const tempArr = [];
    tempDuration.forEach((item) => {
      tempArr.push(item.playedSeconds);
    });
    const start = parseInt(Math.min(...tempArr));
    const end =
      tempDuration.length &&
      (tempDuration[tempDuration.length - 1].playedSeconds
        ? parseInt(tempDuration[tempDuration.length - 1].playedSeconds)
        : 0);

    if (end) {
      durationArr.forEach((item, i) => {
        if (
          (start >= item.start && end <= item.end) ||
          (item.start >= start && item.end <= end) ||
          (start >= item.start && start <= item.end) ||
          (item.start >= start && item.start <= end)
        ) {
          console.log(end);
          if (end - start > item.end - item.start) {
            let temp = durationArr;
            reader.onloadend = function () {
              temp[i] = { start: start, end: end, videoBlob: reader.result };
            };
            setDurationArr(temp);
          }
          found = true;
        }
      });
      if (!durationArr.length || !found) {
        reader.onloadend = function () {
          durationArr.push({ start: start, end: end, videoBlob: reader.result });
        };
        console.log("videoBlob", durationArr);
      }
      const data = durationArr.sort((a, b) => (a.start > b.start ? 1 : b.start > a.start ? -1 : 0));
      const uniqueData = Object.values(data.reduce((acc, cur) => Object.assign(acc, { [cur.start]: cur }), {}));
      let sum = 0;
      setTempDuration([]);
      uniqueData.forEach((item, i) => {
        sum = sum + (item.end - item.start) + (item.start ? 1 : 0);
      });
    }
  };

  //Upload comment reaction
  const postComment = async (uniqueDatas) => {
    setIsCommentUploading(true);

    //Conditions for posts if not in db then save there
    try {
      if (!data.getPost) {
        if (youtubeVideoData) {
          const user = await findUser.refetch({ email: `${youtubeVideoData.channelUsername}@wecept.com` });
          if (!user || (user && user.data && !user.data.getUserByEmail)) {
            const userCreate = await createUser({
              variables: {
                name: youtubeVideoData.snippet.channelTitle,
                dob: new Date(),
                email: `${youtubeVideoData.channelUsername}@wecept.com`,
                is_activated: false,
                is_verified: false,
                password: "none",
                base64: "",
                fileName: "",
                fileType: "",
                role: "user",
              },
            });
            console.log(userCreate.data);
            const channel = await findChannel.refetch({ id: youtubeVideoData.snippet.channelId });
            if (
              (!channel || (channel && channel.data && !channel.data.getChannelByYoutubeChannelId)) &&
              userCreate &&
              userCreate.data &&
              userCreate.data.registerUser
            ) {
              const channelCreate = await createChannel1({
                variables: {
                  title: youtubeVideoData.snippet.channelTitle,
                  description: youtubeVideoData.channelDescription,
                  thumbnail_image_url: youtubeVideoData.channelImage,
                  youtube_channel_id: youtubeVideoData.snippet.channelId,
                  user_id: userCreate.data.registerUser.id,
                },
              });
              if (channelCreate && channelCreate.data && channelCreate.data.createChannel) {
                const data = channelCreate.data.createChannel;
                console.log(data);
                const postCreate = await createPost1({
                  variables: {
                    channel_id: data.id,
                    user_id: userCreate.data.registerUser.id,
                    thumbnail_url: youtubeVideoData.snippet.thumbnails.medium.url,
                    title: youtubeVideoData.snippet.title,
                    url: `https://www.youtube.com/embed/${youtubeVideoData.id}`,
                    type: "video",
                    view_count: parseInt(youtubeVideoData.statistics.viewCount),
                    like_count: parseInt(youtubeVideoData.statistics.likeCount),
                    dislike_count: parseInt(youtubeVideoData.statistics.dislikeCount),
                    aspect_ratio: youtubeVideoData.contentDetails.dimension,
                    duration: youtubeVideoData.contentDetails.duration,
                    role: "normal",
                    created_at: youtubeVideoData.snippet.publishedAt,
                  },
                });
                console.log(postCreate);
                if (postCreate && postCreate.data && postCreate.data.createPost) {
                  setTimeout(() => {
                    setIsCommentUploading(false);
                    setIsRecord(false);
                    setPlaying(false);
                    setDurationArr([]);
                    setTempDuration([]);
                    setTotalDuration(0);
                    successMessage("Comment Posted Successfully");
                  }, 20000);
                  const { data } = await createComments({
                    variables: {
                      post_id: postCreate.data.createPost.id,
                      videos: uniqueDatas,
                      type: "video",
                      totalDuration,
                    },
                  });
                  successMessage("We are processing your comment video. Check back later");
                }
              }
            }
          } else if (user && user.data && user.data.getUserByEmail) {
            const channel = await findChannel.refetch({ id: youtubeVideoData.snippet.channelId });

            if (!channel || (channel && channel.data && !channel.data.getChannelByYoutubeChannelId)) {
              const channelCreate = await createChannel1({
                variables: {
                  title: youtubeVideoData.snippet.channelTitle,
                  description: youtubeVideoData.channelDescription,
                  thumbnail_image_url: youtubeVideoData.channelImage,
                  youtube_channel_id: youtubeVideoData.snippet.channelId,
                  user_id: user.data.getUserByEmail.id,
                },
              });
              if (channelCreate && channelCreate.data && channelCreate.data.createChannel) {
                const data = channelCreate.data.createChannel;
                const postCreate = await createPost1({
                  variables: {
                    channel_id: data.id,
                    user_id: user.data.getUserByEmail.id,
                    thumbnail_url: youtubeVideoData.snippet.thumbnails.medium.url,
                    title: youtubeVideoData.snippet.title,
                    url: `https://www.youtube.com/embed/${youtubeVideoData.id}`,
                    type: "video",
                    view_count: parseInt(youtubeVideoData.statistics.viewCount),
                    like_count: parseInt(youtubeVideoData.statistics.likeCount),
                    dislike_count: parseInt(youtubeVideoData.statistics.dislikeCount),
                    aspect_ratio: youtubeVideoData.contentDetails.dimension,
                    duration: youtubeVideoData.contentDetails.duration,
                    role: "normal",
                    created_at: youtubeVideoData.snippet.publishedAt,
                  },
                });
                if (postCreate && postCreate.data && postCreate.data.createPost) {
                  setTimeout(() => {
                    setIsCommentUploading(false);
                    setIsRecord(false);
                    setPlaying(false);
                    setDurationArr([]);
                    setTempDuration([]);
                    setTotalDuration(0);
                    successMessage("Comment Posted Successfully");
                  }, 20000);
                  const { data } = await createComments({
                    variables: {
                      post_id: postCreate.data.createPost.id,
                      videos: uniqueDatas,
                      type: "video",
                      totalDuration,
                    },
                  });
                  successMessage("We are processing your comment video. Check back later");
                }
              }
            } else if (channel && channel.data && channel.data.getChannelByYoutubeChannelId) {
              const data = channel.data.getChannelByYoutubeChannelId;

              const postCreate = await createPost1({
                variables: {
                  channel_id: data.id,
                  user_id: user.data.getUserByEmail.id,
                  thumbnail_url: youtubeVideoData.snippet.thumbnails.medium.url,
                  title: youtubeVideoData.snippet.title,
                  url: `https://www.youtube.com/embed/${youtubeVideoData.id}`,
                  type: "video",
                  view_count: parseInt(youtubeVideoData.statistics.viewCount),
                  like_count: parseInt(youtubeVideoData.statistics.likeCount),
                  dislike_count: parseInt(youtubeVideoData.statistics.dislikeCount),
                  aspect_ratio: youtubeVideoData.contentDetails.dimension,
                  duration: youtubeVideoData.contentDetails.duration,
                  role: "normal",
                  created_at: youtubeVideoData.snippet.publishedAt,
                },
              });
              if (postCreate && postCreate.data && postCreate.data.createPost) {
                setTimeout(() => {
                  setIsCommentUploading(false);
                  setIsRecord(false);
                  setPlaying(false);
                  setDurationArr([]);
                  setTempDuration([]);
                  setTotalDuration(0);
                  successMessage("Comment Posted Successfully");
                }, 20000);
                const { data } = await createComments({
                  variables: {
                    post_id: postCreate.data.createPost.id,
                    videos: uniqueDatas,
                    type: "video",
                    totalDuration,
                  },
                });
                successMessage("We are processing your comment video. Check back later");
              }
            }
          }
        } else if (crawlIdRes.data && crawlIdRes.data.getCrawledPostByYoutubeId) {
          const postCreate = await createPost1({
            variables: {
              channel_id: crawlIdRes.data.getCrawledPostByYoutubeId.channel_id.id,
              user_id: crawlIdRes.data.getCrawledPostByYoutubeId.user_id.id,
              thumbnail_url: crawlIdRes.data.getCrawledPostByYoutubeId.thumbnail_url,
              title: crawlIdRes.data.getCrawledPostByYoutubeId.title,
              url: crawlIdRes.data.getCrawledPostByYoutubeId.url,
              type: "video",
              view_count: parseInt(crawlIdRes.data.getCrawledPostByYoutubeId.view_count),
              like_count: parseInt(crawlIdRes.data.getCrawledPostByYoutubeId.like_count),
              dislike_count: parseInt(crawlIdRes.data.getCrawledPostByYoutubeId.dislike_count),
              aspect_ratio: "2d",
              duration: crawlIdRes.data.getCrawledPostByYoutubeId.duration,
              role: crawlIdRes.data.getCrawledPostByYoutubeId.role,
              created_at: crawlIdRes.data.getCrawledPostByYoutubeId.created_at,
            },
          });
          console.log(postCreate);
          if (postCreate && postCreate.data && postCreate.data.createPost) {
            setTimeout(() => {
              setIsCommentUploading(false);
              setIsRecord(false);
              setPlaying(false);
              setDurationArr([]);
              setTempDuration([]);
              setTotalDuration(0);
              successMessage("Comment Posted Successfully");
            }, 20000);
            const { data } = await createComments({
              variables: { post_id: postCreate.data.createPost.id, videos: uniqueDatas, type: "video", totalDuration },
            });
            successMessage("We are processing your comment video. Check back later");
          }
        } else {
          errorMessage("Error: Comment can not save");
          setIsCommentUploading(false);
        }
      } else {
        setTimeout(() => {
          setIsCommentUploading(false);
          setIsRecord(false);
          setPlaying(false);
          setDurationArr([]);
          setTempDuration([]);
          setTotalDuration(0);
          successMessage("Comment Posted Successfully");
        }, 20000);
        const { data } = await createComments({
          variables: { post_id: id, videos: uniqueDatas, type: "video", totalDuration },
        });
        successMessage("We are processing your comment video. Check back later");
      }
    } catch (err) {
      console.log(err);
      setIsCommentUploading(false);
      errorMessage(err.toString());
    }
  };

  //Save comment video in database
  const saveVideo = () => {
    const data = durationArr.sort((a, b) => (a.start > b.start ? 1 : b.start > a.start ? -1 : 0));
    const uniqueDatas = Object.values(data.reduce((acc, cur) => Object.assign(acc, { [cur.start]: cur }), {}));
    let sum = 0;

    if (!uniqueDatas.length) {
      errorMessage("Video can not save because you have to record react till less 10 seconds of video");
    }
    uniqueDatas.forEach((item, i) => {
      sum = sum + (item.end - item.start) + (item.start ? 1 : 0);
      if (i === uniqueDatas.length - 1) {
        //const percent = (sum / totalDuration) * 100
        //if (percent >= 85) {
        if (sum >= 10) {
          setUniqueData(uniqueDatas);
          postComment(uniqueDatas);
        } else {
          errorMessage("Video can not save because you have to record react till less 10 seconds of video");
        }
      }
    });
  };

  //Close modal
  const handleOk = () => {
    setIsModalVisible(false);
  };

  //Follow user of post
  const followUser = async () => {
    if (getFromStorage("user_token")) {
      setFollowLoading(true);
      try {
        const res = await followUsers({
          variables: {
            id:
              data && data.getPost && data.getPost.user_id
                ? data.getPost.user_id.id
                : crawlIdRes.data &&
                  crawlIdRes.data.getCrawledPostByYoutubeId &&
                  crawlIdRes.data.getCrawledPostByYoutubeId.user_id
                ? crawlIdRes.data.getCrawledPostByYoutubeId.user_id.id
                : "",
          },
        });
        setFollowLoading(false);
      } catch (err) {
        getError(err);
        setFollowLoading(false);
      }
    } else {
      history.push("/login");
    }
  };

  //Repost to admin
  const reportModalOpen = (user_id, comment_id) => {
    setIsReportVisible(!isReportVisible);
    setReportUserIdValue(user_id);
    setReportCommentIdValue(comment_id);
  };

  //Report to Admin
  const sendReport = async () => {
    if (!getFromStorage("user_token")) {
      errorMessage("Sign In First");
    } else {
      if (reportValue.length !== 0) {
        setIsSendingReport(true);
        try {
          const { data, errors } = await reportComment({
            variables: {
              type: reportValue,
              user_id: reportUserIdValue,
              comment_id: reportCommentIdValue,
              reported_by: getFromStorage("user_id") ? getFromStorage("user_id") : null,
            },
          });
          setIsSendingReport(false);
          setIsReportVisible(false);
          setReportValue("");
          setReportUserIdValue("");
          setReportCommentIdValue("");
          successMessage("Report to admin sent successfully");
        } catch (err) {
          errorMessage("Error in sending report");
        }
      } else {
        setIsSendingReport(false);
        errorMessage("Reporting Option Required");
      }
    }
  };

  const getVideoDataFromYoutube = async () => {
    try {
      const videoDataRes = await axios.get(
        `${youtube_api}/videos?part=statistics,contentDetails,snippet&id=${params.id}&key=${process.env.REACT_APP_YOUTUBE_API_KEY_1}`
      );
      const channelDataRes = await axios.get(
        `${youtube_api}/channels?part=contentDetails,snippet,contentOwnerDetails,topicDetails&id=${videoDataRes.data.items[0].snippet.channelId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY_1}`
      );
      setYoutubeVideoData({
        ...videoDataRes.data.items[0],
        channelDescription: channelDataRes.data.items[0].snippet.description,
        channelImage: channelDataRes.data.items[0].snippet.thumbnails.medium.url,
        channelUsername: channelDataRes.data.items[0].snippet.customUrl,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getVideoAudioPermission();
  }, []);

  if (
    !isPost &&
    ((idRes &&
      idRes.data &&
      !idRes.data.getPostByYoutubeId &&
      crawlIdRes &&
      crawlIdRes.data &&
      !crawlIdRes.data.getCrawledPostByYoutubeId) ||
      (!idRes.data && !crawlIdRes.data))
  ) {
    getVideoDataFromYoutube();
    setIsPost(true);
  }

  //Menu for comment
  const menu = (index) => (
    <Menu>
      <Menu.Item>
        {res.data && res.data.getCommentsByPostID[index].comment_by ? (
          <Link to={`/profile/${res.data ? res.data.getCommentsByPostID[index].comment_by : ""}`}>Profile</Link>
        ) : (
          <span>Profile</span>
        )}
      </Menu.Item>
      <Menu.Item
        onClick={() => onSwap(index, isSkipAll ? skipLimit.skip + 12 : skipLimit.skip + 1, 1, false)}
        disabled={isSwapDisable}
      >
        Swap
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          reportModalOpen(
            res.data ? res.data.getCommentsByPostID[index].comment_by : "",
            res.data ? res.data.getCommentsByPostID[index].id : ""
          )
        }
      >
        Report
      </Menu.Item>
    </Menu>
  );

  //Media blob url on recording complete
  if (typeof MediaRecorder !== "undefined" && mediaBlobUrl && pausing) {
    axios({
      method: "get",
      url: mediaBlobUrl,
      responseType: "blob",
    })
      .then(function (response) {
        console.log(response.data);
        onRecordingComplete(response.data);
      })
      .catch((err) => console.log(err));
    setPausing(false);
  }

  if (loading || res.loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ marginLeft: 6, marginRight: 6 }}>
      <>
        <Modal
          title="Record Reaction"
          visible={isModalVisible}
          okText="Yes"
          cancelText="No"
          onCancel={() => setIsModalVisible(false)}
          onOk={handleOk}
        >
          <p>Video reacording reaction is now 85% do you want to save?</p>
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
        <Grid flow="row" columns={7}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((item, index) =>
            index !== 2 && index !== 13 ? (
              <Cell width={1} key={index} height={1}>
                {res.data &&
                res.data.getCommentsByPostID &&
                res.data.getCommentsByPostID[index > 7 ? index - 1 : index] ? (
                  <div
                    style={{ position: "relative" }}
                    onMouseEnter={() => isHoverHandle(index, true)}
                    onMouseLeave={() => isHoverHandle(index, false)}
                  >
                    <ReactPlayer
                      ref={playerRef.current[index]}
                      url={res.data.getCommentsByPostID[index > 7 ? index - 1 : index].url}
                      onPlay={() => onPlay(index)}
                      onSeek={() => {
                        console.log("abc");
                      }}
                      playing={playing}
                      muted={!muteComment[index]}
                      height={"auto"}
                      width={"100%"}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "0px",
                        right: "0px",
                        color: "white",
                        background: "rgba(0,0,0,0.7)",
                        display: isHover[index] ? "block" : "none",
                      }}
                    >
                      <Dropdown overlay={() => menu(index > 8 ? index - 1 : index)} placement="bottomCenter" arrow>
                        <EllipsisOutlined style={{ fontSize: "20px", color: "white", cursor: "pointer" }} />
                      </Dropdown>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "6px",
                        right: "0px",
                        color: "white",
                        background: "rgba(0,0,0,0.7)",
                        display: isHover[index] ? "block" : "none",
                      }}
                    >
                      {res.data &&
                      res.data.getCommentsByPostID[index > 7 ? index - 1 : index].liked_by &&
                      res.data.getCommentsByPostID[index > 7 ? index - 1 : index].liked_by.includes(
                        getFromStorage("user_id")
                      ) ? (
                        <HeartFilled
                          style={{ fontSize: "20px", color: "red", cursor: "pointer" }}
                          onDoubleClick={() => {
                            if (!clickedLoad)
                              likeCommentHandle(false, res.data.getCommentsByPostID[index > 7 ? index - 1 : index].id);
                          }}
                        />
                      ) : (
                        <HeartOutlined
                          style={{ fontSize: "20px", color: "white", cursor: "pointer" }}
                          onDoubleClick={() => {
                            if (!clickedLoad)
                              likeCommentHandle(true, res.data.getCommentsByPostID[index > 7 ? index - 1 : index].id);
                          }}
                        />
                      )}
                    </div>
                    {res.data && res.data.getCommentsByPostID[index > 7 ? index - 1 : index].type === "video" ? (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "6px",
                          left: "0px",
                          color: "white",
                          background: "rgba(0,0,0,0.7)",
                          display: isHover[index] ? "block" : "none",
                        }}
                      >
                        {muteComment[index] ? (
                          <VolumeUp
                            style={{ fontSize: "20px", color: "white", cursor: "pointer" }}
                            onClick={() => muteCommentHandle(index)}
                          />
                        ) : (
                          <VolumeOff
                            style={{ fontSize: "20px", color: "white", cursor: "pointer" }}
                            onClick={() => muteCommentHandle(index)}
                          />
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <img src={profile_img} alt="" height={"120px"} width={"100%"} style={{ visibility: "hidden" }} />
                )}
              </Cell>
            ) : index === 2 ? (
              <Cell width={3} key={index} height={3}>
                <ReactPlayer
                  ref={playerRef.current[index]}
                  onProgress={(duration) => onProgress(duration, index)}
                  url={`https://www.youtube.com/embed/${params.id}`}
                  onStart={(duration) => {
                    console.log(duration);
                  }}
                  onDuration={(duration) => setTotalDuration(duration)}
                  config={{
                    youtube: {
                      controls: 0,
                    },
                  }}
                  onBuffer={onPause}
                  onPlay={() => {
                    setIsPlayedMode(true);
                    onPlay(index);
                  }}
                  playing={playing}
                  onPause={() => {
                    setIsPlayedMode(false);
                    onPause();
                  }}
                  onEnded={() => {
                    setIsPlayedMode(false);
                    onPause();
                  }}
                  controls
                  width={"100%"}
                  height={"100%"}
                />
              </Cell>
            ) : (
              <Cell width={1} key={index} height={1}>
                {!isRecord ? null : (
                  <>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", top: "0px", right: "8px" }}>
                        {typeof MediaRecorder !== "undefined" && (
                          <Badge
                            dot={true}
                            color={
                              status === "idle"
                                ? "yellow"
                                : status === "recording"
                                ? "red"
                                : status === "stopped"
                                ? "blue"
                                : "blue"
                            }
                          ></Badge>
                        )}
                      </div>

                      <video
                        ref={recordWebcam.webcamRef}
                        autoPlay
                        muted
                        style={{ width: "100%", height: "auto" }}
                        playsInline
                      />
                    </div>
                    <br />
                    <Button
                      onClick={saveVideo}
                      variant="contained"
                      color="primary"
                      size="small"
                      style={{ color: "white", fontSize: "12px", textTransform: "none" }}
                    >
                      Save
                    </Button>
                    <br />
                    <br />
                    {isCommentUploading && <LinearProgress size="small" />}
                  </>
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
                : youtubeVideoData && youtubeVideoData.snippet && youtubeVideoData.snippet.title}
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
                        : youtubeVideoData
                        ? youtubeVideoData.channelImage
                        : profile_img
                    }
                  />
                </Cell>
                {(data && data.getPost) || (crawlIdRes.data && crawlIdRes.data.getCrawledPostByYoutubeId) ? (
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
                ) : (
                  youtubeVideoData && (
                    <Cell width={10}>
                      <div style={{ fontWeight: "bold", fontSize: "14px", color: "black" }}>
                        {youtubeVideoData.snippet.channelTitle}
                      </div>
                      <div style={{ color: "silver" }}>
                        {abbreviateNumber(youtubeVideoData.statistics.viewCount)} views -{" "}
                        {moment(youtubeVideoData.snippet.publishedAt).fromNow()} by{" "}
                        {youtubeVideoData.snippet.channelTitle}
                      </div>
                    </Cell>
                  )
                )}
                {((data && data.getPost) || (crawlIdRes.data && crawlIdRes.data.getCrawledPostByYoutubeId)) &&
                  getFromStorage("user_token") && (
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
                  )}
              </Grid>
            </div>
          </Cell>
          <Cell>
            {data &&
              data.getPost &&
              (data.getPost.liked_by && data.getPost.liked_by.includes(getFromStorage("user_id")) ? (
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
              (data.getPost.disliked_by && data.getPost.disliked_by.includes(getFromStorage("user_id")) ? (
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
          {data && data.getPost && (
            <Cell width={3}>
              <Button onClick={() => onSwap(null, skipLimit.skip - 12, 12, true)}>
                <LeftCircleFilled style={{ fontSize: "22px" }} />
              </Button>
              <Button onClick={() => onSwap(null, skipLimit.skip + 12, 12, true)}>
                <RightCircleFilled style={{ fontSize: "22px" }} />
              </Button>
              Swap Comments {comment_count_res.data ? comment_count_res.data.getCommentsCount.count : ""}
            </Cell>
          )}
        </Grid>
      </>
    </div>
  );
}

export default withRouter(LaptopMode);
