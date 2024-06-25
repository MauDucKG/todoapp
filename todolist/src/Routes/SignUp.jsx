import React from 'react';
import SignUpForm from '../components/SignUpForm';
import { Link } from 'react-router-dom';

function SignUp() {
    return (
        <div className='bodyForm'>
            <SignUpForm />
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}

export default SignUp;
