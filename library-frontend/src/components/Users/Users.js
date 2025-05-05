import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import api from "../../api";
import "../../assets/css/clipboard.css";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const itemsPerPage = 8;

    const fetchUsers = async () => {
        try {
            const response = await api.get("/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error Fetching users: ", error);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/users/${deleteId}`);
            fetchUsers();
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const filteredData = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const offset = currentPage * itemsPerPage;
    const displayedUsers = filteredData.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <>
            <div className="main-content app-content">
                <div className="container-fluid">
                    <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
                        <div>
                            <nav>
                                <ol className="breadcrumb mb-1">
                                    <li className="breadcrumb-item fw-semibold">
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
                                    <li className="breadcrumb-item active fw-bold" aria-current="page">
                                        Users
                                    </li>
                                </ol>
                            </nav>
                        </div>
                        <div className="btn-list">
                            <Link
                                to="/add-users"
                                className="btn btn-success-gradient btn-wave waves-effect waves-light"
                            >
                                <i className="ri-share-forward-line me-1"></i> Add New User
                            </Link>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card custom-card">
                                <div className="card-header">
                                    <div className="card-title fs-18">Users</div>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <div
                                            id="file-export_wrapper"
                                            className="dataTables_wrapper dt-bootstrap5 no-footer"
                                        >
                                            <div
                                                id="file-export_filter"
                                                className="dataTables_filter"
                                            >
                                                <label>
                                                    <div className="position-relative">
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm mb-3"
                                                            placeholder="Search users..."
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
                                                            style={{
                                                                background: "#f2f4f7",
                                                                fontWeight: "bold"
                                                            }}
                                                            className="text-center"
                                                        >
                                                            Sr. No.
                                                        </th>
                                                        <th
                                                            style={{
                                                                background: "#f2f4f7",
                                                                fontWeight: "bold"
                                                            }}
                                                            className="text-center"
                                                        >
                                                            Username
                                                        </th>
                                                        <th
                                                            style={{
                                                                background: "#f2f4f7",
                                                                fontWeight: "bold"
                                                            }}
                                                            className="text-center"
                                                        >
                                                            Full name
                                                        </th>
                                                        <th
                                                            style={{
                                                                background: "#f2f4f7",
                                                                fontWeight: "bold"
                                                            }}
                                                            className="text-center"
                                                        >
                                                            Email
                                                        </th>
                                                        <th
                                                            style={{
                                                                background: "#f2f4f7",
                                                                fontWeight: "bold"
                                                            }}
                                                            className="text-center"
                                                        >
                                                            Role
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
                                                    {displayedUsers.length > 0 ? (
                                                        displayedUsers.map((user, index) => (
                                                            <tr key={user.id}>
                                                                <td className="text-center">
                                                                    {(index + 1 + offset)
                                                                        .toString()
                                                                        .padStart(2, "0")}
                                                                </td>
                                                                <td className="text-center">{user.username}</td>
                                                                <td className="text-center">{user.name}</td>
                                                                <td className="text-center">{user.email}</td>
                                                                <td className="text-center">{user.role}</td>
                                                                <td className="text-center">
                                                                    <span className={`badge bg-${user.status === "Active" ? "success" : "danger"}`}>
                                                                        {user.status}
                                                                    </span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <div className="btn-list">
                                                                        <Link
                                                                            to={`/edit-user/${user.id}`}
                                                                            className="btn btn-sm btn-icon btn-success-gradient"
                                                                        >
                                                                            <i className="ri-pencil-line"></i>
                                                                        </Link>
                                                                        <button
                                                                            className="btn btn-sm btn-icon btn-danger-gradient"
                                                                            onClick={() => {
                                                                                setDeleteId(user.id);
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
                                                                No users found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>

                                            <div className="row mt-3">
                                                <div className="col-md-6">
                                                    <p className="text-muted">
                                                        Showing {offset + 1} to{" "}
                                                        {Math.min(offset + itemsPerPage, filteredData.length)}{" "}
                                                        of {filteredData.length} entries
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
                                <h6>Are you sure you want to delete this user?</h6>
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

export default Users;