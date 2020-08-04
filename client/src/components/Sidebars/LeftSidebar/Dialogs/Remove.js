import React, {useContext} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import socket from '../../../../utils/socket';
import {checkToken} from '../../../../utils/helpers';
import {Context} from '../../../../store/Store';

export default function RemoveDialog(props) {

  const {open, currentRoom} = props;

  const [state] = useContext(Context);


  const removeRoom = (e) => {
    const token = checkToken();
    socket.emit('roomHandler', {
        token,
        room: currentRoom,
        defaultRoom: state.rooms[0]
    });
    props.closeDialog();
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => props.closeDialog()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Remove the room</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure? All room members will be transfered to the "Guest room", and room will be removed completely.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.closeDialog()} color="primary">
            Cancel
          </Button>
          <Button onClick={removeRoom} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
