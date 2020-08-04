import React, {useState, useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import {checkToken} from '../../../../utils/helpers';
import Preloader from '../../../Helpers/Preloader';
import socket from '../../../../utils/socket';

export default function UserInfo(props) {

    const {userData, openBox, currentUser, currentRoom} = props;
    const [preloaderCondition, showPreloader] = useState(false);

    useEffect(() => {
        socketOnListeners();
    }, []);

    const socketOnListeners = () => {
        socket.on("userBanCompleted", data => {
            showPreloader(false);
            props.onClose();
        });
    }

    const handleClose = () => {
        props.onClose();
    };

    const banHandler = (user) => {
        showPreloader(true);
        socket.emit('banUser', user, currentRoom._id);
    }

    return <Dialog open={openBox || false} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">User info</DialogTitle>
            <DialogContent>
                <Avatar alt={userData.avatar} src={userData.avatar} className="userInfoAvatar" />
                <p>Fullname: {userData.fullName}</p>
                <p>Email: {userData.email}</p>
                <p>Status: {userData.status}</p>
            </DialogContent>
            {preloaderCondition ? <Preloader showonleft="true" /> : null }
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
                {currentUser.status === "Admin" && userData._id !== currentUser._id? 
                    <Button onClick={() => banHandler(userData._id)} color="primary">
                        Ban
                    </Button>
                : null}
            </DialogActions>
        </Dialog>
}