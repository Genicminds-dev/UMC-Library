import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  GraduationCap,
  Users,
  QrCode,
  FileText,
  FileDown,
  FileUp
} from "lucide-react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import QRCode from "react-qr-code";
import "./StudentDetail.css";

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const localData = localStorage.getItem("students");
    const data = localData ? JSON.parse(localData) : [];
    const found = data.find((s) => String(s.id) === String(id));
    setStudent(found || null);
  }, [id]);

  if (!student) {
    return (
      <div className="text-center py-10 text-muted">Student not found.</div>
    );
  }

  return (
    <>
      <div className="main-content app-content" id="student-details">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
            <div>
              <nav>
                <ol className="breadcrumb mb-1">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard">Home</Link>
                  </li>
                  <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
                  <li className="breadcrumb-item">
                    <Link to="/students">Students</Link>
                  </li>
                  <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
                  <li className="breadcrumb-item active" aria-current="page">
                    Student Details
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="card student-detail-card">
            <div className="card-header student-header">
              <div className="d-flex align-items-center gap-3">
                <div className="student-avatar">
                  {student.passportPhoto ? (
                    <img
                      src={student.passportPhoto}
                      alt="Student"
                      className="img-fluid rounded-circle"
                    />
                  ) : (
                    <User size={25} className="text-white" />
                  )}
                </div>
                <div>
                  <h3 className="student-name">{student.name}</h3>
                  <p className="student-id">Student ID: {student.id}</p>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              <Section
                title="Personal Details"
                icon={<User className="section-icon" size={20} />}
                className="section-personal"
              >
                <div className="row">
                  <Detail
                    label="Student ID"
                    value={student.id}
                    icon={<GraduationCap size={16} className="detail-icon" />}
                  />
                  <Detail
                    label="Full Name"
                    value={student.name}
                    icon={<User size={16} className="detail-icon" />}
                  />
                  <Detail
                    label="Mobile No."
                    value={student.mobile}
                    icon={<Phone size={16} className="detail-icon" />}
                  />
                  <Detail
                    label="Alternate Mobile"
                    value={student.alternateMobile || "N/A"}
                    icon={<Phone size={16} className="detail-icon" />}
                  />
                  <Detail
                    label="Email"
                    value={student.email}
                    icon={<Mail size={16} className="detail-icon" />}
                  />
                  <Detail
                    label="Gender"
                    value={student.gender}
                    icon={<Users size={16} className="detail-icon" />}
                  />
                  <Detail
                    label="Date of Birth"
                    value={student.dob}
                    icon={<Calendar size={16} className="detail-icon" />}
                  />
                  <Detail
                    label="Aadhar Number"
                    value={student.aadharNumber || "N/A"}
                    icon={<FileText size={16} className="detail-icon" />}
                  />
                </div>
              </Section>

              <Section
                title="Education Details"
                icon={<GraduationCap className="section-icon" size={20} />}
                className="section-education"
              >
                <div className="row">
                  <Detail
                    label="Qualification"
                    value={student.qualification}
                    icon={<GraduationCap size={16} className="detail-icon" />}
                  />
                </div>
              </Section>

              <Section
                title="Upload Documents"
                icon={<FileUp className="section-icon" size={20} />}
                className="section-documents"
              >
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="document-card">
                      <label className="document-label">Passport Photo</label>
                      <div className="document-preview">
                        {student.passportPhoto ? (
                          <img
                            src={student.passportPhoto}
                            alt="Passport"
                            className="img-preview"
                          />
                        ) : (
                          <div className="text-muted">No photo uploaded</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="document-card">
                      <label className="document-label">Aadhar Card</label>
                      <div className="document-preview">
                        {student.aadharPhoto ? (
                          <img
                            src={student.aadharPhoto}
                            alt="Aadhar"
                            className="img-fluid"
                          />
                        ) : (
                          <div className="text-muted">No photo uploaded</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              <Section
                title="Parent Details"
                icon={<Users className="section-icon" size={20} />}
                className="section-parent"
              >
                <div className="row">
                  <Detail
                    label="Parent Name"
                    value={student.parentName}
                    icon={<User size={16} className="detail-icon" />}
                  />
                  <Detail
                    label="Parent Mobile"
                    value={student.parentMobile}
                    icon={<Phone size={16} className="detail-icon" />}
                  />
                  <Detail
                    label="Parent Email"
                    value={student.parentEmail || "N/A"}
                    icon={<Mail size={16} className="detail-icon" />}
                  />
                </div>
              </Section>

              <Section
                title="Contact Details"
                icon={<MapPin className="section-icon" size={20} />}
                className="section-contact"
              >
                <div className="address-card">
                  <div className="d-flex align-items-start gap-3">
                    <MapPin size={18} className="address-icon" />
                    <div>
                      <span className="address-label">Address:</span>
                      <span className="address-text">{student.address}</span>
                    </div>
                  </div>
                </div>
              </Section>

              <Section
                title="Student ID Card"
                icon={<QrCode className="section-icon" size={20} />}
                className="section-idcard"
              >
                <div className="row align-items-center">
                  <div className="col-md-6 mb-4 mb-md-0">
                    <div className="qr-code-container">
                      <div className="qr-code-box">
                        <QRCode
                          value={`${window.location.origin}/qr-details/${student.id}`}
                          size={150}
                          level="H"
                          fgColor="#4f46e5"
                          bgColor="#ffffff"
                        />
                      </div>
                      <p className="qr-code-description">
                        Scan this QR code to quickly access this student's profile.
                        The code contains the student ID:{" "}
                        <span className="font-weight-bold">{student.id}</span>
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="id-card-section">
                      <div className="d-flex flex-column align-items-center gap-1">
                        <div className="id-card-icon mb-4">
                          <FileDown size={40} className="id-card-icon-img" />
                        </div>
                        <Link
                          to={`/student-id-card/${student.id}`}
                          className="id-card-button"
                        >
                          <span className="id-card-button-content">
                            <FileDown size={18} className="id-card-button-icon" />
                            <span>Generate ID Card</span>
                          </span>
                          <span className="id-card-button-arrow">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </Link>
                        <p className="id-card-description">
                          Click to generate and download student ID card with essential information
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-5">
                  <Link
                    to={`/membership/${student.id}`}
                    className="btn membership-button"
                  >
                    Add Membership
                  </Link>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ title, children, icon, className = "" }) {
  return (
    <div className={`section-container ${className}`}>
      <div className="section-header">
        <div className="section-icon-container">{icon}</div>
        <h3 className="section-title">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Detail({ label, value, icon }) {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="detail-card">
        <div className="d-flex align-items-start gap-3">
          {icon && (
            <div className="detail-icon-container">
              {icon}
            </div>
          )}
          <div>
            <span className="detail-label">
              {label}
            </span>
            <span className="detail-value">{value || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}