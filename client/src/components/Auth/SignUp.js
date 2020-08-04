import React, {useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import Link from '@material-ui/core/Link';
import {Link, Redirect } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';
import {email_validate_pattern} from '../../utils/helpers';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp(props) {
  const classes = useStyles();

  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordConfirmationError, setPasswordConfirmationError] = useState('');
  const [serverError, setServerError] = useState('');
  const [registerSuccesss, setRegisterSuccess] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if(registerSuccesss){
      setTimeout(() => {
        setRedirect(true);
      }, 3000);
    }
  }, [registerSuccesss])

  const signupFormHandler = (e) => {
    e.preventDefault();
    const formValidated = validateForm();
    if(formValidated){
      registerUser();
    }
  }

  const registerUser = async () => {
    try {
        const fetchResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
            fullName,
            email,
            password
          });
          if(fetchResponse.status === 201){
            setRegisterSuccess(true);
          }
        return true;
    } catch (e) {
        let errorMessage = [];
        if (e.response.data) {
          if (e.response.data.errors) {
            e.response.data.errors.map((el, id) => {
              errorMessage.push(el.msg);
            });
          } else {
            errorMessage.push(e.response.data.message);
          }
        } else {
          errorMessage.push('Some error occurs, please try again later');
        }
        setServerError(errorMessage);
        return false;
    }    

}

  const validateForm = () => {
    setServerError([]);
    setFullNameError('');
    setEmailError('');
    setPasswordError('');
    setPasswordConfirmationError('');
    let hasErrors = false;
    const emailTest = email_validate_pattern.test(String(email).toLowerCase());

    if(!fullName){
      hasErrors = true;
      setFullNameError('Full name input is required!');
    }
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
    else if(password !== passwordConfirmation){
      hasErrors = true;
      setPasswordError('Password and password confirmation fields are not equal!');
    }
    else if(password.length < 8 || passwordConfirmation.length < 8){
      hasErrors = true;
      setPasswordError('Password and password confirmation fields should have at least 8 characters!');
    }
    if(!passwordConfirmation){
      hasErrors = true;
      setPasswordConfirmationError('Password confirmation field required!');
    }
    if(hasErrors) return false;
    return true;
  }

  

  let result = (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={signupFormHandler}>
          <Grid container spacing={2}>
            <div className="singup-errors">
              {fullNameError ? 
                <Alert className="msg alert-msg" severity="error">
                    {fullNameError}
                </Alert> : null}
              {emailError ? 
                <Alert className="msg alert-msg" severity="error">
                    {emailError}
                </Alert> : null}
              {passwordError ? 
                <Alert className="msg alert-msg" severity="error">
                    {passwordError}
                </Alert> : null}
              {passwordConfirmationError ? 
                <Alert className="msg alert-msg" severity="error">
                    {passwordConfirmationError}
                </Alert> : null}
              {serverError.length > 0 ? 
                serverError.map((message,idx) => {
                  return <Alert key={idx} className="msg alert-msg" severity="error">{message}</Alert>;
                })
              : null}
            </div>
            <div className="singup-success">
              {registerSuccesss ? 
                <Alert className="msg success-msg" severity="success">
                    Registration completed, you will be redirected in login page now...
                </Alert> : null}
            </div>
            <Grid item xs={12}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="Full Name"
                value={fullName}
                autoFocus
                onChange={(e) => setFullName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="repeat-password"
                label="Repeat Password"
                type="password"
                id="repeat-password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={signupFormHandler}
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );

  if(redirect) result = <Redirect to="/login" />;

  return result;
}