
import { useEffect, useState } from 'react';

function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState('Present');
  const [message, setMessage] = useState('');

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

    setStudents(
      JSON.parse(localStorage.getItem('students') || '[]')
    );

    setAttendance(
      JSON.parse(localStorage.getItem('attendance') || '[]')
    );
  }, []);

  // Calculate each student's overall attendance.
  function getAttendanceSummary(student) {
    const studentRecords = attendance.filter(
      record =>
        String(record.studentId) === String(student.id)
    );

    const totalClasses = studentRecords.length;

    const attendedClasses = studentRecords.filter(
      record =>
        record.status === 'Present' ||
        record.status === 'Late'
    ).length;

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

    return {
      totalClasses,
      attendedClasses,
      percentage: percentage.toFixed(2),
      academicStatus
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedStudent || !date || !status) {
      setMessage('Please fill in all fields.');
      return;
    }

    const student = students.find(
      item => String(item.id) === selectedStudent
    );

    if (!student) {
      setMessage('Please select a valid student.');
      return;
    }

    const alreadyRecorded = attendance.some(
      item =>
        String(item.studentId) === String(student.id) &&
        item.date === date
    );

    if (alreadyRecorded) {
      setMessage(
        'Attendance for this student and date is already recorded.'
      );
      return;
    }

    const newRecord = {
      id: Date.now(),
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber || student.rollNo,
      date,
      status
    };

    const updatedAttendance = [...attendance, newRecord];

    setAttendance(updatedAttendance);

    localStorage.setItem(
      'attendance',
      JSON.stringify(updatedAttendance)
    );

    setSelectedStudent('');
    setStatus('Present');
    setMessage('Attendance saved successfully!');
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this attendance record?'
    );

    if (!confirmDelete) {
      return;
    }

    const updatedAttendance = attendance.filter(
      item => item.id !== id
    );

    setAttendance(updatedAttendance);

    localStorage.setItem(
      'attendance',
      JSON.stringify(updatedAttendance)
    );

    setMessage('Attendance record deleted.');
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
          <a href="/attendance" className="active">
            Attendance
          </a>
          <a href="/reports">Reports</a>
        </aside>

        <main className="dashboard-main">
          <h1>Attendance Management</h1>

          <p className="page-description">
            Record and manage student attendance.
          </p>

          <div className="content-card">
            <h2>Mark Attendance</h2>

            {students.length === 0 ? (
              <p>
                Please add students before recording attendance.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="simple-form">
                <label>Select Student</label>

                <select
                  value={selectedStudent}
                  onChange={event =>
                    setSelectedStudent(event.target.value)
                  }
                  required
                >
                  <option value="">Choose a student</option>

                  {students.map(student => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.name} (
                        {student.rollNumber || student.rollNo}
                      )
                    </option>
                  ))}
                </select>

                <label>Date</label>

                <input
                  type="date"
                  value={date}
                  onChange={event => setDate(event.target.value)}
                  required
                />

                <label>Attendance Status</label>

                <select
                  value={status}
                  onChange={event => setStatus(event.target.value)}
                  required
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                </select>

                {message && (
                  <p>{message}</p>
                )}

                <button type="submit" className="full-btn">
                  Save Attendance
                </button>
              </form>
            )}
          </div>

          <div className="content-card">
            <h2>Overall Attendance Summary</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll Number</th>
                    <th>Total Classes</th>
                    <th>Attended</th>
                    <th>Attendance %</th>
                    <th>Academic Status</th>
                  </tr>
                </thead>

                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="6">
                        No students available.
                      </td>
                    </tr>
                  ) : (
                    students.map(student => {
                      const summary =
                        getAttendanceSummary(student);

                      return (
                        <tr key={student.id}>
                          <td>{student.name}</td>
                          <td>
                            {student.rollNumber || student.rollNo}
                          </td>
                          <td>{summary.totalClasses}</td>
                          <td>{summary.attendedClasses}</td>
                          <td>
                            {summary.percentage}%
                          </td>
                          <td>
                            {summary.academicStatus}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <p className="page-description">
              Promoted: Above 85% | Condonated: 75% to 85% |
              Detained: Below 75%.
            </p>
          </div>

          <div className="content-card">
            <h2>
              Attendance Records ({attendance.length})
            </h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll Number</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        No attendance records yet.
                      </td>
                    </tr>
                  ) : (
                    attendance.map(record => (
                      <tr key={record.id}>
                        <td>{record.studentName}</td>
                        <td>{record.rollNumber}</td>
                        <td>{record.date}</td>
                        <td>{record.status}</td>
                        <td>
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(record.id)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
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

export default Attendance;
