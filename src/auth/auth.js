// auth/auth.js
import React, { useState, useEffect } from 'react';

export const CookieNotice = ({ onAccept }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-900 text-white p-3 flex items-center justify-between">
      <p className="text-sm">Cookies are used in this app.</p>
      <button
        onClick={onAccept}
        className="bg-white text-blue-900 px-3 py-1 rounded text-sm"
      >
        Accept
      </button>
    </div>
  );
};

export const LoginForm = ({ onLogin, onCancel }) => {
  const [userInput, setUserInput] = useState('');
  const [userPass, setUserPass] = useState('');
  const [formError, setFormError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [isSignedup, setIsSignedup] = useState(false);
  
  useEffect(() => {
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  const generatedToken = [...randomBytes]
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

  setCsrfToken(generatedToken);
  sessionStorage.setItem('csrf', generatedToken);
}, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!userInput.trim() || !userPass) {
      setFormError('Both fields must be filled out.');
      return;
    }

    if (csrfToken !== sessionStorage.getItem('csrf')) {
      setFormError('Unverified Request.');
      return;
    }

    const endpoint = isSignedup ? '/api/auth/signup' : '/api/auth/login';
    
    try {
      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: userInput, password: userPass })
      });

      if (response.ok) {
        if (isSignedup) {
          setFormError('');
          alert('Sign up successful! Please login.');
          setIsSignedup(false);
        } else {
          onLogin(userInput);
        }
      } else {
        const data = await response.json();
        setFormError(data.error);
      }
    } catch (error) {
      setFormError('Request not successful. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="w-full max-w-sm bg-white p-5 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-4">
          {isSignedup ? 'Log In' : 'Sign Up'}
        </h2>

        {formError && (
          <div className="text-sm bg-red-200 border border-red-400 text-red-800 px-3 py-2 rounded mb-3">
            {formError}
          </div>
        )}

        <form onSubmit={submitHandler}>
          <input type="hidden" name="_csrf" value={csrfToken} />

          <div className="mb-3">
            <label className="text-sm text-gray-700 block mb-1">Username</label>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your username"
              // don't allow html code by removing brackets
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[<>]/g, '');
              }}
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

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setIsSignedup(!isSignedup)}
              className="text-blue-500"
            >
              {isSignedup ? 'Login' : 'Sign up'}
            </button>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              {isSignedup ? 'Register' : 'Sign In'}
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
  const [askAcceptCookies, setAcceptCookies] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
      setAcceptCookies(true);
    }

    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserID({ id: data.userId });
      }
    } catch (error) {
      console.log('Not authenticated');
    }
  };

  const handleLogin = (id) => {
    setUserID({ id });
    setLoginVisible(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5001/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.log('Error in logout.');
    }
    
    setUserID(null);
  };

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setAcceptCookies(false);
  };

  return {
    userID,
    loginVisible,
    setLoginVisible,
    handleLogin,
    handleLogout,
    askAcceptCookies,
    acceptCookies
  };
};