import { CircularProgress } from "@material-ui/core";
import { useState } from "react";
import Layout from "../../../components/Layout/AdminLayout";
import "./reports.css";

import ConfirmDialog from "./ConfirmDialog";
import { getFromStorage } from "../../../utils/storage";
import { Redirect } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { getReports } from "../../../graphql/queries/reports";
import { deleteReport } from "../../../graphql/mutations/reports";
import { getError } from "../../../utils/error";
import { successMessage } from "../../../utils/message";
import DataTable from "./DataTableReports";
import "antd/dist/antd.css";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loadingTemp, setLoadingTemp] = useState(false);
  const [deleteSingleReport] = useMutation(deleteReport);
  const { data, error, loading } = useQuery(getReports());

  //Open Dialog Channel
  const deleteReports = async () => {
    // setLoading(true)
    setOpen(false);
    setLoading1(true);

    try {
      const deleteSingle = await deleteSingleReport({ variables: { id } });
      setReports(deleteSingle.data.deleteReport);
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

  if (!getFromStorage("token")) {
    return <Redirect to="/admin/login" />;
  }

  if (!loading && !loadingTemp && data) {
    setReports(data.getReports);
    setLoadingTemp(true);
  }

  return (
    <div>
      <div className="root">
        <Layout />
        <menu style={{ textAlign: "center" }}>
          <br />
          <h1 style={{ textAlign: "center" }}>Reports</h1>

          {(loading && !data) || loading1 ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <CircularProgress />
            </div>
          ) : null}
          {error ? (
            <div style={{ textAlign: "center", marginTop: "20px", fontSize: "22px" }}>{error.message} !</div>
          ) : null}

          {!loading && !loading1 ? <DataTable reports={reports} handleDialog={handleDialog} /> : null}
        </menu>
        <ConfirmDialog open={open} handleClose={handleDialog} deleteReport={deleteReports} />
      </div>
    </div>
  );
};

export default Reports;
