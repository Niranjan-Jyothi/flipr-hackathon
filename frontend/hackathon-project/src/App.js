import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom"
import Header from "./components/Header/Header";
import Login from "./Login";
import MainPage from "./MainPage";
import {auth} from "./firebase";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => { //listener to know when a user have logged in or not
      if (authUser){ //login state detected
        setAuthenticated(true);
        
      }else{ //user logiut state detected

        setAuthenticated(false);
      }
    });

    return () =>{
      //any cleanup goes here...
      unsubscribe();
    }

  },[]);

  function PrivateRoute({ children, authenticated, ...rest }){
    console.log("Accesing privTE ROUTE WITH AUTH VALUE = ",authenticated);
    return(
      <Route
        {...rest}
        render = {({ location }) => 
          authenticated ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: {from: location}
              }}
            />
          )
        }
      />
    );
  }

  return (
    <Router>
    <div className="app">
        <Switch>

          <PrivateRoute path="/main-page" authenticated={authenticated}>
              <Header />
              <MainPage />
          </PrivateRoute>

         

          <Route path="/">
            <Login />
          </Route>
        </Switch>
    </div>
    </Router>
  );
}

export default App;
