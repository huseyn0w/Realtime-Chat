import React from 'react';
import Slide from '@material-ui/core/Slide';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';


export default function MessageItem(props) {
  const {data: {message, attachment, avatar, sender}, direction} = props;

  const date = moment().format('LT');

  let messageBox;

   let msg_attachment = null;
   if(attachment){
        msg_attachment = <div>
            <a href={process.env.REACT_APP_BACKEND_URL + '/server/images/' + attachment} target="_blank" rel="noopener noreferrer">
                <img src={process.env.REACT_APP_BACKEND_URL + '/server/images/' + attachment} alt="Message Attachment" className="messageItemAttachment" />
            </a>
        </div> 
   }


  if(direction === 'left'){
      messageBox = (
          <Slide direction="right" in={true} mountOnEnter unmountOnExit>
            <ListItem align="left" style={{padding: 0, marginBottom: 15}}>
                {sender !== 'System' ?
                <ListItemIcon>
                    <Avatar alt="User avatar" src={avatar} />
                </ListItemIcon> : null}  
                <ListItemText align="left" className="messageItemTextCover">
                    <p className="messageHeadline">{sender + ' - ' + date}</p>
                    {msg_attachment ? <p>{msg_attachment}</p> : null}
                    {message ?
                        <p className="messageItemFrom">
                            <span>{message}</span>
                        </p> : null
                    }
                </ListItemText>
            </ListItem>
          </Slide>
      );
  }
  else if(direction === 'center'){
      messageBox = (
          <Slide direction="down" in={true} mountOnEnter unmountOnExit>
            <ListItem align="center" style={{padding: 0, marginBottom: 15}}>
                {sender !== 'System' ?
                <ListItemIcon>
                    <Avatar alt="User avatar" src={avatar} />
                </ListItemIcon> : null}  
                <ListItemText align="center" className="messageItemTextCover">
                    <p className="">{sender + ' - ' + date}</p>
                    {msg_attachment ? <p>{msg_attachment}</p> : null}
                    {message ?
                        <p>
                            <span>{message}</span>
                        </p> : null
                    }
                </ListItemText>
            </ListItem>
          </Slide>
      );
  }
  else{
      messageBox = (
          <Slide direction="left" in={true} mountOnEnter unmountOnExit>
            <ListItem align="right" style={{padding: 0, marginBottom: 15}}>
                <ListItemText align="right" className="messageItemTextCover messageTo">
                    <p className="messageHeadline">{sender + ' - ' + date}</p>
                    {msg_attachment ? <div>{msg_attachment}</div> : null}
                    {message ?
                        <p className="messageItemTo">
                            <span>{message}</span>
                        </p> : null
                    }
                </ListItemText>
                <ListItemIcon style={{justifyContent:'flex-end'}}>
                    <Avatar alt="User avatar" src={avatar} />
                </ListItemIcon>
            </ListItem>
          </Slide>
      );
  }


  
  return (
    <ListItem style={{padding:0}}>
        <Grid container style={{padding:0}}>
            <Grid item xs={12}>
                <List>
                    {messageBox}
                </List>
            </Grid>
        </Grid>
    </ListItem>
  );
}
