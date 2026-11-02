
function Home() {
  return (
    <>
      <header className="navbar">
        <div className="logo">SRMS</div>

        <nav>
          <a href="/">Home</a>
          <a href="#about">About</a>
          <a href="/login">Login</a>
          <a href="/signup" className="nav-btn">Sign Up</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <span className="badge">
            Student Management System
          </span>

          <h1>
            Student Report<br />
            <span>Management System</span>
          </h1>

          <p>
            A simple platform to manage student records,
            marks, attendance and academic reports.
          </p>

          <div className="hero-buttons">
            <a href="/login" className="btn primary">
              Login
            </a>

            <a href="/signup" className="btn secondary">
              Create Account
            </a>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-icon">📊</div>

          <h2>Academic Dashboard</h2>

          <p>Manage student performance in one place.</p>

          <div className="mini-stats">
            <div>
              <strong>Marks</strong>
              <span>Manage</span>
            </div>

            <div>
              <strong>Attendance</strong>
              <span>Track</span>
            </div>

            <div>
              <strong>Reports</strong>
              <span>View</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <h2>System Modules</h2>

        <div className="module-grid">
          <div className="module-card">
            <div className="module-icon">👨‍💼</div>
            <h3>Admin Module</h3>
            <p>
              Manage students, marks, attendance and
              academic reports.
            </p>
          </div>

          <div className="module-card">
            <div className="module-icon">👨‍🎓</div>
            <h3>User Module</h3>
            <p>
              Students can view their profile, marks,
              attendance and reports.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2026 Student Report Management System</p>
      </footer>
    </>
  );
}

export default Home;
