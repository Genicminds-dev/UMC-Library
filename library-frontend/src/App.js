import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Main from './components/Main/Main';
import Header from './components/Heading/Heading';
import HeaderAdmin from './components/HeaderAdmin/HeaderAdmin';
import AddNewEntry from './components/AddNewEntry/addNewEntry';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import ScanGallary from './components/ScanGallary/ScanGallary';
import AddNewGrievance from './components/BookList/AddBooks';
import BookList from './components/BookList/BookList';
import Footer from './components/Footer/Footer';
import FooterAdmin from './components/FooterAdmin/FooterAdmin';
import Sidebar from './components/Sidebar/Sidebar';
import AddPersonalAssistant from "./components/AddPersonalAssistant/AddPersonalAssistant";
import CompletedGrievance from "./components/CompletedGrievance/CompletedGrievance";
import InProgressGrievance from "./components/InProgressGrievance/InProgressGrievance";
import RejectedGrievance from "./components/RejectedGrievance/RejectedGrievance";
import AddBoothNo from "./components/AddBoothNo/AddBoothNo";
import AddSubject from "./components/AddSubject/AddSubject";
import AddComplaintSender from "./components/AddComplaintSender/AddComplaintSender";
import AddAppStatus from "./components/AddApplicationStatus/AddApplicationStatus";
import AddWhatsAppGroup from "./components/AddWhatsAppGroup/AddWhatsAppGroup";
import AddUser from "./components/AddUser/AddUser";
import ViewApplication from './components/ViewApplication/ViewApplication';
import EditApplication from './components/EditApplication/EditApplication';
import AddTaluka from './components/AddTaluka/AddTaluka';
import StudentList from './components/StudentList/StudentList';
import LendedBooks from './components/LendedBooks/LendedBooks';
import AddBooks from './components/BookList/AddBooks';
import AddStudents from './components/StudentList/AddStudents';
import StudentDetail from './components/StudentList/StudentsDetail';
import EditStudent from './components/StudentList/EditStudents';
import QrDetailsPage from './components/StudentList/QrDetailsPage';

function Layout({ children }) {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const { user_permission } = user;

  const clerkRoutes = [
    '/dashboard',
    '/add-new-entry',
    '/scan-gallary',
    '/add-new-grievance',
  ];

  const adminRoutes = [
    '/dashboard',
    '/add-new-entry',
    '/scan-gallary',
    '/books',
    '/add-books',
    '/students',
    '/add-students',
    '/lended-books',
    '/completed-grievance',
    '/in-progress-grievance',
    '/rejected-grievance',
    '/add-personal_assistance',
    '/add-booth-number',
    '/add-subject',
    '/add-taluka',
    '/add-complaint-sender',
    '/add-app-status',
    '/add-whatsapp-group',
    '/add-user',
    '/view-application/:id',
    '/edit-application/:id',
    '/student/:id',
    '/edit-student/:id',
  ];

  const protectedRoutes =
    user_permission === 'Clerk' ? clerkRoutes : adminRoutes;

  const path = location.pathname;

  const isProtected = protectedRoutes.some((route) =>
    path.startsWith(route.split('/:')[0])
  );

  if (!isLoggedIn && isProtected) {
    return <Navigate to="/login" />;
  }

  if (isLoggedIn && (path === '/' || path === '/login')) {
    return <Navigate to="/dashboard" />;
  }

  if (isLoggedIn && !isProtected && path !== '/login') {
    return <Navigate to="/dashboard" />;
  }

  if (!isLoggedIn && (path === '/' || path === '/login')) {
    return <>{children}</>;
  }

  return (
    <>
      <HeaderAdmin />
      <div
        className="d-flex"
        style={{ minHeight: '100vh', flexDirection: 'column' }}
      >
        <div className="d-flex flex-grow-1">
          <Sidebar user={user_permission} />
          <div className="content-wrapper flex-grow-1">
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
      <Routes>
        {/* Plain route with no layout */}
        <Route path="/qr-details/:id" element={<QrDetailsPage />} />

        {/* All other routes wrapped with Layout */}
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route index element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-new-entry" element={<AddNewEntry />} />
                <Route path="/scan-gallary" element={<ScanGallary />} />
                <Route path="/books" element={<BookList />} />
                <Route path="/add-books" element={<AddBooks />} />
                <Route path="/students" element={<StudentList />} />
                <Route path="/add-students" element={<AddStudents />} />
                <Route path="/lended-books" element={<LendedBooks />} />
                <Route path="/completed-grievance" element={<CompletedGrievance />} />
                <Route path="/in-progress-grievance" element={<InProgressGrievance />} />
                <Route path="/rejected-grievance" element={<RejectedGrievance />} />
                <Route path="/add-personal_assistance" element={<AddPersonalAssistant />} />
                <Route path="/add-booth-number" element={<AddBoothNo />} />
                <Route path="/add-subject" element={<AddSubject />} />
                <Route path="/add-taluka" element={<AddTaluka />} />
                <Route path="/add-complaint-sender" element={<AddComplaintSender />} />
                <Route path="/add-app-status" element={<AddAppStatus />} />
                <Route path="/add-whatsapp-group" element={<AddWhatsAppGroup />} />
                <Route path="/add-user" element={<AddUser />} />
                <Route path="/view-application/:id" element={<ViewApplication />} />
                <Route path="/edit-application/:id" element={<EditApplication />} />
                <Route path="/student/:id" element={<StudentDetail />} />
                <Route path="/edit-student/:id" element={<EditStudent />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
