import { CircularProgress, IconButton, Switch, TextField, Tooltip } from "@material-ui/core";
import { useState } from "react";
import Layout from "../../../components/Layout/AdminLayout";
import "./users.css";
import ThumbnailsUsers from "./ThumbnailsUsers";

import ConfirmDialog from "./ConfirmDialog";
import { getFromStorage } from "../../../utils/storage";
import { Redirect } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { getUsers } from "../../../graphql/queries/users";
import { deleteUser } from "../../../graphql/mutations/users";
import { getError } from "../../../utils/error";
import { successMessage } from "../../../utils/message";
import DataTable from "./DataTableUsers";
import "antd/dist/antd.css";
import { SearchOutlined } from "@material-ui/icons";
import DescriptionModal from "./DescriptionModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const { data, error, loading } = useQuery(getUsers());
  const [loading1, setLoading1] = useState(false);
  const [loadingTemp, setLoadingTemp] = useState(false);
  const [deleteSingleUser] = useMutation(deleteUser);
  const [isDatatable, setIsDatatable] = useState(false);
  const [usersTemp, setUsersTemp] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [description, setDescription] = useState(null);

  const showModal = (data) => {
    console.log(data);
    setDescription(data);
    setIsModalVisible(!isModalVisible);
  };

  //Open Dialog User
  const deleteUsers = async () => {
    // setLoading(true)
    setOpen(false);
    setLoading1(true);

    try {
      const deleteSingle = await deleteSingleUser({ variables: { id } });
      setUsers(deleteSingle.data.deleteUser);
      successMessage("User Deleted Successfully");
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
    const searchRows = usersTemp.filter(
      (item) =>
        item.name.toString().toLowerCase().includes(data.toString().toLowerCase()) ||
        item.email.toString().toLowerCase().includes(data.toString().toLowerCase())
    );
    setUsers(searchRows);
  };

  if (!getFromStorage("token")) {
    return <Redirect to="/admin/login" />;
  }

  if (!loading && !loadingTemp && data) {
    setUsers(data.getUsers);
    setUsersTemp(data.getUsers);
    setLoadingTemp(true);
  }

  return (
    <div>
      <div className="root">
        <Layout />
        <menu style={{ textAlign: "center" }}>
          <br />
          <h1 style={{ textAlign: "center" }}>
            Users
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
          <br />

          {(loading && !data) || loading1 ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <CircularProgress />
            </div>
          ) : null}
          {error ? (
            <div style={{ textAlign: "center", marginTop: "20px", fontSize: "22px" }}>{error.message} !</div>
          ) : null}

          {!loading && !loading1 ? (
            !isDatatable ? (
              <div>
                <TextField
                  value={search}
                  onChange={(e) => searchData(e.target.value)}
                  id="outlined-basic"
                  label="Search"
                  variant="outlined"
                  style={{ background: "white" }}
                />

                <Tooltip title="Search User">
                  <IconButton aria-label="filter list">
                    <SearchOutlined />
                  </IconButton>
                </Tooltip>

                <div style={{ margin: 20 }}>
                  <ThumbnailsUsers users={users} showModal={showModal} handleDialog={handleDialog} />
                </div>
              </div>
            ) : (
              <DataTable users={users} handleDialog={handleDialog} />
            )
          ) : null}
        </menu>
        <ConfirmDialog open={open} handleClose={handleDialog} deleteUser={deleteUsers} />
        {description && <DescriptionModal open={isModalVisible} handleOk={showModal} description={description} />}
      </div>
    </div>
  );
};

export default Users;
