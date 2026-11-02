
import { useEffect, useState } from 'react';

function User() {
  const [user, setUser] = useState(null);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser')
    );

    if (!loggedInUser) {
      window.location.href = '/login';
      return;
    }

    if (loggedInUser.role === 'admin') {
      window.location.href = '/admin';
      return;
    }

    setUser(loggedInUser);

    const allMarks = JSON.parse(localStorage.getItem('marks')) || [];
    const allAttendance = JSON.parse(
      localStorage.getItem('attendance')
    ) || [];

    setMarks(allMarks);
    setAttendance(allAttendance);
  }, []);

  function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/login';
  }

  if (!user) {
    return <p>Loading dashboard...</p>;
  }

  const studentMarks = marks.filter(
    record => record.studentId === user.studentId
  );

  const studentAttendance = attendance.filter(
    record => record.studentId === user.studentId
  );

  return (
    <>
      <header className="dashboard-nav">
        <div className="logo">SRMS</div>

        <div>
          <span>Welcome, {user.name}</span>

          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <h3>User Panel</h3>
          <a href="/user" className="active">Dashboard</a>
          <a href="/profile">My Profile</a>
          <a href="/user-marks">My Marks</a>
          <a href="/user-attendance">My Attendance</a>
          <a href="/user-report">My Report</a>
        </aside>

        <main className="dashboard-main">
          <h1>Student Dashboard</h1>

          <p className="page-description">
            Welcome to your academic dashboard.
          </p>

          <div className="dashboard-grid">
            <div className="stat-card">
              <span>📝</span>
              <h3>Marks Records</h3>
              <strong>{studentMarks.length}</strong>
            </div>

            <div className="stat-card">
              <span>📅</span>
              <h3>Attendance Records</h3>
              <strong>{studentAttendance.length}</strong>
            </div>

            <div className="stat-card">
              <span>👤</span>
              <h3>Account</h3>
              <strong>Active</strong>
            </div>
          </div>

          <div className="content-card">
            <h2>Quick Access</h2>

            <div className="quick-grid">
              <a href="/profile">View My Profile</a>
              <a href="/user-marks">View My Marks</a>
              <a href="/user-attendance">View My Attendance</a>
              <a href="/user-report">View My Report</a>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default User;
