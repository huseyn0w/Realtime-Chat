import React, {useState, useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import LeftSidebar from './Sidebars/LeftSidebar/LeftSidebar';
import RightSidebar from './Sidebars/RightSidebar/RightSidebar';
import Chatbox from './ChatBox/ChatBox';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import PeopleIcon from '@material-ui/icons/People';
import {Context} from '../store/Store';
import socket from '../utils/socket';
import {actions} from '../reducers/actions';
import {checkToken} from '../utils/helpers';
import Notification from './Helpers/Notification';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Main() {
  const token = checkToken();
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);
  const [notificationEnabled, showNotification] = useState(false);

  useEffect(() => {
    socket.emit('newUser', token);
  }, [])

  useEffect(() => {
    socketOnListeners();
  }, []);

  const socketOnListeners = () => {
    socket.on("userUpdateSuccess", data => {
      showNotification(true);
      setTimeout(() => {
        showNotification(false);
      }, 3000);
    });
  };

  let messageFrameColumns = 8;
  let leftSidebarColumns = 2;
  let rightSidebarColumns = 2;
  if(!state.leftSidebar && !state.rightSidebar){
    messageFrameColumns = 10;
    leftSidebarColumns = 1;
    rightSidebarColumns = 1;
  }
  else if(!state.leftSidebar || !state.rightSidebar){
    messageFrameColumns = 9;
    if(!state.leftSidebar){
      leftSidebarColumns = 1;
      rightSidebarColumns = 2;
    }
    else{
      leftSidebarColumns = 2;
      rightSidebarColumns = 1;
    }
  }

  return (
    <div className={classes.root}>
      {notificationEnabled ?
        <Notification
          message="User data updated"
         /> : null
      }
      <Grid container spacing={0} className="MessageFrameCover">
        <Grid container item xs={leftSidebarColumns} spacing={0}>
          {state.leftSidebar ? <LeftSidebar /> : <DoubleArrowIcon color="primary" className='leftSidebarButton' onClick={() => dispatch({type: actions.LEFT_SIDEBAR, payload: true})} />}
        </Grid>
        <Grid container item xs={messageFrameColumns} spacing={0}>
          <Chatbox />
        </Grid>
        <Grid container item xs={rightSidebarColumns} spacing={0}>
          {state.rightSidebar ? <RightSidebar /> : <PeopleIcon className='rightSidebarButton' onClick={() => dispatch({type: actions.RIGHT_SIDEBAR, payload: true})} />}
        </Grid>
      </Grid>
    </div>
  );
}