import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import socket from '../../../../utils/socket';
import {checkToken} from '../../../../utils/helpers';

export default function CreateUpdate(props) {

  const {open, headline, action, saveHeadline, currentRoom} = props;
  const [roomName, setRoomName] = useState(currentRoom.name ?? '');
  const [roomTopic, setRoomTopic] = useState(currentRoom.topic ?? '');
  const [roomPassword, setRoomPassword] = useState('');

  const handleClose = () => {
    props.closeDialog();
  };

 

  const newRoomHandler = (e) => {
      e.preventDefault();
      const token = checkToken();
      if(roomName && roomTopic){
          const data = {
              token,
              room: {
                name: roomName,
                topic: roomTopic,
                password: roomPassword ?? null
              }
          }
          if(action === "new"){
            data.action = "create";
            const roomID = roomName.replace(/[\s#@!%&*()_+="ə~Ё/|<>,.;:?+\\]/g, "-").toLowerCase();
            data.room.id = roomID;
          }
          else{
            data.action = "update";
            data.room._id = currentRoom._id;
          }
          socket.emit('roomHandler', data);
          props.closeDialog();
      }
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{headline}</DialogTitle>
        <form onSubmit={newRoomHandler}>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="roomname"
                    label="Room name"
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    fullWidth
                />
                <TextField
                    id="roomtopic"
                    label="Room topic"
                    type="text"
                    value={roomTopic}
                    onChange={(e) => setRoomTopic(e.target.value)}
                    fullWidth
                />
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
            <Button type="submit" onClick={newRoomHandler} color="primary">
                {saveHeadline}
            </Button>
            </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}