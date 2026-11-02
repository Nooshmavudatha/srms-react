
import { useEffect, useState } from 'react';

function UserReport() {
  const [marks, setMarks] = useState([]);
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

    const allMarks = JSON.parse(
      localStorage.getItem('marks') || '[]'
    );

    const allAttendance = JSON.parse(
      localStorage.getItem('attendance') || '[]'
    );

    setMarks(
      allMarks.filter(
        record =>
          String(record.studentId) === String(studentId) ||
          (
            !record.studentId &&
            String(record.rollNo || record.rollNumber) ===
              String(
                studentRecord?.rollNumber ||
                studentRecord?.rollNo ||
                loggedInUser.rollNumber
              )
          )
      )
    );

    setAttendance(
      allAttendance.filter(
        record =>
          String(record.studentId) === String(studentId)
      )
    );
  }, []);

  function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/login';
  }

  // Support both older and newer marks record formats.
  function getObtainedMarks(record) {
    return Number(record.score ?? record.marks ?? 0);
  }

  function getTotalMarks(record) {
    return Number(record.total ?? 100);
  }

  const totalScore = marks.reduce(
    (sum, record) => sum + getObtainedMarks(record),
    0
  );

  const totalPossible = marks.reduce(
    (sum, record) => sum + getTotalMarks(record),
    0
  );

  const average =
    totalPossible > 0
      ? (totalScore / totalPossible) * 100
      : 0;

  const presentCount = attendance.filter(
    record => record.status === 'Present'
  ).length;

  const absentCount = attendance.filter(
    record => record.status === 'Absent'
  ).length;

  const lateCount = attendance.filter(
    record => record.status === 'Late'
  ).length;

  const totalClasses = attendance.length;
  const attendedClasses = presentCount + lateCount;

  const attendancePercentage =
    totalClasses > 0
      ? (attendedClasses / totalClasses) * 100
      : 0;

  let academicStatus = 'No Records';

  if (totalClasses > 0) {
    if (attendancePercentage > 85) {
      academicStatus = 'Promoted';
    } else if (attendancePercentage >= 75) {
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
          <a href="/user-attendance">My Attendance</a>
          <a href="/user-report" className="active">
            My Reports
          </a>
        </aside>

        <main className="dashboard-main">
          <h1>My Academic Report</h1>

          <p className="page-description">
            Academic performance summary for {studentName}.
          </p>

          <div className="content-card">
            <h2>Student Information</h2>

            <p><strong>Name:</strong> {studentName}</p>
            <p><strong>Roll Number:</strong> {rollNumber || '—'}</p>
          </div>

          <div className="content-card">
            <h2>Academic Performance Summary</h2>

            <div className="dashboard-grid">
              <div className="stat-card">
                <h3>Subjects Recorded</h3>
                <p>{marks.length}</p>
              </div>

              <div className="stat-card">
                <h3>Total Marks Obtained</h3>
                <p>{totalScore}</p>
              </div>

              <div className="stat-card">
                <h3>Total Possible Marks</h3>
                <p>{totalPossible}</p>
              </div>

              <div className="stat-card">
                <h3>Marks Percentage</h3>
                <p>{average.toFixed(2)}%</p>
              </div>
            </div>
          </div>

          <div className="content-card">
            <h2>Marks Summary</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Marks Obtained</th>
                    <th>Total Marks</th>
                    <th>Percentage</th>
                  </tr>
                </thead>

                <tbody>
                  {marks.length === 0 ? (
                    <tr>
                      <td colSpan="4">
                        No marks records found.
                      </td>
                    </tr>
                  ) : (
                    marks.map((record, index) => {
                      const obtained = getObtainedMarks(record);
                      const total = getTotalMarks(record);
                      const percentage =
                        total > 0 ? (obtained / total) * 100 : 0;

                      return (
                        <tr key={record.id || index}>
                          <td>{record.subject}</td>
                          <td>{obtained}</td>
                          <td>{total}</td>
                          <td>{percentage.toFixed(2)}%</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="content-card">
            <h2>Attendance Summary</h2>

            <div className="dashboard-grid">
              <div className="stat-card">
                <h3>Total Classes</h3>
                <p>{totalClasses}</p>
              </div>

              <div className="stat-card">
                <h3>Present</h3>
                <p>{presentCount}</p>
              </div>

              <div className="stat-card">
                <h3>Absent</h3>
                <p>{absentCount}</p>
              </div>

              <div className="stat-card">
                <h3>Late</h3>
                <p>{lateCount}</p>
              </div>

              <div className="stat-card">
                <h3>Attendance Percentage</h3>
                <p>{attendancePercentage.toFixed(2)}%</p>
              </div>

              <div className="stat-card">
                <h3>Academic Status</h3>
                <p>{academicStatus}</p>
              </div>
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

export default UserReport;
