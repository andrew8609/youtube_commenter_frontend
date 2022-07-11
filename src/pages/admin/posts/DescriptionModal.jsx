import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import moment from "moment";
import { abbreviateNumber } from "../../../utils/NumberConvert";

const DescriptionModal = ({ open, handleOk, description }) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleOk}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Description</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <table border={1}>
              <tbody>
                <tr>
                  <th>Title</th>
                  <td>{description.title}</td>
                </tr>
                <tr>
                  <th>Type</th>
                  <td>{description.type}</td>
                </tr>
                <tr>
                  <th>Duration</th>
                  <td>{description.duration}</td>
                </tr>
                <tr>
                  <th>View Count</th>
                  <td>{abbreviateNumber(description.view_count)}</td>
                </tr>
                <tr>
                  <th>Like Count</th>
                  <td>{abbreviateNumber(description.like_count)}</td>
                </tr>
                <tr>
                  <th>Dislike Count</th>
                  <td>{abbreviateNumber(description.dislike_count)}</td>
                </tr>
                <tr>
                  <th>Published At</th>
                  <td>{moment(parseInt(description.created_at)).format("DD/MM/YYYY hh:mm A")}</td>
                </tr>
                <tr>
                  <th>Created At</th>
                  <td>{moment(parseInt(description.last_updated)).format("DD/MM/YYYY hh:mm A")}</td>
                </tr>
              </tbody>
            </table>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOk} color="secondary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DescriptionModal;
