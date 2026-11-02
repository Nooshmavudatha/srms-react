
import { useState } from 'react';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    rollNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    setMessage('');
    setError(false);

    const {
      name,
      username,
      email,
      rollNumber,
      password,
      confirmPassword,
    } = formData;

    if (
      !name.trim() ||
      !username.trim() ||
      !email.trim() ||
      !rollNumber.trim() ||
      !password ||
      !confirmPassword
    ) {
      setMessage('Please fill in all fields.');
      setError(true);
      return;
    }

    if (password.length < 6) {
      setMessage('Password must contain at least 6 characters.');
      setError(true);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setError(true);
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const students = JSON.parse(localStorage.getItem('students') || '[]');

    const existingUser = users.find(
      (user) =>
        user.username?.toLowerCase() === username.trim().toLowerCase() ||
        user.email?.toLowerCase() === email.trim().toLowerCase()
    );

    if (existingUser) {
      setMessage('Username or email is already registered.');
      setError(true);
      return;
    }

    // Find the student record using the entered roll number.
    const matchedStudent = students.find((student) => {
      const studentRollNumber = student.rollNumber || student.rollNo;

      return (
        String(studentRollNumber || '').trim().toLowerCase() ===
        rollNumber.trim().toLowerCase()
      );
    });

    if (!matchedStudent) {
      setMessage(
        'No student record found with this roll number. Please contact the Admin.'
      );
      setError(true);
      return;
    }

    // Prevent the same student record from being linked to multiple accounts.
    const alreadyLinked = users.some(
      (user) => String(user.studentId) === String(matchedStudent.id)
    );

    if (alreadyLinked) {
      setMessage('An account is already registered for this student.');
      setError(true);
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      password,
      role: 'user',

      // Link this account to the Admin's student record.
      studentId: matchedStudent.id,
      rollNumber: matchedStudent.rollNumber || matchedStudent.rollNo,
    };

    users.push(newUser);

    localStorage.setItem('users', JSON.stringify(users));

    setMessage('Account created successfully! Redirecting to login...');
    setError(false);

    setFormData({
      name: '',
      username: '',
      email: '',
      rollNumber: '',
      password: '',
      confirmPassword: '',
    });

    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  }

  return (
    <div className="auth-body">
      <div className="auth-container">

        <div className="auth-left">
          <h1>SRMS</h1>
          <h2>Create Your Account</h2>
          <p>
            Join the Student Report Management System to access
            your academic information.
          </p>

          <ul className="auth-points">
            <li>View your academic marks</li>
            <li>Check attendance records</li>
            <li>Access academic reports</li>
            <li>Manage your student profile</li>
          </ul>
        </div>

        <div className="auth-right">
          <div className="form-box">
            <h2>Sign Up</h2>
            <p className="form-subtitle">
              Create your student account
            </p>

            <form onSubmit={handleSubmit}>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label>Roll Number</label>
              <input
                type="text"
                name="rollNumber"
                placeholder="Enter your Admin-registered roll number"
                value={formData.rollNumber}
                onChange={handleChange}
                required
              />

              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              {message && (
                <p
                  className="message"
                  style={{ color: error ? 'red' : 'green' }}
                >
                  {message}
                </p>
              )}

              <button type="submit" className="full-btn">
                Create Account
              </button>
            </form>

            <p className="bottom-text">
              Already have an account?{' '}
              <a href="/login">Login</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Signup;
