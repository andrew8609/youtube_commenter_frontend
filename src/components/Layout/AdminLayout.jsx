import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { SupervisedUserCircle, PostAdd, ExitToApp, Tv, FireplaceRounded, SupervisedUserCircleOutlined, Report } from '@material-ui/icons'
import { Link } from 'react-router-dom';
import { removeFromStorage } from '../../utils/storage';
import { DatabaseFilled, LockFilled } from '@ant-design/icons';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function Layout() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logout = () => {
    removeFromStorage("token");
    window.location = "/admin/login";
  }

  const sidebarContents = [
    {
      name: "Users",
      component: <SupervisedUserCircle />
    },
    {
      name: "Channels",
      component: <Tv />
    },
    {
      name: "Posts",
      component: <PostAdd />
      
    },
    {
      name: "Trends",
      component: <FireplaceRounded />
      
    },
    {
      name: "Reports",
      component: <Report />
      
    },
    {
      name: "Crawler",
      component: <DatabaseFilled />
      
    },
    {
      name: "Profile Settings",
      component: <SupervisedUserCircleOutlined />
      
    },
    {
      name: "Change Password",
      component: <LockFilled />
      
    }
  ]

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{color: "white"}} noWrap>
            Wecept
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {sidebarContents.map((text, index) => (
            <Link key={text.name} to={`/admin/${text.name.toLowerCase() === "profile settings" ? "profile_settings" : text.name.toLowerCase() === "change password" ? "change_password" : text.name.toLowerCase()}`} style={{ textDecoration: "none", color: "rgba(0, 0, 0, 0.54)" }}>
              <ListItem button key={text.name}>
                <ListItemIcon>{text.component}</ListItemIcon>
                <ListItemText primary={text.name} />
              </ListItem>
            </Link>
          ))}
          
          <ListItem 
            button 
            key="Logout" 
            style={{ textDecoration: "none", color: "rgba(0, 0, 0, 0.54)" }} 
            onClick={logout} 
          >
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}