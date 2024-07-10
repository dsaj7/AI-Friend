
import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom'; 
import "./Signup.css";


const Signup = () => {
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [Name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const history = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'Name') {
      setName(value);
    }
    setErrors({ ...errors, [name]: '' }); // Clear error when typing
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const validationError = {};

    if (!Email.trim()) {
      validationError.Email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(Email)) {
      validationError.Email = "Invalid email format";
    }

    if (!password.trim()) {
      validationError.password = "Password is required";
    } else if (!/^(?=.*[A-Z])/.test(password)) {
      validationError.password = "At least enter one Capital letter";
    } else if (!/^(?=.*[a-z])/.test(password)) {
      validationError.password = "At least enter one small letter";
    } else if (!/^(?=.*[!@#/$%^&/*])/.test(password)) {
      validationError.password = "At least enter one special symbol";
    } else if (!/^(?=.*[0-9])/.test(password)) {
      validationError.password = "At least enter one digit";
    } else if (!/^(?=.{8,14})/.test(password)) {
      validationError.password = "Password must be between 8 and 14 characters";
    }

    if (!Name.trim()) {
      validationError.Name = "Name is required";
    }

    setErrors(validationError);

    // If there are no errors, you can proceed with form submission
    if (Object.keys(validationError).length === 0) {
      try {
        const response = await fetch('http://localhost:5000/register', { // Replace with your backend API URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: Email, password: password, name: Name }),
        });
        
        if (response.ok) {
          // Registration successful
          history('/Login');
          console.log("Register successful");
          // Display success message or redirect to login page
        } else {
          // Registration failed, handle error
          const data = await response.json();
          // Assuming backend returns error message in format { message: 'Error message' }
          setErrors({ ...errors, register: data.message });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='signup-form'>
      <div>
        <h2>Signup to your Ai.Talk account</h2>
      </div>
      <div className='form-coainter-signup'>
        <form onSubmit={handleSubmit}>
        <div className='form-input-signup'>
            <input
              type="text"
              onChange={handleChange}
              id='Name'
              name='Name'
              placeholder='Name*'
            /><br/>
            {errors.Name && <span className='error-name-sign'>{errors.Name}</span>}<br/>
          </div>
          
          <div className='form-input-signup'>
            <input
              type='email'
              value={Email}
              onChange={handleChange}
              name='Email'
              placeholder='Email*'
            /><br/>
            {errors.Email && <span className='error-name-sign'>{errors.Email}</span>}<br/>
          </div>
          <div className='form-input-signup'>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handleChange}
              name='password'
              placeholder='Password*'
            /><br/>
            {errors.password && <span className='error-name-sign'>{errors.password}</span>}<br/>
            <span
              id='icon-eye-signup'
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} size='sm' />
            </span>
          </div>
          <div className='form-links-signup'>
            <input type="checkbox" name="checkbox" id="cheack-box-signup" /> Please don't send me marketing emails <br />
            <button type="submit" id="button-signup">Continue</button>
            <h4><Link to="/Login">Already have an account?</Link></h4>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
