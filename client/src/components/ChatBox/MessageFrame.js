import React,{useState, useContext, useEffect} from 'react';
import MessageItem from './MessageItem';
import {Context} from '../../store/Store';
import socket from '../../utils/socket';
import {actions} from '../../reducers/actions';
import List from '@material-ui/core/List';
import SpringScrollbars from '../../utils/ScrollBar';
import message_sound from '../../message.ogg';
import BackgroundAnimation from './BackgroundAnimation';


function MessageFrame() {

    const [state, dispatch] = useContext(Context);
    const [audio] = useState(new Audio(message_sound));
    const [messages, setMessages] = useState([]);
    const [playing, setPlaying] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(null);


    useEffect(() => {
        if(playing){
          audio.play();
        }
        else{
           audio.pause();
           audio.currentTime = 0;
        }
        setTimeout(() => {
          setPlaying(false);
        }, 3000);
      },
      [playing]
    );


    useEffect(() => {
        socketOnListeners();
    }, []);


    const socketOnListeners = () => {

      socket.on("joinCompleted", data => {
        dispatch({type: actions.UPDATE_CURRENT_USER, payload: data.currentUser});
        setMessages(messages => [...messages, data]);
      });

      socket.on("newUserArrived", data => {
        setPlaying(true);
        setMessages(messages => [...messages, data]);
      });

      socket.on("room-changed", data => {
        setMessages(messages => [data.message]);
        dispatch({type: actions.NEW_ROOM, payload: data.room});
      });

      socket.on("room-changed-rest", data => {
        setMessages(messages => [...messages, data.message]);
        dispatch({type: actions.NEW_ROOM, payload: data.room});
        if(data.roomUsers){
          dispatch({type: actions.UPDATE_USERS_LIST, payload: data.roomUsers});
        }
        
      });

      socket.on('newMsgSaved', data => {
        setCurrentMessage(data.message)
        setMessages(messages => {
          if(messages.length > 1000) {
            return [data];
          }
          else{
            return [...messages, data]
          }
        });
      });

  
      socket.on('user-left-room', data => {
        setMessages(messages => [...messages, data.message]);
      });

      socket.on('userLeft', data => {
        setMessages(messages => [...messages, data.message]);
        dispatch({type: actions.UPDATE_USERS_LIST, payload: data.currentRoomUsers});
      });

      socket.on('userExit', data => {
        setMessages(messages => [...messages, data]);
      });

      return () => socket.disconnect();

    }

    if(currentMessage && currentMessage.indexOf(state.currentUser.fullName) > -1 && !playing) {
      setPlaying(true);
      setCurrentMessage(null);
      setTimeout(() => {
        setPlaying(false);
      }, 3000);
    }

    return (
        <SpringScrollbars 
            autoHide={true}
            scrolltobottom='1'
            renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{display:"none"}}/>}
            renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" style={{display:"none"}}/>}
            renderView={props => <div style={{padding: '0 25px 0 15px', ...props.style}} />}
            style={{ width: '100%', height: '90vh' }}>
            <List>
              {messages.length > 5 ? <BackgroundAnimation /> : null }

              {messages.length > 0 ? messages.map((el,idx) => {
                  const userIndex = state.roomUsers.findIndex(x => x._id === el.user)
                  let avatar = null;
                  if(userIndex > -1){
                    avatar = state.roomUsers[userIndex].avatar;
                  }
                  el.avatar = avatar;

                  let direction = 'left';
                  if(el.type === 'system'){
                    direction = 'center';
                  }
                  else if(el.type === 'current'){
                    direction = 'right';
                  }
                  return (
                      <MessageItem key={idx} data={el} direction={direction} />
                  );
              }) : null}
            </List>
        </SpringScrollbars>
    )
}

export default MessageFrame;
