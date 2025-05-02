import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BiBook, BiBookContent } from 'react-icons/bi';
import { FaShare, FaUsers, FaExclamationTriangle, FaLock } from 'react-icons/fa';
import { Link } from "react-router-dom";
import api from "../../api";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [completedGrievance, setCompletedGrievance] = useState([]);
  const [rejectedGrievance, setRejectedGrievance] = useState([]);
  const [inprogressGrievance, setInProgressGrievance] = useState([]);
  const [processedGrievance, setProcessedGrievance] = useState([]);
  const [filteredGrievance, setFilteredGrievance] = useState([]);
  const [clearDateRange, setClearDateRange] = useState("");


  const visitorsData = [
    { name: "Jan", Visitors: 50, Lenders: 70 },
    { name: "Feb", Visitors: 60, Lenders: 80 },
    { name: "Mar", Visitors: 70, Lenders: 90 },
    { name: "Apr", Visitors: 60, Lenders: 70 },
    { name: "May", Visitors: 80, Lenders: 120 },
    { name: "Jun", Visitors: 90, Lenders: 130 },
    { name: "Jul", Visitors: 70, Lenders: 90 },
    { name: "Aug", Visitors: 60, Lenders: 70 },
    { name: "Sep", Visitors: 80, Lenders: 100 },
    { name: "Oct", Visitors: 75, Lenders: 95 },
    { name: "Nov", Visitors: 65, Lenders: 85 },
    { name: "Dec", Visitors: 70, Lenders: 90 },
  ];

  const locationData = [
    { name: "Chennai", value: 26 },
    { name: "Coimbatore", value: 32 },
    { name: "Hyderabad", value: 24 },
    { name: "Bangalore", value: 10 },
    { name: "Kerala", value: 9 },
  ];

  const bookAvailabilityData = [
    { name: "Lended", value: 45, color: "#FF5C5C" },
    { name: "Available", value: 50, color: "#00C49F" },
    { name: "Reserved", value: 5, color: "#0088FE" },
  ];

  const bookLendingTrendData = [
    { name: "Jan", Borrowed: 300 },
    { name: "Feb", Borrowed: 180 },
    { name: "Mar", Borrowed: 400 },
    { name: "Apr", Borrowed: 370 },
    { name: "May", Borrowed: 450 },
    { name: "Jun", Borrowed: 430 },
    { name: "Jul", Borrowed: 410 },
    { name: "Aug", Borrowed: 350 },
    { name: "Sep", Borrowed: 460 },
    { name: "Oct", Borrowed: 440 },
    { name: "Nov", Borrowed: 220 },
    { name: "Dec", Borrowed: 100 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF6384", "#AA46BE"];

  const fetchGrievances = async () => {
    try {
      const response = await api.get("/grievances");
      setGrievances(response.data);

      const completedGrievances = response.data.filter(
        (grievance) => grievance.applicationStatus === "Completed"
      );
      setCompletedGrievance(completedGrievances);

      const rejectedGrievances = response.data.filter(
        (grievance) => grievance.applicationStatus === "Rejected"
      );
      setRejectedGrievance(rejectedGrievances);

      const inprogressGrievances = response.data.filter(
        (grievance) => grievance.applicationStatus === "In Progress"
      );
      setInProgressGrievance(inprogressGrievances);

      const processedGrievances = response.data.filter(
        (grievance) => grievance.applicationStatus === "Processed"
      );
      setProcessedGrievance(processedGrievances);
      setFilteredGrievance(processedGrievances);
    } catch (error) {
      console.error("Error fetching grievances: ", error);
    }
  };

  const filterByDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) {
      setFilteredGrievance(processedGrievance);
      return;
    }

    const filtered = processedGrievance.filter((grievance) => {
      const grievanceDate = new Date(grievance.date);
      return grievanceDate >= startDate && grievanceDate <= endDate;
    });

    setFilteredGrievance(filtered);
  };

  const clearDate = () => {
    setClearDateRange("");
    document.getElementById("daterange").value = "";
    setFilteredGrievance(processedGrievance);
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  useEffect(() => {
    flatpickr("#daterange", {
      mode: "range",
      dateFormat: "Y-m-d",
      onClose: (selectedDates) => {
        if (selectedDates.length === 2) {
          const startDate = selectedDates[0];
          const endDate = selectedDates[1];

          filterByDateRange(startDate, endDate);

          const formattedStartDate = startDate.toISOString().split("T")[0];
          const formattedEndDate = endDate.toISOString().split("T")[0];
          document.getElementById(
            "daterange"
          ).value = `${formattedStartDate} to ${formattedEndDate}`;

          setClearDateRange(`${formattedStartDate} to ${formattedEndDate}`);
        } else {
          document.getElementById("daterange").value = "";
          setFilteredGrievance(processedGrievance);
          setClearDateRange("");
        }
      },
    });
    //eslint-disable-next-line
  }, [processedGrievance]);

  return (
    <>
      <div class="main-content app-content">
        <div class="container-fluid">
          <div class="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
            <div>
              <h1 class="page-title fw-bold fs-18 mb-0">Welcome Admin</h1>
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="fw-bold fs-15">Quick Actions:</span>
              <button className="btn btn-sm add-new-book">
                <i className="ri-add-line me-1"></i> Add New Book
              </button>
            </div>
          </div>
          <div class="row">
            <div class="col-xl-12">
              <div class="row">
                {/* Total Books */}
                <div class="col-xxl-3 col-xl-3 col-md-4 col-6">
                  <div class="card custom-card overflow-hidden main-content-card">
                    <Link to="/total-books">
                      <div class="card-body">
                        <div class="d-flex align-items-start justify-content-between">
                          <div>
                            <span class="text-muted mb-1">Total Books</span>
                            <h4 class="fw-medium mb-0">400</h4>
                          </div>
                          <div class="lh-1 p-2 border border-primary border-opacity-10 bg-info-transparent rounded-pill">
                            <span class="avatar avatar-md avatar-rounded bg-info bg-opacity-15" style={{ fontSize: "1.5 rem" }}>
                              📕
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div class="card-footer text-center">
                      <Link to="/total-books" class="btn btn-info btn-sm">View Details</Link>
                    </div>
                  </div>
                </div>

                {/* Lended Books */}
                <div class="col-xxl-3 col-xl-3 col-md-4 col-6">
                  <div class="card custom-card overflow-hidden main-content-card">
                    <Link to="/lended-books">
                      <div class="card-body">
                        <div class="d-flex align-items-start justify-content-between">
                          <div>
                            <span class="text-muted mb-1">Lended Books</span>
                            <h4 class="fw-medium mb-0">30</h4>
                          </div>
                          <div class="lh-1 p-2 border border-primary border-opacity-10 bg-success-transparent rounded-pill">
                            <span class="avatar avatar-md avatar-rounded bg-success" style={{ fontSize: "1.4 rem" }}>
                              📚
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div class="card-footer text-center">
                      <Link to="/lended-books" class="btn btn-success btn-sm">View Details</Link>
                    </div>
                  </div>
                </div>

                {/* Available Books */}
                <div class="col-xxl-3 col-xl-3 col-md-4 col-6">
                  <div class="card custom-card overflow-hidden main-content-card">
                    <Link to="/available-books">
                      <div class="card-body">
                        <div class="d-flex align-items-start justify-content-between">
                          <div>
                            <span class="text-muted mb-1">Available Books</span>
                            <h4 class="fw-medium mb-0">150</h4>
                          </div>
                          <div class="lh-1 p-2 border border-primary border-opacity-10 bg-warning-transparent rounded-pill">
                            <span class="avatar avatar-md avatar-rounded bg-warning" style={{ fontSize: "1.4 rem" }}>
                              📖
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div class="card-footer text-center">
                      <Link to="/available-books" class="btn btn-warning btn-sm">View Details</Link>
                    </div>
                  </div>
                </div>

                {/* Total Users */}
                <div class="col-xxl-3 col-xl-3 col-md-4 col-6">
                  <div class="card custom-card overflow-hidden main-content-card">
                    <Link to="/total-users">
                      <div class="card-body">
                        <div class="d-flex align-items-start justify-content-between">
                          <div>
                            <span class="text-muted mb-1">Total Users</span>
                            <h4 class="fw-medium mb-0">50</h4>
                          </div>
                          <div class="lh-1 p-2 border border-primary border-opacity-10 bg-primary-transparent rounded-pill">
                            <span class="avatar avatar-md avatar-rounded bg-primary" style={{ fontSize: "1.4 rem" }}>
                              👤
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div class="card-footer text-center">
                      <Link to="/total-users" class="btn btn-primary btn-sm">View Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5>No of Visitors</h5>
                    <select className="form-select form-select-sm w-auto">
                      <option>2024</option>
                    </select>
                  </div>
                  <div style={{ height: '250px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={visitorsData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Visitors" fill="#8884d8" />
                        <Bar dataKey="Lenders" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mb-3">
              <div className="card bg-white">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5>Books Allocation by Locations</h5>
                    <select className="form-select form-select-sm w-auto">
                      <option>2024</option>
                    </select>
                  </div>
                  <div style={{ height: '250px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={locationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          nameKey="name"
                        >
                          {locationData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => {
                            const total = locationData.reduce((acc, curr) => acc + curr.value, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return [`${percentage}%`, name];
                          }}
                        />
                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 mb-3">
              <div className="card bg-white">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5>Book Availability</h5>
                    <select className="form-select form-select-sm w-auto">
                      <option>2024</option>
                    </select>
                  </div>
                  <div style={{ height: '250px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={bookAvailabilityData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {bookAvailabilityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="d-flex justify-content-center mt-2 gap-4 flex-wrap">
                    {bookAvailabilityData.map((item, index) => (
                      <div key={index} className="d-flex align-items-center gap-1">
                        <div
                          className="rounded-circle"
                          style={{ width: '12px', height: '12px', backgroundColor: item.color }}
                        />
                        <span className="text-sm">{`${item.value}% ${item.name}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8 mb-3">
              <div className="card bg-white">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5>Book Lending Trends</h5>
                    <select className="form-select form-select-sm w-auto">
                      <option>2024</option>
                    </select>
                  </div>
                  <div style={{ height: '250px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bookLendingTrendData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="Borrowed" fill="#8A63D2" />
                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                          payload={[
                            { value: 'Borrowed', type: 'square', color: '#8A63D2' },
                          ]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
