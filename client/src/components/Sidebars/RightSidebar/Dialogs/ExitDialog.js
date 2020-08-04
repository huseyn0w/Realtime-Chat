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
import {actions} from '../../../../reducers/actions';

export default function ExitDialog(props) {

  const {open} = props;

  const [state, dispatch] = useContext(Context);

  const exitHandler = (e) => {
    const token = checkToken();
    const loggedUserFullName = state.currentUser.fullName;
    socket.emit('userExited', {
        token,
        room: state.currentRoom._id,
        fullName: loggedUserFullName
    });
    localStorage.removeItem('chatUserToken');
    dispatch({type: actions.LOGOUT_CHAT});
    props.closeDialog();
    window.location.reload(false);
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => props.closeDialog()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Exit the chat</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to leave the chat?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.closeDialog()} color="primary">
            Stay
          </Button>
          <Button onClick={exitHandler} color="primary">
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
