import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

// Inspired by the former Facebook spinners.
const useStylesFacebook = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    position: 'absolute',
    left: '50%',
    marginLeft:'-20px'
  },
  bottomLeft: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    position: 'absolute',
    left: '15px',
    marginLeft: '0'
  },
  top: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: 'absolute',
    left: '50%',
    marginLeft:'-20px'
  },
  topLeft: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: 'absolute',
    left: '15px',
    marginLeft: '0'
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

function Preloader(props) {
  const classes = useStylesFacebook();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={props.showonleft === 'true' ? classes.bottomLeft : classes.bottom}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={props.showonleft === 'true' ? classes.topLeft : classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function CustomizedProgressBars(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Preloader showonleft={props.showonleft === 'true' ? 'true': 'false'} />
    </div>
  );
}