import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import moment from "moment";

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
                  <th>Name</th>
                  <td>{description.name}</td>
                </tr>
                <tr>
                  <th>Date of Birth</th>
                  <td>{description.dob}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{description.email}</td>
                </tr>
                <tr>
                  <th>Is Activated</th>
                  <td>{description.is_activated ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <th>Is Verified</th>
                  <td>{description.is_verified ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <th>Last Signed IP</th>
                  <td>{description.last_signed_ip}</td>
                </tr>
                <tr>
                  <th>Last Signed Date</th>
                  <td>{moment(parseInt(description.last_signed_date)).format("DD/MM/YYYY hh:mm")}</td>
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
