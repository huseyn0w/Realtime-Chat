import React, {useState, useContext, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import socket from '../../../../utils/socket';
import {checkToken} from '../../../../utils/helpers';
import {actions} from '../../../../reducers/actions';
import {Context} from '../../../../store/Store';
import Preloader from '../../../Helpers/Preloader';


export default function Profile(props) {

  const {open} = props;
  const [state, dispatch] = useContext(Context);
  const [fullName, setFullName] = useState(state.currentUser.fullName ?? '');
  const [email, setEmail] = useState(state.currentUser.email ?? '');
  const [avatar, setAvatar] = useState(state.currentUser.avatar ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [preloaderCondition, showPreloader] = useState(false);


  useEffect(() => {
      socketOnListeners();
  }, []);

  useEffect(() => {
    setFullName(state.currentUser.fullName);
    setEmail(state.currentUser.email);
    setAvatar(state.currentUser.avatar);
  }, [state.currentUser]);

  const socketOnListeners = () => {

    socket.on("userUpdateSuccess", data => {
      dispatch({type: actions.USER_DATA_UPDATED, payload: data});
      dispatch({type: actions.UPDATE_CURRENT_USER_IN_USERS_LIST, payload: data});
      props.closeDialog();
      showPreloader(false);
    });

    socket.on("roomUserUpdated", data => {
      dispatch({type: actions.USER_DATA_UPDATED, payload: data});
      dispatch({type: actions.UPDATE_CURRENT_USER_IN_USERS_LIST, payload: data});
      props.closeDialog();
      showPreloader(false);
    });

    


    return () => socket.disconnect();

  }

  const handleClose = () => {
    props.closeDialog();
  };


  const profileDataHandler = (e) => {
      e.preventDefault();
      const token = checkToken();
      socket.emit('updateUserData', {
        token,
        fullName,
        email,
        newPassword,
        avatar
      })
      showPreloader(true);
      // props.closeDialog();
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit profile details</DialogTitle>
        {preloaderCondition ? <Preloader /> : null}
        <form onSubmit={profileDataHandler}>
            <DialogContent>
                <TextField
                    id="roomtopic"
                    label="Full Name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    fullWidth
                    className="profile-input-item"
                />
                <TextField
                    id="avatar"
                    label="Avatar URL"
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    fullWidth
                    className="profile-input-item"
                />
                <TextField
                    id="roomtopic"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    className="profile-input-item"
                />
                <TextField
                    id="password"
                    label="New password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button type="submit" onClick={profileDataHandler} color="primary">
                Save
            </Button>
            </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}