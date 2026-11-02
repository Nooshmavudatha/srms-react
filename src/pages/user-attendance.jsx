
import { useEffect, useState } from 'react';

function UserAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [studentName, setStudentName] = useState('Student');
  const [rollNumber, setRollNumber] = useState('');

  useEffect(() => {
    const loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || 'null'
    );

    if (!loggedInUser || loggedInUser.role !== 'user') {
      window.location.href = '/login';
      return;
    }

    const students = JSON.parse(
      localStorage.getItem('students') || '[]'
    );

    const studentRecord = students.find(
      student =>
        String(student.id) === String(loggedInUser.studentId) ||
        (
          student.username &&
          student.username.toLowerCase() ===
            loggedInUser.username?.toLowerCase()
        )
    );

    const studentId = loggedInUser.studentId ?? studentRecord?.id;

    setStudentName(
      studentRecord?.name || loggedInUser.name || 'Student'
    );

    setRollNumber(
      studentRecord?.rollNumber ||
      studentRecord?.rollNo ||
      loggedInUser.rollNumber ||
      ''
    );

    const allAttendance = JSON.parse(
      localStorage.getItem('attendance') || '[]'
    );

    const myAttendance = allAttendance
      .filter(
        record =>
          String(record.studentId) === String(studentId)
      )
      .sort((a, b) => b.date.localeCompare(a.date));

    setAttendance(myAttendance);
  }, []);

  function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/login';
  }

  const totalClasses = attendance.length;

  const presentCount = attendance.filter(
    record => record.status === 'Present'
  ).length;

  const absentCount = attendance.filter(
    record => record.status === 'Absent'
  ).length;

  const lateCount = attendance.filter(
    record => record.status === 'Late'
  ).length;

  // Present and Late both count as attended classes.
  const attendedClasses = presentCount + lateCount;

  const percentage =
    totalClasses === 0
      ? 0
      : (attendedClasses / totalClasses) * 100;

  let academicStatus = 'No Records';

  if (totalClasses > 0) {
    if (percentage > 85) {
      academicStatus = 'Promoted';
    } else if (percentage >= 75) {
      academicStatus = 'Condonated';
    } else {
      academicStatus = 'Detained';
    }
  }

  return (
    <>
      <header className="dashboard-nav">
        <div className="logo">SRMS</div>

        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <h3>Student Panel</h3>

          <a href="/user">Dashboard</a>
          <a href="/profile">My Profile</a>
          <a href="/user-marks">My Marks</a>
          <a href="/user-attendance" className="active">
            My Attendance
          </a>
          <a href="/user-report">My Reports</a>
        </aside>

        <main className="dashboard-main">
          <h1>My Attendance</h1>

          <p className="page-description">
            Welcome, {studentName}. View your attendance details
            and overall academic attendance status.
          </p>

          <div className="content-card">
            <h2>Overall Attendance Summary</h2>

            <div className="dashboard-grid">
              <div className="stat-card">
                <h3>Total Classes</h3>
                <p>{totalClasses}</p>
              </div>

              <div className="stat-card">
                <h3>Attended Classes</h3>
                <p>{attendedClasses}</p>
              </div>

              <div className="stat-card">
                <h3>Attendance Percentage</h3>
                <p>{percentage.toFixed(2)}%</p>
              </div>

              <div className="stat-card">
                <h3>Academic Status</h3>
                <p>{academicStatus}</p>
              </div>
            </div>
          </div>

          <div className="content-card">
            <h2>Attendance Details</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    <th>Total Classes</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Attendance %</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>{rollNumber || '—'}</td>
                    <td>{totalClasses}</td>
                    <td>{presentCount}</td>
                    <td>{absentCount}</td>
                    <td>{lateCount}</td>
                    <td>{percentage.toFixed(2)}%</td>
                    <td>{academicStatus}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="content-card">
            <h2>Attendance History</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Roll Number</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan="3">
                        No attendance records found.
                      </td>
                    </tr>
                  ) : (
                    attendance.map((record, index) => (
                      <tr key={record.id || index}>
                        <td>{record.date}</td>
                        <td>
                          {record.rollNumber || rollNumber || '—'}
                        </td>
                        <td>{record.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="content-card">
            <h2>Attendance Eligibility Rules</h2>

            <p>Above 85% — Promoted</p>
            <p>75% to 85% — Condonated</p>
            <p>Below 75% — Detained</p>
          </div>
        </main>
      </div>
    </>
  );
}

export default UserAttendance;
