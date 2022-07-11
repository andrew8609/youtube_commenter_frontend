import "./youtube_layout.css";
import React, { useState } from "react";
import {
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Switch,
  Divider,
  Avatar,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Apps from "@material-ui/icons/Apps";
import { Menu, Dropdown, Modal } from "antd";
import { getFromStorage, removeFromStorage, setInStorage } from "../../utils/storage";
import { Link, withRouter } from "react-router-dom";
import { LiveTv, Subscriptions, Tv, Whatshot } from "@material-ui/icons";
import { VideoCameraFilled } from "@ant-design/icons";
import Search from "antd/lib/input/Search";
import logo from "../../images/istage-logo/logo.png";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundColor: theme.palette.background.dark,
  },
  appBar: {
    boxShadow: "none",
    zIndex: theme.zIndex.drawer + 1,
    height: theme.breakpoints.keys === "xs" ? 120 : 60,
  },

  toolbar: {
    flexWrap: theme.breakpoints.keys === "xs" ? "wrap-reverse" : "nowrap",
    justifyContent: theme.breakpoints.keys === "xs" ? "space-between" : "",
  },
  // logo: {
  //   height: "auto",
  // },
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
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  underline: {
    borderBottom: `1px solid ${theme.palette.secondary}`,
  },
}));

function YoutubeHeader({
  darkMode,
  setDarkMode,
  history,
  isLiveMode,
  setIsLiveMode,
  setIsRecording,
  setIsLaptopMode,
  isUserLive,
  openCloseModal,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [search, setSearch] = useState(
    window.location.search ? decodeURI(window.location.search.split("search=")[1]) : ""
  );

  const xs = useMediaQuery(theme.breakpoints.down("xs"));

  const onSearch = () => {
    history.push(`/search_videos?search=${search}`);
  };

  const handleOpen = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const menu = !window.location.pathname.includes("/post") ? (
    <Menu>
      <Menu.Item>Most Liked</Menu.Item>
      <Divider />
      <Menu.Item>Most Recent</Menu.Item>
      <Menu.Item>None</Menu.Item>
      <Divider />
      <Menu.Item>Large</Menu.Item>
      <Menu.Item>Default</Menu.Item>
    </Menu>
  ) : (
    <Menu>
      <Menu.Item onClick={() => setIsLaptopMode(false)}>Laptop Mode</Menu.Item>
      <Menu.Item onClick={() => setIsLaptopMode(true)}>Normal Mode</Menu.Item>
    </Menu>
  );

  const logout = () => {
    removeFromStorage("user_token");
    removeFromStorage("user_profile");
    window.location.reload();
  };

  const menu1 = (
    <Menu>
      <Menu.Item
        onClick={() => {
          if (isUserLive) {
            openCloseModal(true);
            setInStorage("path", "/my_profile");
          } else {
            history.push("/my_profile");
          }
        }}
      >
        Profile
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          if (isUserLive) {
            openCloseModal(true);
            setInStorage("path", "/change_password");
          } else {
            history.push("/change_password");
          }
        }}
      >
        Change Password
      </Menu.Item>
      <Menu.Item onClick={logout}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <AppBar color="inherit" className={classes.appBar}>
      <Modal title="Record Reaction" visible={isModalVisible} footer={null} onCancel={handleOk}>
        <p>First select video for reaction recording</p>
      </Modal>
      <Toolbar className={classes.toolbar}>
        {!xs && (
          <Link to="/">
            <img
              src={theme.palette.type === "dark" ? logo : logo}
              alt="logo"
              // className={classes.logo}
            />
          </Link>
        )}
        <Search
          placeholder="Search"
          allowClear
          size="large"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={onSearch}
          style={{ width: "100%", margin: 5, flexGrow: 1 }}
        />

        <Link>
          <Button
            startIcon={<Whatshot />}
            variant="outlined"
            color="secondary"
            style={{
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              borderBottom: history.location.pathname !== "/trending" && "none",
            }}
            onClick={() => {
              if (isUserLive) {
                openCloseModal(true);
                setInStorage("path", "/trending");
              } else {
                history.push("/trending");
              }
            }}
          >
            {xs ? "" : "Trending"}
          </Button>
        </Link>
        <Link>
          <Button
            startIcon={<Subscriptions />}
            variant="outlined"
            color="secondary"
            style={{
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              borderBottom: history.location.pathname !== "/following" && "none",
            }}
            onClick={() => {
              if (isUserLive) {
                openCloseModal(true);
                setInStorage("path", "/following");
              } else {
                history.push("/following");
              }
            }}
          >
            {xs ? "" : "Following"}
          </Button>
        </Link>
        {!xs && <Switch value={darkMode} onChange={() => setDarkMode(!darkMode)} className={classes.icons} />}
        <Button
          startIcon={isLiveMode ? <Tv /> : <LiveTv />}
          variant="text"
          color="secondary"
          onClick={() => {
            if (getFromStorage("user_id") && setIsLiveMode) {
              if (isUserLive) {
                openCloseModal(true);
                removeFromStorage("path");
              } else {
                setIsLiveMode(!isLiveMode);
              }
            } else if (setIsLiveMode) {
              if (isUserLive) {
                openCloseModal(true);
                setInStorage("path", "/login");
              } else {
                history.push("/login");
              }
            }
          }}
        >
          {isLiveMode ? "Solo" : "Live"}
        </Button>

        {!xs && (
          <IconButton className={classes.icons}>
            <Dropdown overlay={menu} placement="bottomCenter" arrow>
              <Apps />
            </Dropdown>
          </IconButton>
        )}

        <IconButton
          className={classes.icons}
          onClick={() => {
            if (getFromStorage("user_token")) {
              if (
                history.location.pathname.split("/")[1] === "post" &&
                history.location.pathname.split("/")[2].length > 0
              ) {
                setIsRecording();
              } else {
                handleOpen();
              }
            } else {
              history.push("/login");
            }
          }}
        >
          <VideoCameraFilled />
        </IconButton>
        {!getFromStorage("user_token") ? (
          <Link to="/login">
            <Button startIcon={<AccountCircle />} variant="outlined" color="secondary">
              Login
            </Button>
          </Link>
        ) : (
          <IconButton className={classes.icons}>
            <Dropdown overlay={menu1} placement="bottomCenter" arrow>
              <Avatar src={getFromStorage("user_profile")} className={classes.large} />
            </Dropdown>
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default withRouter(YoutubeHeader);
