import React, {useState, useContext, Fragment} from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {Context} from '../../../store/Store';
import {actions} from '../../../reducers/actions';
import CreateUpdateDialog from './Dialogs/CreateUpdate';
import RemoveDialog from './Dialogs/Remove';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(0),
        },
    },
    fab: {
        margin: theme.spacing(0),
    },
    absolute: {
        position: 'absolute',
        bottom: theme.spacing(0),
        right: theme.spacing(3),
    },
    customButtons: {
        padding:'0 5px',
    }
}));



function LeftButtons(props) {
    const classes = useStyles();
    const [state, dispatch] = useContext(Context);
    const [createDialog, openCreateDialog] = useState(false);
    const [updateDialog, openUpdateDialog] = useState(false);
    const [deleteDialog, openDeleteDialog] = useState(false);

    // useEffect(() => {
    //     socket.on("room-changed", data => {
    //         setCurrentRoom(data.room);
    //         console.log(data.room);
    //     });
    // }, [])

    const handleCreateDialog = () => {
        openCreateDialog(true);
    };

    const handleUpdateDialog = () => {
        openUpdateDialog(true);
    };

    const handleDeleteDialog = () => {
        openDeleteDialog(true);
    };

    const hideSidebarHandler = (e) => {
        dispatch({type: actions.LEFT_SIDEBAR, payload: false});
    }

    // if(state.currentRoom !== null){
    //     console.log('state id ' + state.currentRoom._id);
    //     console.log('env id ' + process.env.REACT_APP_GUEST_ROOM_ID);

    //     console.log(process.env.REACT_APP_GUEST_ROOM_ID == state.currentRoom._id);
    // }
    
    
    return (
        <div className="leftButtons">
            <Grid container classes={{root: classes.root}} item xs={12} spacing={0}>
                <Grid container classes={{root: classes.root}} item xs={10} spacing={0}>
                    <Tooltip title="Add room">
                        <IconButton color="primary" onClick={handleCreateDialog} classes={{root: classes.customButtons}} aria-label="add an alarm">
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    {state.currentRoom !== null && state.currentRoom._id !== process.env.REACT_APP_GUEST_ROOM_ID ?
                    <Tooltip title="Rename room">
                        <IconButton color="primary" onClick={handleUpdateDialog} classes={{root: classes.customButtons}} aria-label="add an alarm">
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    : null}
                    {state.currentRoom !== null && state.currentRoom._id !== process.env.REACT_APP_GUEST_ROOM_ID ?
                        <Tooltip title="Delete room">
                            <IconButton color="primary" onClick={handleDeleteDialog} classes={{root: classes.customButtons}} aria-label="add an alarm">
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip> : null
                    }  
                </Grid>
                <Grid container classes={{root: classes.root}} item xs={2} spacing={0}>
                    <Tooltip title="Hide sidebar">
                        <IconButton color="primary" onClick={hideSidebarHandler} classes={{root: classes.customButtons}} aria-label="add an alarm">
                            <ArrowBackIosIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <Fragment>
                {createDialog ? 
                    <CreateUpdateDialog 
                        open={true} 
                        closeDialog={() => openCreateDialog(false)}
                        headline="Create room"
                        saveHeadline="Save"
                        action="new"
                        currentRoom=""
                    />
                : null}
                
                {updateDialog && state.currentRoom !== null && state.currentRoom._id !== process.env.REACT_APP_GUEST_ROOM_ID ? 
                    <CreateUpdateDialog 
                        open={true} 
                        closeDialog={() => openUpdateDialog(false)}
                        headline="Update room"
                        saveHeadline="Update"
                        action="update"
                        currentRoom={state.currentRoom}
                    />
                : null}

                {deleteDialog && state.currentRoom !== null && state.currentRoom._id !== process.env.REACT_APP_GUEST_ROOM_ID ? 
                    <RemoveDialog 
                        open={true} 
                        closeDialog={() => openDeleteDialog(false)}
                        currentRoom={state.currentRoom}
                    />
                : null}
                
            </Fragment>
        </div>
    )
}

export default LeftButtons
