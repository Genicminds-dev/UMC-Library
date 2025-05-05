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
import { BookOpenText, Info, Star } from "lucide-react";

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

  const [errors, setErrors] = useState({
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

  const generateBookId = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const random = Math.floor(100 + Math.random() * 900);
    return `BK${year}${month}${day}${random}`;
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, id: generateBookId() }));
  }, []);

  const validateForm = () => {
    const newErrors = {
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
      "category",
      "language",
      "totalCopies",
      "floor",
      "status",
      "totalPages",
      "features",
      "moral"
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]?.toString().trim()) {
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    if (formData.isbn && !/^[\d-]{10,13}$/.test(formData.isbn)) {
      newErrors.isbn = "ISBN should be 10 to 13 digits or include hyphens";
      isValid = false;
    }

    if (formData.availableCopies && isNaN(formData.availableCopies)) {
      newErrors.availableCopies = "Available copies must be a number";
      isValid = false;
    }

    if (formData.totalCopies && isNaN(formData.totalCopies)) {
      newErrors.totalCopies = "Total copies must be a number";
      isValid = false;
    }

    if (formData.totalPages && isNaN(formData.totalPages)) {
      newErrors.totalPages = "Total pages must be a number";
      isValid = false;
    }

    if (formData.volume && isNaN(formData.volume)) {
      newErrors.volume = "Volume must be a number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

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
      const response = await api.post("/books", formData);
      const notificationData = {
        heading: "Added New Book",
        description: `Added new book ${formData.title}`,
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
      console.error("Error adding book:", error);
      alert("Error adding book, please try again.");
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
                    <Link to="/books">Manage Books</Link>
                  </li>
                  <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
                  <li className="breadcrumb-item active" aria-current="page">
                    Add Book
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
                      <BookOpenText size={25} className="text-white" />
                    </div>
                    <div>
                      <div className="card-title fw-bold fs-6">Add New Book</div>
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
                      {/* Book Information Section */}
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
                                <Info size={20} className="text-indigo-500" />
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
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Title <span className="text-danger">*</span></label>
                                <input
                                  type="text"
                                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                  name="title"
                                  value={formData.title}
                                  onChange={handleChange}
                                  placeholder="Enter Book Title"
                                  required
                                />
                                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Author <span className="text-danger">*</span></label>
                                <input
                                  type="text"
                                  className={`form-control ${errors.author ? 'is-invalid' : ''}`}
                                  name="author"
                                  value={formData.author}
                                  onChange={handleChange}
                                  placeholder="Enter Author Name"
                                  required
                                />
                                {errors.author && <div className="invalid-feedback">{errors.author}</div>}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">ISBN</label>
                                <input
                                  type="text"
                                  className={`form-control ${errors.isbn ? 'is-invalid' : ''}`}
                                  name="isbn"
                                  value={formData.isbn}
                                  onChange={handleChange}
                                  placeholder="Enter ISBN"
                                />
                                {errors.isbn && <div className="invalid-feedback">{errors.isbn}</div>}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Publisher</label>
                                <input
                                  type="text"
                                  className={`form-control ${errors.publisher ? 'is-invalid' : ''}`}
                                  name="publisher"
                                  value={formData.publisher}
                                  onChange={handleChange}
                                  placeholder="Enter Publisher"
                                />
                                {errors.publisher && <div className="invalid-feedback">{errors.publisher}</div>}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">
                                  Category <span className="text-danger">*</span>
                                </label>
                                <select
                                  className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                                  name="category"
                                  value={formData.category}
                                  onChange={handleChange}
                                  required
                                >
                                  <option value="">Select Category</option>
                                  <option value="Fiction">Fiction</option>
                                  <option value="Non-fiction">Non-fiction</option>
                                  <option value="Biography">Biography</option>
                                  <option value="History">History</option>
                                  <option value="Science">Science</option>
                                  <option value="Comics">Comics</option>
                                </select>
                                {errors.category && (
                                  <div className="invalid-feedback">{errors.category}</div>
                                )}
                              </div>
                            </div>


                            <div className="col-md-4">
                              <div className="p-3 rounded shadow bg-white">
                                <label className="form-label">Language <span className="text-danger">*</span></label>
                                <select
                                  className={`form-select ${errors.language ? 'is-invalid' : ''}`}
                                  name="language"
                                  value={formData.language}
                                  onChange={handleChange}
                                  required
                                >
                                  <option value="">Select Language</option>
                                  <option value="English">English</option>
                                  <option value="Marathi">Marathi</option>
                                  <option value="Hindi">Hindi</option>
                                  <option value="French">French</option>
                                  <option value="Spanish">Spanish</option>
                                </select>
                                {errors.language && <div className="invalid-feedback">{errors.language}</div>}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Available Copies</label>
                                <input
                                  type="number"
                                  className={`form-control ${errors.availableCopies ? 'is-invalid' : ''}`}
                                  name="availableCopies"
                                  value={formData.availableCopies}
                                  onChange={handleChange}
                                  placeholder="Enter Available Copies"
                                />
                                {errors.availableCopies && <div className="invalid-feedback">{errors.availableCopies}</div>}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Total Copies <span className="text-danger">*</span></label>
                                <input
                                  type="number"
                                  className={`form-control ${errors.totalCopies ? 'is-invalid' : ''}`}
                                  name="totalCopies"
                                  value={formData.totalCopies}
                                  onChange={handleChange}
                                  placeholder="Enter Total Copies"
                                  required
                                />
                                {errors.totalCopies && <div className="invalid-feedback">{errors.totalCopies}</div>}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Floor <span className="text-danger">*</span></label>
                                <input
                                  type="text"
                                  className={`form-control ${errors.floor ? 'is-invalid' : ''}`}
                                  name="floor"
                                  value={formData.floor}
                                  onChange={handleChange}
                                  placeholder="Enter Floor"
                                  required
                                />
                                {errors.floor && <div className="invalid-feedback">{errors.floor}</div>}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Shelf Code</label>
                                <input
                                  type="text"
                                  className={`form-control ${errors.shelfCode ? 'is-invalid' : ''}`}
                                  name="shelfCode"
                                  value={formData.shelfCode}
                                  onChange={handleChange}
                                  placeholder="Enter Shelf Code"
                                />
                                {errors.shelfCode && <div className="invalid-feedback">{errors.shelfCode}</div>}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Status <span className="text-danger">*</span></label>
                                <select
                                  className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                                  name="status"
                                  value={formData.status}
                                  onChange={handleChange}
                                  required
                                >
                                  <option value="">Select Status</option>
                                  <option value="Available">Available</option>
                                  <option value="Reserved">Reserved</option>
                                  <option value="Out of Stock">Out of Stock</option>
                                </select>
                                {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Total Pages <span className="text-danger">*</span></label>
                                <input
                                  type="number"
                                  className={`form-control ${errors.totalPages ? 'is-invalid' : ''}`}
                                  name="totalPages"
                                  value={formData.totalPages}
                                  onChange={handleChange}
                                  placeholder="Enter Total Pages"
                                  required
                                />
                                {errors.totalPages && <div className="invalid-feedback">{errors.totalPages}</div>}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">File Attachment</label>
                                <input
                                  type="file"
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Features Information Section */}
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
                                <Star size={20} className="text-pink-500" />
                              </span>
                              <h6 className="fw-semibold mb-0" style={{ color: "#344054" }}>
                                FEATURES INFORMATION
                              </h6>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Features <span className="text-danger">*</span></label>
                                <input
                                  type="text"
                                  className={`form-control ${errors.features ? 'is-invalid' : ''}`}
                                  name="features"
                                  value={formData.features}
                                  onChange={handleChange}
                                  placeholder="Enter Features"
                                  required
                                />
                                {errors.features && <div className="invalid-feedback">{errors.features}</div>}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Volume</label>
                                <input
                                  type="text"
                                  className={`form-control ${errors.volume ? 'is-invalid' : ''}`}
                                  name="volume"
                                  value={formData.volume}
                                  onChange={handleChange}
                                  placeholder="Enter Volume"
                                />
                                {errors.volume && <div className="invalid-feedback">{errors.volume}</div>}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Created Date</label>
                                <input
                                  type="date"
                                  className={`form-control ${errors.createdDate ? 'is-invalid' : ''}`}
                                  name="createdDate"
                                  value={formData.createdDate}
                                  onChange={handleChange}
                                />
                                {errors.createdDate && <div className="invalid-feedback">{errors.createdDate}</div>}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Published Year</label>
                                <input
                                  type="text"
                                  className={`form-control ${errors.publishedYear ? 'is-invalid' : ''}`}
                                  name="publishedYear"
                                  value={formData.publishedYear}
                                  onChange={handleChange}
                                  placeholder="Enter Published Year"
                                />
                                {errors.publishedYear && <div className="invalid-feedback">{errors.publishedYear}</div>}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Published Date</label>
                                <input
                                  type="date"
                                  className={`form-control ${errors.publishedDate ? 'is-invalid' : ''}`}
                                  name="publishedDate"
                                  value={formData.publishedDate}
                                  onChange={handleChange}
                                />
                                {errors.publishedDate && <div className="invalid-feedback">{errors.publishedDate}</div>}
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="p-3 rounded shadow" style={{ backgroundColor: "#fff" }}>
                                <label className="form-label">Moral <span className="text-danger">*</span></label>
                                <textarea
                                  rows={3}
                                  className={`form-control ${errors.moral ? 'is-invalid' : ''}`}
                                  name="moral"
                                  value={formData.moral}
                                  onChange={handleChange}
                                  placeholder="Enter Moral"
                                  required
                                />
                                {errors.moral && <div className="invalid-feedback">{errors.moral}</div>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 mt-4 mb-3 text-center">
                        <button
                          className="btn btn-danger-gradient me-2"
                          type="button"
                          onClick={() => {
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
                          }}
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
    </>
  );
};

export default AddBooks;