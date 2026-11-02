import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';

import Admin from './pages/admin';
import Students from './pages/students';
import Attendance from './pages/attendance';
import Marks from './pages/marks';
import Reports from './pages/reports';

import User from './pages/user';
import Profile from './pages/profile';
import UserMarks from './pages/user-marks';
import UserAttendance from './pages/user-attendance';
import UserReport from './pages/user-report';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/students" element={<Students />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/marks" element={<Marks />} />
        <Route path="/reports" element={<Reports />} />

        <Route path="/user" element={<User />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user-marks" element={<UserMarks />} />
        <Route path="/user-attendance" element={<UserAttendance />} />
        <Route path="/user-report" element={<UserReport />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;