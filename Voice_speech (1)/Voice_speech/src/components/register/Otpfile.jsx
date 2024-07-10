import React, { useState } from 'react';
import './Otpfile.css'; 
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Otpfile = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const[loading, setLoading]=useState(false);
  const [backendError, setBackendError] = useState('');

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationError = {}; // Initialize validationError as an object

    // Validate OTP
    if (!otp.trim()) {
      validationError.otp = "OTP is required"; // Use object notation to set the error message
    } else if (!/^\d{6}$/.test(otp.trim())) {
      validationError.otp = "Invalid OTP format"; // Use object notation to set the error message
    }
  
    // Check if any validation errors occurred
    if (Object.keys(validationError).length > 0) {
      // If there are validation errors, update the state and return without further processing
      setError(validationError.otp); // Update the error state with the OTP validation error
      setLoading(false); // Stop loading
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/verify_otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({otp: otp }), // Use otp instead of email
      });
  
      if (response.status === 200) {
        setTimeout(() => {
          setLoading(false); // Turn off loading after 5 seconds
          window.location.href = '/password';
        }, 2000);
        // Redirect to reset password page or handle success as needed
      } else {
        const data = await response.json();
        setError(data.error);
          setBackendError(data.error);// Assuming backend returns error in format { error: 'Error message' }
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
      setLoading(false);
    } finally{
      setLoading(false);
    }
 
  };
  
  return (
    <div className='cointer-otp'>
      <div className='container-otp'>
          <h2>Enter OTP</h2>
      <div className='form-input-otp'>
      <form  method='POST' onSubmit={handleSubmit}>
        <div>
          <label>OTP: </label>
          <input type="text"id='otp-number' value={otp} onChange={handleOtpChange} /><br/>
          {error && <span className="error-otp">{error}</span>}<br/>
          {backendError&&<span className="error-name-backend-log">{backendError}</span> }<br/>
        </div>
        <div>
        <button type="submit" id='button-otp' >{loading ? (
                <FontAwesomeIcon id='spinner-icon-pass' icon={faRotateRight} spin />
              ) : (
                "Verify OTP"
              )}</button>
        </div>
      </form>
      </div>
      </div>
    </div>
  );
};

export default Otpfile;