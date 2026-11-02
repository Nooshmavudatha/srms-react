import { useEffect, useState } from 'react';

function Students() {
  const [students, setStudents] = useState([]);
  const [adminName, setAdminName] = useState('Administrator');

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    course: '',
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

    setAdminName(loggedInUser.name);

    const savedStudents = JSON.parse(
      localStorage.getItem('students')
    ) || [];

    setStudents(savedStudents);
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

    const { name, rollNumber, course } = formData;

    if (!name.trim() || !rollNumber.trim() || !course.trim()) {
      setMessage('Please fill in all fields.');
      return;
    }

    const duplicate = students.some(
      (student) =>
        student.rollNumber.toLowerCase() ===
        rollNumber.trim().toLowerCase()
    );

    if (duplicate) {
      setMessage('This roll number already exists.');
      return;
    }

    const newStudent = {
      id: Date.now(),
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      course: course.trim(),
    };

    const updatedStudents = [...students, newStudent];

    setStudents(updatedStudents);

    localStorage.setItem(
      'students',
      JSON.stringify(updatedStudents)
    );

    setFormData({
      name: '',
      rollNumber: '',
      course: '',
    });

    setMessage('Student added successfully!');
  }

  function deleteStudent(id) {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    const updatedStudents = students.filter(
      (student) => student.id !== id
    );

    setStudents(updatedStudents);

    localStorage.setItem(
      'students',
      JSON.stringify(updatedStudents)
    );

    setMessage('Student deleted successfully.');
  }

  function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/login';
  }

  return (
    <>
      {/* Same Header as Admin Dashboard */}
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

        {/* Same Sidebar as Admin Dashboard */}
        <aside className="sidebar">
          <h3>Admin Panel</h3>

          <a href="/admin">Dashboard</a>

          <a href="/students" className="active">
            Students
          </a>

          <a href="/marks">Marks</a>
          <a href="/attendance">Attendance</a>
          <a href="/reports">Reports</a>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <h1>Manage Students</h1>

          <p className="page-description">
            Add and manage student information.
          </p>

          {/* Add Student Form */}
          <div className="content-card">
            <h2>Add New Student</h2>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '20px',
                  marginTop: '20px',
                }}
              >
                <div>
                  <label>Student Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter student name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Roll Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    placeholder="Enter roll number"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Course</label>
                  <input
                    type="text"
                    name="course"
                    placeholder="Enter course"
                    value={formData.course}
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
                + Add Student
              </button>
            </form>

            {message && (
              <p style={{ marginTop: '15px' }}>
                {message}
              </p>
            )}
          </div>

          {/* Student List */}
          <div className="content-card">
            <h2>Student List ({students.length})</h2>

            {students.length === 0 ? (
              <p>No students added yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Student Name </th>
                      <th>Roll Number </th>
                      <th>Course </th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.rollNumber}</td>
                        <td>{student.course}</td>
                        <td>
                          <button
                            className="btn"
                            style={{
                              background: '#dc2626',
                              color: 'white',
                            }}
                            onClick={() => deleteStudent(student.id)}
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

export default Students;