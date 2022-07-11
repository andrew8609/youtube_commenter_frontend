import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function ConfirmDialog(props) {
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to delete trend?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="secondary">
            No
          </Button>
          <Button onClick={props.delete} color="secondary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
