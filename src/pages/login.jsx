
import { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  function handleLogin(event) {
    event.preventDefault();

    if (!username.trim() || !password) {
      setMessage('Please enter username and password.');
      setMessageColor('#dc2626');
      return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Create the demo admin account if it doesn't exist
    const adminExists = users.some(user => user.username === 'admin');

    if (!adminExists) {
      users.push({
        name: 'Administrator',
        username: 'admin',
        email: 'admin@srms.com',
        password: 'admin123',
        role: 'admin'
      });

      localStorage.setItem('users', JSON.stringify(users));
    }

    const user = users.find(
      item =>
        item.username === username.trim() &&
        item.password === password
    );

    if (!user) {
      setMessage('Invalid username or password.');
      setMessageColor('#dc2626');
      return;
    }

    localStorage.setItem('loggedInUser', JSON.stringify(user));

    setMessage('Login successful!');
    setMessageColor('#16a34a');

    setTimeout(() => {
      if (user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/user';
      }
    }, 500);
  }

  return (
    <div className="auth-body">
      <div className="auth-container">

        <div className="auth-left">
          <div className="logo large">SRMS</div>

          <h1>Welcome Back!</h1>

          <p>
            Login to access the Student Report
            Management System.
          </p>

          <div className="auth-points">
            <p>✓ Manage student records</p>
            <p>✓ Track marks and attendance</p>
            <p>✓ View academic reports</p>
          </div>
        </div>

        <div className="auth-right">
          <form className="form-box" onSubmit={handleLogin}>

            <h2>Login</h2>

            <p className="form-subtitle">
              Enter your account details
            </p>

            <label>Username</label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={event => setUsername(event.target.value)}
            />

            <label>Password</label>

            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={event => setPassword(event.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <p className="message" style={{ color: messageColor }}>
              {message}
            </p>

            <button type="submit" className="full-btn">
              Login
            </button>

            <p className="bottom-text">
              Don't have an account?{' '}
              <a href="/signup">Create Account</a>
            </p>

            <div className="demo-login">
              <strong>Demo Admin</strong>
              <br />
              Username: admin
              <br />
              Password: admin123
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;
