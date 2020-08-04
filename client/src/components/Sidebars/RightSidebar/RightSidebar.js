import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import RightButtons from './RightButtons';
import Users from './Users';


const useStyles = makeStyles({
  root: {
    background: '#fff'
  },
});


function RightSidebar() {

    const classes = useStyles();

    return (
        <Grid container classes={{root: classes.root}} item xs={12} spacing={0}>
            <div className="right-sidebar">
                <RightButtons />
                <Users />
            </div>
        </Grid>
    )
}

export default RightSidebar;
