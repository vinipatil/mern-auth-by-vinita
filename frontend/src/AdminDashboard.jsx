import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user-logs');
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserLogs();
  }, []);

  const handleLogout = async () => {
    const email = localStorage.getItem('email');
    const loginIndex = localStorage.getItem('loginIndex');
    try {
      const response = await axios.post('http://localhost:5000/logout', { email, loginIndex });
      setMessage(response.data.message);
      localStorage.removeItem('email');
      localStorage.removeItem('loginIndex');
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/remove-user/${userId}`);
      const updatedUsers = users.map(user => {
        if (user._id === userId) {
          user.logins.pop();
        }
        return user;
      });
      setUsers(updatedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover" style={{
        backgroundImage:
          'url("https://media0.giphy.com/media/xTiTnxpQ3ghPiB2Hp6/giphy.gif")',
      }}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
        <table className="w-full table-auto border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2">Name</th>
              <th className="border border-gray-400 p-2">Email</th>
              <th className="border border-gray-400 p-2">Login Time</th>
              <th className="border border-gray-400 p-2">Logout Time</th>
              <th className="border border-gray-400 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              user.logins.map((login, i) => (
                <tr key={`${index}-${i}`} className="bg-white">
                  <td className="border border-gray-400 p-2">{user.name}</td>
                  <td className="border border-gray-400 p-2">{user.email}</td>
                  <td className="border border-gray-400 p-2">{new Date(login.loginTime).toLocaleString()}</td>
                  <td className="border border-gray-400 p-2">{login.logoutTime ? new Date(login.logoutTime).toLocaleString() : 'N/A'}</td>
                  <td className="border border-gray-400 p-2">
                    <button className="bg-red-500 hover:bg-red-700 text-white p-2 rounded" onClick={() => handleRemove(user._id)}>Remove</button>
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
        <button
          className="ml-96 bg-red-500 hover:bg-red-600 text-white p-2 rounded mt-4"
          onClick={handleLogout}
        >
          Logout
        </button>
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </div>
    </div>
  );
}

export default AdminDashboard;
