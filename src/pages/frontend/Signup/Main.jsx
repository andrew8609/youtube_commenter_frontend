import { makeStyles, Toolbar, Box } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { useState } from "react";
import YoutubeHeader from "../../../components/Layout/YoutubeHeader";
import Signup from "./Signup";

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

function Main() {
  const classes = useStyles();
  const [darkMode, setDarkMode] = useState(false);

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
        <YoutubeHeader darkMode={darkMode} setDarkMode={setDarkMode} />
        <Box display="flex">
          <Box p={8} style={{ backgroundColor: darkMode ? "#181818" : "#f4f6f8", width: "100%" }}>
            <Toolbar />
            <Signup />
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default Main;
