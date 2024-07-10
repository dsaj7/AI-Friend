import React, { useState } from "react";
import "./Forgotpass.css";

const Forgotpass = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmail(value);
    setErrors({ ...errors, [name]: "" }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = {};

    if (!email.trim()) {
      validationError.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationError.email = "Invalid email format";
    }

    setErrors(validationError);

    // If there are no errors, you can proceed with form submission
    if (Object.keys(validationError).length === 0) {
      try {
        const response = await fetch("http://localhost:5000/forget_password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        });

        if (response.ok) {
          window.location.href = "/Otpfile";
          // Email sent successfully, handle success
          console.log("Reset password instructions sent successfully");
        } else {
          // Email sending failed, handle error
          console.error("Failed to send reset password instructions");
        }
      } catch (error) {
        console.error("Error sending reset password instructions:", error);
        // Handle error
      }
    }
  };

  return (
    <div className="Forget-form">
      <div className="forget-form-text">
        <h2>Reset your Ai.Talk Password</h2>
      </div>
      <div className="form-coainter-forget">
        <p>
          Enter your email, and we'll send you instructions on
          <br /> <span>How to reset your password.</span>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-input-forget">
            <input
              type="email"
              value={email}
              onChange={handleChange}
              name="email"
              placeholder="Email*"
            />
            <br />
            {errors.email && (
              <span className="error-name-for">{errors.email}</span>
            )}
            <br />
          </div>
          <div className="form-links-forget">
            <button type="submit" id="for-login">
              Send Instructions
            </button>
            <h3>
              <a href="/Login">Back to Login Page</a>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forgotpass;
