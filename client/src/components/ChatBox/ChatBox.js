import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MessageFrame from './MessageFrame';
import Input from './Input';
import Grid from '@material-ui/core/Grid';
import {checkToken} from '../../utils/helpers';
import socket from '../../utils/socket';
import {Context} from '../../store/Store';



const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
      padding:'0',
  }
}));


export default function ChatBox(props) {
  const classes = useStyles();
  const [state] = useContext(Context);
  
  const submitHandler = (msg) => {
    const token = checkToken();
    const data = {
      room: state.currentRoom,
      msg,
      user: state.currentUser.fullName,
      avatar:state.currentUser.avatar
    }
    socket.emit('newMsg', token, data);
  }

  return (
    <Grid container item xs={12} classes={{root: classes.root}} spacing={0}>
        <MessageFrame />
        <Input onSend={submitHandler} />
    </Grid>
  );
}