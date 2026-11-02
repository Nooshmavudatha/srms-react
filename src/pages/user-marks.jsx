
import { useEffect, useState } from 'react';

function UserMarks() {
  const [user, setUser] = useState(null);
  const [marks, setMarks] = useState([]);

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

    const allMarks =
      JSON.parse(localStorage.getItem('marks')) || [];

    const allStudents =
      JSON.parse(localStorage.getItem('students')) || [];

    const studentRecord = allStudents.find(
      (student) =>
        student.username?.toLowerCase() ===
        loggedInUser.username?.toLowerCase()
    );

    const studentId =
      loggedInUser.studentId ?? studentRecord?.id;

    const rollNumber =
      loggedInUser.rollNumber ||
      studentRecord?.rollNumber ||
      studentRecord?.rollNo;

    const studentMarks = allMarks.filter((record) => {
      if (studentId !== undefined && studentId !== null) {
        return String(record.studentId) === String(studentId);
      }

      return (
        record.rollNumber === rollNumber ||
        record.rollNo === rollNumber
      );
    });

    setMarks(studentMarks);
  }, []);

  function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/login';
  }

  if (!user) {
    return <p>Loading marks...</p>;
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
          <h3>User Panel</h3>

          <a href="/user">Dashboard</a>
          <a href="/profile">My Profile</a>
          <a href="/user-marks" className="active">
            My Marks
          </a>
          <a href="/user-attendance">My Attendance</a>
          <a href="/user-report">My Report</a>
        </aside>

        <main className="dashboard-main">
          <h1>My Marks</h1>

          <p className="page-description">
            View your examination marks and subject-wise performance.
          </p>

          <div className="content-card">
            <h2>Examination Results</h2>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Obtained Marks</th>
                    <th>Total Marks</th>
                    <th>Percentage</th>
                  </tr>
                </thead>

                <tbody>
                  {marks.length === 0 ? (
                    <tr>
                      <td colSpan="4">
                        No marks records available.
                      </td>
                    </tr>
                  ) : (
                    marks.map((record) => {
                      const obtained =
                        Number(record.score ?? record.marks ?? 0);

                      const total = Number(record.total ?? 100);

                      const percentage =
                        total > 0
                          ? ((obtained / total) * 100).toFixed(1)
                          : null;

                      return (
                        <tr key={record.id}>
                          <td>{record.subject}</td>
                          <td>{obtained}</td>
                          <td>{total}</td>
                          <td>
                            {percentage !== null
                              ? `${percentage}%`
                              : 'N/A'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default UserMarks;
