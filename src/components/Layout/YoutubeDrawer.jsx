import './youtube_layout.css';
import React from "react";
import {
    Toolbar,
    Drawer,
    Button,
    List,
    Typography,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Box,
    Hidden,
    useTheme,
    makeStyles,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import HomeIcon from "@material-ui/icons/Home";
import Subscriptions from "@material-ui/icons/Subscriptions";
import Whatshot from "@material-ui/icons/Whatshot";
import VideoLibrary from "@material-ui/icons/VideoLibrary";
import History from "@material-ui/icons/History";
import AddCircle from "@material-ui/icons/AddCircle";
import { Link, withRouter } from 'react-router-dom';
import { getFromStorage } from '../../utils/storage';

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

const YoutubeDrawer = ({ history }) => {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Hidden mdDown>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <List>
                        <ListItem button classes={{ root: classes.listItem }} onClick={() => history.push("/")}>
                            <ListItemIcon>{<HomeIcon />}</ListItemIcon>
                            <ListItemText
                                classes={{
                                    primary: classes.listItemText,
                                }}
                                primary={"Home"}
                            />
                        </ListItem>
                        <ListItem button classes={{ root: classes.listItem }} onClick={() => history.push("/trending")}>
                            <ListItemIcon>{<Whatshot />}</ListItemIcon>
                            <ListItemText
                                classes={{
                                    primary: classes.listItemText,
                                }}
                                primary={"Trending"}
                            />
                        </ListItem>
                        <ListItem button classes={{ root: classes.listItem }} onClick={() => history.push("/following")}>
                            <ListItemIcon>{<Subscriptions />}</ListItemIcon>
                            <ListItemText
                                classes={{
                                    primary: classes.listItemText,
                                }}
                                primary={"Following"}
                            />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button classes={{ root: classes.listItem }}>
                            <ListItemIcon>
                                <VideoLibrary />
                            </ListItemIcon>
                            <ListItemText
                                classes={{
                                    primary: classes.listItemText,
                                }}
                                primary={"Library"}
                            />
                        </ListItem>
                        <ListItem button classes={{ root: classes.listItem }}>
                            <ListItemIcon>
                                <History />
                            </ListItemIcon>
                            <ListItemText
                                classes={{
                                    primary: classes.listItemText,
                                }}
                                primary={"History"}
                            />
                        </ListItem>
                    </List>
                    {!getFromStorage("user_token") ?
                        <>
                            <Divider />
                            <Box p={7}>
                                <Typography variant="body2">
                                    Log in to like videos, comment and subscribe.
                                </Typography>
                                <Box mt={2}>
                                    <Link to="/login">
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            startIcon={<AccountCircle />}
                                        >
                                            Login
                                </Button>
                                    </Link>
                                </Box>
                            </Box>
                        </>
                        :
                        null
                    }
                    <Divider />
                    <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                            <ListSubheader
                                component="div"
                                id="nested-list-subheader"
                                className={classes.subheader}
                            >
                                THE BEST OF Wecept
                            </ListSubheader>
                        }
                    >
                        <ListItem button classes={{ root: classes.listItem }}>
                            <ListItemIcon>
                                <AddCircle />
                            </ListItemIcon>
                            <ListItemText
                                classes={{
                                    primary: classes.listItemText,
                                }}
                                primary={"Music"}
                            />
                        </ListItem>
                        <ListItem button classes={{ root: classes.listItem }}>
                            <ListItemIcon>
                                <AddCircle />
                            </ListItemIcon>
                            <ListItemText
                                classes={{
                                    primary: classes.listItemText,
                                }}
                                primary={"Sports"}
                            />
                        </ListItem>
                        <ListItem button classes={{ root: classes.listItem }}>
                            <ListItemIcon>
                                <AddCircle />
                            </ListItemIcon>
                            <ListItemText
                                classes={{
                                    primary: classes.listItemText,
                                }}
                                primary={"Games"}
                            />
                        </ListItem>
                        <ListItem button classes={{ root: classes.listItem }}>
                            <ListItemIcon>
                                <AddCircle />
                            </ListItemIcon>
                            <ListItemText
                                classes={{
                                    primary: classes.listItemText,
                                }}
                                primary={"Movies"}
                            />
                        </ListItem>
                        <ListItem button classes={{ root: classes.listItem }}>
                            <ListItemIcon>
                                <AddCircle />
                            </ListItemIcon>
                            <ListItemText
                                classes={{
                                    primary: classes.listItemText,
                                }}
                                primary={"News"}
                            />
                        </ListItem>
                        <ListItem button classes={{ root: classes.listItem }}>
                            <ListItemIcon>
                                <AddCircle />
                            </ListItemIcon>
                            <ListItemText
                                classes={{
                                    primary: classes.listItemText,
                                }}
                                primary={"Live"}
                            />
                        </ListItem>
                        <ListItem button classes={{ root: classes.listItem }}>
                            <ListItemIcon>
                                <AddCircle />
                            </ListItemIcon>
                            <ListItemText
                                classes={{
                                    primary: classes.listItemText,
                                }}
                                primary={"Highlights"}
                            />
                        </ListItem>
                        <ListItem button classes={{ root: classes.listItem }}>
                            <ListItemIcon>
                                <AddCircle />
                            </ListItemIcon>
                            <ListItemText
                                classes={{
                                    primary: classes.listItemText,
                                }}
                                primary={"Videos 360"}
                            />
                        </ListItem>
                    </List>
                    <Divider />
                    <ListItem button classes={{ root: classes.listItem }}>
                        <ListItemIcon>
                            <AddCircle />
                        </ListItemIcon>
                        <ListItemText
                            classes={{
                                primary: classes.listItemText,
                            }}
                            primary={"Search More"}
                        />
                    </ListItem>
                    <Divider />
                </div>
            </Drawer>
        </Hidden>
    )
}

export default withRouter(YoutubeDrawer);