import React, {useState, useContext, Fragment} from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {Context} from '../../../store/Store';
import {actions} from '../../../reducers/actions';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import ExitDialog from './Dialogs/ExitDialog';
import Profile from './Dialogs/Profile';

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


function RightButtons() {

    const classes = useStyles();

    const [state, dispatch] = useContext(Context);
    const [exitDialog, openExitDialog] = useState(false);
    const [userData] = useState({
        id: '-',
        fullname: '-',
        email: '-',
        status: '-',
        avatar: null
    });
    const [open, setOpen] = useState(false);

    const hideSidebarHandler = (e) => {
        dispatch({type: actions.RIGHT_SIDEBAR, payload: false});
    }

    const openProfileDialog = () => {
        setOpen(true);
    }



    return (
        <div className="rightButtons">
            <Profile
                userData={userData}
                open={open}
                closeDialog={() => setOpen(false)}
            />
            <Grid container classes={{root: classes.root}} item xs={12} spacing={0}>
                <Grid container classes={{root: classes.root}} item xs={10} spacing={0}>
                    <Tooltip title="Profile">
                        <IconButton color="primary" onClick={() => openProfileDialog()}  classes={{root: classes.customButtons}} aria-label="add an alarm">
                            <AccountCircle />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Exit">
                        <IconButton color="primary" onClick={() => openExitDialog(true)}  classes={{root: classes.customButtons}} aria-label="add an alarm">
                            <ExitToAppRoundedIcon />
                        </IconButton>
                    </Tooltip>
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

                {exitDialog ? 
                    <ExitDialog 
                        open={true} 
                        closeDialog={() => openExitDialog(false)}
                    />
                : null}
                
            </Fragment>
        </div>
    )
}

export default RightButtons
