import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function BannedUser() {
  const [open] = React.useState(true);

  const handleClose = () => {
    // setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"ALERT!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Unfortunately you have benn banned from the chat. Please contact administrator to get more details. You will be redirected to the home page now.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}