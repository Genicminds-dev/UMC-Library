import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, MapPin, Users, GraduationCap, FileText, Image, Camera } from "lucide-react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import "./EditStudent.css";
import {Link } from "react-router-dom";

export default function EditStudent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        mobile: "",
        alternateMobile: "",
        email: "",
        gender: "",
        dob: "",
        aadharNumber: "",
        qualification: "",
        parentName: "",
        parentMobile: "",
        parentEmail: "",
        address: "",
        passportPhoto: null,
        aadharPhoto: null,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const existingRaw = localStorage.getItem("students");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        const student = existing.find((s) => s.id === id);

        if (student) {
            setFormData(student);
        } else {
            alert("Student not found");
            navigate("/profile");
        }
    }, [id, navigate]);

    const validateAadhar = (value) => {
        return /^\d{12}$/.test(value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "aadharNumber") {
            if (value && !/^\d*$/.test(value)) {
                return;
            }
            if (value.length > 12) {
                return;
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleImageUpload = (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.match('image/jpeg|image/png|image/jpg')) {
            alert('Please upload a valid JPEG or PNG image');
            return;
        }

        if (type === 'passportPhoto' && file.size > 2 * 1024 * 1024) {
            alert('Passport photo should be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            if (type === 'passportPhoto') {
                const img = new window.Image();
                img.onload = () => {
                    setFormData(prev => ({
                        ...prev,
                        [type]: event.target?.result
                    }));
                };
                img.onerror = () => {
                    alert('Error loading image');
                };
                img.src = event.target?.result;
            } else {
                setFormData(prev => ({
                    ...prev,
                    [type]: event.target?.result
                }));
            }
        };
        reader.onerror = () => {
            alert('Error reading file');
        };
        reader.readAsDataURL(file);
    };

    const validateForm = () => {
        const newErrors = {};

        if (formData.aadharNumber && !validateAadhar(formData.aadharNumber)) {
            newErrors.aadharNumber = "Aadhar number must be 12 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const existingRaw = localStorage.getItem("students");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];

        const updated = existing.map((student) =>
            student.id === id ? formData : student
        );

        localStorage.setItem("students", JSON.stringify(updated));
        navigate("/profile");
    };

    return (
        <>
            <div className="main-content app-content" id="edit-content">
                <div className="container-fluid">
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
                                        Edit Student
                                    </li>
                                </ol>
                            </nav>
                        </div>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="card custom-card">
                                        <div className="card-header edit-student-header">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="edit-student-avatar">
                                                    <User size={25} className="text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="edit-student-name">{formData.name}</h3>
                                                    <p className="edit-student-id">ID: {formData.id}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-body">
                                            <form onSubmit={handleSubmit}>
                                                <div className="row gy-3">
                                                    {/* Personal Details Section */}
                                                    <div className="col-12 mt-4">
                                                        <div className="personal-details-section">
                                                            <div className="row gy-3">
                                                                <div className="col-12 d-flex align-items-center gap-2">
                                                                    <span className="section-icon-container">
                                                                        <User size={20} className="text-indigo" />
                                                                    </span>
                                                                    <h6 className="section-title">PERSONAL DETAILS</h6>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-field-container">
                                                                        <label className="form-label">Student ID</label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            name="id"
                                                                            value={formData.id}
                                                                            onChange={handleChange}
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-field-container">
                                                                        <label className="form-label">Full Name <span className="text-danger">*</span></label>
                                                                        <input
                                                                            type="text"
                                                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                                            name="name"
                                                                            value={formData.name}
                                                                            onChange={handleChange}
                                                                            placeholder="Enter Full Name"
                                                                            required
                                                                        />
                                                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-field-container">
                                                                        <label className="form-label">Mobile No. <span className="text-danger">*</span></label>
                                                                        <input
                                                                            type="text"
                                                                            className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                                                                            name="mobile"
                                                                            value={formData.mobile}
                                                                            onChange={handleChange}
                                                                            placeholder="Enter Mobile Number"
                                                                            required
                                                                        />
                                                                        {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-field-container">
                                                                        <label className="form-label">Alternate Mobile</label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            name="alternateMobile"
                                                                            value={formData.alternateMobile}
                                                                            onChange={handleChange}
                                                                            placeholder="Enter Alternate Mobile"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-field-container">
                                                                        <label className="form-label">Email <span className="text-danger">*</span></label>
                                                                        <input
                                                                            type="email"
                                                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                                            name="email"
                                                                            value={formData.email}
                                                                            onChange={handleChange}
                                                                            placeholder="Enter Email"
                                                                            required
                                                                        />
                                                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-field-container">
                                                                        <label className="form-label">Gender <span className="text-danger">*</span></label>
                                                                        <select
                                                                            className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                                                                            name="gender"
                                                                            value={formData.gender}
                                                                            onChange={handleChange}
                                                                            required
                                                                        >
                                                                            <option value="">Select Gender</option>
                                                                            <option value="Male">Male</option>
                                                                            <option value="Female">Female</option>
                                                                            <option value="Other">Other</option>
                                                                        </select>
                                                                        {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-field-container">
                                                                        <label className="form-label">Date of Birth <span className="text-danger">*</span></label>
                                                                        <input
                                                                            type="date"
                                                                            className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                                                                            name="dob"
                                                                            value={formData.dob}
                                                                            onChange={handleChange}
                                                                            required
                                                                        />
                                                                        {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-field-container">
                                                                        <label className="form-label">Aadhar Number</label>
                                                                        <div className="input-group">
                                                                            <span className="input-group-text">
                                                                                <FileText size={16} className="text-indigo" />
                                                                            </span>
                                                                            <input
                                                                                type="text"
                                                                                className={`form-control ${errors.aadharNumber ? 'is-invalid' : ''}`}
                                                                                name="aadharNumber"
                                                                                value={formData.aadharNumber}
                                                                                onChange={handleChange}
                                                                                placeholder="12-digit Aadhar number"
                                                                                maxLength={12}
                                                                            />
                                                                        </div>
                                                                        {errors.aadharNumber && <div className="invalid-feedback">{errors.aadharNumber}</div>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Education Details Section */}
                                                    <div className="col-12 mt-4">
                                                        <div className="education-details-section">
                                                            <div className="row gy-3">
                                                                <div className="col-12 d-flex align-items-center gap-2">
                                                                    <span className="section-icon-container">
                                                                        <GraduationCap size={20} className="text-blue" />
                                                                    </span>
                                                                    <h6 className="section-title">EDUCATION DETAILS</h6>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-field-container">
                                                                        <label className="form-label">Qualification <span className="text-danger">*</span></label>
                                                                        <div className="input-group">
                                                                            <span className="input-group-text">
                                                                                <GraduationCap size={16} className="text-blue" />
                                                                            </span>
                                                                            <input
                                                                                type="text"
                                                                                className={`form-control ${errors.qualification ? 'is-invalid' : ''}`}
                                                                                name="qualification"
                                                                                value={formData.qualification}
                                                                                onChange={handleChange}
                                                                                placeholder="Enter Qualification"
                                                                                required
                                                                            />
                                                                        </div>
                                                                        {errors.qualification && <div className="invalid-feedback">{errors.qualification}</div>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Upload Documents Section */}
                                                    <div className="col-12 mt-4">
                                                        <div className="upload-documents-section">
                                                            <div className="row gy-3">
                                                                <div className="col-12 d-flex align-items-center gap-2">
                                                                    <span className="section-icon-container">
                                                                        <Image size={20} className="text-purple" />
                                                                    </span>
                                                                    <h6 className="section-title">UPLOAD DOCUMENTS</h6>
                                                                </div>

                                                                <div className="col-md-6">
                                                                    <div className="form-field-container">
                                                                        <label className="form-label">
                                                                            Passport Photo (35x45 mm) <span className="text-danger">*</span>
                                                                        </label>
                                                                        <input
                                                                            type="file"
                                                                            onChange={(e) => handleImageUpload(e, 'passportPhoto')}
                                                                            accept="image/jpeg, image/png"
                                                                            className="d-none"
                                                                            id="passportPhoto"
                                                                        />
                                                                        <label
                                                                            htmlFor="passportPhoto"
                                                                            className="upload-area passport-upload"
                                                                        >
                                                                            {formData.passportPhoto ? (
                                                                                <div className="upload-preview">
                                                                                    <img
                                                                                        src={formData.passportPhoto}
                                                                                        alt="Passport preview"
                                                                                        className="passport-preview"
                                                                                    />
                                                                                    <span className="upload-change-text">Click to change photo</span>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="upload-placeholder">
                                                                                    <div className="upload-icon">
                                                                                        <Camera size={20} className="text-indigo" />
                                                                                    </div>
                                                                                    <p className="upload-text">Click to upload passport photo</p>
                                                                                    <p className="upload-hint">Aspect ratio 35x45 mm</p>
                                                                                </div>
                                                                            )}
                                                                        </label>
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-6">
                                                                    <div className="form-field-container">
                                                                        <label className="form-label">
                                                                            Aadhar Card Photo <span className="text-danger">*</span>
                                                                        </label>
                                                                        <input
                                                                            type="file"
                                                                            onChange={(e) => handleImageUpload(e, 'aadharPhoto')}
                                                                            accept="image/jpeg, image/png"
                                                                            className="d-none"
                                                                            id="aadharPhoto"
                                                                        />
                                                                        <label
                                                                            htmlFor="aadharPhoto"
                                                                            className="upload-area aadhar-upload"
                                                                        >
                                                                            {formData.aadharPhoto ? (
                                                                                <div className="upload-preview">
                                                                                    <img
                                                                                        src={formData.aadharPhoto}
                                                                                        alt="Aadhar preview"
                                                                                        className="aadhar-preview"
                                                                                    />
                                                                                    <span className="upload-change-text">Click to change photo</span>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="upload-placeholder">
                                                                                    <div className="upload-icon">
                                                                                        <Image size={20} className="text-indigo" />
                                                                                    </div>
                                                                                    <p className="upload-text">Click to upload Aadhar card</p>
                                                                                    <p className="upload-hint">Front or back side</p>
                                                                                </div>
                                                                            )}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Parent Details Section */}
                                                    <div className="col-12 mt-4">
                                                        <div className="parent-details-section">
                                                            <div className="row gy-3">
                                                                <div className="col-12 d-flex align-items-center gap-2">
                                                                    <span className="section-icon-container">
                                                                        <Users size={20} className="text-purple" />
                                                                    </span>
                                                                    <h6 className="section-title">PARENT DETAILS</h6>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-field-container">
                                                                        <label className="form-label">Parent Name <span className="text-danger">*</span></label>
                                                                        <input
                                                                            type="text"
                                                                            className={`form-control ${errors.parentName ? 'is-invalid' : ''}`}
                                                                            name="parentName"
                                                                            value={formData.parentName}
                                                                            onChange={handleChange}
                                                                            placeholder="Enter Parent Name"
                                                                            required
                                                                        />
                                                                        {errors.parentName && <div className="invalid-feedback">{errors.parentName}</div>}
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-field-container">
                                                                        <label className="form-label">Parent Mobile <span className="text-danger">*</span></label>
                                                                        <input
                                                                            type="text"
                                                                            className={`form-control ${errors.parentMobile ? 'is-invalid' : ''}`}
                                                                            name="parentMobile"
                                                                            value={formData.parentMobile}
                                                                            onChange={handleChange}
                                                                            placeholder="Enter Parent Mobile"
                                                                            required
                                                                        />
                                                                        {errors.parentMobile && <div className="invalid-feedback">{errors.parentMobile}</div>}
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-field-container">
                                                                        <label className="form-label">Parent Email (Optional)</label>
                                                                        <input
                                                                            type="email"
                                                                            className="form-control"
                                                                            name="parentEmail"
                                                                            value={formData.parentEmail}
                                                                            onChange={handleChange}
                                                                            placeholder="Enter Parent Email"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Address Details Section */}
                                                    <div className="col-12 mt-4">
                                                        <div className="address-details-section">
                                                            <div className="row gy-3">
                                                                <div className="col-12 d-flex align-items-center gap-2">
                                                                    <span className="section-icon-container">
                                                                        <MapPin size={20} className="text-pink" />
                                                                    </span>
                                                                    <h6 className="section-title">ADDRESS DETAILS</h6>
                                                                </div>

                                                                <div className="col-12">
                                                                    <div className="form-field-container">
                                                                        <label className="form-label">Address <span className="text-danger">*</span></label>
                                                                        <textarea
                                                                            name="address"
                                                                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                                                            rows={3}
                                                                            placeholder="Enter Address"
                                                                            value={formData.address}
                                                                            onChange={handleChange}
                                                                            required
                                                                        />
                                                                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 mt-4 mb-3 text-center">
                                                        <button className="btn btn-danger me-2" onClick={() => { navigate("/students") }} type="button">
                                                            Cancel
                                                        </button>
                                                        <button className="btn btn-primary" type="submit">
                                                            Update
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
                </div>
            </div>

        </>
    );
}