import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(0),
    padding: '15px 15px 15px 0',
  },
}));

function InviteUser() {
     const classes = useStyles();

  return (
    <div>
      <div className={classes.margin}>
        <Grid container spacing={0} alignItems="flex-end">
          <Grid item xs={2}>
            <AccountCircle />
          </Grid>
          <Grid item xs={10}>
            <TextField id="input-with-icon-grid" label="Invite user to the room" />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default InviteUser
