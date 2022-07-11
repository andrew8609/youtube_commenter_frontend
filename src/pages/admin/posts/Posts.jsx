import { CircularProgress, IconButton, Switch, TextField, Tooltip } from "@material-ui/core";
import { useState } from "react";
import Layout from "../../../components/Layout/AdminLayout";
import "./posts.css";
import ThumbnailsPosts from "./ThumbnailsPosts";

import ConfirmDialog from "./ConfirmDialog";
import { getFromStorage } from "../../../utils/storage";
import { Redirect, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { getPosts, getPostsByChannel } from "../../../graphql/queries/posts";
import { deletePost } from "../../../graphql/mutations/posts";
import { getError } from "../../../utils/error";
import { successMessage } from "../../../utils/message";
import DataTable from "./DataTablePosts";
import { SearchOutlined } from "@material-ui/icons";
import DescriptionModal from "./DescriptionModal";

const Posts = () => {
  const params = useParams();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loadingTemp, setLoadingTemp] = useState(false);
  const [deleteSinglePost] = useMutation(deletePost);
  const [isDatatable, setIsDatatable] = useState(false);
  const [postsTemp, setPostsTemp] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [description, setDescription] = useState(null);
  const { data, error, loading } = useQuery(params.id ? getPostsByChannel : getPosts(), {
    variables: { id: params.id, search },
  });

  const showModal = (data) => {
    setDescription(data);
    setIsModalVisible(!isModalVisible);
  };

  //Open Dialog Post
  const deletePosts = async () => {
    setOpen(false);
    setLoading1(true);

    try {
      const deleteSingle = await deleteSinglePost({ variables: { id } });
      setPosts(deleteSingle.data.deletePost);
      successMessage("Post Deleted Successfully");
      setLoading1(false);
    } catch (err) {
      getError(err.toString());
      setLoading1(false);
    }
  };

  //handle dialog
  const handleDialog = (id) => {
    setOpen(!open);
    setId(id);
  };

  //search data
  const searchData = (data) => {
    setSearch(data);
    const searchRows = postsTemp.filter((item) =>
      item.title.toString().toLowerCase().includes(data.toString().toLowerCase())
    );
    setPosts(searchRows);
  };

  if (!getFromStorage("token")) {
    return <Redirect to="/admin/login" />;
  }

  if (!loading && !loadingTemp && data) {
    setPosts(!params.id ? data.getPosts : data.getPostsByChannel);
    setPostsTemp(!params.id ? data.getPosts : data.getPostsByChannel);
    setLoadingTemp(true);
  }

  return (
    <div>
      <div className="root">
        <Layout />
        <menu style={{ textAlign: "center" }}>
          <br />
          <h1 style={{ textAlign: "center" }}>
            {params.id ? "Channel" : null} Posts
            <span style={{ float: "right", marginRight: 40, fontSize: "12px" }}>
              Row
              <Switch
                checked={isDatatable}
                onChange={() => {
                  setIsDatatable(!isDatatable);
                }}
              />
            </span>
          </h1>

          {!isDatatable ? (
            <div>
              <TextField
                value={search}
                onChange={(e) => searchData(e.target.value)}
                id="outlined-basic"
                label="Search"
                variant="outlined"
                style={{ background: "white" }}
              />

              <Tooltip title="Search Post">
                <IconButton aria-label="filter list">
                  <SearchOutlined />
                </IconButton>
              </Tooltip>
            </div>
          ) : null}
          {error ? <div style={{ textAlign: "center", marginTop: "20px", fontSize: "22px" }}>Error !</div> : null}
          {!loading && !loading1 ? (
            !isDatatable ? (
              <div>
                <div style={{ margin: 20 }}>
                  <ThumbnailsPosts posts={posts} handleDialog={handleDialog} showModal={showModal} />
                </div>
              </div>
            ) : (
              <DataTable posts={posts} handleDialog={handleDialog} />
            )
          ) : null}
          {(loading && !data) || loading1 ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <CircularProgress />
            </div>
          ) : null}
        </menu>
        <ConfirmDialog open={open} handleClose={handleDialog} deletePost={deletePosts} />
        {description && <DescriptionModal open={isModalVisible} handleOk={showModal} description={description} />}
      </div>
    </div>
  );
};

export default Posts;
