
import { useEffect, useState } from 'react';

function Admin() {
  const [adminName, setAdminName] = useState('Administrator');
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [totalAttendance, setTotalAttendance] = useState(0);

  useEffect(() => {
    const loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser')
    );

    if (!loggedInUser) {
      window.location.href = '/login';
      return;
    }

    if (loggedInUser.role !== 'admin') {
      window.location.href = '/user';
      return;
    }

    setAdminName(loggedInUser.name);

    const students = JSON.parse(
      localStorage.getItem('students')
    ) || [];

    const marks = JSON.parse(
      localStorage.getItem('marks')
    ) || [];

    const attendance = JSON.parse(
      localStorage.getItem('attendance')
    ) || [];

    setTotalStudents(students.length);
    setTotalMarks(marks.length);
    setTotalAttendance(attendance.length);
  }, []);

  function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/login';
  }

  return (
    <>
      <header className="dashboard-nav">
        <div className="logo">SRMS</div>

        <div>
          <span>Welcome, {adminName}</span>

          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <h3>Admin Panel</h3>

          <a href="/admin" className="active">
            Dashboard
          </a>

          <a href="/students">Students</a>
          <a href="/marks">Marks</a>
          <a href="/attendance">Attendance</a>
          <a href="/reports">Reports</a>
        </aside>

        <main className="dashboard-main">
          <h1>Admin Dashboard</h1>

          <p className="page-description">
            Manage student academic information.
          </p>

          <div className="dashboard-grid">
            <div className="stat-card">
              <span>👨‍🎓</span>
              <h3>Total Students</h3>
              <strong>{totalStudents}</strong>
            </div>

            <div className="stat-card">
              <span>📝</span>
              <h3>Marks Records</h3>
              <strong>{totalMarks}</strong>
            </div>

            <div className="stat-card">
              <span>📅</span>
              <h3>Attendance</h3>
              <strong>{totalAttendance}</strong>
            </div>

            <div className="stat-card">
              <span>📊</span>
              <h3>Reports</h3>
              <strong>Available</strong>
            </div>
          </div>

          <div className="content-card">
            <h2>Quick Actions</h2>

            <div className="quick-grid">
              <a href="/students">Add / Manage Students</a>
              <a href="/marks">Enter Marks</a>
              <a href="/attendance">Manage Attendance</a>
              <a href="/reports">View Reports</a>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Admin;
