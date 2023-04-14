import React, { useContext, useState } from 'react';
import {UserContext} from "../context/UserContext"
import ErrorMessage from './ErrorMessage';

const Register = () =>{
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);
    const submitRegistration = async () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name:name, position:position, email: email, hashed_password:password})
        }
        const response = await fetch("/api/users", requestOptions);
        const data = await response.json();

        if(!response.ok) {
            setErrorMessage(data.detail);
        } else{
            setToken(data.access_token);
        }
    };

    const handleSumbmit = (e) => {
        e.preventDefault();
        if (password === confirmationPassword && password.length > 6) {
            submitRegistration();
        } else{
            setErrorMessage("Ensure that the passwords match and are greater than 6 characters");
        }
    }

    return (
        <div className="column">
            <form className="box" onSubmit={handleSumbmit}>
                <h1 className="title has-text-centered">Register</h1>
                <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                        <input type="string" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} className='input' required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Position</label>
                    <div className="control">
                        <input type="string" placeholder="Enter position" value={position} onChange={(e) => setPosition(e.target.value)} className='input' required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Email Address</label>
                    <div className="control">
                        <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className='input' required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input type="password" autoComplete="off" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className='input' required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Confirm Password</label>
                    <div className="control">
                        <input type="password" autoComplete="off" placeholder="Enter password" value={confirmationPassword} onChange={(e) => setConfirmationPassword(e.target.value)} className='input' required />
                    </div>
                </div>
                <ErrorMessage message={errorMessage}/>
                <br />
                <button className="button is-primary" type="submit">
                    Register
                </button>
            </form>
        </div>
    )
}

export default Register;