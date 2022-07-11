import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";
import Users from './pages/admin/users/Users';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Posts from './pages/admin/posts/Posts';
import Channels from './pages/admin/channels/Channels';
import Trends from './pages/admin/trends/Trends';
import Login from './pages/admin/Login/Login';
import ProfileSettings from './pages/admin/profile_settings/ProfileSettings';
import UserProfileSettings from './pages/frontend/ProfileSettings/Settings'
import Home from './pages/frontend/Home/Home';
import Post from './pages/frontend/Post/Post';
import Following from './pages/frontend/Following/Following';
import Trending from './pages/frontend/Trending/Trending';
import UserLogin from './pages/frontend/Login/Login';
import SearchVideos from './pages/frontend/SearchVideos/SearchVideos';
import Main from './pages/frontend/Signup/Main';
import Verify from './pages/Verify/Verify';
import { removeFromStorage } from './utils/storage';
import ProfilePage from './pages/frontend/Profile/ProfilePage';
import MyProfilePage from './pages/frontend/MyProfile/MyProfilePage';
import Reports from './pages/admin/reports/Reports';
import ChangePassword from './pages/admin/change_password/ChangePassword';
import ChangePasswordPage from './pages/frontend/change_password/ChangePasswordPage';
import ResetPasswordPage from './pages/frontend/reset_password/ResetPasswordPage';
import Crawler from './pages/admin/Crawler/Crawler';

function App() {
  useEffect(() => {
    removeFromStorage("isVisited")
  }, [])

  return (
    <BrowserRouter>
      <div>
        <ToastContainer position="bottom-right" />
        <Switch>
          {/*Front End Routes */}
          <Route path="/" component={Home} exact/>
          <Route path="/search_videos" component={SearchVideos} exact/>
          <Route path="/post/:id" component={Post} exact/>
          <Route path="/trending" component={Trending} exact/>
          <Route path="/following" component={Following} exact/>
          <Route path="/profile_settings" component={UserProfileSettings} exact/>
          <Route path="/login" component={UserLogin} exact/>
          <Route path="/signup" component={Main} exact/>
          <Route path="/activate/:token" component={Verify} exact/>
          <Route path="/profile/:id" component={ProfilePage} exact />
          <Route path="/my_profile" component={MyProfilePage} exact />
          <Route path="/change_password" component={ChangePasswordPage} exact />
          <Route path="/reset_password/:token" component={ResetPasswordPage} exact />

          {/*Admin Routes */}
          <Route path="/admin/login" component={Login} exact />
          <Route path="/admin/users" component={Users} exact />
          <Route path="/admin/channels" component={Channels} exact />
          <Route path="/admin/posts" component={Posts} exact />
          <Route path="/admin/posts/:id" component={Posts} exact />
          <Route path="/admin/trends" component={Trends} exact />
          <Route path="/admin/profile_settings" component={ProfileSettings} exact />
          <Route path="/admin/change_password" component={ChangePassword} exact />
          <Route path="/admin/reports" component={Reports} exact />
          <Route path="/admin/crawler" component={Crawler} exact />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
