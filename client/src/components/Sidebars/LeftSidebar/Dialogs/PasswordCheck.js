import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import socket from '../../../../utils/socket';
import {checkToken} from '../../../../utils/helpers';

export default function PasswordCheck(props) {

  const {open, headline, saveHeadline, currentRoom, authorFullName, passRoom} = props;
  const [roomPassword, setRoomPassword] = useState(currentRoom.password ?? '');
  const [wrongPass, setWrongPass] = useState(false);

  useEffect(() => {
      socketOnListeners();
  }, []);

  const socketOnListeners = () => {

      socket.on("room-changed", data => {
          setRoomPassword('');
          props.closeDialog();
      });

      socket.on("wrongPass", data => {
          setRoomPassword('');
          setWrongPass(true);
      });


      return () => socket.disconnect();

    }

  const handleClose = () => {
    props.closeDialog();
  };


  const changeRoomHandler = (e) => {
      const token = checkToken();
      e.preventDefault();
      const data = {
          passRoom,
          author: authorFullName,
          currentRoom,
          roomPassword
      };
      socket.emit('roomAuthMiddleware', token, data);
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{wrongPass ? 'Wrong password' : headline}</DialogTitle>
        <form onSubmit={changeRoomHandler}>
            <DialogContent>
                <TextField
                    id="roomPassword"
                    label="Room password"
                    type="Password"
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button type="submit" onClick={changeRoomHandler} color="primary">
                {saveHeadline}
            </Button>
            </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}