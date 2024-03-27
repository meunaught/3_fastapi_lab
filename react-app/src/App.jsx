import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation checks
    if (formData.username.length <= 5) {
      newErrors.username = 'Username must have more than five characters';
    }

    if (formData.password.length <= 6) {
      newErrors.password = 'Password must have more than six characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phoneNumber.length !== 11 || isNaN(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must have exactly 11 digits';
    }
    try {
      const response = await axios.post('https://silver-robot-9qgj464r4xvc9r9r-8000.app.github.dev/register/', formData);
      setSuccessMessage('Registration successful!');
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        const { detail } = error.response.data;
        if (detail.includes("Username already registered")) {
          newErrors.usernameError = detail;
        } else if (detail.includes("Email already registered")) {
          newErrors.emailError = detail;
        } else if (detail.includes("Phone number already registered")) {
          newErrors.phoneNumberError = detail;
        } else {
          newErrors.apiError = detail;
        }
        setErrors(newErrors);
      } else {
        console.error('An unexpected error occurred:', error.message);
      }
    }
    if (Object.keys(newErrors).length === 0) {
      // Submit form (can be an API call)
      setSuccessMessage('Registration successful!');
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <span>{errors.username}</span>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span>{errors.password}</span>}
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && <span>{errors.phoneNumber}</span>}
        </div>
        <button type="submit">Register</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default RegistrationForm;
