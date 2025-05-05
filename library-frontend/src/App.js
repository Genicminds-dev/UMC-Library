import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import HeaderAdmin from './components/HeaderAdmin/HeaderAdmin';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import BookList from './components/BookList/BookList';
import AddBooks from './components/BookList/AddBooks';
import Sidebar from './components/Sidebar/Sidebar';
import LendedBooks from './components/LendedBooks/LendedBooks';
import StudentList from './components/StudentList/StudentList';
import AddStudents from './components/StudentList/AddStudents';
import Users from './components/Users/Users';
import AddUser from "./components/Users/AddUsers";
import FooterAdmin from './components/FooterAdmin/FooterAdmin';

function Layout({ children }) {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const { role } = user;

  const clerkRoutes = [
    '/dashboard',
    '/add-new-entry',
    '/scan-gallary',
    '/add-new-grievance',
  ];

  const adminRoutes = [
    '/dashboard',
    '/books',
    '/add-books',
    '/students',
    '/add-students',
    '/lended-books',
    '/users',
    '/add-users',
  ];

  const protectedRoutes =
    role === 'Clerk' ? clerkRoutes : adminRoutes;

  const path = location.pathname;
  const isEditOrViewApplication =
    path.startsWith('/edit-application/') ||
    path.startsWith('/view-application/');

  const isProtected = protectedRoutes.some((route) =>
    path.startsWith(route.split('/:')[0])
  );

  // Redirect to login if accessing protected route
  if (!isLoggedIn && isProtected) {
    return <Navigate to="/login" />;
  }

  // Redirect to dashboard if logged in and trying to access login
  if (isLoggedIn && (path === '/' || path === '/login')) {
    return <Navigate to="/dashboard" />;
  }

  // Redirect to dashboard if logged in and trying to access invalid route
  if (isLoggedIn && !isProtected && path !== '/login') {
    return <Navigate to="/dashboard" />;
  }

  // Show only login page layout
  if (!isLoggedIn && (path === '/' || path === '/login')) {
    return <>{children}</>;
  }

  // Protected layout
  return (
    <>
      <HeaderAdmin />
      <div
        className="d-flex"
        style={{ minHeight: '100vh', flexDirection: 'column' }}
      >
        <div className="d-flex flex-grow-1">
          <Sidebar user={role} />
          <div className={`content-wrapper flex-grow-1`}>
            {children}
          </div>
        </div>
        <FooterAdmin />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/add-books" element={<AddBooks />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/add-students" element={<AddStudents />} />
          <Route path="/lended-books" element={<LendedBooks />} />
          <Route path="/users" element={<Users />} />
          <Route path="/add-users" element={<AddUser />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;