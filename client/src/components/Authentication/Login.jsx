import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLoginClick = (type) => {
    setUserType(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userType) {
      let loginRoute;
      if (userType === 'mentor') {
        loginRoute = 'api/mentors/login';
      } else if (userType === 'student') {
        loginRoute = 'api/students/login';
      }

      fetch(loginRoute, {
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
          if (userType === 'mentor') {
            navigate('/mentor-dashboard');
          } else if (userType === 'student') {
            navigate('/student-dashboard');
          }
        } else {
          alert(data.error);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while logging in.');
      });
    }
  };

  return (
    <div className="centered-container">
      <h2 style={{ color: 'white' }}>Login</h2>
      <div>
        <select onChange={(e) => handleLoginClick(e.target.value)}>
          <option value="">Select User Type</option>
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
        </select>
      </div>
      {userType !== '' && (
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
        </form>
      )}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  );
};

export default Login;
