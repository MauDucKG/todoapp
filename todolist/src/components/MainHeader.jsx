import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import CircleAddIcon from '@mui/icons-material/AddCircleOutline';
import classes from './MainHeader.module.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import IconButton from '@mui/material/IconButton';
import { IoClose } from "react-icons/io5";
import defaultUrl from '../assets/ProfilePictures/defaultPfp.png';
import { jwtDecode } from 'jwt-decode';
function MainHeader({ handleInfoClose, isInfoShown,addTask,setSearchTerm }) {
    const navigate = useNavigate();
    function logout() {
        localStorage.clear();
        navigate('/login');
    }
    const [decodedToken, setDecodedToken] = useState(null);
    const [isProfileShown, setIsProfileShown] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const decoded = jwtDecode(token);
            setDecodedToken(decoded);
        }
    }, []);
    let url = decodedToken == null ? null : decodedToken.ProfilePicture;
    function handleProfileShow() {
        let b = isProfileShown;
        setIsProfileShown(!b);
    }
    return (
        <div style={{ position: "fixed", width: "100%" }}>
            <nav className={classes.header}>
                <div className={classes.nav}>
                    <Link to="/">
                        <img src={logo} className="logo" alt="logo" />
                    </Link>
                </div>
                <div className={classes.menu}>
                    <svg width="0" height="0">
                        <linearGradient id="lgrad" x1="50%" y1="100%" x2="50%" y2="0%" >
                            <stop offset="0%" style={{ direction: "ltr", stopColor: "rgb(57,52,94)", stopOpacity: "1.00" }} />
                            <stop offset="100%" style={{ direction: "ltr", stopColor: "rgb(194,157,222)", stopOpacity: "1.00" }} />
                        </linearGradient>
                    </svg>
                    <div className={classes.searchDiv + " " + (searchVisible ? classes.vis :"")} onMouseEnter={()=>setSearchVisible(true)} onMouseLeave={() => {if(!isFocused) setSearchVisible(false) } }>
                        <input defaultValue="" id={classes.searchField} onFocus={() => setIsFocused(true)} onBlur={(e) => { setIsFocused(false); if (!e.target.value || e.target.value.length == 0) setSearchVisible(false); } } type="text" onChange={(e)=>setSearchTerm(e.target.value) } className={searchVisible ? classes.textVis : ''} />
                            <FaSearch style={{ width: "25px", height: "25px", fill: "url(#lgrad)" }} />
                    </div>
                    <IconButton aria-label="Add" style={{ outline: "none" }} sx={{ width: "35px", height: "35px", padding: "6px" }} onClick={() => addTask({
                        id:"new",
                        title: "",
                        category: "",
                        dueDate: "",
                        estimatedTime:
                        {
                            days: 0,
                            hours: 0
                        },
                        priority: 0,
                        status: 0
})}>
                        <CircleAddIcon sx={{ width: "30px", height: "30px", fill: "url(#lgrad)" }} />
                    </IconButton>
                    <IconButton style={{ outline: "none" }} sx={{ width: "50px", height: "50px" }} onClick={handleProfileShow}>
                        <img alt="Profile" style={{ borderRadius: "50%" }} src={url != null && url != '' ? url : defaultUrl} width="42" height="42" />
                    </IconButton>
                </div>
            </nav>
            {isInfoShown && <div className={classes.infoDiv}>
                &quot;Anything that can go wrong will go wrong!&quot;
                <IconButton aria-label="Close" style={{ outline: "none", display: "none" }} onClick={handleInfoClose}>
                    <IoClose style={{ width: "4vw", height: "4vw", fill: "white " }} />
                </IconButton>
            </div>}
            {
                isProfileShown &&
                <div className={classes.profileDiv} onClick={() => setIsProfileShown(false)}>
                        <div style={{ paddingRight: '1vw'} }>
                        <img alt="Profile" style={{ borderRadius: "50%" }} src={url != null && url != '' ? url : defaultUrl} width="60" height="60" />
                    </div>
                    <div className={classes.profileBody}>
                            <h4 style={{margin:0} }>{decodedToken == null ? "user@example.com" : decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]}</h4>
                            <button className={classes.button} onClick={logout}>Logout <LogoutIcon sx={{color:"black"}}></LogoutIcon></button>
                    </div>
                </div>
            }

        </div>
    );
}

export default MainHeader;
