import { useMutation, useQuery } from "@apollo/client";
import { CircularProgress, IconButton, Switch, TextField, Tooltip } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import "antd/dist/antd.css";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Layout from "../../../components/Layout/AdminLayout";
import { deleteChannel } from "../../../graphql/mutations/channels";
import { getChannels } from "../../../graphql/queries/channels";
import { getError } from "../../../utils/error";
import { successMessage } from "../../../utils/message";
import { getFromStorage } from "../../../utils/storage";
import "./channels.css";
import ConfirmDialog from "./ConfirmDialog";
import DataTable from "./DataTableChannels";
import DescriptionModal from "./DescriptionModal";
import ThumbnailsChannels from "./ThumbnailsChannels";

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [loading1, setLoading1] = React.useState(false);
  const [loadingTemp, setLoadingTemp] = React.useState(false);
  const [deleteSingleChannel, response] = useMutation(deleteChannel);
  const [isDatatable, setIsDatatable] = useState(false);
  const [channelsTemp, setChannelsTemp] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [description, setDescription] = useState(null);
  const { data, error, loading } = useQuery(getChannels());

  const showModal = (data) => {
    setDescription(data);
    setIsModalVisible(!isModalVisible);
  };

  //Open Dialog Channel
  const deleteChannels = async () => {
    // setLoading(true)
    setOpen(false);
    setLoading1(true);

    try {
      const deleteSingle = await deleteSingleChannel({ variables: { id } });
      setChannels(deleteSingle.data.deleteChannel);
      successMessage("Channel Deleted Successfully");
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
    const searchRows = channelsTemp.filter((item) =>
      item.title.toString().toLowerCase().includes(data.toString().toLowerCase())
    );
    setChannels(searchRows);
  };

  if (!getFromStorage("token")) {
    return <Redirect to="/admin/login" />;
  }

  if (!loading && !loadingTemp && data) {
    setChannels(data.getChannels);
    setChannelsTemp(data.getChannels);
    setLoadingTemp(true);
  }

  return (
    <div>
      <div className="root">
        <Layout />
        <menu style={{ textAlign: "center" }}>
          <br />
          <h1 style={{ textAlign: "center" }}>
            Channels
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

                <Tooltip title="Search Channel">
                  <IconButton aria-label="filter list">
                    <SearchOutlined />
                  </IconButton>
                </Tooltip>

                <div style={{ margin: 20 }}>
                  <ThumbnailsChannels channels={channels} handleDialog={handleDialog} showModal={showModal} />
                </div>
              </div>
            ) : (
              <DataTable channels={channels} handleDialog={handleDialog} />
            )
          ) : null}
        </menu>
        <ConfirmDialog open={open} handleClose={handleDialog} deleteChannel={deleteChannels} />
        {description && <DescriptionModal open={isModalVisible} handleOk={showModal} description={description} />}
      </div>
    </div>
  );
};

export default Channels;
