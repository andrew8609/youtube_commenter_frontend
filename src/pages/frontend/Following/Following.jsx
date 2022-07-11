import { Box, makeStyles, Toolbar, Typography } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { useState } from "react";
import YoutubeHeader from "../../../components/Layout/YoutubeHeader";
import Videos from "./Videos";

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function Following() {
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
            {/* <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                            <Tab label="Videos" {...a11yProps(0)} />
                            <Tab label="Posts" {...a11yProps(1)} />
                        </Tabs> */}
            {/* <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={value}
                            onChangeIndex={handleChangeIndex}
                        > */}
            {/* <TabPanel value={value} index={0} dir={theme.direction}> */}
            <Videos />
            {/* </TabPanel>
                            <TabPanel value={value} index={1} dir={theme.direction}> */}
            {/* <Posts /> */}
            {/* </TabPanel> */}
            {/* </SwipeableViews> */}
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default Following;
