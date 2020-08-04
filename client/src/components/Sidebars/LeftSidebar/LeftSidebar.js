import React,{useState, useContext, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import {Context} from '../../../store/Store';
import socket from '../../../utils/socket';
import Search from './Search';
import SpringScrollbars from '../../../utils/ScrollBar';
import LeftButtons from './LeftButtons';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LockIcon from '@material-ui/icons/Lock';
import StarIcon from '@material-ui/icons/Star';
import {actions} from '../../../reducers/actions';
import PasswordCheck from './Dialogs/PasswordCheck';
import {checkToken, removeToken} from '../../../utils/helpers';
import Preloader from '../../Helpers/Preloader';


const useStyles = makeStyles({
  root: {
    background: '#EAF5F0',
    padding: '0 15px'
  },
});


function LeftSidebar() {

    const [state, dispatch] = useContext(Context);
    const [rooms, setRooms] = useState(state.rooms);
    const [SearchRooms, setSearchRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(state.currentRoom);
    const [passRoom, setPassRoom] = useState('');
    const [showPassDialog, openPassDialog] = useState(false);

    const classes = useStyles();

    useEffect(() => {
        setRooms(rooms => {
            return state.rooms;
        });
        setCurrentRoom(state.currentRoom);
    }, [state.rooms, state.currentRoom]);

    useEffect(() => {
        socketOnListeners();
    }, []);

    const socketOnListeners = () => {

      socket.on("tokenError", removeToken);

      socket.on("joinCompleted", data => {
        if(data.currentUser && data.currentUser !== null){
            dispatch({type: actions.UPDATE_CURRENT_USER, payload: data.currentUser }); 
        }
        if(data.roomsList.rooms && data.roomsList.rooms.length > 0){
            dispatch({type: actions.LOAD_ROOMS, payload: data.roomsList.rooms}); 
            
            if(data.currentRoom && data.currentRoom !== null){
                dispatch({type: actions.CURRENT_ROOM, payload: data.currentRoom}); 
            }
        }
      });

      socket.on("newUserArrived", data => {
            if(data.roomsList.rooms && data.roomsList.rooms.length > 0){
                dispatch({type: actions.LOAD_ROOMS, payload: data.roomsList.rooms}); 
                
                if(data.currentRoom && data.currentRoom !== null){
                    dispatch({type: actions.CURRENT_ROOM, payload: data.currentRoom}); 
                }
            }
        });

      socket.on("room-changed", data => {
          dispatch({type: actions.CURRENT_ROOM, payload: data.room}); 
      });

      socket.on("roomCreated", data => {
          dispatch({type: actions.CREATE_ROOM, payload: data});
      });

      socket.on("roomUpdated", room => {
          dispatch({type: actions.UPDATE_ROOM, payload: room});
      });


      socket.on("roomDeleted", room => {
          dispatch({type: actions.DELETE_ROOM, payload: room._id});
      });


      return () => socket.disconnect();

    }

    const roomHandler = (newRoom) => {
        const token = checkToken();
        if(newRoom.protected){
            setPassRoom(newRoom);
            openPassDialog(true);
        }
        else{
            // console.log(currentRoom);
            if(currentRoom._id !== newRoom._id){
                socket.emit('change-room', token, currentRoom, newRoom, state.currentUser.fullName);
            }
        }

        
    }

    const searchHandler = (room) => {
        if(room){
            const newRooms = rooms.filter((el, id) => {
                return el.name.toLowerCase().search(room.toLowerCase()) > -1;
            })

            if (newRooms.length > 0) setSearchRooms(newRooms);
        }
        else{
            setSearchRooms([])
        }
        
    }

    let roomsList = (
        <div className="roomsPreloader">
            <Preloader />
        </div>
    );

    if(rooms.length > 0){
        roomsList = rooms.map((room, idx) => {
            let arr_key = 0;
            let selectedKey = 0;
            if(rooms.length > 1) {
                arr_key = room._id;
                // console.log(currentRoom);
                selectedKey = currentRoom === null ? 0 : currentRoom._id;
            }
            return (
                    <ListItem
                        button
                        key={arr_key}
                        selected={arr_key === selectedKey ? true : false}
                        onClick={() => roomHandler(room)}
                    >
                    {arr_key=== selectedKey ?
                    <ListItemIcon>
                        <StarIcon />
                    </ListItemIcon>  : null}
                    <ListItemText primary={room.name} />
                    {room.protected ? <LockIcon /> : null}
                    
                </ListItem>
            )
        });
    }


    if(SearchRooms.length > 0){
       roomsList = SearchRooms.map((room) => {
           let arr_key = 0;
           let selectedKey = 0;
           if (rooms.length > 1) {
               arr_key = room._id;
               selectedKey = currentRoom === null ? 0 : currentRoom._id;
           }
            return (
                    <ListItem
                    button
                    key={arr_key}
                    selected={arr_key === selectedKey ? true : false}
                    onClick={() => roomHandler(room)}
                    >
                    {arr_key=== selectedKey ?
                    <ListItemIcon>
                        <StarIcon />
                    </ListItemIcon>  : null}
                    <ListItemText primary={room.name} />
                    {room.protected ? <LockIcon /> : null}
                </ListItem>
            )
        });
    }

    return (
        <Grid container classes={{root: classes.root}} item xs={12} spacing={0}>
            {showPassDialog ? 
                <PasswordCheck 
                    open={true}
                    currentRoom={currentRoom}
                    passRoom={passRoom}
                    authorFullName={state.currentUser.fullName}
                    closeDialog={() => openPassDialog(false)}
                    headline="Enter password"
                    saveHeadline="Save"
                    action="new"
                />
            : null}
            <div className="leftSearch">
                <Search handler={searchHandler} placeholderText={'Filter room names'} />
            </div>
            <SpringScrollbars
                autoHide={true}
                style={{ width: '100%', height: '75vh' }}>
                <div className="leftRooms">
                    <List component="nav" aria-label="rooms-list">
                        {roomsList}
                    </List>
                </div>
            </SpringScrollbars>
            <LeftButtons />
        </Grid>
    )
}

export default LeftSidebar;
