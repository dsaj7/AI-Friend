
import React, { useState } from 'react';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const history = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmail(value);
    setErrors({ ...errors, [name]: '' }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = {};

    if (!email.trim()) {
      validationError.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationError.email = "Invalid email format";
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


    setErrors(validationError);

    if (Object.keys(validationError).length === 0) {
      try {
        const response = await fetch('http://localhost:5000/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          history('/');
        } else {
          const data = await response.json();
          setErrors({ ...errors, login: data.message });
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
    <div className='header-pass'>
      <div className='header-text'>
        <h2>Login to your Ai.Talk Account</h2>
      </div>
      <div className='form-coainter-login'>
        <form onSubmit={handleSubmit}>
          <div className='form-input-login'>
            <input
              type='email'
              value={email}
              onChange={handleChange}
              name='email'
              placeholder='Email'
            /><br/>
            {errors.email && <span className='error-name-email'>{errors.email}</span>}<br/>
          </div>
          <div className='form-input-login'>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name='password'
              placeholder='Password'
            /><br/>
            {errors.password && <span className='error-name-pass'>{errors.password}</span>}<br/>
            <span
              id='icon-eye-login'
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash}  /><br/>
            </span>
          </div>
          <div className='form-links-login'>
            <h3><a id='forgot-pass-log' href="/Forgotpass">Forgot password?</a></h3>
            <button type="submit" id="button-login">Login</button>
            <h4><a href="/Signup">Don't have an account?</a></h4>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
