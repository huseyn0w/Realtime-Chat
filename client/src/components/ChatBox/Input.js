import React, {useState, useEffect, useContext, useRef} from 'react';
import {Context} from '../../store/Store';
// import {actions} from '../../reducers/actions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
// import socket from '../../utils/socket';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import Notification from '../Helpers/Notification';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    messageForm:{
        width: '100%',
    },
    root:{
        position: 'relative',
        padding:'0 20px',
        width: '100%',
    },
    input: {
        display: 'none'
    }
}))



function Input(props) {
    const classes = useStyles();
    const [message, setMessage] = useState('');
    const [file, setFile] = useState('');
    const [preview, setPreview] = useState('');
    const [emoji, showEmoji] = useState(false);
    const textInput = useRef(null);
    const [state] = useContext(Context);
    const [users, setUsers] = useState(state.roomUsers);
    const [searchUsers, setSearchUsers] = useState([]);
    const [openSuggestions, setOpenSuggestions] = useState(false);
    const [errorNotification, setErrorNotification] = useState({show:false, message: ''});


    useEffect(() => {
        setUsers(users => {
            return state.roomUsers;
        })
    }, [state.roomUsers]);


    const messageHandler = (e) => {
        let msg = e.target.value;
        let lastLetter = msg[msg.length - 1];
        if(lastLetter === ' ') setOpenSuggestions(false);
        if(lastLetter === '@' && !openSuggestions){
            setOpenSuggestions(true);
        }
        let lastAtPosition = msg.lastIndexOf('@');
        if(lastAtPosition > -1){
            // let lastSpacePosition = msg.lastIndexOf(' ');
            const userString = msg.slice(lastAtPosition + 1);
            if(userString){
                const searchUsers = users.filter((el, id) => {
                    return el.fullName.toLowerCase().search(userString.toLowerCase()) > -1;
                })

                if (searchUsers.length > 0) setSearchUsers(searchUsers);
            }
            else{
                setSearchUsers([]);
            }
        }
        
        setMessage(msg);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if(message || preview){
            let msg = {
                text: message,
                attachment: null,
            }
            if(preview){
                const data = new FormData();
                data.append('file', file)
                const uploadURL = process.env.REACT_APP_BACKEND_URL + '/upload';
                axios.post(uploadURL, data)
                .then(res => {
                    if(res.status === 200){
                        msg.attachment = res.data.filename;
                        props.onSend(msg);
                        setMessage('');
                        setPreview('');
                        setFile('');
                    }
                })
                .catch(e => {
                    let errorMessage = null;
                    // console.log(e.response);
                    if(e.response.data){
                        // console.log(e.response.data.message);
                        errorMessage= e.response.data.message;
                    }
                    else{
                        errorMessage= 'Some error ocurred, please try again later';
                    }

                    setErrorNotification({
                        show: true,
                        message: errorMessage
                    })

                    setTimeout(() => {
                        setErrorNotification({
                            show: false,
                            message: false
                        })
                    }, 3000);
                    
                })
            }
            else{
                props.onSend(msg);
                setMessage('');
                setPreview('');
                setFile('');
            }
        }
    }

    const handleImageChange = (e) => {
        e.preventDefault();

        
        var file = e.target.files[0];
        if(!file) return;

        e.target.value = '';

        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function (ev) {
            setPreview(reader.result);
            setFile(file);
        }

        
        
    }

    const resetImageHandler = (e) =>{
        setPreview('');
        setFile('');
    }

    const addEmoji = (e) => {
        let sym = e.unified.split('-');
        let codesArray = [];
        sym.forEach(el => codesArray.push('0x' + el));
        let emoji = String.fromCodePoint(...codesArray);
        setMessage(message => message + ' ' + emoji);
        showEmoji(false);
        textInput.current.focus();
    } 

    const addUsername = (fullName) => {

        let lastAtPosition = message.lastIndexOf('@');
        let modifiedMessage = message.slice(0, lastAtPosition + 1);
        setMessage(modifiedMessage + fullName  + ' ');
        textInput.current.focus();
        setOpenSuggestions(false);

    }


    let userSuggestionsList = null;
    if (users.length > 0) {
        userSuggestionsList = users.map((el, idx) => {
            return <li key={el._id} onClick={() => addUsername(el.fullName)}>{el.fullName}</li>
        })
    }

    if(searchUsers.length > 0){
        userSuggestionsList = searchUsers.map((el, idx) => {
            return <li key={el._id} onClick={() => addUsername(el.fullName)}>{el.fullName}</li>
        })
    }

    return (
        <form className={classes.messageForm} onSubmit={submitHandler} noValidate autoComplete="off">
            {errorNotification.show ? <Notification message={errorNotification.message} /> : null}
            <Grid container item xs={12} classes={{root: classes.root}} spacing={0}>
                <div className="attachment_cover">
                    {preview ? 
                        <React.Fragment>
                            <CancelIcon className="remove-attachment" onClick={resetImageHandler} />
                            <img src={preview} className="attachment-preview" alt="preview" />
                        </React.Fragment>
                    : null}
                </div>
                {emoji ?
                    <div className="emoji_cover">
                        <Picker set={"google"} showPreview={false} showSkinTones={false} onSelect={addEmoji} style={{ position: 'absolute', bottom: '60px', right: '20px' }} />
                    </div> : null
                }
                <Grid container item xs={9} spacing={0}>
                    {openSuggestions ?
                        <ul className="suggestionsList">
                            {userSuggestionsList}
                        </ul>
                    : null}
                    <TextField 
                        id="standard-basic" 
                        inputRef={textInput} 
                        value={message} 
                        onChange={messageHandler} 
                        className="messageInput" 
                        label="Message" 
                    />
                </Grid>
                <Grid container item xs={3} spacing={0}>
                    <input accept="image/*" onChange={(e)=> handleImageChange(e)} className={classes.input} id="icon-button-file" type="file" />
                    {/* <label htmlFor="icon-button-file">
                        <IconButton color="primary" className={classes.button} aria-label="Upload picture" component="span">
                            <PhotoCamera />
                        </IconButton>
                    </label> */}
                    <IconButton color="primary" className={classes.button} aria-label="Add emoji" onClick={() => showEmoji(!emoji)}>
                        <InsertEmoticonIcon />
                    </IconButton>
                    <Button
                        color="primary"
                        className={classes.button}
                        onClick={submitHandler}
                    >
                       <SendIcon>Send</SendIcon>
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default Input
