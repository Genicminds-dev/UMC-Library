// import React, { useState, useEffect, useRef } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { HiOutlineArrowNarrowRight } from "react-icons/hi";
// import { Link, useNavigate } from "react-router-dom";
// import "react-datepicker/dist/react-datepicker.css";
// import api from "../../api";
// import "flatpickr/dist/flatpickr.css";
// import "./AddStudents.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { User, MapPin, Users, GraduationCap, FileText, Image, Camera, FileUp } from "lucide-react";

// const AddStudents = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     id: "",
//     name: "",
//     mobile: "",
//     alternateMobile: "",
//     email: "",
//     gender: "",
//     dob: "",
//     aadharNumber: "",
//     qualification: "",
//     parentName: "",
//     parentMobile: "",
//     parentEmail: "",
//     address: "",
//     passportPhoto: null,
//     aadharPhoto: null,
//   });

//   const [errors, setErrors] = useState({});
//   const passportPhotoRef = useRef(null);
//   const aadharPhotoRef = useRef(null);

//   // Generate random student ID on component mount
//   useEffect(() => {
//     const randomNum = Math.floor(100000 + Math.random() * 900000);
//     const studentId = `STU${randomNum.toString().padStart(6, '0')}`;
//     setFormData(prev => ({ ...prev, id: studentId }));
//   }, []);

//   const validateAadhar = (value) => {
//     return /^\d{12}$/.test(value);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "aadharNumber") {
//       if (value && !/^\d*$/.test(value)) {
//         return;
//       }
//       if (value.length > 12) {
//         return;
//       }
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const handleImageUpload = (e, type) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate image type
//     if (!file.type.match('image/jpeg|image/png|image/jpg')) {
//       alert('Please upload a valid JPEG or PNG image');
//       return;
//     }

//     // For passport photo, check size (2MB limit)
//     if (type === 'passportPhoto' && file.size > 2 * 1024 * 1024) {
//       alert('Passport photo should be less than 2MB');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       if (type === 'passportPhoto') {
//         const img = new window.Image();
//         img.onload = () => {
//           setFormData(prev => ({
//             ...prev,
//             [type]: event.target?.result
//           }));
//         };
//         img.onerror = () => {
//           alert('Error loading image');
//         };
//         img.src = event.target?.result;
//       } else {
//         setFormData(prev => ({
//           ...prev,
//           [type]: event.target?.result
//         }));
//       }
//     };
//     reader.onerror = () => {
//       alert('Error reading file');
//     };
//     reader.readAsDataURL(file);
//   };

//   const triggerFileInput = (type) => {
//     if (type === 'passportPhoto' && passportPhotoRef.current) {
//       passportPhotoRef.current.click();
//     } else if (type === 'aadharPhoto' && aadharPhotoRef.current) {
//       aadharPhotoRef.current.click();
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (formData.aadharNumber && !validateAadhar(formData.aadharNumber)) {
//       newErrors.aadharNumber = "Aadhar number must be 12 digits";
//     }

//     // Add other validations as needed
//     if (!formData.name) newErrors.name = "Name is required";
//     if (!formData.mobile) newErrors.mobile = "Mobile is required";
//     if (!formData.email) newErrors.email = "Email is required";
//     if (!formData.gender) newErrors.gender = "Gender is required";
//     if (!formData.dob) newErrors.dob = "Date of birth is required";
//     if (!formData.qualification) newErrors.qualification = "Qualification is required";
//     if (!formData.parentName) newErrors.parentName = "Parent name is required";
//     if (!formData.parentMobile) newErrors.parentMobile = "Parent mobile is required";
//     if (!formData.address) newErrors.address = "Address is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     if (!formData.passportPhoto || !formData.aadharPhoto) {
//       alert('Please upload both passport photo and Aadhar photo');
//       return;
//     }

//     try {
//       const response = await api.post("/students", formData);
//       const notificationData = {
//         heading: "Added New Student",
//         description: `Added new student ${formData.name}`,
//         readed: 0,
//       };

//       await api.post("/notification", notificationData);
//       navigate("/students");

//       // Reset form
//       const randomNum = Math.floor(100000 + Math.random() * 900000);
//       const studentId = `STU${randomNum.toString().padStart(6, '0')}`;
//       setFormData({
//         id: studentId,
//         name: "",
//         mobile: "",
//         alternateMobile: "",
//         email: "",
//         gender: "",
//         dob: "",
//         aadharNumber: "",
//         qualification: "",
//         parentName: "",
//         parentMobile: "",
//         parentEmail: "",
//         address: "",
//         passportPhoto: null,
//         aadharPhoto: null,
//       });
//     } catch (error) {
//       console.error("Error adding student:", error);
//       alert("Error adding student, please try again.");
//     }
//   };

//   return (
//     <>
//       <div className="main-content app-content">
//         <div className="container-fluid">
//           <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
//             <div>
//               <nav>
//                 <ol className="breadcrumb mb-1">
//                   <li className="breadcrumb-item fw-semibold">
//                     <Link to="/dashboard">Home</Link>
//                   </li>
//                   <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
//                   <li className="breadcrumb-item fw-semibold">
//                     <Link to="/students">Students</Link>
//                   </li>
//                   <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
//                   <li className="breadcrumb-item active fw-bold" aria-current="page">
//                     Add Student
//                   </li>
//                 </ol>
//               </nav>
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-xl-12">
//               <div className="card custom-card">
//                 <div
//                   className="card-header justify-content-between d-flex align-items-center"
//                   style={{
//                     background: 'linear-gradient(to right, #6a5af9 0%, #a034f8 100%)',
//                     color: 'white',
//                     fontSize: '14px',
//                     fontWeight: '500',
//                     padding: '10px',
//                     borderRadius: '10px 10px 0 0',
//                   }}
//                 >
//                   <div className="d-flex align-items-center">
//                     <div
//                       style={{
//                         backgroundColor: 'rgba(255, 255, 255, 0.1)',
//                         borderRadius: '50%',
//                         padding: '10px',
//                         marginRight: '15px',
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                       }}
//                     >
//                       <User size={25} className="text-white" />
//                     </div>
//                     <div>
//                       <div className="card-title fw-bold fs-6">Add New Student</div>
//                       <div className="d-flex align-items-center" style={{ fontSize: '12px', fontWeight: '400', color: "oklch(0.93 0.034 272.788)" }}>
//                         <span>Please fill all required fields</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="prism-toggle"></div>
//                 </div>

//                 <div className="card-body">
//                   <form onSubmit={handleSubmit} autoComplete="off">
//                     <div className="row gy-3">
//                       {/* Personal Details Section */}
//                       <div className="col-12 mt-4">
//                         <div className="p-4" style={{ backgroundColor: '#e6f2ff', borderRadius: '8px' }}>
//                           <div className="row gy-3">
//                             <div className="col-12 d-flex align-items-center gap-2">
//                               <span
//                                 style={{
//                                   backgroundColor: "#fff",
//                                   padding: "6px 10px",
//                                   borderRadius: "8px",
//                                   display: "inline-block",
//                                   fontSize: "16px",
//                                 }}
//                               >
//                                 <User size={20} className="text-indigo-500" />
//                               </span>
//                               <h6 className="fw-semibold mb-0" style={{ color: "#344054" }}>
//                                 PERSONAL DETAILS
//                               </h6>
//                             </div>

//                             <div className="col-md-4">
//                               <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
//                                 <label className="form-label">Student ID</label>
//                                 <input
//                                   type="text"
//                                   className="form-control"
//                                   name="id"
//                                   value={formData.id}
//                                   onChange={handleChange}
//                                   readOnly
//                                 />
//                               </div>
//                             </div>

//                             <div className="col-md-4">
//                               <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
//                                 <label className="form-label">Full Name <span className="text-danger">*</span></label>
//                                 <input
//                                   type="text"
//                                   className={`form-control ${errors.name ? 'is-invalid' : ''}`}
//                                   name="name"
//                                   value={formData.name}
//                                   onChange={handleChange}
//                                   placeholder="Enter Full Name"
//                                   required
//                                 />
//                                 {errors.name && <div className="invalid-feedback">{errors.name}</div>}
//                               </div>
//                             </div>

//                             <div className="col-md-4">
//                               <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
//                                 <label className="form-label">Mobile No. <span className="text-danger">*</span></label>
//                                 <input
//                                   type="text"
//                                   className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
//                                   name="mobile"
//                                   value={formData.mobile}
//                                   onChange={handleChange}
//                                   placeholder="Enter Mobile Number"
//                                   required
//                                 />
//                                 {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
//                               </div>
//                             </div>

//                             <div className="col-md-4">
//                               <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
//                                 <label className="form-label">Alternate Mobile</label>
//                                 <input
//                                   type="text"
//                                   className="form-control"
//                                   name="alternateMobile"
//                                   value={formData.alternateMobile}
//                                   onChange={handleChange}
//                                   placeholder="Enter Alternate Mobile"
//                                 />
//                               </div>
//                             </div>

//                             <div className="col-md-4">
//                               <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
//                                 <label className="form-label">Email <span className="text-danger">*</span></label>
//                                 <input
//                                   type="email"
//                                   className={`form-control ${errors.email ? 'is-invalid' : ''}`}
//                                   name="email"
//                                   value={formData.email}
//                                   onChange={handleChange}
//                                   placeholder="Enter Email"
//                                   required
//                                 />
//                                 {errors.email && <div className="invalid-feedback">{errors.email}</div>}
//                               </div>
//                             </div>

//                             <div className="col-md-4">
//                               <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
//                                 <label className="form-label">Gender <span className="text-danger">*</span></label>
//                                 <select
//                                   className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
//                                   name="gender"
//                                   value={formData.gender}
//                                   onChange={handleChange}
//                                   required
//                                 >
//                                   <option value="">Select Gender</option>
//                                   <option value="Male">Male</option>
//                                   <option value="Female">Female</option>
//                                   <option value="Other">Other</option>
//                                 </select>
//                                 {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
//                               </div>
//                             </div>

//                             <div className="col-md-4">
//                               <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
//                                 <label className="form-label">Date of Birth <span className="text-danger">*</span></label>
//                                 <input
//                                   type="date"
//                                   className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
//                                   name="dob"
//                                   value={formData.dob}
//                                   onChange={handleChange}
//                                   required
//                                 />
//                                 {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
//                               </div>
//                             </div>

//                             <div className="col-md-4">
//                               <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
//                                 <label className="form-label">Aadhar Number</label>
//                                 <div className="input-group">
//                                   <span className="input-group-text">
//                                     <FileText size={16} className="text-indigo-400" />
//                                   </span>
//                                   <input
//                                     type="text"
//                                     className={`form-control ${errors.aadharNumber ? 'is-invalid' : ''}`}
//                                     name="aadharNumber"
//                                     value={formData.aadharNumber}
//                                     onChange={handleChange}
//                                     placeholder="12-digit Aadhar number"
//                                     maxLength={12}
//                                   />
//                                 </div>
//                                 {errors.aadharNumber && <div className="invalid-feedback">{errors.aadharNumber}</div>}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Education Details Section */}
//                       <div className="col-12 mt-4">
//                         <div className="p-4" style={{ backgroundColor: '#e6ffed', borderRadius: '8px' }}>
//                           <div className="row gy-3">
//                             <div className="col-12 d-flex align-items-center gap-2">
//                               <span
//                                 style={{
//                                   backgroundColor: "#fff",
//                                   padding: "6px 10px",
//                                   borderRadius: "8px",
//                                   display: "inline-block",
//                                   fontSize: "16px",
//                                 }}
//                               >
//                                 <GraduationCap size={20} className="text-blue-500" />
//                               </span>
//                               <h6 className="fw-semibold mb-0" style={{ color: "#344054" }}>
//                                 EDUCATION DETAILS
//                               </h6>
//                             </div>

//                             <div className="col-md-4">
//                               <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
//                                 <label className="form-label">Qualification <span className="text-danger">*</span></label>
//                                 <div className="input-group">
//                                   <span className="input-group-text">
//                                     <GraduationCap size={16} className="text-blue-400" />
//                                   </span>
//                                   <input
//                                     type="text"
//                                     className={`form-control ${errors.qualification ? 'is-invalid' : ''}`}
//                                     name="qualification"
//                                     value={formData.qualification}
//                                     onChange={handleChange}
//                                     placeholder="Enter Qualification"
//                                     required
//                                   />
//                                 </div>
//                                 {errors.qualification && <div className="invalid-feedback">{errors.qualification}</div>}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Upload Documents Section */}
//                       <div className="col-12 mt-4">
//                         <div className="p-4" style={{ backgroundColor: '#fff0f3', borderRadius: '8px' }}>
//                           <div className="row gy-3">
//                             <div className="col-12 d-flex align-items-center gap-2">
//                               <span
//                                 style={{
//                                   backgroundColor: "#fff",
//                                   padding: "6px 10px",
//                                   borderRadius: "8px",
//                                   display: "inline-block",
//                                   fontSize: "16px",
//                                 }}
//                               >
//                                 <FileUp size={20} className="text-purple-600" />
//                               </span>
//                               <h6 className="fw-semibold mb-0" style={{ color: "#344054" }}>
//                                 UPLOAD DOCUMENTS
//                               </h6>
//                             </div>

//                             <div className="col-md-6">
//                               <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
//                                 <label className="form-label">
//                                   Passport Photo (110x120 mm) <span className="text-danger">*</span>
//                                 </label>
//                                 <input
//                                   type="file"
//                                   ref={passportPhotoRef}
//                                   onChange={(e) => handleImageUpload(e, 'passportPhoto')}
//                                   accept="image/jpeg, image/png"
//                                   className="d-none"
//                                 />
//                                 <div
//                                   onClick={() => triggerFileInput('passportPhoto')}
//                                   className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-indigo-500 transition"
//                                 >
//                                   {formData.passportPhoto ? (
//                                     <div className="flex flex-column items-center">
//                                       <img
//                                         src={formData.passportPhoto}
//                                         alt="Passport preview"
//                                         className="h-24 w-20 object-cover rounded-md mb-2"
//                                       />
//                                       <span className="text-sm text-indigo-600">Click to change photo</span>
//                                     </div>
//                                   ) : (
//                                     <div className="flex flex-column items-center">
//                                       <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
//                                         <Camera size={20} className="text-indigo-500" />
//                                       </div>
//                                       <p className="text-sm text-gray-500">Click to upload passport photo</p>
//                                       <p className="text-xs text-gray-400 mt-1">Aspect ratio 110x120 mm</p>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="col-md-6">
//                               <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
//                                 <label className="form-label">
//                                   Aadhar Card Photo <span className="text-danger">*</span>
//                                 </label>
//                                 <input
//                                   type="file"
//                                   ref={aadharPhotoRef}
//                                   onChange={(e) => handleImageUpload(e, 'aadharPhoto')}
//                                   accept="image/jpeg, image/png"
//                                   className="d-none"
//                                 />
//                                 <div
//                                   onClick={() => triggerFileInput('aadharPhoto')}
//                                   className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-indigo-500 transition"
//                                 >
//                                   {formData.aadharPhoto ? (
//                                     <div className="flex flex-column items-center">
//                                       <img
//                                         src={formData.aadharPhoto}
//                                         alt="Aadhar preview"
//                                         className="h-24 w-full object-contain rounded-md mb-2"
//                                       />
//                                       <span className="text-sm text-indigo-600">Click to change photo</span>
//                                     </div>
//                                   ) : (
//                                     <div className="flex flex-column items-center">
//                                       <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
//                                         <Image size={20} className="text-indigo-500" />
//                                       </div>
//                                       <p className="text-sm text-gray-500">Click to upload Aadhar card</p>
//                                       <p className="text-xs text-gray-400 mt-1">Front or back side</p>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Parent Details Section */}
//                       <div className="col-12 mt-4">
//                         <div className="p-4" style={{ backgroundColor: '#f0e6ff', borderRadius: '8px' }}>
//                           <div className="row gy-3">
//                             <div className="col-12 d-flex align-items-center gap-2">
//                               <span
//                                 style={{
//                                   backgroundColor: "#fff",
//                                   padding: "6px 10px",
//                                   borderRadius: "8px",
//                                   display: "inline-block",
//                                   fontSize: "16px",
//                                 }}
//                               >
//                                 <Users size={20} className="text-purple-500" />
//                               </span>
//                               <h6 className="fw-semibold mb-0" style={{ color: "#344054" }}>
//                                 PARENT DETAILS
//                               </h6>
//                             </div>

//                             <div className="col-md-4">
//                               <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
//                                 <label className="form-label">Parent Name <span className="text-danger">*</span></label>
//                                 <input
//                                   type="text"
//                                   className={`form-control ${errors.parentName ? 'is-invalid' : ''}`}
//                                   name="parentName"
//                                   value={formData.parentName}
//                                   onChange={handleChange}
//                                   placeholder="Enter Parent Name"
//                                   required
//                                 />
//                                 {errors.parentName && <div className="invalid-feedback">{errors.parentName}</div>}
//                               </div>
//                             </div>

//                             <div className="col-md-4">
//                               <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
//                                 <label className="form-label">Parent Mobile <span className="text-danger">*</span></label>
//                                 <input
//                                   type="text"
//                                   className={`form-control ${errors.parentMobile ? 'is-invalid' : ''}`}
//                                   name="parentMobile"
//                                   value={formData.parentMobile}
//                                   onChange={handleChange}
//                                   placeholder="Enter Parent Mobile"
//                                   required
//                                 />
//                                 {errors.parentMobile && <div className="invalid-feedback">{errors.parentMobile}</div>}
//                               </div>
//                             </div>

//                             <div className="col-md-4">
//                               <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
//                                 <label className="form-label">Parent Email (Optional)</label>
//                                 <input
//                                   type="email"
//                                   className="form-control"
//                                   name="parentEmail"
//                                   value={formData.parentEmail}
//                                   onChange={handleChange}
//                                   placeholder="Enter Parent Email"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Address Details Section */}
//                       <div className="col-12 mt-4">
//                         <div className="p-4" style={{ backgroundColor: '#ffe6e6', borderRadius: '8px' }}>
//                           <div className="row gy-3">
//                             <div className="col-12 d-flex align-items-center gap-2">
//                               <span
//                                 style={{
//                                   backgroundColor: "#fff",
//                                   padding: "6px 10px",
//                                   borderRadius: "8px",
//                                   display: "inline-block",
//                                   fontSize: "16px",
//                                 }}
//                               >
//                                 <MapPin size={20} className="text-pink-500" />
//                               </span>
//                               <h6 className="fw-semibold mb-0" style={{ color: "#344054" }}>
//                                 ADDRESS DETAILS
//                               </h6>
//                             </div>

//                             <div className="col-12">
//                               <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
//                                 <label className="form-label">Address <span className="text-danger">*</span></label>
//                                 <textarea
//                                   name="address"
//                                   className={`form-control ${errors.address ? 'is-invalid' : ''}`}
//                                   rows={3}
//                                   placeholder="Enter Address"
//                                   value={formData.address}
//                                   onChange={handleChange}
//                                   required
//                                 />
//                                 {errors.address && <div className="invalid-feedback">{errors.address}</div>}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="col-12 mt-4 mb-3 text-center">
//                         <button className="btn btn-danger-gradient me-2" onClick={() => { navigate("/students") }} type="button">
//                           Cancel
//                         </button>
//                         <button className="btn btn-purple-gradient" type="submit">
//                           Submit
//                         </button>
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AddStudents;


import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api";
import "flatpickr/dist/flatpickr.css";
import "./AddStudents.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { User, MapPin, Users, GraduationCap, FileText, Image, Camera, FileUp } from "lucide-react";

const AddStudents = () => {
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
  const passportPhotoRef = useRef(null);
  const aadharPhotoRef = useRef(null);

  // Generate random student ID on component mount
  useEffect(() => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const studentId = `STU${randomNum.toString().padStart(6, '0')}`;
    setFormData(prev => ({ ...prev, id: studentId }));
  }, []);

  // Load students from localStorage on component mount
  useEffect(() => {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      // Just to verify data is loading correctly
      console.log('Loaded students from localStorage:', JSON.parse(storedStudents));
    }
  }, []);

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

    // Validate image type
    if (!file.type.match('image/jpeg|image/png|image/jpg')) {
      alert('Please upload a valid JPEG or PNG image');
      return;
    }

    // For passport photo, check size (2MB limit)
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

  const triggerFileInput = (type) => {
    if (type === 'passportPhoto' && passportPhotoRef.current) {
      passportPhotoRef.current.click();
    } else if (type === 'aadharPhoto' && aadharPhotoRef.current) {
      aadharPhotoRef.current.click();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.aadharNumber && !validateAadhar(formData.aadharNumber)) {
      newErrors.aadharNumber = "Aadhar number must be 12 digits";
    }

    // Add other validations as needed
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.mobile) newErrors.mobile = "Mobile is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.qualification) newErrors.qualification = "Qualification is required";
    if (!formData.parentName) newErrors.parentName = "Parent name is required";
    if (!formData.parentMobile) newErrors.parentMobile = "Parent mobile is required";
    if (!formData.address) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!formData.passportPhoto || !formData.aadharPhoto) {
      alert('Please upload both passport photo and Aadhar photo');
      return;
    }

    try {
      // Get existing students from localStorage
      const existingStudents = JSON.parse(localStorage.getItem('students')) || [];

      // Add new student to the array
      const updatedStudents = [...existingStudents, formData];

      // Save back to localStorage
      localStorage.setItem('students', JSON.stringify(updatedStudents));

      // Optional: Still send to API if needed
      // const response = await api.post("/students", formData);
      const notificationData = {
        heading: "Added New Student",
        description: `Added new student ${formData.name}`,
        readed: 0,
      };

      await api.post("/notification", notificationData);
      navigate("/students");

      // Reset form
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const studentId = `STU${randomNum.toString().padStart(6, '0')}`;
      setFormData({
        id: studentId,
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
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Error adding student, please try again.");
    }
  };

  return (
    <>
      <div className="main-content app-content">
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
                    Add Student
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
                    padding: '10px',
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
                      <User size={25} className="text-white" />
                    </div>
                    <div>
                      <div className="card-title fw-bold fs-6">Add New Student</div>
                      <div className="d-flex align-items-center" style={{ fontSize: '12px', fontWeight: '400', color: "oklch(0.93 0.034 272.788)" }}>
                        <span>Please fill all required fields</span>
                      </div>
                    </div>
                  </div>
                  <div className="prism-toggle"></div>
                </div>

                <div className="card-body">
                  <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="row gy-3">
                      {/* Personal Details Section */}
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
                                <User size={20} className="text-indigo-500" />
                              </span>
                              <h6 className="fw-semibold mb-0" style={{ color: "#344054" }}>
                                PERSONAL DETAILS
                              </h6>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
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
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
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
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
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
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
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
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
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
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
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
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
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
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Aadhar Number</label>
                                <div className="input-group">
                                  <span className="input-group-text">
                                    <FileText size={16} className="text-indigo-400" />
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
                        <div className="p-4" style={{ backgroundColor: '#e6ffed', borderRadius: '8px' }}>
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
                                <GraduationCap size={20} className="text-blue-500" />
                              </span>
                              <h6 className="fw-semibold mb-0" style={{ color: "#344054" }}>
                                EDUCATION DETAILS
                              </h6>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Qualification <span className="text-danger">*</span></label>
                                <div className="input-group">
                                  <span className="input-group-text">
                                    <GraduationCap size={16} className="text-blue-400" />
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
                        <div className="p-3 p-md-4" style={{ backgroundColor: '#fff0f3', borderRadius: '8px' }}>
                          <div className="row gy-4">
                            <div className="col-12 d-flex flex-wrap align-items-center gap-2">
                              <span
                                style={{
                                  backgroundColor: "#fff",
                                  padding: "6px 10px",
                                  borderRadius: "8px",
                                  display: "inline-block",
                                  fontSize: "16px",
                                }}
                              >
                                <FileUp size={20} className="text-purple-600" />
                              </span>
                              <h6 className="fw-semibold mb-0" style={{ color: "#344054" }}>
                                UPLOAD DOCUMENTS
                              </h6>
                            </div>

                            {/* Passport Photo Upload */}
                            <div className="col-12 col-sm-12 col-md-6">
                              <div className="p-3 rounded shadow bg-white h-100">
                                <label className="form-label">
                                  Passport Photo (110x120 mm) <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="file"
                                  ref={passportPhotoRef}
                                  onChange={(e) => handleImageUpload(e, "passportPhoto")}
                                  accept="image/jpeg, image/png"
                                  className="d-none"
                                />
                                <div
                                  onClick={() => triggerFileInput("passportPhoto")}
                                  className="border border-2 border-dashed text-center p-3 rounded"
                                  style={{ cursor: "pointer", minHeight: "180px" }}
                                >
                                  {formData.passportPhoto ? (
                                    <div>
                                      <img
                                        src={formData.passportPhoto}
                                        alt="Passport preview"
                                        className="img-fluid"
                                        style={{
                                          width: "110px",
                                          height: "120px",
                                          objectFit: "cover",
                                          borderRadius: "8px",
                                        }}
                                      />
                                      <p className="mt-2 text-primary small">Click to change photo</p>
                                    </div>
                                  ) : (
                                    <div className="">
                                      <div className="mx-auto mb-2 d-flex align-items-center justify-content-center" style={{
                                        width: "40px", height: "40px", backgroundColor: "#e0e7ff", borderRadius: "50%"
                                      }}>
                                        <Camera size={20} className="text-indigo-500" />
                                      </div>
                                      <p className="mb-1 small">Click to upload passport photo</p>
                                      <p className="text-secondary" style={{ fontSize: "12px" }}>Aspect ratio 110x120 mm</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Aadhar Card Upload */}
                            <div className="col-12 col-sm-12 col-md-6">
                              <div className="p-3 rounded shadow bg-white h-100">
                                <label className="form-label">
                                  Aadhar Card Photo <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="file"
                                  ref={aadharPhotoRef}
                                  onChange={(e) => handleImageUpload(e, "aadharPhoto")}
                                  accept="image/jpeg, image/png"
                                  className="d-none"
                                />
                                <div
                                  onClick={() => triggerFileInput("aadharPhoto")}
                                  className="border border-2 border-dashed text-center p-3 rounded"
                                  style={{ cursor: "pointer", minHeight: "180px" }}
                                >
                                  {formData.aadharPhoto ? (
                                    <div>
                                      <img
                                        src={formData.aadharPhoto}
                                        alt="Aadhar preview"
                                        className="img-fluid"
                                        style={{
                                          width: "100%",
                                          height: "120px",
                                          objectFit: "contain",
                                          borderRadius: "8px",
                                        }}
                                      />
                                      <p className="mt-2 text-primary small">Click to change photo</p>
                                    </div>
                                  ) : (
                                    <div className="">
                                      <div className="mx-auto mb-2 d-flex align-items-center justify-content-center" style={{
                                        width: "40px", height: "40px", backgroundColor: "#e0e7ff", borderRadius: "50%"
                                      }}>
                                        <Image size={20} className="text-indigo-500" />
                                      </div>
                                      <p className="mb-1 small">Click to upload Aadhar card</p>
                                      <p className="text-secondary" style={{ fontSize: "12px" }}>Front or back side</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>


                      {/* Parent Details Section */}
                      <div className="col-12 mt-4">
                        <div className="p-4" style={{ backgroundColor: '#f0e6ff', borderRadius: '8px' }}>
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
                                <Users size={20} className="text-purple-500" />
                              </span>
                              <h6 className="fw-semibold mb-0" style={{ color: "#344054" }}>
                                PARENT DETAILS
                              </h6>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
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
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
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
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
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
                        <div className="p-4" style={{ backgroundColor: '#ffe6e6', borderRadius: '8px' }}>
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
                                <MapPin size={20} className="text-pink-500" />
                              </span>
                              <h6 className="fw-semibold mb-0" style={{ color: "#344054" }}>
                                ADDRESS DETAILS
                              </h6>
                            </div>

                            <div className="col-12">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
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
                        <button className="btn btn-danger-gradient me-2" onClick={() => { navigate("/students") }} type="button">
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
    </>
  );
};

export default AddStudents;


