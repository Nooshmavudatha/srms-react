
import { useEffect, useState } from 'react';

function Marks() {
  const [adminName, setAdminName] = useState('Administrator');
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);

  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    score: '',
    total: '',
  });

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

    setAdminName(loggedInUser.name || 'Administrator');

    const savedStudents =
      JSON.parse(localStorage.getItem('students')) || [];

    const savedMarks =
      JSON.parse(localStorage.getItem('marks')) || [];

    setStudents(savedStudents);
    setMarks(savedMarks);
  }, []);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    const { studentId, subject, score, total } = formData;

    if (
      !studentId ||
      !subject.trim() ||
      score === '' ||
      total === ''
    ) {
      setMessage('Please fill in all fields.');
      return;
    }

    const obtainedMarks = Number(score);
    const totalMarks = Number(total);

    if (
      !Number.isFinite(obtainedMarks) ||
      !Number.isFinite(totalMarks) ||
      totalMarks <= 0 ||
      obtainedMarks < 0 ||
      obtainedMarks > totalMarks
    ) {
      setMessage('Please enter valid marks.');
      return;
    }

    const student = students.find(
      (item) => String(item.id) === studentId
    );

    if (!student) {
      setMessage('Please select a valid student.');
      return;
    }

    const rollNumber = student.rollNumber || student.rollNo || '';

    const newMark = {
      id: Date.now(),
      studentId: student.id,
      studentName: student.name,
      rollNumber,
      rollNo: rollNumber,
      subject: subject.trim(),
      score: obtainedMarks,
      marks: obtainedMarks,
      total: totalMarks,
    };

    const updatedMarks = [...marks, newMark];

    setMarks(updatedMarks);

    localStorage.setItem(
      'marks',
      JSON.stringify(updatedMarks)
    );

    setFormData({
      studentId: '',
      subject: '',
      score: '',
      total: '',
    });

    setMessage('Marks added successfully!');
  }

  function deleteMark(id) {
    if (
      !window.confirm(
        'Are you sure you want to delete this marks record?'
      )
    ) {
      return;
    }

    const updatedMarks = marks.filter(
      (mark) => String(mark.id) !== String(id)
    );

    setMarks(updatedMarks);

    localStorage.setItem(
      'marks',
      JSON.stringify(updatedMarks)
    );

    setMessage('Marks record deleted successfully.');
  }

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

          <a href="/admin">Dashboard</a>
          <a href="/students">Students</a>
          <a href="/marks" className="active">Marks</a>
          <a href="/attendance">Attendance</a>
          <a href="/reports">Reports</a>
        </aside>

        <main className="dashboard-main">
          <h1>Manage Marks</h1>

          <p className="page-description">
            Add and manage student marks.
          </p>

          <div className="content-card">
            <h2>Add Student Marks</h2>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '20px',
                  marginTop: '20px',
                }}
              >
                <div>
                  <label>Select Student</label>

                  <select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Student</option>

                    {students.map((student) => (
                      <option
                        key={student.id}
                        value={String(student.id)}
                      >
                        {student.name} (
                        {student.rollNumber || student.rollNo}
                        )
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Subject</label>

                  <input
                    type="text"
                    name="subject"
                    placeholder="Enter subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Marks Obtained</label>

                  <input
                    type="number"
                    name="score"
                    placeholder="Enter marks obtained"
                    min="0"
                    value={formData.score}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Total Marks</label>

                  <input
                    type="number"
                    name="total"
                    placeholder="Enter total marks"
                    min="1"
                    value={formData.total}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn primary"
                style={{ marginTop: '20px' }}
              >
                Add Marks
              </button>
            </form>

            {message && (
              <p style={{ marginTop: '15px' }}>
                {message}
              </p>
            )}
          </div>

          <div className="content-card">
            <h2>Marks Records</h2>

            {marks.length === 0 ? (
              <p>No marks records available.</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Roll Number</th>
                      <th>Subject</th>
                      <th>Marks Obtained</th>
                      <th>Total Marks</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {marks.map((mark) => (
                      <tr key={mark.id}>
                        <td>{mark.studentName || mark.student}</td>
                        <td>{mark.rollNumber || mark.rollNo}</td>
                        <td>{mark.subject}</td>
                        <td>{mark.score ?? mark.marks}</td>
                        <td>{mark.total ?? 100}</td>

                        <td>
                          <button
                            className="btn"
                            style={{
                              background: '#dc2626',
                              color: 'white',
                            }}
                            onClick={() => deleteMark(mark.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default Marks;
