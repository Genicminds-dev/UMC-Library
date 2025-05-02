import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api";
import "flatpickr/dist/flatpickr.css";
import "./AddBooks.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddBooks = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    category: "",
    language: "",
    availableCopies: "",
    totalCopies: "",
    floor: "",
    shelfCode: "",
    status: "",
    totalPages: "",
    features: "",
    volume: "",
    createdDate: "",
    publishedYear: "",
    publishedDate: "",
    moral: "",
  });

  const [Error, setError] = useState({
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    category: "",
    language: "",
    availableCopies: "",
    totalCopies: "",
    floor: "",
    shelfCode: "",
    status: "",
    totalPages: "",
    features: "",
    volume: "",
    createdDate: "",
    publishedYear: "",
    publishedDate: "",
    moral: "",
  });

  const validateForm = () => {
    const newError = {
      title: "",
      author: "",
      isbn: "",
      publisher: "",
      category: "",
      language: "",
      availableCopies: "",
      totalCopies: "",
      floor: "",
      shelfCode: "",
      status: "",
      totalPages: "",
      features: "",
      volume: "",
      createdDate: "",
      publishedYear: "",
      publishedDate: "",
      moral: "",
    };

    let isValid = true;

    const requiredFields = [
      "title",
      "author",
      "isbn",
      "publisher",
      "category",
      "language",
      "availableCopies",
      "totalCopies",
      "floor",
      "shelfCode",
      "status",
      "totalPages",
      "features",
      "volume",
      "createdDate",
      "publishedYear",
      "publishedDate",
      "moral",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]?.toString().trim()) {
        newError[field] = `*${field.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    // Specific field pattern validations
    if (formData.isbn && !/^[\d-]{10,13}$/.test(formData.isbn)) {
      newError.isbn = "*ISBN should be 10 to 13 digits or include hyphens";
      isValid = false;
    }

    if (formData.availableCopies && isNaN(formData.availableCopies)) {
      newError.availableCopies = "*Available copies must be a number";
      isValid = false;
    }

    if (formData.totalCopies && isNaN(formData.totalCopies)) {
      newError.totalCopies = "*Total copies must be a number";
      isValid = false;
    }

    if (formData.totalPages && isNaN(formData.totalPages)) {
      newError.totalPages = "*Total pages must be a number";
      isValid = false;
    }

    if (formData.volume && isNaN(formData.volume)) {
      newError.volume = "*Volume must be a number";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleFocus = (field) => {
    setError((prevError) => ({ ...prevError, [field]: "" }));
  };

  const generateBookId = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month with leading zero
    const day = now.getDate().toString().padStart(2, "0"); // Day with leading zero
    const random = Math.floor(100 + Math.random() * 900); // Random 3-digit number
    return `STU${year}${month}${day}${random}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newError = {};

    const alphaRegex = /^[A-Za-z\s]*$/;

    if (name === "inwardNo") {
      setFormData({ ...formData, [name]: value });

      if (value.trim() !== "") {
        newError[name] = "";
      } else {
        newError[name] = "*Inward number cannot be empty";
      }
    }
    if (name === "date") {
      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) {
        setFormData({ ...formData, [name]: value });
      }
    }

    if (
      name === "fullName" ||
      name === "subject" ||
      name === "handledBy" ||
      name === "complaintSentTo" ||
      name === "district" ||
      name === "taluka" ||
      name === "village" ||
      name === "city" ||
      name === "whatsappGroup" ||
      name === "applicationStatus" ||
      name === "remark"
    ) {
      if (alphaRegex.test(value) || value === "") {
        setFormData({ ...formData, [name]: value });
        newError[name] = "";
      } else {
        newError[name] = `*Only alphabets are allowed for ${name}`;
      }
    } else if (
      name === "mobileNo" ||
      name === "pincode" ||
      name === "boothNo"
    ) {
      if (/^[0-9]*$/.test(value) || value === "") {
        setFormData({ ...formData, [name]: value });
        newError[name] = "";
      } else {
        newError[name] = `*Only numbers are allowed for ${name}`;
      }
    }
    setError((prevError) => ({ ...prevError, ...newError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!formData.date) {
      formData.date = new Date().toISOString().split("T")[0];
    }

    try {
      // eslint-disable-next-line
      const response = await api.post("/grievances", formData);
      const notificationData = {
        heading: "Added New Entry",
        description: `Added new grievance ${formData.inwardNo}`,
        readed: 0,
      };

      await api.post("/notification", notificationData);
      navigate("/manage-books");

      setFormData({
        id: generateBookId(),
        title: "",
        author: "",
        isbn: "",
        publisher: "",
        category: "",
        language: "",
        availableCopies: "",
        totalCopies: "",
        floor: "",
        shelfCode: "",
        status: "",
        totalPages: "",
        features: "",
        volume: "",
        createdDate: "",
        publishedYear: "",
        publishedDate: "",
        moral: "",
      });
    } catch (error) {
      console.error("Error adding grievances:", error);
      alert("Error adding grievance, please try again.");
    }
  };

  const [selectedDate, setSelectedDate] = useState(null);
  return (
    <>
      <div class="main-content app-content">
        <div class="container-fluid">
          <div class="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
            <div>
              <nav>
                <ol class="breadcrumb mb-1">
                  <li class="breadcrumb-item fw-semibold">
                    <Link to="/dashboard">Home</Link>
                  </li>
                  <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
                  <li class="breadcrumb-item fw-semibold">
                    <Link to="/books">Manage Books</Link>
                  </li>
                  <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
                  <li class="breadcrumb-item active fw-bold" aria-current="page">
                    Add Book
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <div class="row">
            <div class="col-xl-12">
              <div className="card custom-card">
                <div
                  className="card-header justify-content-between d-flex align-items-center"
                  style={{
                    // background: 'linear-gradient(to right, #6a11cb, #2575fc)',
                    background: 'linear-gradient(to right, #6a5af9 0%, #a034f8 100%)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    padding: '15px',
                    borderRadius: '10px 10px 0 0', // Rounded top corners
                  }}
                >
                  <div className="d-flex align-items-center">
                    {/* Circle Box for the SVG Icon with Transparency */}
                    <div
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent white background with 10% opacity
                        borderRadius: '50%', // Circle shape
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
                        className="lucide lucide-book-open-text text-white"
                      >
                        <path d="M12 7v14"></path>
                        <path d="M16 12h2"></path>
                        <path d="M16 8h2"></path>
                        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                        <path d="M6 12h2"></path>
                        <path d="M6 8h2"></path>
                      </svg>
                    </div>

                    {/* Title and Message */}
                    <div>
                      <div className="card-title fw-bold fs-6">Add New Book</div>
                      <div className="d-flex align-items-center" style={{ fontSize: '12px', fontWeight: '400', color: "oklch(0.93 0.034 272.788)" }}>
                        <span>Please fill all required fields</span>
                      </div>
                    </div>
                  </div>

                  {/* Optional Prism Toggle */}
                  <div className="prism-toggle"></div>
                </div>

                <div class="card-body">
                  <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="row gy-3">

                      <div className="col-12 mt-4">
                        <div className="p-4" style={{ backgroundColor: '#e6f2ff', borderRadius: '8px' }}>
                          <div className="row gy-3">
                            <div className="col-12 d-flex align-items-center gap-2">
                              <span
                                style={{
                                  backgroundColor: "#fff", // light bluish background
                                  padding: "6px 10px",
                                  borderRadius: "8px", // slightly rounded corners
                                  display: "inline-block",
                                  fontSize: "16px",
                                }}
                              >
                                📚
                              </span>
                              <h6 className="fw-semibold mb-0" style={{ color: "#344054" }}>
                                BOOK INFORMATION
                              </h6>
                            </div>
                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Book ID</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="id"
                                  value={formData.id}
                                  onChange={handleChange}
                                  placeholder="Enter Book ID"
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Title</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="title"
                                  value={formData.title}
                                  onChange={handleChange}
                                  placeholder="Enter Book Title"
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Author</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="author"
                                  value={formData.author}
                                  onChange={handleChange}
                                  placeholder="Enter Author Name"
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">ISBN</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="isbn"
                                  value={formData.isbn}
                                  onChange={handleChange}
                                  placeholder="Enter ISBN"
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Publisher</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="publisher"
                                  value={formData.publisher}
                                  onChange={handleChange}
                                  placeholder="Enter Publisher"
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Category</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="category"
                                  value={formData.category}
                                  onChange={handleChange}
                                  placeholder="Enter Category"
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Language</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="language"
                                  value={formData.language}
                                  onChange={handleChange}
                                  placeholder="Enter Language"
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Status</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="status"
                                  value={formData.status}
                                  onChange={handleChange}
                                  placeholder="Enter Status"
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Total Pages</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="totalPages"
                                  value={formData.totalPages}
                                  onChange={handleChange}
                                  placeholder="Enter Total Pages"
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Available Copies</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="availableCopies"
                                  value={formData.availableCopies}
                                  onChange={handleChange}
                                  placeholder="Enter Available Copies"
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Total Copies</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="totalCopies"
                                  value={formData.totalCopies}
                                  onChange={handleChange}
                                  placeholder="Enter Total Copies"
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Floor</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="floor"
                                  value={formData.floor}
                                  onChange={handleChange}
                                  placeholder="Enter Floor"
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Shelf Code</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="shelfCode"
                                  value={formData.shelfCode}
                                  onChange={handleChange}
                                  placeholder="Enter Shelf Code"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* --- Features Information Section --- */}
                      <div className="col-12 mt-4">
                        <div className="p-4" style={{ backgroundColor: '#fff0f3', borderRadius: '8px' }}>
                          <div className="row gy-3">
                            <div className="col-12 d-flex align-items-center gap-2">
                              <span
                                style={{
                                  backgroundColor: "#fff", // light bluish background
                                  padding: "6px 10px",
                                  borderRadius: "8px", // slightly rounded corners
                                  display: "inline-block",
                                  fontSize: "16px",
                                }}
                              >
                                ✨
                              </span>
                              <h6 className="fw-semibold mb-0" style={{ color: "#344054" }}>
                                FEATURES INFORMATION
                              </h6>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Features</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="features"
                                  value={formData.features}
                                  onChange={handleChange}
                                  placeholder="Enter Features"
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Volume</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="volume"
                                  value={formData.volume}
                                  onChange={handleChange}
                                  placeholder="Enter Volume"
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Created Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  name="createdDate"
                                  value={formData.createdDate}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Published Year</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="publishedYear"
                                  value={formData.publishedYear}
                                  onChange={handleChange}
                                  placeholder="Enter Published Year"
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Published Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  name="publishedDate"
                                  value={formData.publishedDate}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Moral</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="moral"
                                  value={formData.moral}
                                  onChange={handleChange}
                                  placeholder="Enter Moral"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 mt-4 mb-3 text-center">
                        <button className="btn btn-danger-gradient me-2" onClick={() => { navigate("/books") }} type="button">
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

export default AddBooks;
