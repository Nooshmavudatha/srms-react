
import { useEffect, useState } from 'react';

function Profile() {
  const [user, setUser] = useState(null);

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
  }, []);

  function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/login';
  }

  if (!user) {
    return <p>Loading profile...</p>;
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
          <a href="/profile" className="active">My Profile</a>
          <a href="/user-marks">My Marks</a>
          <a href="/user-attendance">My Attendance</a>
          <a href="/user-report">My Report</a>
        </aside>

        <main className="dashboard-main">
          <h1>My Profile</h1>

          <p className="page-description">
            View your registered account information.
          </p>

          <div className="content-card profile-card">
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <h2>{user.name}</h2>
            <p>Student Account</p>

            <div className="profile-details">
              <div>
                <strong>Full Name</strong>
                <span>{user.name}</span>
              </div>

              <div>
                <strong>Username</strong>
                <span>{user.username}</span>
              </div>

              <div>
                <strong>Email Address</strong>
                <span>{user.email}</span>
              </div>

              <div>
                <strong>Account Role</strong>
                <span>{user.role}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Profile;
