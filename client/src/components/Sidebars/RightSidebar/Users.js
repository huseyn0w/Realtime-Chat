import React, {useState, useEffect, useContext} from 'react';
import {Context} from '../../../store/Store';
import {actions} from '../../../reducers/actions';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import SpringScrollbars from '../../../utils/ScrollBar';
import socket from '../../../utils/socket';
import {removeToken} from '../../../utils/helpers';
import UserInfo from './Dialogs/UserInfo';
import BannedModal from './Dialogs/BannedUser';
import Preloader from '../../Helpers/Preloader';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    paddingTop: '5px'
  },
  headBG: {
      backgroundColor: '#e0e0e0'
  },
  borderRight500: {
      borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '70vh',
    overflowY: 'hidden'
  }
});

const Chat = () => {
    const classes = useStyles();
    const [state, dispatch] = useContext(Context);
    const [users, setUsers] = useState(state.roomUsers);
    const [searchUsers, setSearchUsers] = useState([]);
    const [userID, setUserID] = useState('-');
    const [currentUserID, serCurrentUserID] = useState(null);
    const [userData, setUserData] = useState({
        _id:'-',
        fullName: '-',
        email: '-',
        status: '-',
    });
    const [open, setOpen] = useState(false);
    const [bannedDialog, showBannedDialog] = useState(false);

    useEffect(() => {
        // window.addEventListener("beforeunload", function (e) {
        //     const token = checkToken();
        //     socket.emit('userExited', {
        //         room:state.currentRoom._id,
        //         token,
        //         fullName:state.currentUser.fullName
        //     });

        // });
    });
    
    useEffect(() => {
        if(currentUserID === userID && !bannedDialog){
            banUser();
        }
    },[currentUserID, userID]);

    useEffect(() => {
        setUsers(users => {
            return state.roomUsers;
        })
    }, [state.roomUsers]);

    useEffect(() => {
        socketOnListeners();
    }, []);

    useEffect(() => {
        setUserData(data => {
            return state.currentUser
        })
        // serCurrentUserID(state.currentUser._id);
    }, [state.currentUser]);


    const banUser = () => {
        showBannedDialog(true);
        setTimeout(() => {
            removeToken();
        }, 5000);
    }

    const socketOnListeners = () => {
        
        socket.on("newUserArrived", data => {
            if(data.roomUsers){
                dispatch({type: actions.UPDATE_USERS_LIST, payload: data.roomUsers}); 
            }
        });

        socket.on("joinCompleted", data => {
            if (data.currentUser){
                if(data.currentUser.banned) banUser();
                serCurrentUserID(data.currentUser._id);
                dispatch({type: actions.UPDATE_CURRENT_USER, payload: data.currentUser}); 
            }
            if(data.roomUsers){
                dispatch({type: actions.UPDATE_USERS_LIST, payload: data.roomUsers}); 
            }
        });

        socket.on("userGone", userID => {
             dispatch({type: actions.USER_LEFT, payload: userID}); 
        });

        socket.on('user-left-room', data => {
            if(data.roomUsers){
                dispatch({type: actions.UPDATE_USERS_LIST, payload: data.roomUsers});
            }
        });

         socket.on('userLeft', data => {
            if(data.roomUsers){
                dispatch({type: actions.UPDATE_USERS_LIST, payload: data.roomUsers});
            }
        });

        socket.on("room-changed", data => {
            if(data.roomUsers){
                dispatch({type: actions.UPDATE_USERS_LIST, payload: data.roomUsers});
            }
        });
        
        socket.on("room-changed-rest", data => {
            if(data.roomUsers){
                dispatch({type: actions.UPDATE_USERS_LIST, payload: data.roomUsers});
            }
        });

        socket.on('userBanCompleted', data => {
            setUserID(data.userID);
            if(data.currentRoomUsers){
                dispatch({type: actions.UPDATE_USERS_LIST, payload: data.currentRoomUsers});
            }
        });
    }

    const searchUserHandler = (e) => {
        const fullName = e.target.value;
        if(fullName){
            const searchUsers = users.filter((el, id) => {
                return el.fullName.toLowerCase().search(fullName.toLowerCase()) > -1;
            })

            if (searchUsers.length > 0) setSearchUsers(searchUsers);
        }
        else{
            setSearchUsers([]);
        }
    }

    const userHandler = (userID) => {
        const clickedUser = users.filter((el, id) => {
            return el._id === userID;
        });
        if(clickedUser.length > 0){
            setUserData(clickedUser[0]);
            setOpen(true);
        }
    }

    let usersList = (
        <div className="roomsPreloader">
            <Preloader />
        </div>
    )
    if(users.length > 0){
        usersList = users.map((el, idx) => {
                return <ListItem button key={el._id} id={el._id} onClick={() => userHandler(el._id)}>
                            <ListItemIcon>
                                <Avatar alt={el.fullName} src={el.avatar} />
                            </ListItemIcon>
                            <ListItemText primary={el.fullName}>{el.fullName}</ListItemText>
                        </ListItem>
        });
    }

    if(searchUsers.length > 0){
        usersList = searchUsers.map((el, idx) => {
                return <ListItem button key={el._id} id={el._id} onClick={() => userHandler(el._id)}>
                            <ListItemIcon>
                                <Avatar alt={el.fullName} src={el.avatar} />
                            </ListItemIcon>
                            <ListItemText primary={el.fullName}>{el.fullName}</ListItemText>
                        </ListItem>
        }); 
    }


    return (
        <div>
            {bannedDialog ? <BannedModal /> : null}
            <UserInfo 
                userData={userData}
                currentUser={state.currentUser}
                currentRoom={state.currentRoom}
                openBox={open}
                onClose={() => setOpen(false)}
            />
            <Grid container component={Paper} className={classes.chatSection}>
                <Grid item xs={12} className={classes.borderRight500}>
                    <Grid item xs={12} style={{padding: '10px'}}>
                        <TextField id="outlined-basic-email" onChange={searchUserHandler} label="Search user in room" variant="outlined" fullWidth />
                    </Grid>
                    <Divider />
                    <SpringScrollbars
                    autoHide={true}
                    style={{ width: '100%', height: '78vh' }}>
                        <List>
                            {usersList}
                        </List>
                    </SpringScrollbars>
                </Grid>
            </Grid>
        </div>
    );
}

export default Chat;