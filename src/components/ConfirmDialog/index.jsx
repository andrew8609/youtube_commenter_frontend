import React from "react";
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
        onClose={props.onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title || "Confirm"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{props.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel} color="secondary">
            No
          </Button>
          <Button onClick={props.onOk} color="secondary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
