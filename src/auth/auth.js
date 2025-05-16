// auth/auth.js
import React, { useState, useEffect } from 'react';

export const CookieNotice = ({ onConfirm }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-900 text-white p-3 flex items-center justify-between">
      <p className="text-sm">Cookies are used to handle login.</p>
      <button
        onClick={onConfirm}
        className="bg-white text-blue-900 px-3 py-1 rounded text-sm"
      >
        Got it
      </button>
    </div>
  );
};

export const LoginForm = ({ onLogin, onCancel }) => {
  const [userInput, setUserInput] = useState('');
  const [userPass, setUserPass] = useState('');
  const [formError, setFormError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  
  useEffect(() => {
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  const generatedToken = [...randomBytes]
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

  setCsrfToken(generatedToken);
  sessionStorage.setItem('csrf', generatedToken);
}, []);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!userInput.trim() || !userPass) {
      setFormError('Both fields must be filled out.');
      return;
    }

    if (csrfToken !== sessionStorage.getItem('csrf')) {
      setFormError('Unverified Request.');
      return;
    }

    const createdTime = Date.now();
    const authPayload = {userId: userInput, createdTime, expiresAt: createdTime + 360000};

    const auth_token = btoa(JSON.stringify(authPayload));
    
    document.cookie = `auth_token=${auth_token}; path=/; max-age=3600; SameSite=Strict`;

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

const readCookie = (key) => {
  const cookies = document.cookie.split('; ').map(c => c.split('='));
  for (const [k, v] of cookies) {
    if (k === key) return v;
  }
  return null;
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

    const token = readCookie('auth_token');

    if(!token){
      return;
    }

    try {
      const decoded = JSON.parse(atob(token));

      if (decoded.exp > Date.now()) {
        setUserID({ id: decoded.id });
        localStorage.setItem('user_auth', decoded.id);
      } else {
        document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        localStorage.removeItem('user_auth');
      }
    } catch (e) {
      console.error('Invalid token');
    }

  }, []);

  const handleLogin = (id) => {
    setUserID({ id });
    localStorage.setItem('user_auth', id);
    setLoginVisible(false);
  };

  const handleLogout = () => {
    setUserID(null);
    localStorage.removeItem('user_auth');
    document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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