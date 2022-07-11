import { useState } from "react";
import Layout from "../../../components/Layout/AdminLayout";
import DataTable from "./DataTableCrawler";
import { useMutation, useQuery } from "@apollo/client";
import { deleteCrawler } from "../../../graphql/mutations/crawler";
import { getCrawlerData } from "../../../graphql/queries/crawler";
import { successMessage } from "../../../utils/message";
import { CircularProgress, Switch } from "@material-ui/core";
import { getError } from "../../../utils/error";
import ConfirmDialog from "./ConfirmDialog";
import { Redirect } from "react-router-dom";
import { getFromStorage } from "../../../utils/storage";
import { getCrawlerStatus } from "../../../graphql/queries/crawler_status";
import { updateCrawlerStatus } from "../../../graphql/mutations/crawler_status";

const Crawler = () => {
  const [crawlData, setCrawlData] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loadingTemp, setLoadingTemp] = useState(false);
  const [loadingTemp1, setLoadingTemp1] = useState(false);
  const [id, setId] = useState("");
  const [deleteSingleCrawlerData] = useMutation(deleteCrawler);
  const { data, loading } = useQuery(getCrawlerData);
  const crawlerStatus = useQuery(getCrawlerStatus);
  const [statusCrawl, setStatusCrawl] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [updateCrawlerStatuss] = useMutation(updateCrawlerStatus);

  //Open Dialog
  const deleteCrawlingData = async () => {
    setOpen(false);
    setLoading1(true);

    try {
      const deleteSingle = await deleteSingleCrawlerData({ variables: { id } });
      setCrawlData(deleteSingle.data.deleteCrawler);
      successMessage("Data Deleted Successfully");
      setLoading1(false);
    } catch (err) {
      getError(err.toString());
      setLoading1(false);
    }
  };

  //Update crawling status
  const updateCrawlingStatus = async () => {
    setIsStatusLoading(true);
    try {
      const status = await updateCrawlerStatuss({ variables: { is_on: !statusCrawl } });
      setStatusCrawl(status.data.updateCrawlerStatus.is_on);
      setIsStatusLoading(false);
    } catch (err) {
      getError(err.toString());
      setIsStatusLoading(false);
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

  if (!loadingTemp1 && !crawlerStatus.loading && crawlerStatus.data) {
    setStatusCrawl(crawlerStatus.data.getCrawlerStatus.is_on);
    setLoadingTemp1(true);
  }

  if (!loading && !loadingTemp && data) {
    setCrawlData(data.getCrawlerData);
    setLoadingTemp(true);
  }

  return (
    <div>
      <div className="root">
        <Layout />
        <menu style={{ textAlign: "center" }}>
          <br />
          <h1 style={{ textAlign: "center" }}>Crawler</h1>
          <div>
            Crawler is{statusCrawl ? " " : " not "}Running:{" "}
            <Switch checked={statusCrawl} onChange={updateCrawlingStatus} disabled={isStatusLoading} /> (On/Off)
          </div>
          {!loading && !loading1 ? <DataTable crawlData={crawlData} handleDialog={handleDialog} /> : null}

          {(loading && !data) || loading1 ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <CircularProgress />
            </div>
          ) : null}
        </menu>
        <ConfirmDialog open={open} handleClose={handleDialog} deleteCrawlingData={deleteCrawlingData} />
      </div>
    </div>
  );
};

export default Crawler;
