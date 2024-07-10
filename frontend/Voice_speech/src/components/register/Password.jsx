import React, { useState } from "react";
import {
  faEyeSlash,
  faEye,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Password.css";
import { useNavigate } from "react-router-dom";

const Password = () => {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reenteredPassword, setReenteredPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showReenteredPassword, setShowReenteredPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const { token } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Email") {
      setEmail(value);
    } else if (name === "Password") {
      setPassword(value);
    } else if (name === "Reenterpassword") {
      setReenteredPassword(value);
    }
    setErrors({ ...errors, [name]: "" }); // Clear error when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationError = {};

    if (!Email.trim()) {
      validationError.Email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(Email)) {
      validationError.Email = "Invalid email format";
    }
    if (!password.trim()) {
      validationError.Password = "Password is required";
    } else if (!/^(?=.*[A-Z])/.test(password)) {
      validationError.Password = "At least enter one Capital letter";
    } else if (!/^(?=.*[a-z])/.test(password)) {
      validationError.Password = "At least enter one small letter";
    } else if (!/^(?=.*[!@#/$%^&/*])/.test(password)) {
      validationError.Password = "At least enter one special symbol";
    } else if (!/^(?=.*[0-9])/.test(password)) {
      validationError.Password = "At least enter one digit";
    } else if (!/^(?=.{8,14})/.test(password)) {
      validationError.Password = "Password must be between 8 and 14 characters";
    }

    if (!reenteredPassword.trim()) {
      validationError.Reenterpassword = "Re-enter Password is required";
    } else if (reenteredPassword !== password) {
      validationError.Reenterpassword = "Passwords do not match";
    }

    setErrors(validationError);

    // If there are no errors, you can proceed with form submission
    if (Object.keys(validationError).length === 0) {
      try {
        const response = await fetch(`http://localhost:5000/resetpassword`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: Email,
            password,
            confirm_password: reenteredPassword, // Ensure key matches backend
          }),
        });
        if (response.ok) {
          setTimeout(() => {
            setLoading(false); // Turn off loading after 5 seconds
          navigate("/Login")
          }, 1000);
          console.log("Password reset successful");
        } else {
          // Password reset failed, handle error
          const data = await response.json();
          // Assuming backend returns error message in format { message: 'Error message' }
          setErrors({ ...errors, resetPassword: data.error });
          setBackendError(data.error);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    } else {
      setLoading(false); // Turn off loading if there are validation errors
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleReenteredPasswordVisibility = () => {
    setShowReenteredPassword(!showReenteredPassword);
  };

  return (
    <div className="head-password">
      <div className="head-text">
        <h2>Create your New Password</h2>
      </div>
      <div className="conta-iner">
        <h3>Reset Password </h3>
        <form method="POST" onSubmit={handleSubmit}>
          <div className="conta-iner-input">
            <input
              type="email"
              value={Email}
              onChange={handleChange}
              name="Email"
              placeholder="Email"
            />
            <br />
            {errors.Email && (
              <span className="error-name-pssd">{errors.Email}</span>
            )}
            <br />
          </div>
          <div className="conta-iner-input">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handleChange}
              placeholder="Enter Password"
              name="Password"
            />
            <span id="icon-eye-pass" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                size="sm"
              />
              <br />
            </span>
            {errors.Password && (
              <span className="error-name-pssd" id="error-name">
                {errors.Password}
              </span>
            )}
            <br />
          </div>
          <div className="conta-iner-input">
            <input
              type={showReenteredPassword ? "text" : "password"}
              value={reenteredPassword}
              onChange={handleChange}
              placeholder="Re-enter Password"
              name="Reenterpassword"
            />
            <span
              id="icon-eye-pass"
              onClick={toggleReenteredPasswordVisibility}
            >
              <FontAwesomeIcon
                icon={showReenteredPassword ? faEye : faEyeSlash}
                size="sm"
              />
              <br />
            </span>
            {errors.Reenterpassword && (
              <span className="error-name-pssd" id="error-name-renter">
                {errors.Reenterpassword}
              </span>
            )}
            <br />
            {backendError && (
              <span className="error-name-backend-log">{backendError}</span>
            )}
            <br />
          </div>
          <div>
            <button type="submit" id="button-pass">
              {loading ? (
                <FontAwesomeIcon
                  id="spinner-icon-pass"
                  icon={faRotateRight}
                  spin
                />
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Password;
