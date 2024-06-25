import LoginForm from '../components/LoginForm';
import logo from '../assets/logo.png';
import man from '../assets/Man.png';
import woman from '../assets/Woman.png';
import { useEffect } from 'react';
import './App.css';
import handleTokenRefresh from '../Modules/Refresh.js';
import { useNavigate } from 'react-router-dom';
import classes from './Login.module.css';

function Login() {
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            let b = await handleTokenRefresh();
            if (b) {
                navigate('/');
            }
        };

        fetchData();
    }, []);
    return (
        <div className={classes.app} >
            
            <div className={classes.form}>
                <LoginForm />
            </div>
        </div>
    );
}

export default Login;
