import { useMutation, useQuery } from "@apollo/client";
import { CircularProgress, IconButton, Switch, TextField, Tooltip } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import Layout from "../../../components/Layout/AdminLayout";
import { deleteTrend } from "../../../graphql/mutations/trends";
import { getTrends } from "../../../graphql/queries/trends";
import { getError } from "../../../utils/error";
import { successMessage } from "../../../utils/message";
import { getFromStorage } from "../../../utils/storage";
import ConfirmDialog from "./ConfirmDialog";
import DataTable from "./DataTableTrends";
import DescriptionModal from "./DescriptionModal";
import ThumbnailsTrends from "./ThumbnailTrends";
import "./trends.css";

const Trends = () => {
  const [trends, setTrends] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const { data, error, loading } = useQuery(getTrends());
  const [loading1, setLoading1] = useState(false);
  const [loadingTemp, setLoadingTemp] = useState(false);
  const [deleteSingleTrend] = useMutation(deleteTrend);
  const [isDatatable, setIsDatatable] = useState(false);
  const [trendsTemp, setTrendsTemp] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [description, setDescription] = useState(null);

  const showModal = (data) => {
    console.log(data);
    setDescription(data);
    setIsModalVisible(!isModalVisible);
  };

  //Open Dialog Trends
  const deleteTrends = async () => {
    setOpen(false);
    setLoading1(true);

    try {
      const deleteSingle = await deleteSingleTrend({ variables: { id } });
      setTrends(deleteSingle.data.de);
      successMessage("Trend Deleted Successfully");
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
    const searchRows = trendsTemp.filter((item) =>
      item.title.toString().toLowerCase().includes(data.toString().toLowerCase())
    );
    setTrends(searchRows);
  };

  if (!getFromStorage("token")) {
    return <Redirect to="/admin/login" />;
  }

  if (!loading && !loadingTemp && data) {
    setTrends(data.getTrends);
    setTrendsTemp(data.getTrends);
    setLoadingTemp(true);
  }

  return (
    <div>
      <div className="root">
        <Layout />
        <menu style={{ textAlign: "center" }}>
          <br />
          <h1 style={{ textAlign: "center" }}>
            Trends
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

                <Tooltip title="Search Trend">
                  <IconButton aria-label="filter list">
                    <SearchOutlined />
                  </IconButton>
                </Tooltip>
                <div style={{ margin: 20 }}>
                  <ThumbnailsTrends trends={trends} handleDialog={handleDialog} showModal={showModal} />
                </div>
              </div>
            ) : (
              <DataTable trends={trends} handleDialog={handleDialog} />
            )
          ) : null}
        </menu>
        <ConfirmDialog open={open} handleClose={handleDialog} deleteTrends={deleteTrends} name="trend" />
        {description && <DescriptionModal open={isModalVisible} handleOk={showModal} description={description} />}
      </div>
    </div>
  );
};

export default Trends;
