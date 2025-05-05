// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { HiOutlineArrowNarrowRight } from "react-icons/hi";
// import { Link } from "react-router-dom";
// import ReactPaginate from "react-paginate";
// import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
// import api from "../../api";
// import * as XLSX from "xlsx";
// import autoTable from "jspdf-autotable";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import "../../assets/css/clipboard.css";

// const StudentList = () => {
//   const [students, setStudents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const [sortColumn, setSortColumn] = useState("");
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const itemsPerPage = 8;

//   const fetchStudents = async () => {
//     try {
//       const response = await api.get("/students");
//       setStudents(response.data);
//     } catch (error) {
//       console.error("Error fetching students:", error);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await api.delete(`/students/${deleteId}`);
//       fetchStudents();
//       setShowDeleteModal(false);
//     } catch (error) {
//       console.error("Error deleting student:", error);
//     }
//   };

//   const filteredData = students.filter(
//     (item) =>
//       item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.qualification.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const sortData = (data, column, direction) => {
//     const sortedData = [...data].sort((a, b) => {
//       const isAsc = direction === "asc";
//       if (a[column] < b[column]) {
//         return isAsc ? -1 : 1;
//       }
//       if (a[column] > b[column]) {
//         return isAsc ? 1 : -1;
//       }
//       return 0;
//     });
//     return sortedData;
//   };

//   const sortedData = sortColumn
//     ? sortData(filteredData, sortColumn, sortDirection)
//     : filteredData;

//   const offset = currentPage * itemsPerPage;
//   const displayedStudents = sortedData.slice(offset, offset + itemsPerPage);
//   const pageCount = Math.ceil(sortedData.length / itemsPerPage);

//   const handlePageClick = (event) => {
//     setCurrentPage(event.selected);
//   };

//   const handleSort = (column) => {
//     const direction =
//       sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
//     setSortColumn(column);
//     setSortDirection(direction);
//   };

//   const renderSortIcon = (column) => {
//     if (sortColumn === column) {
//       return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
//     }
//     return <FaSort />;
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//   };

//   const handlePrint = () => {
//     const printWindow = window.open("", "", "width=800,height=600");
//     const printContent = `
//         <html>
//           <head>
//             <title>Students List</title>
//             <style>
//               table {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin: 20px 0;
//               }
//               th, td {
//                 border: 1px solid #ddd;
//                 padding: 8px;
//                 text-align: left;
//               }
//               th {
//                 background-color: #f2f2f2;
//               }
//             </style>
//           </head>
//           <body>
//             <h2>Students List</h2>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Student ID</th>
//                   <th>Name</th>
//                   <th>Mobile</th>
//                   <th>Email</th>
//                   <th>Qualification</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${students
//                   .map(
//                     (student, index) => `
//                   <tr>
//                     <td>${student.id}</td>
//                     <td>${student.name}</td>
//                     <td>${student.mobile}</td>
//                     <td>${student.email}</td>
//                     <td>${student.qualification}</td>
//                     <td>Active</td>
//                   </tr>
//                 `
//                   )
//                   .join("")}
//               </tbody>
//             </table>
//           </body>
//         </html>
//       `;
//     printWindow.document.write(printContent);
//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//     printWindow.close();
//   };

//   const [showPopup, setShowPopup] = useState(false);
//   const copyToClipboard = () => {
//     const tableHeadings = "Student ID\tName\tMobile\tEmail\tQualification\tStatus";

//     const dataStr = students
//       .map(
//         (student) =>
//           `${student.id}\t${student.name}\t${student.mobile}\t${student.email}\t${student.qualification}\tActive`
//       )
//       .join("\n");

//     const fullDataStr = `${tableHeadings}\n${dataStr}`;

//     navigator.clipboard
//       .writeText(fullDataStr)
//       .then(() => {
//         setShowPopup(true);
//         setTimeout(() => {
//           setShowPopup(false);
//         }, 1500);
//       })
//       .catch((err) => {
//         console.error("Failed to copy data: ", err);
//       });
//   };

//   const downloadCSV = () => {
//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       students
//         .map(
//           (student) =>
//             `${student.id},${student.name},${student.mobile},${student.email},${student.qualification},Active`
//         )
//         .join("\n");

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "studentsList.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const downloadExcel = () => {
//     const formattedStudents = students.map((student) => ({
//       "Student ID": student.id,
//       "Name": student.name,
//       "Mobile": student.mobile,
//       "Email": student.email,
//       "Qualification": student.qualification,
//       "Status": "Active"
//     }));

//     const ws = XLSX.utils.json_to_sheet(formattedStudents);

//     const wscols = [
//       { wpx: 100 },
//       { wpx: 150 },
//       { wpx: 120 },
//       { wpx: 200 },
//       { wpx: 150 },
//       { wpx: 80 },
//     ];
//     ws["!cols"] = wscols;

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Students List");

//     XLSX.writeFile(wb, "studentsList.xlsx");
//   };

//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();

//     doc.setFontSize(16);
//     doc.setTextColor(0, 0, 0);

//     const title = "Students List";
//     const titleWidth = doc.getTextWidth(title);
//     const titleXPosition = (pageWidth - titleWidth) / 2;

//     doc.text(title, titleXPosition, 15);

//     autoTable(doc, {
//       head: [
//         [
//           "Student ID",
//           "Name",
//           "Mobile",
//           "Email",
//           "Qualification",
//           "Status"
//         ],
//       ],
//       body: students.map((student) => [
//         student.id,
//         student.name,
//         student.mobile,
//         student.email,
//         student.qualification,
//         "Active"
//       ]),
//       styles: {
//         overflow: "linebreak",
//       },
//       headStyles: {
//         fillColor: [4, 54, 71],
//         textColor: [255, 255, 255],
//         halign: "center",
//         valign: "middle",
//         cellPadding: 1,
//         fontSize: 9,
//       },
//       bodyStyles: {
//         cellPadding: 1,
//         overflow: "linebreak",
//         fontSize: 9,
//       },
//       margin: { top: 20 },
//     });

//     doc.save("studentsList.pdf");
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   return (
//     <>
//       <div className="main-content app-content">
//         <div className="container-fluid">
//           <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
//             <div>
//               <nav>
//                 <ol className="breadcrumb mb-1">
//                   <li className="breadcrumb-item">
//                     <Link to="/dashboard">Home</Link>
//                   </li>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       height: "100%",
//                     }}
//                   >
//                     <HiOutlineArrowNarrowRight className="mx-2 mt-1" />
//                   </div>
//                   <li className="breadcrumb-item active" aria-current="page">
//                     Students
//                   </li>
//                 </ol>
//               </nav>
//             </div>
//             <div className="btn-list">
//               <Link
//                 to="/add-students"
//                 className="btn btn-success-gradient btn-wave waves-effect waves-light"
//               >
//                 <i className="ri-share-forward-line me-1"></i> Add New Student
//               </Link>
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-xl-12">
//               <div className="card custom-card">
//                 <div className="card-header">
//                   <div className="card-title fs-18">Students</div>
//                 </div>
//                 <div className="card-body">
//                   <div className="table-responsive">
//                     <div
//                       id="file-export_wrapper"
//                       className="dataTables_wrapper dt-bootstrap5 no-footer"
//                     >
//                       <div className="dt-buttons">
//                         <button
//                           className="dt-button buttons-copy buttons-html5"
//                           tabIndex="0"
//                           aria-controls="file-export"
//                           style={{ background: "#21CE9E", marginLeft: "0px" }}
//                           onClick={copyToClipboard}
//                         >
//                           {showPopup && (
//                             <div className="popup">
//                               <span className="popup-title">
//                                 Copy to clipboard
//                               </span>
//                               <hr className="popup-divider" />
//                               <p className="popup-subtitle">
//                                 Copied {students.length} rows to clipboard
//                               </p>
//                             </div>
//                           )}
//                           <span>Copy</span>
//                         </button>
//                         <button
//                           className="dt-button buttons-csv buttons-html5"
//                           tabIndex="0"
//                           aria-controls="file-export"
//                           type="button"
//                           style={{ background: "#FF8E6F", marginLeft: "8px" }}
//                           onClick={downloadCSV}
//                         >
//                           <span>CSV</span>
//                         </button>
//                         <button
//                           className="dt-button buttons-excel buttons-html5"
//                           tabIndex="0"
//                           aria-controls="file-export"
//                           type="button"
//                           style={{ background: "#FFC658", marginLeft: "8px" }}
//                           onClick={downloadExcel}
//                         >
//                           <span>Excel</span>
//                         </button>
//                         <button
//                           className="dt-button buttons-pdf buttons-html5"
//                           tabIndex="0"
//                           aria-controls="file-export"
//                           type="button"
//                           style={{ background: "#FB4242", marginLeft: "8px" }}
//                           onClick={downloadPDF}
//                         >
//                           <span>PDF</span>
//                         </button>
//                         <button
//                           className="dt-button buttons-print"
//                           tabIndex="0"
//                           aria-controls="file-export"
//                           type="button"
//                           style={{ background: "#5C67F7", marginLeft: "8px" }}
//                           onClick={handlePrint}
//                         >
//                           <span>Print</span>
//                         </button>{" "}
//                       </div>

//                       <div
//                         id="file-export_filter"
//                         className="dataTables_filter"
//                       >
//                         <label>
//                           <div className="position-relative">
//                             <input
//                               type="text"
//                               className="form-control form-control-sm mb-3"
//                               placeholder="Search student..."
//                               value={searchTerm}
//                               onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                             {searchTerm && (
//                               <button
//                                 onClick={clearSearch}
//                                 className="btn btn-link position-absolute"
//                                 style={{
//                                   right: "4px",
//                                   top: "50%",
//                                   transform: "translateY(-50%)",
//                                   fontSize: "1.3rem",
//                                   color: "#006CA5",
//                                   fontWeight: "500",
//                                   textDecoration: "none",
//                                 }}
//                                 title="Clear"
//                               >
//                                 &times;
//                               </button>
//                             )}
//                           </div>
//                         </label>
//                       </div>
//                       <table className="table table-bordered text-nowrap w-100">
//                         <thead>
//                           <tr>
//                             <th
//                               onClick={() => handleSort("id")}
//                               style={{
//                                 cursor: "pointer",
//                                 justifyContent: "space-between",
//                                 background: "#f2f4f7",
//                                 fontWeight: "bold"
//                               }}
//                               className="text-center"
//                             >
//                               Student ID
//                               <span
//                                 style={{
//                                   opacity: 0.2,
//                                   paddingLeft: "5px",
//                                   fontSize: "12px",
//                                 }}
//                                 className="text-center"
//                               >
//                                 {renderSortIcon("id")}
//                               </span>
//                             </th>
//                             <th
//                               onClick={() => handleSort("name")}
//                               style={{
//                                 cursor: "pointer",
//                                 justifyContent: "space-between",
//                                 background: "#f2f4f7",
//                                 fontWeight: "bold"
//                               }}
//                               className="text-center"
//                             >
//                               Name
//                               <span
//                                 style={{
//                                   opacity: 0.2,
//                                   paddingLeft: "20px",
//                                   fontSize: "12px",
//                                 }}
//                               >
//                                 {renderSortIcon("name")}
//                               </span>
//                             </th>
//                             <th
//                               onClick={() => handleSort("mobile")}
//                               style={{
//                                 cursor: "pointer",
//                                 justifyContent: "space-between",
//                                 background: "#f2f4f7",
//                                 fontWeight: "bold"
//                               }}
//                               className="text-center"
//                             >
//                               Mobile
//                               <span
//                                 style={{
//                                   opacity: 0.2,
//                                   paddingLeft: "20px",
//                                   fontSize: "12px",
//                                 }}
//                               >
//                                 {renderSortIcon("mobile")}
//                               </span>
//                             </th>
//                             <th
//                               onClick={() => handleSort("email")}
//                               style={{
//                                 cursor: "pointer",
//                                 justifyContent: "space-between",
//                                 background: "#f2f4f7",
//                                 fontWeight: "bold"
//                               }}
//                               className="text-center"
//                             >
//                               Email
//                               <span
//                                 style={{
//                                   opacity: 0.2,
//                                   paddingLeft: "20px",
//                                   fontSize: "12px",
//                                 }}
//                               >
//                                 {renderSortIcon("email")}
//                               </span>
//                             </th>
//                             <th
//                               onClick={() => handleSort("qualification")}
//                               style={{
//                                 cursor: "pointer",
//                                 justifyContent: "space-between",
//                                 background: "#f2f4f7",
//                                 fontWeight: "bold"
//                               }}
//                               className="text-center"
//                             >
//                               Qualification
//                               <span
//                                 style={{
//                                   opacity: 0.2,
//                                   paddingLeft: "20px",
//                                   fontSize: "12px",
//                                 }}
//                               >
//                                 {renderSortIcon("qualification")}
//                               </span>
//                             </th>
//                             <th
//                               style={{
//                                 background: "#f2f4f7",
//                                 fontWeight: "bold"
//                               }}
//                               className="text-center"
//                             >
//                               Status
//                             </th>
//                             <th
//                               style={{
//                                 background: "#f2f4f7",
//                                 fontWeight: "bold"
//                               }}
//                               className="text-center"
//                             >
//                               Actions
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {displayedStudents.length > 0 ? (
//                             displayedStudents.map((student, index) => (
//                               <tr key={student.id}>
//                                 <td>{student.id}</td>
//                                 <td className="fw-semibold">
//                                   <div className="d-flex align-items-center gap-3">
//                                     <div>
//                                       <span className="d-block fw-medium">
//                                         {student.name}
//                                       </span>
//                                     </div>
//                                   </div>
//                                 </td>
//                                 <td>{student.mobile}</td>
//                                 <td>{student.email}</td>
//                                 <td>{student.qualification}</td>
//                                 <td>
//                                   <span className="badge bg-success">
//                                     Active
//                                   </span>
//                                 </td>
//                                 <td>
//                                   <div className="btn-list">
//                                     <Link
//                                       to={`/student/${student.id}`}
//                                       className="btn btn-sm btn-icon btn-purple-gradient"
//                                     >
//                                       <i className="ri-eye-line"></i>
//                                     </Link>
//                                     <Link
//                                       to={`/edit-student/${student.id}`}
//                                       className="btn btn-sm btn-icon btn-success-gradient"
//                                     >
//                                       <i className="ri-pencil-line"></i>
//                                     </Link>
//                                     <button
//                                       className="btn btn-sm btn-icon btn-danger-gradient"
//                                       onClick={() => {
//                                         setDeleteId(student.id);
//                                         setShowDeleteModal(true);
//                                       }}
//                                     >
//                                       <i className="ri-delete-bin-line"></i>
//                                     </button>
//                                   </div>
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="7" className="text-center">
//                                 No students found
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>

//                       <div className="row mt-3">
//                         <div className="col-md-6">
//                           <p className="text-muted">
//                             Showing {offset + 1} to{" "}
//                             {Math.min(offset + itemsPerPage, sortedData.length)}{" "}
//                             of {sortedData.length} entries
//                           </p>
//                         </div>

//                         <div className="col-md-6 d-flex justify-content-end">
//                           <ReactPaginate
//                             previousLabel={"Previous"}
//                             nextLabel={"Next"}
//                             breakLabel={"..."}
//                             pageCount={pageCount}
//                             marginPagesDisplayed={2}
//                             pageRangeDisplayed={3}
//                             onPageChange={handlePageClick}
//                             containerClassName={"pagination"}
//                             pageClassName={"page-item"}
//                             pageLinkClassName={"page-link"}
//                             previousClassName={"page-item"}
//                             previousLinkClassName={"page-link"}
//                             nextClassName={"page-item"}
//                             nextLinkClassName={"page-link"}
//                             breakClassName={"page-item"}
//                             breakLinkClassName={"page-link"}
//                             activeClassName={"active"}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {showDeleteModal && <div className="modal-backdrop fade show"></div>}

//       {showDeleteModal && (
//         <div className="modal show d-block">
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content text-center">
//               <div className="modal-body">
//                 <h6>Are you sure you want to delete this student?</h6>
//               </div>
//               <div className="modal-footer d-block">
//                 <button
//                   type="button"
//                   className="btn btn-success-gradient"
//                   onClick={handleDelete}
//                 >
//                   Yes
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-danger-gradient"
//                   onClick={() => setShowDeleteModal(false)}
//                 >
//                   No
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default StudentList;


import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../assets/css/clipboard.css";

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const itemsPerPage = 8;

  // Fetch students from localStorage
  const fetchStudents = () => {
    try {
      const storedStudents = localStorage.getItem('students');
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      }
    } catch (error) {
      console.error("Error fetching students from localStorage:", error);
    }
  };

  // Delete student from localStorage
  const handleDelete = () => {
    try {
      const updatedStudents = students.filter(student => student.id !== deleteId);
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      setStudents(updatedStudents);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const filteredData = students.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.qualification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortData = (data, column, direction) => {
    const sortedData = [...data].sort((a, b) => {
      const isAsc = direction === "asc";
      if (a[column] < b[column]) {
        return isAsc ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return isAsc ? 1 : -1;
      }
      return 0;
    });
    return sortedData;
  };

  const sortedData = sortColumn
    ? sortData(filteredData, sortColumn, sortDirection)
    : filteredData;

  const offset = currentPage * itemsPerPage;
  const displayedStudents = sortedData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(sortedData.length / itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleSort = (column) => {
    const direction =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  };

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    const printContent = `
        <html>
          <head>
            <title>Students List</title>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            <h2>Students List</h2>
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Qualification</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${students
                  .map(
                    (student, index) => `
                  <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.mobile}</td>
                    <td>${student.email}</td>
                    <td>${student.qualification}</td>
                    <td>Active</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const [showPopup, setShowPopup] = useState(false);
  const copyToClipboard = () => {
    const tableHeadings = "Student ID\tName\tMobile\tEmail\tQualification\tStatus";

    const dataStr = students
      .map(
        (student) =>
          `${student.id}\t${student.name}\t${student.mobile}\t${student.email}\t${student.qualification}\tActive`
      )
      .join("\n");

    const fullDataStr = `${tableHeadings}\n${dataStr}`;

    navigator.clipboard
      .writeText(fullDataStr)
      .then(() => {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
      })
      .catch((err) => {
        console.error("Failed to copy data: ", err);
      });
  };

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      students
        .map(
          (student) =>
            `${student.id},${student.name},${student.mobile},${student.email},${student.qualification},Active`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "studentsList.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = () => {
    const formattedStudents = students.map((student) => ({
      "Student ID": student.id,
      "Name": student.name,
      "Mobile": student.mobile,
      "Email": student.email,
      "Qualification": student.qualification,
      "Status": "Active"
    }));

    const ws = XLSX.utils.json_to_sheet(formattedStudents);

    const wscols = [
      { wpx: 100 },
      { wpx: 150 },
      { wpx: 120 },
      { wpx: 200 },
      { wpx: 150 },
      { wpx: 80 },
    ];
    ws["!cols"] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students List");

    XLSX.writeFile(wb, "studentsList.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);

    const title = "Students List";
    const titleWidth = doc.getTextWidth(title);
    const titleXPosition = (pageWidth - titleWidth) / 2;

    doc.text(title, titleXPosition, 15);

    autoTable(doc, {
      head: [
        [
          "Student ID",
          "Name",
          "Mobile",
          "Email",
          "Qualification",
          "Status"
        ],
      ],
      body: students.map((student) => [
        student.id,
        student.name,
        student.mobile,
        student.email,
        student.qualification,
        "Active"
      ]),
      styles: {
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [4, 54, 71],
        textColor: [255, 255, 255],
        halign: "center",
        valign: "middle",
        cellPadding: 1,
        fontSize: 9,
      },
      bodyStyles: {
        cellPadding: 1,
        overflow: "linebreak",
        fontSize: 9,
      },
      margin: { top: 20 },
    });

    doc.save("studentsList.pdf");
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <HiOutlineArrowNarrowRight className="mx-2 mt-1" />
                  </div>
                  <li className="breadcrumb-item active" aria-current="page">
                    Students
                  </li>
                </ol>
              </nav>
            </div>
            <div className="btn-list">
              <Link
                to="/add-students"
                className="btn btn-success-gradient btn-wave waves-effect waves-light"
              >
                <i className="ri-share-forward-line me-1"></i> Add New Student
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-12">
              <div className="card custom-card">
                <div className="card-header">
                  <div className="card-title fs-18">Students</div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <div
                      id="file-export_wrapper"
                      className="dataTables_wrapper dt-bootstrap5 no-footer"
                    >
                      <div className="dt-buttons">
                        <button
                          className="dt-button buttons-copy buttons-html5"
                          tabIndex="0"
                          aria-controls="file-export"
                          style={{ background: "#21CE9E", marginLeft: "0px" }}
                          onClick={copyToClipboard}
                        >
                          {showPopup && (
                            <div className="popup">
                              <span className="popup-title">
                                Copy to clipboard
                              </span>
                              <hr className="popup-divider" />
                              <p className="popup-subtitle">
                                Copied {students.length} rows to clipboard
                              </p>
                            </div>
                          )}
                          <span>Copy</span>
                        </button>
                        <button
                          className="dt-button buttons-csv buttons-html5"
                          tabIndex="0"
                          aria-controls="file-export"
                          type="button"
                          style={{ background: "#FF8E6F", marginLeft: "8px" }}
                          onClick={downloadCSV}
                        >
                          <span>CSV</span>
                        </button>
                        <button
                          className="dt-button buttons-excel buttons-html5"
                          tabIndex="0"
                          aria-controls="file-export"
                          type="button"
                          style={{ background: "#FFC658", marginLeft: "8px" }}
                          onClick={downloadExcel}
                        >
                          <span>Excel</span>
                        </button>
                        <button
                          className="dt-button buttons-pdf buttons-html5"
                          tabIndex="0"
                          aria-controls="file-export"
                          type="button"
                          style={{ background: "#FB4242", marginLeft: "8px" }}
                          onClick={downloadPDF}
                        >
                          <span>PDF</span>
                        </button>
                        <button
                          className="dt-button buttons-print"
                          tabIndex="0"
                          aria-controls="file-export"
                          type="button"
                          style={{ background: "#5C67F7", marginLeft: "8px" }}
                          onClick={handlePrint}
                        >
                          <span>Print</span>
                        </button>{" "}
                      </div>

                      <div
                        id="file-export_filter"
                        className="dataTables_filter"
                      >
                        <label>
                          <div className="position-relative">
                            <input
                              type="text"
                              className="form-control form-control-sm mb-3"
                              placeholder="Search student..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                              <button
                                onClick={clearSearch}
                                className="btn btn-link position-absolute"
                                style={{
                                  right: "4px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  fontSize: "1.3rem",
                                  color: "#006CA5",
                                  fontWeight: "500",
                                  textDecoration: "none",
                                }}
                                title="Clear"
                              >
                                &times;
                              </button>
                            )}
                          </div>
                        </label>
                      </div>
                      <table className="table table-bordered text-nowrap w-100">
                        <thead>
                          <tr>
                            <th
                              onClick={() => handleSort("id")}
                              style={{
                                cursor: "pointer",
                                justifyContent: "space-between",
                                background: "#f2f4f7",
                                fontWeight: "bold"
                              }}
                              className="text-center"
                            >
                              Student ID
                              <span
                                style={{
                                  opacity: 0.2,
                                  paddingLeft: "5px",
                                  fontSize: "12px",
                                }}
                                className="text-center"
                              >
                                {renderSortIcon("id")}
                              </span>
                            </th>
                            <th
                              onClick={() => handleSort("name")}
                              style={{
                                cursor: "pointer",
                                justifyContent: "space-between",
                                background: "#f2f4f7",
                                fontWeight: "bold"
                              }}
                              className="text-center"
                            >
                              Name
                              <span
                                style={{
                                  opacity: 0.2,
                                  paddingLeft: "20px",
                                  fontSize: "12px",
                                }}
                              >
                                {renderSortIcon("name")}
                              </span>
                            </th>
                            <th
                              onClick={() => handleSort("mobile")}
                              style={{
                                cursor: "pointer",
                                justifyContent: "space-between",
                                background: "#f2f4f7",
                                fontWeight: "bold"
                              }}
                              className="text-center"
                            >
                              Mobile
                              <span
                                style={{
                                  opacity: 0.2,
                                  paddingLeft: "20px",
                                  fontSize: "12px",
                                }}
                              >
                                {renderSortIcon("mobile")}
                              </span>
                            </th>
                            <th
                              onClick={() => handleSort("email")}
                              style={{
                                cursor: "pointer",
                                justifyContent: "space-between",
                                background: "#f2f4f7",
                                fontWeight: "bold"
                              }}
                              className="text-center"
                            >
                              Email
                              <span
                                style={{
                                  opacity: 0.2,
                                  paddingLeft: "20px",
                                  fontSize: "12px",
                                }}
                              >
                                {renderSortIcon("email")}
                              </span>
                            </th>
                            <th
                              onClick={() => handleSort("qualification")}
                              style={{
                                cursor: "pointer",
                                justifyContent: "space-between",
                                background: "#f2f4f7",
                                fontWeight: "bold"
                              }}
                              className="text-center"
                            >
                              Qualification
                              <span
                                style={{
                                  opacity: 0.2,
                                  paddingLeft: "20px",
                                  fontSize: "12px",
                                }}
                              >
                                {renderSortIcon("qualification")}
                              </span>
                            </th>
                            <th
                              style={{
                                background: "#f2f4f7",
                                fontWeight: "bold"
                              }}
                              className="text-center"
                            >
                              Status
                            </th>
                            <th
                              style={{
                                background: "#f2f4f7",
                                fontWeight: "bold"
                              }}
                              className="text-center"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedStudents.length > 0 ? (
                            displayedStudents.map((student, index) => (
                              <tr key={student.id}>
                                <td className="text-center">{student.id}</td>
                                <td className="fw-semibold">
                                  <div className=" text-center gap-3">
                                    <div>
                                      <span className="d-block fw-medium">
                                        {student.name}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="text-center">{student.mobile}</td>
                                <td className="text-center">{student.email}</td>
                                <td className="text-center">{student.qualification}</td>
                                <td className="text-center">
                                  <span className="badge bg-success">
                                    Active
                                  </span>
                                </td>
                                <td className="text-center">
                                  <div className="btn-list">
                                    <Link
                                      to={`/student/${student.id}`}
                                      className="btn btn-sm btn-icon btn-purple-gradient"
                                    >
                                      <i className="ri-eye-line"></i>
                                    </Link>
                                    <Link
                                      to={`/edit-student/${student.id}`}
                                      className="btn btn-sm btn-icon btn-success-gradient"
                                    >
                                      <i className="ri-pencil-line"></i>
                                    </Link>
                                    <button
                                      className="btn btn-sm btn-icon btn-danger-gradient"
                                      onClick={() => {
                                        setDeleteId(student.id);
                                        setShowDeleteModal(true);
                                      }}
                                    >
                                      <i className="ri-delete-bin-line"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center">
                                No students found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      <div className="row mt-3">
                        <div className="col-md-6">
                          <p className="text-muted">
                            Showing {offset + 1} to{" "}
                            {Math.min(offset + itemsPerPage, sortedData.length)}{" "}
                            of {sortedData.length} entries
                          </p>
                        </div>

                        <div className="col-md-6 d-flex justify-content-end">
                          <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            activeClassName={"active"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && <div className="modal-backdrop fade show"></div>}

      {showDeleteModal && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center">
              <div className="modal-body">
                <h6>Are you sure you want to delete this student?</h6>
              </div>
              <div className="modal-footer d-block">
                <button
                  type="button"
                  className="btn btn-success-gradient"
                  onClick={handleDelete}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="btn btn-danger-gradient"
                  onClick={() => setShowDeleteModal(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentList;