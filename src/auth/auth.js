// Auth.js
import React, { useState, useEffect } from 'react';

export const LoginForm = ({ onLogin, onCancel }) => {
  const [userInput, setUserInput] = useState('');
  const [userPass, setUserPass] = useState('');
  const [formError, setFormError] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();

    if (!userInput.trim() || !userPass) {
      setFormError('Both fields must be filled out.');
      return;
    }

    onLogin(userInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="w-full max-w-sm bg-white p-5 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-4">Sign In</h2>

        {formError && (
          <div className="text-sm bg-red-200 border border-red-400 text-red-800 px-3 py-2 rounded mb-3">
            {formError}
          </div>
        )}

        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label className="text-sm text-gray-700 block mb-1">Username</label>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-700 block mb-1">Password</label>
            <input
              type="password"
              value={userPass}
              onChange={(e) => setUserPass(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-600 py-2 px-4"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const authorize = () => {
  const [userID, setUserID] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem('auth_user');
    if (storedId) {
      setUserID({ id: storedId });
    }
  }, []);

  const handleLogin = (id) => {
    setUserID({ id });
    localStorage.setItem('auth_user', id);
    setLoginVisible(false);
  };

  const handleLogout = () => {
    setUserID(null);
    localStorage.removeItem('auth_user');
  };

  return {
    userID,
    loginVisible,
    setLoginVisible,
    handleLogin,
    handleLogout
  };
};