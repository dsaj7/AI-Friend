import React from 'react';
import "./Navbar.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophoneLines } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <>
    <div className='navbar'>
     <Link to="/"><h3 className="logo">
        <FontAwesomeIcon style={{color:'#fff', width:'20px'}} icon={faMicrophoneLines} /> Ai.<span>TALK</span>
        </h3></Link>
        <div className="signup">
          <Link to="/Signup"><button>Signup</button></Link>
        </div>
    </div>
    </>
  )
}

export default Navbar;