import React, {useState} from 'react'
import "./Login.css"
import { useHistory} from 'react-router-dom';
import {auth} from "./firebase";
import {Button, TextField} from "@material-ui/core"

function Login() {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = e => {
        e.preventDefault();
        console.log("Helow");
        auth.signInWithEmailAndPassword(email, password)
        .then((auth) => {
            //redirect to man-page
            history.push("/main-page")
        })
        .catch(e => alert(e.message));
    };

    const register = e => {
        e.preventDefault();
        
        auth.createUserWithEmailAndPassword(email, password)
        .then(auth => {
            //created ..redirect to logn
            history.push("/main-page")
        })
        .catch(e => alert("Enter Valid E-mail and Password and Click Register"));
    }
    
    
    return (
        <div className="login">
            <div className="login__container">
            <h1>Sign in</h1>

            <form className="login__form"> 
                
                <TextField id="outlined-basic" type="email" value={email} label="username" variant="outlined" onChange={event => setEmail(event.target.value)}/>
                
                <TextField id="outlined-basic" type="password" value={password} label="password" variant="outlined" onChange={event => setPassword(event.target.value)}/>
                <Button variant="contained" size="small" onClick={login} type="submit" color="Primary">Sign In</Button>
            </form>

            <div className="login__newuser">
                
                <span>New Here? Fill the above Fields and Click Resgister!</span>
                <Button onClick={register} variant="outlined" color="Primary">Register</Button>
            </div>
            </div>
        </div>
    )
}

export default Login
