import React, {useState, useEffect} from 'react';
import { Switch, BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import Data from '../display/data/Data';
import TokenPage from '../display/authtokens/TokenPage';
import Error from '../display/error/Error';

export default function Routes() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [width, setWidth] = useState();

  const login = (email) => {
    localStorage.setItem("loggedIn", true);
    localStorage.setItem("email", email);
    setLoggedIn(true);
  }

  const logOut = () => {
    localStorage.setItem("loggedIn", false);
    localStorage.removeItem("email");
    setLoggedIn(false);
  }

  const getReturn = () => {
    console.log(window.innerWidth);
    if(window.innerWidth > "670") {
      return <Data loggedIn={loggedIn} login={login} logout={logOut}/>
    } else {
      return <Error />
    }
  }

  useEffect(() => {
    if(localStorage.getItem("loggedIn") == "true") {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);

  return (
      <Router>
        <Switch>
          <Route exact path="/" component={() => getReturn()}/>
          <Route exact path="/confirm_email/:token" component={() => <TokenPage loggedIn={loggedIn} login={login}/>}/>
          <Route path='/'><Redirect to='/'/></Route>
        </Switch>
      </Router>
  )
}
