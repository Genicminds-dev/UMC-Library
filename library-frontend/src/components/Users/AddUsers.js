import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

const AddUsers = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    role: "",
    status: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    name: "",
    email: "",
    role: "",
    status: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {
      username: "",
      name: "",
      email: "",
      role: "",
      status: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;
    
    if (!formData.username.trim()) {
      newErrors.username = "*Username is required";
      isValid = false;
    }
    if (!formData.name.trim()) {
      newErrors.name = "*Name is required";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "*Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "*Invalid email format";
      isValid = false;
    }
    if (!formData.role) {
      newErrors.role = "*Role is required";
      isValid = false;
    }
    if (!formData.status) {
      newErrors.status = "*Status is required";
      isValid = false;
    }
    
    if (!formData.password) {
      newErrors.password = "*Password is required";
      isValid = false;
    } else if (formData.password.length < 8 || formData.password.length > 15) {
      newErrors.password = "*Password must be 8-15 characters long";
      isValid = false;
    } else if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      newErrors.password = "*Password must contain both letters and numbers";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "*Confirm password is required";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "*Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await api.post("/users", userData);
      navigate("/users");
    } catch (error) {
      console.error("Error adding user:", error);
      if (error.response && error.response.data) {
        const apiError = error.response.data;
        if (apiError.username) {
          setErrors(prev => ({ ...prev, username: apiError.username }));
        }
        if (apiError.email) {
          setErrors(prev => ({ ...prev, email: apiError.email }));
        }
      }
    }
  };

  return (
    <div className="main-content app-content">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
          <div>
            <nav>
              <ol className="breadcrumb mb-1">
                <li className="breadcrumb-item fw-semibold">
                  <Link to="/dashboard">Home</Link>
                </li>
                <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
                <li className="breadcrumb-item fw-semibold">
                  <Link to="/users">Users</Link>
                </li>
                <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
                <li className="breadcrumb-item active fw-bold" aria-current="page">
                  Add User
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="card custom-card">
              <div
                className="card-header justify-content-between d-flex align-items-center"
                style={{
                  background: 'linear-gradient(to right, #6a5af9 0%, #a034f8 100%)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '15px',
                  borderRadius: '10px 10px 0 0',
                }}
              >
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '50%',
                      padding: '10px',
                      marginRight: '15px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-user-plus text-white"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" x2="19" y1="8" y2="14" />
                      <line x1="22" x2="16" y1="11" y2="11" />
                    </svg>
                  </div>
                  <div>
                    <div className="card-title fw-bold fs-6">Add New User</div>
                    <div className="d-flex align-items-center" style={{ fontSize: '12px', fontWeight: '400', color: "oklch(0.93 0.034 272.788)" }}>
                      <span>Please fill all required fields</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit} autoComplete="off">
                  <div className="row gy-3">
                    <div className="col-12 mt-4">
                      <div className="p-4" style={{ backgroundColor: '#e6f2ff', borderRadius: '8px' }}>
                        <div className="row gy-3">
                          <div className="col-12 d-flex align-items-center gap-2">
                            <span
                              style={{
                                backgroundColor: "#fff",
                                padding: "6px 10px",
                                borderRadius: "8px",
                                display: "inline-block",
                                fontSize: "16px",
                              }}
                            >
                              👤
                            </span>
                            <h6 className="fw-semibold mb-0" style={{ color: "#344054" }}>
                              USER INFORMATION
                            </h6>
                          </div>

                          <div className="col-md-6">
                            <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                              <label className="form-label">Username <span className="text-danger">*</span></label>
                              <input
                                type="text"
                                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                              />
                              {errors.username && (
                                <div className="invalid-feedback" style={{ display: "block" }}>
                                  {errors.username}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                              <label className="form-label">Full Name <span className="text-danger">*</span></label>
                              <input
                                type="text"
                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                              />
                              {errors.name && (
                                <div className="invalid-feedback" style={{ display: "block" }}>
                                  {errors.name}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                              <label className="form-label">Email <span className="text-danger">*</span></label>
                              <input
                                type="email"
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                              />
                              {errors.email && (
                                <div className="invalid-feedback" style={{ display: "block" }}>
                                  {errors.email}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                              <label className="form-label">Role <span className="text-danger">*</span></label>
                              <select
                                className={`form-select ${errors.role ? "is-invalid" : ""}`}
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                              >
                                <option value="">Select role</option>
                                <option value="Admin">Admin</option>
                                <option value="Clerk">Clerk</option>
                              </select>
                              {errors.role && (
                                <div className="invalid-feedback" style={{ display: "block" }}>
                                  {errors.role}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                              <label className="form-label">Status <span className="text-danger">*</span></label>
                              <select
                                className={`form-select ${errors.status ? "is-invalid" : ""}`}
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                              >
                                <option value="">Select status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                              {errors.status && (
                                <div className="invalid-feedback" style={{ display: "block" }}>
                                  {errors.status}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Password Section */}
                    <div className="col-12 mt-4">
                      <div className="p-4" style={{ backgroundColor: '#fff0f3', borderRadius: '8px' }}>
                        <div className="row gy-3">
                          <div className="col-12 d-flex align-items-center gap-2">
                            <span
                              style={{
                                backgroundColor: "#fff",
                                padding: "6px 10px",
                                borderRadius: "8px",
                                display: "inline-block",
                                fontSize: "16px",
                              }}
                            >
                              🔒
                            </span>
                            <h6 className="fw-semibold mb-0" style={{ color: "#344054" }}>
                              CREDENTIALS
                            </h6>
                          </div>

                          <div className="col-md-6">
                            <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                              <label className="form-label">Password <span className="text-danger">*</span></label>
                              <input
                                type="password"
                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password (8-15 characters)"
                              />
                              {errors.password && (
                                <div className="invalid-feedback" style={{ display: "block" }}>
                                  {errors.password}
                                </div>
                              )}
                              <small className="text-muted">Must contain letters and numbers (8-15 characters)</small>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                              <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
                              <input
                                type="password"
                                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm password"
                              />
                              {errors.confirmPassword && (
                                <div className="invalid-feedback" style={{ display: "block" }}>
                                  {errors.confirmPassword}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 mt-4 mb-3 text-center">
                      <button 
                        className="btn btn-danger-gradient me-2" 
                        type="button"
                        onClick={() => navigate("/users")}
                      >
                        Cancel
                      </button>
                      <button className="btn btn-purple-gradient" type="submit">
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUsers;