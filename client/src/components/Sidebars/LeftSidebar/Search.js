import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: theme.spacing(0),
    flex: 1,
    padding:'0 15px 0 0'
  },
  iconButton: {
    padding: '10 0',
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function Search(props) {
  const classes = useStyles();

  const SearchHandler = (e) => {
    const val = e.target.value;
    props.handler(val);
  }

  return (
    <Paper component="div" className={classes.root}>
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder={props.placeholderText}
        inputProps={{ 'aria-label': props.placeholderText }}
        onChange={SearchHandler}
      />
    </Paper>
  );
}
