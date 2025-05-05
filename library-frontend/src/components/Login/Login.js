import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../api";
import {
  RiUserLine,
  RiEyeOffLine,
  RiEyeLine,
  RiLockLine,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import image from "../../assets/images/bg-watermark.png";

const Login = () => {
  const navigate = useNavigate();

  const [userData, setData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(""); // NEW
  const [showPassword, setShowPassword] = useState(false);
  const [inputStyles, setInputStyles] = useState({
    username: "form-control",
    password: "form-control",
  });
  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    setData({
      ...userData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
    setLoginError(""); // Clear general login error on input change

    if (e.target.name === "username") {
      setInputStyles({
        ...inputStyles,
        username: e.target.value ? "form-control input-filled" : "form-control",
      });
    } else if (e.target.name === "password") {
      setInputStyles({
        ...inputStyles,
        password: e.target.value ? "form-control input-filled" : "form-control",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userData.username) newErrors.username = "Username is required";
    if (!userData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleLogin = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await api.post("/login", userData);
      const { username, name, role } = response.data.user;

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem(
        "user",
        JSON.stringify({ username, name, role })
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Login Successfully",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (err) {
      setLoginError(err.response?.data?.message || "Invalid username or password");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="landing-body">
      <div className="row authentication authentication-cover-main mx-0">

        {/* Left Pane with Watermark */}
        <div className="col-xxl-6 col-xl-5 col-lg-12 d-xl-block d-none px-0 position-relative">
          <div
            className="d-flex align-items-center justify-content-center text-center"
            style={{
              backgroundColor: "#161950",
              height: "100vh",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={image}
              alt="UMC Logo"
              className="w-100 h-100"
              style={{
                position: "absolute",
                objectFit: "contain",
                opacity: 0.2,
                zIndex: 1,
              }}
            />
            <div className="position-relative z-2 px-4">
              <h2 className="fw-bold text-white mb-3" style={{ fontSize: "1.85rem" }}>
                UMC Library Management <br /> System
              </h2>
              <p className="mb-1 fs-6" style={{ color: "#d0d5dd" }}>
                Digital Initiative by Ulhasnagar Municipal Corporation
              </p>
              <p className="fs-6" style={{ color: "#d0d5dd" }}>
                Transforming library services for citizens
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="col-xxl-6 col-xl-7">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-xxl-7 col-xl-9 col-lg-6 col-md-6 col-sm-8 col-12">
              <div className="card custom-card my-auto border shadow-lg">
                <div className="card-body p-5">
                  <h5 className="text-dark mb-1 text-center fw-medium mb-3">
                    Welcome to Library Management System
                  </h5>
                  <p className="h4 mb-2 text-center text-danger">LOGIN</p>
                  <p className="mb-4 text-muted op-9 fw-normal text-center">
                    Please enter your details to sign in!
                  </p>

                  <form onSubmit={onSubmit}>
                    <div className="row gy-3">
                      {loginError && (
                        <div className="text-danger text-center mb-2">
                          {loginError}
                        </div>
                      )}

                      <div className="col-xl-12 mb-2">
                        <div className="mb-3">
                          <label className="form-label fs-14 text-dark">
                            Email
                          </label>
                          <div className="input-group">
                            <div className="input-group-text">
                              <RiUserLine />
                            </div>
                            <input
                              type="text"
                              className={inputStyles.username}
                              name="username"
                              placeholder="info@gmail.com"
                              value={userData.username}
                              onChange={handleChange}
                            />
                          </div>
                          {errors.username && (
                            <div className="text-danger">{errors.username}</div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label fs-14 text-dark">
                            Password
                          </label>
                          <div className="input-group">
                            <div className="input-group-text">
                              <RiLockLine />
                            </div>
                            <input
                              type={showPassword ? "text" : "password"}
                              className={inputStyles.password}
                              name="password"
                              placeholder="Enter your password"
                              value={userData.password}
                              onChange={handleChange}
                            />
                            <a
                              className="show-password-button text-muted"
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                togglePasswordVisibility();
                              }}
                            >
                              {showPassword ? (
                                <RiEyeLine className="align-middle" />
                              ) : (
                                <RiEyeOffLine className="align-middle" />
                              )}
                            </a>
                          </div>
                          {errors.password && (
                            <div className="text-danger">{errors.password}</div>
                          )}
                        </div>

                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="rememberCheck"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="rememberCheck"
                          >
                            Remember password ?
                          </label>
                        </div>

                        <div className="d-grid gap-2 col-6 mx-auto">
                          <button
                            type="submit"
                            className="btn btn-secondary-gradient text-center"
                          >
                            LOGIN
                          </button>
                        </div>
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
  );
};

export default Login;
