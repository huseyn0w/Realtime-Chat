import React, {useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import {Link} from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import {email_validate_pattern} from '../../utils/helpers';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [loginSuccessFull, setloginSuccessFull] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if(loginSuccessFull){
      setTimeout(() => {
        setRedirect(true);
      }, 3000);
    }
  }, [loginSuccessFull])

  const loginFormHandler = (e) => {
    e.preventDefault();
    const formValidated = validateForm();
    if(formValidated){
      loginUser();
    }
  }

  const validateForm = () => {
    setServerError([]);
    setEmailError('');
    setPasswordError('');
    let hasErrors = false;
    const emailTest = email_validate_pattern.test(String(email).toLowerCase());

    if(!email){
      hasErrors = true;
      setEmailError('Email field required!');
    }
    else if(!emailTest){
      hasErrors = true;
      setEmailError('Wrong email format!');
    }
    if(!password){
      hasErrors = true;
      setPasswordError('Password field required!');
    }

    if(hasErrors) return false;
    return true;
  }

  const loginUser = async () => {
    try {
      console.log(process.env);
      console.log(process.env.REACT_APP_BACKEND_URL);
        const fetchResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
            email,
            password
          });
          if(fetchResponse.status === 201){
            setloginSuccessFull(true);
            const token = fetchResponse.data.token;
            localStorage.setItem('chatUserToken', token);
          }
        return true;
    } catch (e) {
        let errorMessage = [];
        if (e.response.data) {
          if(e.response.data.errors){
            e.response.data.errors.map((el, id) => {
              errorMessage.push(el.msg);
            });
          }
          else{
            errorMessage.push(e.response.data.message);
          }
        }
        else{
          errorMessage.push('Some error occurs, please try again later');
        }
        setServerError(errorMessage);
        return false;
    }    

}

let result = (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={loginFormHandler}>
            <div className="login-errors">
              {emailError ? 
                <Alert className="msg alert-msg" severity="error">
                    {emailError}
                </Alert> : null}
              {passwordError ? 
                <Alert className="msg alert-msg" severity="error">
                    {passwordError}
                </Alert> : null}
              {serverError.length > 0 ? 
                serverError.map((message,idx) => {
                  return <Alert key={idx} className="msg alert-msg" severity="error">{message}</Alert>;
                })
              : null}
              {loginSuccessFull ? 
                <Alert className="msg success-msg" severity="success">
                  Login completed, you will be redirected to the chat soon
                </Alert>
              : null}
            </div>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="email"
              value={email}
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={loginFormHandler}
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <div className="about-cover">
                  <a href="https://github.com/huseyn0w/Realtime-Chat" target="_blank" className="about-links">About the app</a>
                  <a href="https://huseyn0w.github.io" target="_blank" className="about-links">About the author</a>
                </div>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );

  if(redirect) result = window.location.reload(false);;

  return result;
}