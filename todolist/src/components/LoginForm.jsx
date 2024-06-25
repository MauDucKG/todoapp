import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import classes from './LoginForm.module.css';

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mailError, setMailError] = useState("");
    const [passError, setPassError] = useState("");

    const navigate = useNavigate();
    function handleLogin(event) {
        event.preventDefault();
        let params = JSON.stringify({
            email: username,
            password: password
        });
        axios.post('https://localhost:7260/api/User/login', params, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.status);
                console.log(response.data);
                if (response.status === 200) {
                    const { accessToken, refreshToken } = response.data;

                    localStorage.setItem('token', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);

                    navigate('/');
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    if (error.response.data == "Invalid Email") setMailError("Invalid Email"); else setMailError("");
                    if (error.response.data == "Invalid Password") setPassError("Invalid Password");
                }
                console.error(error);
            });
    }

    function handleBlur(e) {
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!re.test(e) && e != "") {
            setMailError("Invalid Email");
        } else {
            setMailError(''); // Clear error message if email is valid
        }
    }

    return (
        <div className={classes.body} >
            <form className={classes.form}>
                <label className={classes.title}>Time To Work!</label>
                <label className={classes.label}>Email</label>
                <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); if (e.target.value == "") setMailError(""); }} onBlur={
                    (e) => handleBlur(e.target.value)} />
                <span className={classes.error}>{mailError}</span>
                <label className={classes.label}>Password</label>
                <input type="password" value={password} onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value == "") setPassError("");
                }} />
                <span className={classes.error}>{passError}</span>
                <button type="submit" onClick={handleLogin}>Login</button>
                <p>Not have an account? <Link to="/signup">Sign up</Link></p>
            </form>
        </div>
    );
}
export default LoginForm;