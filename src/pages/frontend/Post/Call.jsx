import AgoraRTC from "agora-rtc-sdk";
import { Component } from "react";
let client = AgoraRTC.createClient({ mode: "live", codec: "h264" });

const USER_ID = Math.floor(Math.random() * 1000000001);

export default class Call extends Component {
  localStream = AgoraRTC.createStream({
    streamID: USER_ID,
    audio: true,
    video: true,
    screen: false,
  });

  componentDidMount() {
    this.initLocalStream();
    this.initClient();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.channel !== this.props.channel && this.props.channel !== "") {
      this.joinChannel();
    }
  }

  initLocalStream = () => {
    let me = this;
    me.localStream.init(
      function () {
        console.log("getUserMedia successfully");
        me.localStream.play("agora_local");
      },
      function (err) {
        console.log("getUserMedia failed", err);
      }
    );
  };

  initClient = () => {
    client.init(
      "32daf22edf664dcfbe2a292eb059f33b",
      function () {
        console.log("AgoraRTC client initialized");
      },
      function (err) {
        console.log("AgoraRTC client init failed", err);
      }
    );
  };

  joinChannel = () => {
    let me = this;
    client.join(
      null,
      me.props.channel,
      USER_ID,
      function (uid) {
        console.log("User " + uid + " join channel successfully");
        client.publish(me.localStream, function (err) {
          console.log("Publish local stream error: " + err);
        });

        client.on("stream-published", function (evt) {
          console.log("Publish local stream successfully");
        });
      },
      function (err) {
        console.log("Join channel failed", err);
      }
    );
  };

  render() {
    return (
      <div>
        <div id="agora_local" style={{ width: "400px", height: "400px" }} />
      </div>
    );
  }
}
