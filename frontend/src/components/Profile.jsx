import React, {useContext, useState, useEffect} from 'react';
import { UserContext } from '../context/UserContext';
import Spider from './Spider';
import Table from './Table';

const Profile = () =>{
    const [token] = useContext(UserContext);
    const [skills, setSkills] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [email, setEmail] = useState("");

    const getProfile = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        const response = await fetch("/api/users/me", requestOptions);
        if (!response.ok){
            setErrorMessage("Couldn't find your profile");
        } else{
            const data = await response.json();
            setName(data.name);
            setEmail(data.email);
            setPosition(data.position);
        }
    };    
   
    const getSkills = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        const response = await fetch("/api/skills", requestOptions);
        if (!response.ok){
            setErrorMessage("Something went wrong. Couldn't load your skills")
        } else{
            const data = await response.json();
            setSkills(data);
            setLoaded(true);
        }
    };

    useEffect(() => {
        getSkills();
        getProfile();
    }, []);

    return(
        <div>
            <div className="columns">
                <div className="column">
                    <img src={`https://api.multiavatar.com/${email.split("@")[0]}.png`} width={120} height={120} alt="icons"/>
                </div>
                <div className="column">
                    <p className='is-size-5 has-text-weight-semibold' >Welcome {name}!</p>
                    <p className='is-size-5 has-text-weight-semibold' >Email: {email}</p>
                    <p className='is-size-5 has-text-weight-semibold' >Position: {position}</p>
                </div>
            </div>
            <div className="column">              
                <Spider skills={skills}/>
                <br /> 
                <Table getSkills={getSkills} skills={skills} loaded={loaded}/>
            </div>
        </div>
    );
}

export default Profile;

 