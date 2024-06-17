// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './loginRegister/loginRegister';
import Home from './Home/Home';
import MainUser from './MainUser/MainUser';
import MainAdmin from './MainAdmin/MainAdmin';
import MainTest from './MainTest/MainTest';
import TestFile from './TestFile/TestFile';
import AddUser from './AddUser/AddUser';
import Profile from './Profile/Profile';
import ForgetPassword from './ForgetPass/ForgetPass';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loginRegister" element={<Login />} />
          <Route path="/mainUser" element={<MainUser />} />
          <Route path="/mainAdmin" element={<MainAdmin />} />
          <Route path="/addUser" element={<AddUser />} />
          <Route path="/mainTest" element={<MainTest />} />
          <Route path="/testFile" element={<TestFile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
export const decodeToken = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
};
export const refreshAccessToken = () => {
  const refreshToken = localStorage.getItem('refreshToken');

  fetch(`${process.env.REACT_APP_API_BASE_URL}/person/refreshToken`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refreshToken }),
  })
  .then(response => {
      if (response.ok) {
          return response.json();
      }
      throw new Error('Network response was not ok.');
  })
  .then(data => {
      localStorage.setItem('token', data.token);
      console.log("Token refreshed successfully");
  })
  .catch(error => console.error('Error refreshing token:', error));
};
