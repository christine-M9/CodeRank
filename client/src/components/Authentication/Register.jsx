import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });

  const [userType, setUserType] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    setFormData({
      ...formData,
      role: type
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userType) {
      const registerRoute = userType === 'mentor' ? 'api/mentors/signup' : 'api/students/signup';

      fetch(registerRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.access_token) {
          localStorage.setItem('accessToken', data.access_token);
          setRegistrationStatus('success');
        } else {
          alert(data.error);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while registering.');
      });
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="centered-container">
      <h2 style={{ color: 'white' }}>Register</h2>
      {registrationStatus === 'success' ? (
        <div>
          <p style={{ color: 'white' }}>You have Successfully created a CodeRank account!</p>
          <button onClick={handleLoginClick}>Proceed to Login</button>
        </div>
      ) : (
        <div>
          <p style={{ color: 'white' }}>Are you registering as a student or mentor?</p>
          <button
            type="button"
            onClick={() => handleUserTypeSelection('student')}
            style={{ marginRight: '50px' }} 
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => handleUserTypeSelection('mentor')}
          >
            Mentor
          </button>
        </div>
      )}
      {userType !== null && registrationStatus !== 'success' && (
        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ color: 'white' }}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label style={{ color: 'white' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label style={{ color: 'white' }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
      )}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleBack}>Back to Home</button>
      </div>
    </div>
  );
};

export default Register;
