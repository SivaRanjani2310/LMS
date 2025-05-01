import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { AuthLogin, AuthRegister } from "../../service/api";
import { useForm } from "react-hook-form"

export default function Login() {
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  const images = [
    {
      url: "https://patronslegal.com/blogs/wp-content/uploads/2024/09/Best-Criminal-Lawyers-in-Noida.jpg",
      text: `<a href="https://storyset.com/job">Job illustrations by Storyset</a>`,
    },
    {
      url: "https://www.jjmccaskill.com/wp-content/uploads/2023/07/Difference-Between-Lawyer-and-Attorney.jpg",
      text: `<a href="https://example.com/community" target="_blank">Join the GBU Mameey community</a>`,
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm();

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm();

  // Image carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const HandleLogin = async (data) => {
    try {
      const res = await AuthLogin(data);
      localStorage.setItem("loginData", JSON.stringify(res));
      console.log(res);
      if (res.user.role === "Mentor") {
        navigate("/admin");
        window.location.reload();
      } else if (res.user.role === "Student") {
        navigate("/home");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const HandleRegister = async (data) => {
    try {
      const res = await AuthRegister(data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  // Welcome Screen
  if (showWelcomeScreen) {
    return (
      <div className="welcome-container">
        <div className="welcome-card">
          <div className="welcome-content">
            {/* Welcome Content */}
            <div className="welcome-text-section">
              <div className="welcome-text-container">
                <h1 className="welcome-title">
                  Welcome to
                </h1>
                <h2 className="welcome-subtitle">
                  LMS Platform
                </h2>
                <p className="welcome-description">
                  Your all-in-one learning management system. Join our community
                  of students and mentors today!
                </p>

                <div className="welcome-button-group">
                  <button
                    onClick={() => {
                      setShowWelcomeScreen(false);
                      setShowSignup(false);
                    }}
                    className="welcome-primary-btn"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setShowWelcomeScreen(false);
                      setShowSignup(true);
                    }}
                    className="welcome-secondary-btn"
                  >
                    Sign Up
                  </button>
                </div>

                <div className="welcome-terms">
                  <p className="terms-text">
                    By continuing, you agree to our{" "}
                    <a href="#" className="terms-link">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="terms-link">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Welcome Image */}
            <div
              className="welcome-image-section"
              style={{
                backgroundImage: `url(${images[currentImageIndex].url})`,
              }}
            >
              <div className="welcome-image-content">
                <div className="welcome-image-buttons">
                  <button
                    className="welcome-image-btn"
                    onClick={() => {
                      setShowWelcomeScreen(false);
                      setShowSignup(true);
                    }}
                  >
                    Sign Up
                  </button>
                  <button className="welcome-image-btn">
                    Join Us
                  </button>
                </div>
                <div>
                  <h2
                    className="welcome-image-text"
                    dangerouslySetInnerHTML={{
                      __html: images[currentImageIndex].text,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .welcome-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f3f4f6;
          }
          
          .welcome-card {
            width: 100%;
            max-width: 80rem;
            min-height: 100vh;
            background-color: white;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border-radius: 0;
            overflow: hidden;
          }
          
          @media (min-width: 768px) {
            .welcome-card {
              min-height: 0;
              height: 83.333333%;
              border-radius: 1rem;
            }
          }
          
          .welcome-content {
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          
          @media (min-width: 768px) {
            .welcome-content {
              flex-direction: row;
            }
          }
          
          .welcome-text-section {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem;
            background-color: white;
          }
          
          @media (min-width: 768px) {
            .welcome-text-section {
              width: 50%;
            }
          }
          
          .welcome-text-container {
            width: 100%;
            max-width: 28rem;
            text-align: center;
          }
          
          @media (min-width: 768px) {
            .welcome-text-container {
              text-align: left;
            }
          }
          
          .welcome-title {
            font-size: 2.25rem;
            font-weight: 700;
            margin-bottom: 1rem;
          }
          
          @media (min-width: 768px) {
            .welcome-title {
              font-size: 3rem;
            }
          }
          
          .welcome-subtitle {
            font-size: 1.875rem;
            font-weight: 700;
            color: #2563eb;
            margin-bottom: 1.5rem;
          }
          
          @media (min-width: 768px) {
            .welcome-subtitle {
              font-size: 2.25rem;
            }
          }
          
          .welcome-description {
            margin-bottom: 2rem;
            color: #4b5563;
            font-size: 1.125rem;
          }
          
          .welcome-button-group {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            justify-content: center;
            margin-bottom: 2rem;
          }
          
          @media (min-width: 768px) {
            .welcome-button-group {
              flex-direction: row;
              justify-content: flex-start;
            }
          }
          
          .welcome-primary-btn {
            background-color: #000;
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 9999px;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            transition: opacity 0.2s;
          }
          
          .welcome-primary-btn:hover {
            opacity: 0.9;
          }
          
          .welcome-secondary-btn {
            border: 1px solid #000;
            color: #000;
            padding: 0.75rem 2rem;
            border-radius: 9999px;
            background-color: transparent;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.2s;
          }
          
          .welcome-secondary-btn:hover {
            background-color: #f3f4f6;
          }
          
          .welcome-terms {
            margin-top: 2rem;
            color: #6b7280;
          }
          
          .terms-text {
            font-size: 0.875rem;
          }
          
          .terms-link {
            color: #3b82f6;
            text-decoration: none;
          }
          
          .terms-link:hover {
            text-decoration: underline;
          }
          
          .welcome-image-section {
            display: none;
            width: 50%;
            background-size: cover;
            background-position: center;
          }
          
          @media (min-width: 768px) {
            .welcome-image-section {
              display: block;
            }
          }
          
          .welcome-image-content {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            padding: 1.5rem;
            color: white;
          }
          
          .welcome-image-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
          }
          
          .welcome-image-btn {
            border: 1px solid white;
            padding: 0.25rem 1rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            background-color: transparent;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .welcome-image-btn:hover {
            background-color: white;
            color: black;
          }
          
          .welcome-image-text {
            font-size: 1.25rem;
            font-weight: 600;
            max-width: 20rem;
            margin-bottom: 0.5rem;
            transition: opacity 0.7s;
          }
          
          @media (min-width: 768px) {
            .welcome-image-text {
              font-size: 1.5rem;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Mobile Header - Only visible on small screens */}
        <div className="mobile-header">
          <button
            onClick={() => setShowWelcomeScreen(true)}
            className="mobile-back-btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="back-icon"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            LMS Platform
          </button>
          <div className="mobile-auth-buttons">
            <button
              className={`mobile-auth-btn ${!showSignup ? "active" : ""}`}
              onClick={() => setShowSignup(false)}
            >
              Login
            </button>
            <button
              className={`mobile-auth-btn ${showSignup ? "active" : ""}`}
              onClick={() => setShowSignup(true)}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {/* Form Side */}
          <div className="form-side">
            {/* Desktop Back Button */}
            <div className="desktop-back-btn-container">
              <button
                onClick={() => setShowWelcomeScreen(true)}
                className="desktop-back-btn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="back-icon"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
                Back to welcome
              </button>
            </div>

            {/* Login Form */}
            <div
              className={`login-form-container ${showSignup ? "hidden" : ""}`}
            >
              <div className="form-content">
                <h1 className="form-title">Hi there!</h1>
                <p className="form-subtitle">Welcome to LMS platform</p>

                <button className="social-login-btn">
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google Icon"
                    className="social-icon"
                  />
                  Log in with Google
                </button>

                <div className="divider">
                  <div className="divider-line"></div>
                  <span className="divider-text">or</span>
                  <div className="divider-line"></div>
                </div>

                <form onSubmit={handleLoginSubmit(HandleLogin)} className="auth-form">
                  <input
                    type="text"
                    placeholder="Your username"
                    className="form-input"
                    {...loginRegister("identifier", { required: true })}
                  />

                  <div className="password-input-container">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Password"
                      className="form-input"
                      {...loginRegister("password", { required: true })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="password-toggle"
                    >
                      {showLoginPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  <div className="forgot-password">
                    <a href="#" className="forgot-password-link">
                      Forgot password?
                    </a>
                  </div>

                  <button
                    className="submit-btn"
                    type="submit"
                  >
                    Log In
                  </button>
                </form>

                <p className="auth-switch-text">
                  Don't have an account?{" "}
                  <button
                    className="auth-switch-link"
                    onClick={() => setShowSignup(true)}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>

            {/* Signup Form */}
            <div
              className={`signup-form-container ${showSignup ? "visible" : "hidden"}`}
            >
              <div className="form-content">
                <h1 className="form-title">Join Us!</h1>
                <p className="form-subtitle">
                  Create your LMS platform account
                </p>

                <button className="social-login-btn">
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google Icon"
                    className="social-icon"
                  />
                  Sign up with Google
                </button>

                <div className="divider">
                  <div className="divider-line"></div>
                  <span className="divider-text">or</span>
                  <div className="divider-line"></div>
                </div>

                <form onSubmit={handleSignupSubmit(HandleRegister)} className="auth-form">
                  <input
                    type="text"
                    placeholder="User Name"
                    className="form-input"
                    {...signupRegister("username", { required: true })}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="form-input"
                    {...signupRegister("email", { required: true })}
                  />

                  <div className="password-input-container">
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      placeholder="Password"
                      className="form-input"
                      {...signupRegister("password", { required: true })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="password-toggle"
                    >
                      {showSignupPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  <button
                    className="submit-btn"
                    type="submit"
                  >
                    Sign Up
                  </button>
                </form>

                <p className="auth-switch-text">
                  Already have an account?{" "}
                  <button
                    className="auth-switch-link"
                    onClick={() => setShowSignup(false)}
                  >
                    Log in
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Image Side - Hidden on mobile, visible on medium screens and up */}
          <div
            className="image-side"
            style={{ backgroundImage: `url(${images[currentImageIndex].url})` }}
          >
            <div className="image-content">
              <div className="image-buttons">
                <button
                  className="image-btn"
                  onClick={() => setShowSignup(true)}
                >
                  Sign Up
                </button>
                <button className="image-btn">
                  Join Us
                </button>
              </div>
              <div>
                <h2
                  className="image-text"
                  dangerouslySetInnerHTML={{
                    __html: images[currentImageIndex].text,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f3f4f6;
        }
        
        .login-card {
          position: relative;
          width: 100%;
          max-width: 80rem;
          min-height: 100vh;
          background-color: white;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border-radius: 0;
          overflow: hidden;
        }
        
        @media (min-width: 768px) {
          .login-card {
            min-height: 0;
            height: 83.333333%;
            border-radius: 1rem;
          }
        }
        
        .mobile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: white;
          padding: 1rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        
        @media (min-width: 768px) {
          .mobile-header {
            display: none;
          }
        }
        
        .mobile-back-btn {
          font-weight: 700;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .back-icon {
          width: 24px;
          height: 24px;
        }
        
        .mobile-auth-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .mobile-auth-btn {
          padding: 0.375rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          background-color: #e5e7eb;
        }
        
        .mobile-auth-btn.active {
          background-color: #000;
          color: white;
        }
        
        .main-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        @media (min-width: 768px) {
          .main-content {
            flex-direction: row;
          }
        }
        
        .form-side {
          width: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        
        @media (min-width: 768px) {
          .form-side {
            width: 50%;
          }
        }
        
        .desktop-back-btn-container {
          display: none;
          align-items: center;
          padding: 1rem;
        }
        
        @media (min-width: 768px) {
          .desktop-back-btn-container {
            display: flex;
          }
        }
        
        .desktop-back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4b5563;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .desktop-back-btn:hover {
          color: #000;
        }
        
        .login-form-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 1.5rem;
          transition: all 0.5s;
        }
        
        @media (min-width: 768px) {
          .login-form-container.hidden {
            display: none;
          }
        }
        
        .signup-form-container {
          width: 100%;
          height: 100%;
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 1.5rem;
          transition: all 0.5s;
        }
        
        @media (min-width: 768px) {
          .signup-form-container.hidden {
            display: none;
          }
        }
        
        .signup-form-container.visible {
          display: flex;
        }
        
        .form-content {
          width: 100%;
          max-width: 28rem;
        }
        
        .form-title {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        @media (min-width: 768px) {
          .form-title {
            font-size: 2.25rem;
          }
        }
        
        .form-subtitle {
          margin-bottom: 1.5rem;
          color: #6b7280;
        }
        
        .social-login-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.75rem;
          color: #4b5563;
          margin-bottom: 1rem;
          background: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .social-login-btn:hover {
          background-color: #f3f4f6;
        }
        
        .social-icon {
          height: 1.25rem;
          width: 1.25rem;
        }
        
        .divider {
          display: flex;
          align-items: center;
          margin: 1rem 0;
        }
        
        .divider-line {
          flex-grow: 1;
          border-top: 1px solid #d1d5db;
        }
        
        .divider-text {
          margin: 0 1rem;
          color: #9ca3af;
        }
        
        .auth-form {
          width: 100%;
        }
        
        .form-input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.75rem;
          margin-bottom: 1rem;
          font-size: 1rem;
        }
        
        .password-input-container {
          position: relative;
          margin-bottom: 0.5rem;
        }
        
        .password-toggle {
          position: absolute;
          top: 50%;
          right: 0.75rem;
          transform: translateY(-50%);
          color: #6b7280;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .forgot-password {
          text-align: right;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }
        
        .forgot-password-link {
          color: #3b82f6;
          text-decoration: none;
        }
        
        .forgot-password-link:hover {
          text-decoration: underline;
        }
        
        .submit-btn {
          width: 100%;
          background-color: #000;
          color: white;
          padding: 0.75rem;
          border-radius: 9999px;
          border: none;
          margin-bottom: 1rem;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        
        .submit-btn:hover {
          opacity: 0.9;
        }
        
        .auth-switch-text {
          font-size: 0.875rem;
          text-align: center;
          margin-top: 0.5rem;
        }
        
        .auth-switch-link {
          color: #3b82f6;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        
        .auth-switch-link:hover {
          text-decoration: underline;
        }
        
        .image-side {
          display: none;
          width: 50%;
          background-size: cover;
          background-position: center;
        }
        
        @media (min-width: 768px) {
          .image-side {
            display: block;
          }
        }
        
        .image-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          padding: 1.5rem;
          color: white;
        }
        
        .image-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
        
        .image-btn {
          border: 1px solid white;
          padding: 0.25rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          background-color: transparent;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .image-btn:hover {
          background-color: white;
          color: black;
        }
        
        .image-text {
          font-size: 1.25rem;
          font-weight: 600;
          max-width: 20rem;
          margin-bottom: 0.5rem;
          transition: opacity 0.7s;
        }
        
        @media (min-width: 768px) {
          .image-text {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}