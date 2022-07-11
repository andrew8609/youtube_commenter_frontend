import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

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
            <div>
              <div>
                <strong>Title</strong>
              </div>
              <div>{description.title}</div>
            </div>
            <br />
            <div>
              <div>
                <strong>Description</strong>
              </div>
              <div>{description.description}</div>
            </div>
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
