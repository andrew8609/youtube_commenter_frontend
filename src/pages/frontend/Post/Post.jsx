import { Box, makeStyles, Toolbar } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { useState } from "react";
import YoutubeHeader from "../../../components/Layout/YoutubeHeader";
import LaptopMode from "./LaptopMode";
import LiveVideo from "./LiveVideo";
import SoloVideo from "./SoloVideo";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundColor: theme.palette.background.dark,
  },
  appBar: {
    boxShadow: "none",
    zIndex: theme.zIndex.drawer + 1,
  },
  logo: {
    height: 25,
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
    borderRight: "none",
  },
  menuIcon: {
    paddingRight: theme.spacing(5),
    paddingLeft: theme.spacing(6),
  },
  icons: {
    paddingRight: theme.spacing(5),
  },
  grow: {
    flexGrow: 1,
  },
  listItemText: {
    fontSize: 14,
  },
  listItem: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  subheader: {
    textTransform: "uppercase",
  },
}));

function Post() {
  const classes = useStyles();
  const [darkMode, setDarkMode] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [laptopMode, setLaptopMode] = useState(false);
  const [isPlayed, setIsPlayed] = useState(false);
  const [isUserLive, setIsUserLive] = useState(false);
  const [isExit, setIsExit] = useState(false);

  const themes = createMuiTheme({
    spacing: 4,
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: "#f44336",
      },
      secondary: {
        main: "#3EA6FF",
      },
      background: {
        default: darkMode ? "#232323" : "#FFF",
        dark: darkMode ? "#181818" : "#f4f6f8",
        paper: darkMode ? "#232323" : "#FFF",
      },
    },
  });

  return (
    <ThemeProvider theme={themes}>
      <div className={classes.root}>
        {!isPlayed ? (
          <YoutubeHeader
            isLaptopMode={laptopMode}
            setIsLaptopMode={(data) => setLaptopMode(!data)}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            isLiveMode={isLiveMode}
            setIsLiveMode={(data) => setIsLiveMode(data)}
            setIsRecording={() => {
              setIsRecording(!isRecording);
            }}
            isUserLive={isUserLive}
            openCloseModal={(data) => setIsExit(data)}
          />
        ) : null}
        <Box display="flex">
          <Box
            p={4}
            style={{
              backgroundColor: darkMode ? "#181818" : "#f4f6f8",
              width: "100%",
            }}
          >
            {!isPlayed ? <Toolbar /> : null}
            {!isLiveMode ? (
              laptopMode ? (
                <LaptopMode
                  isPlayedMode={isPlayed}
                  setIsPlayedMode={(data) => setIsPlayed(data)}
                  isRecord={isRecording}
                  setIsRecord={(data) => setIsRecording(data)}
                />
              ) : (
                <SoloVideo
                  isPlayedMode={isPlayed}
                  setIsPlayedMode={(data) => setIsPlayed(data)}
                  isRecord={isRecording}
                  setIsRecord={(data) => setIsRecording(data)}
                />
              )
            ) : (
              <LiveVideo
                isPlayedMode={isPlayed}
                setIsPlayedMode={(data) => setIsPlayed(data)}
                isRecord={isRecording}
                setIsRecord={(data) => setIsRecording(data)}
                setIsLiveMode={() => setIsLiveMode(false)}
                isUserLive={isUserLive}
                setIsUserLive={(data) => setIsUserLive(data)}
                isExit={isExit}
                setIsExit={(data) => setIsExit(data)}
              />
            )}
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default Post;
