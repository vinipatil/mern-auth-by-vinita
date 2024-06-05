import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const email = localStorage.getItem('email');
    const loginIndex = localStorage.getItem('loginIndex');
    try {
      await axios.post('http://localhost:5000/logout', { email, loginIndex });
      localStorage.removeItem('email');
      localStorage.removeItem('loginIndex');
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-blue-500">
      <h1 className="text-6xl font-bold">Welcome to the User Dashboard</h1>
      <button onClick={handleLogout} className="ml-20 p-4 bg-red-500 hover:bg-red-600 text-white rounded">Logout</button>
    </div>
  );
}

export default UserDashboard;
