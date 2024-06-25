import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import classes from './SignUpForm.module.css';

function SignUpForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");

    const navigate = useNavigate();

    function handleSignUp(event) {
        event.preventDefault();

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            return;
        }

        let params = JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        });

        axios.post('https://localhost:7260/api/User/signup', params, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 200) {
                    navigate('/login'); // Redirect to login page after successful registration
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    if (error.response.data === "Email already in use") {
                        setEmailError("Email already in use");
                    }
                } else {
                    setGeneralError("An error occurred. Please try again later.");
                }
                console.error(error);
            });
    }

    function handleEmailBlur(e) {
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!re.test(e) && e !== "") {
            setEmailError("Invalid Email");
        } else {
            setEmailError(''); // Clear error message if email is valid
        }
    }

    return (
        <div className={classes.body}>
            <form className={classes.form} onSubmit={handleSignUp}>
                <label className={classes.title}>Create an Account for Todo App</label>
                <label className={classes.label}>First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <label className={classes.label}>Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <label className={classes.label}>Email</label>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={(e) => handleEmailBlur(e.target.value)} />
                <span className={classes.error}>{emailError}</span>
                <label className={classes.label}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <span className={classes.error}>{passwordError}</span>
                <label className={classes.label}>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <span className={classes.error}>{confirmPasswordError}</span>
                <br></br>
                <button type="submit" className="btn btn-primary">Sign Up</button>
                <span className={classes.error}>{generalError}</span>
            </form>
        </div>
    );
}

export default SignUpForm;
