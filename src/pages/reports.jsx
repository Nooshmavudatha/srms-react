
import { useEffect, useState } from 'react';

function Reports() {
  const [students, setStudents] = useState([]);
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

    if (loggedInUser.role !== 'admin') {
      window.location.href = '/user';
      return;
    }

    setStudents(JSON.parse(localStorage.getItem('students')) || []);
    setMarks(JSON.parse(localStorage.getItem('marks')) || []);
    setAttendance(JSON.parse(localStorage.getItem('attendance')) || []);
  }, []);

  function getStudentMarks(studentId) {
    return marks.filter(record => record.studentId === studentId);
  }

  function getStudentAttendance(studentId) {
    const records = attendance.filter(
      record => record.studentId === studentId
    );

    const present = records.filter(
      record => record.status === 'Present'
    ).length;

    const percentage = records.length
      ? ((present / records.length) * 100).toFixed(1)
      : '0.0';

    return { total: records.length, present, percentage };
  }

  function getAverage(records) {
    if (records.length === 0) return 'N/A';

    const obtained = records.reduce(
      (sum, record) => sum + Number(record.score), 0
    );

    const total = records.reduce(
      (sum, record) => sum + Number(record.total), 0
    );

    if (total === 0) return 'N/A';

    return `${((obtained / total) * 100).toFixed(1)}%`;
  }

  function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/login';
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
          <h3>Admin Panel</h3>
          <a href="/admin">Dashboard</a>
          <a href="/students">Students</a>
          <a href="/marks">Marks</a>
          <a href="/attendance">Attendance</a>
          <a href="/reports" className="active">Reports</a>
        </aside>

        <main className="dashboard-main">
          <h1>Academic Reports</h1>

          <p className="page-description">
            View student marks and attendance summaries.
          </p>

          <div className="dashboard-grid">
            <div className="stat-card">
              <span>👨‍🎓</span>
              <h3>Total Students</h3>
              <strong>{students.length}</strong>
            </div>

            <div className="stat-card">
              <span>📝</span>
              <h3>Marks Records</h3>
              <strong>{marks.length}</strong>
            </div>

            <div className="stat-card">
              <span>📅</span>
              <h3>Attendance Records</h3>
              <strong>{attendance.length}</strong>
            </div>
          </div>

          <div className="content-card">
            <h2>Student Academic Summary</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll Number</th>
                    <th>Marks Records</th>
                    <th>Marks Average</th>
                    <th>Attendance</th>
                  </tr>
                </thead>

                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="5">No student records available.</td>
                    </tr>
                  ) : (
                    students.map(student => {
                      const studentMarks = getStudentMarks(student.id);
                      const studentAttendance = getStudentAttendance(student.id);

                      return (
                        <tr key={student.id}>
                          <td>{student.name}</td>
                          <td>{student.rollNumber}</td>
                          <td>{studentMarks.length}</td>
                          <td>{getAverage(studentMarks)}</td>
                          <td>
                            {studentAttendance.percentage}%
                            ({studentAttendance.present}/{studentAttendance.total})
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

export default Reports;
