import React  from 'react';
import {
  Switch,
  Route
} from "react-router-dom";
import './App.css';
import SignUp from './components/Auth/SignUp';
import Login from './components/Auth/Login';
import Main from './components/Main';
import Store from './store/Store';

function App() {
  const userToken = localStorage.getItem('chatUserToken');
  return (
    <Switch>
      <Route path="/login" exact>
        {userToken ? <Store><Main /></Store> : <Login />}
      </Route>
      <Route path="/signup" exact>
        {userToken ? <Store><Main /></Store> : <SignUp />}
      </Route>
      <Route path="/">
        <Store>
          {userToken ? <Main /> : <Login />}
        </Store>
      </Route>
    </Switch>
  );
}

export default App;
