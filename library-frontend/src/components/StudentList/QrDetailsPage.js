import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  User,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  FileText,
  MapPin,
  Shield,
  Smartphone,
  BookOpen,
  Home
} from "lucide-react";
import "./QrDetailsPage.css";

export default function QrDetailsPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const localData = localStorage.getItem("students");
      const data = localData ? JSON.parse(localData) : [];
      const found = data.find((s) => String(s.id) === String(id));
      setStudent(found || null);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="spinner"></div>
          <h2 className="loading-title">Loading Student Details</h2>
          <p className="loading-text">Please wait while we fetch the information</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="not-found-container">
        <div className="not-found-card">
          <div className="not-found-icon">
            <User size={36} />
          </div>
          <h1 className="not-found-title">Student Not Found</h1>
          <p className="not-found-message">The requested student record does not exist in our database.</p>
          <a 
            href="/" 
            className="not-found-button"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" id='scan-qr-page'>
      <div className="content-wrapper">
        {/* Header Card */}
        <div className="header-card">
          <div className="header-content">
            <div className="avatar-container">
              <div className="avatar">
                <User size={35} />
              </div>
              <div className="verified-badge">
                <div className="badge-icon">
                  <Shield size={13} />
                </div>
              </div>
            </div>
            
            <div className="header-text">
              <h1 className="student-name">{student.name}</h1>
              <p className="student-id">Student ID: {student.id}</p>
              <div className="verified-tag">
                <span className="verified-text">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="row">
          {/* Personal Information Card */}
          <div className="col-md-6 mb-4">
            <div className="info-card personal-card">
              <div className="card-header personal-header">
                <h2 className="card-title">
                  <User size={20} className="card-icon" />
                  Personal Information
                </h2>
              </div>
              <div className="card-body">
                <DetailItem 
                  icon={<FileText size={18} className="detail-icon" />}
                  label="Aadhar Number"
                  value={student.aadharNumber}
                />
                <DetailItem 
                  icon={<Calendar size={18} className="detail-icon" />}
                  label="Date of Birth"
                  value={student.dob}
                />
                <DetailItem 
                  icon={<User size={18} className="detail-icon" />}
                  label="Gender"
                  value={student.gender}
                />
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="col-md-6 mb-4">
            <div className="info-card contact-card">
              <div className="card-header contact-header">
                <h2 className="card-title">
                  <Smartphone size={20} className="card-icon" />
                  Contact Information
                </h2>
              </div>
              <div className="card-body">
                <DetailItem 
                  icon={<Phone size={18} className="detail-icon" />}
                  label="Mobile"
                  value={student.mobile}
                />
                <DetailItem 
                  icon={<Mail size={18} className="detail-icon" />}
                  label="Email"
                  value={student.email}
                />
                <DetailItem 
                  icon={<MapPin size={18} className="detail-icon" />}
                  label="Address"
                  value={student.address}
                  fullWidth
                />
              </div>
            </div>
          </div>

          {/* Education Information Card */}
          <div className="col-md-6 mb-4">
            <div className="info-card education-card">
              <div className="card-header education-header">
                <h2 className="card-title">
                  <BookOpen size={20} className="card-icon" />
                  Education
                </h2>
              </div>
              <div className="card-body">
                <DetailItem 
                  icon={<GraduationCap size={18} className="detail-icon" />}
                  label="Qualification"
                  value={student.qualification}
                />
              </div>
            </div>
          </div>

          {/* Parent Information Card */}
          <div className="col-md-6 mb-4">
            <div className="info-card parent-card">
              <div className="card-header parent-header">
                <h2 className="card-title">
                  <Home size={20} className="card-icon" />
                  Parent Information
                </h2>
              </div>
              <div className="card-body">
                <DetailItem 
                  icon={<User size={18} className="detail-icon" />}
                  label="Parent Name"
                  value={student.parentName}
                />
                <DetailItem 
                  icon={<Phone size={18} className="detail-icon" />}
                  label="Parent Mobile"
                  value={student.parentMobile}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Detail Item Component
function DetailItem({ icon, label, value, fullWidth = false }) {
  return (
    <div className={`detail-item ${fullWidth ? 'full-width' : ''}`}>
      <div className="detail-icon-container">
        {icon}
      </div>
      <div className="detail-text">
        <p className="detail-label">{label}</p>
        <p className="detail-value">{value}</p>
      </div>
    </div>
  );
}