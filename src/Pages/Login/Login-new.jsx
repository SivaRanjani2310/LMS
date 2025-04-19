import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./Login.css"; // Make sure to import the CSS file

export default function LoginPage() {
  const [showSignup, setShowSignup] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const images = [
    {
      url: "https://images.ottplay.com/images/ajith-kumar-in-good-bad-ugly-1723179833.jpg",
      text: `<a href="https://example.com" target="_blank">Explore the Universe with GBU Mameey</a>`,
    },
    {
      url: "https://tse2.mm.bing.net/th?id=OIF.VjNPH3uC8hm%2bSE6omK8ISA&pid=Api&P=0&h=180",
      text: `<a href="https://www.youtube.com/watch?v=p4CSfe72Xrw" target="_blank">This is strictly made for fans</a>`,
    },
    {
      url: "https://tse1.mm.bing.net/th?id=OIP.ybwXgx1e9xD121k9zf_qOwHaFG&pid=Api&P=0&h=180",
      text: `<a href="https://example.com/community" target="_blank">Join the GBU Mameey community</a>`,
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <div className={`panel-wrapper ${showSignup ? "slide-left" : ""}`}>
        {/* Login Panel */}
        <div className="form-panel">
          <div className="form-content">
            <h1>Hi there!</h1>
            <p>Welcome to GBU world Mameey</p>

            <button className="google-btn">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google Icon"
              />
              Log in with Google
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <input
              type="email"
              placeholder="Your email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            <div className="input-password">
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
              >
                {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="forgot-link">
              <a href="#">Forgot password?</a>
            </div>

            <button className="submit-btn">Log In</button>

            <p className="switch-text">
              Don’t have an account?{" "}
              <button onClick={() => setShowSignup(true)}>Sign up</button>
            </p>
          </div>
        </div>

        {/* Signup Panel */}
        <div className="form-panel">
          <div className="form-content">
            <h1>Join Us!</h1>
            <p>Create your GBU Mameey account</p>

            <button className="google-btn">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google Icon"
              />
              Sign up with Google
            </button>

            <input
              type="text"
              placeholder="User Name"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />

            <div className="input-password">
              <input
                type={showSignupPassword ? "text" : "password"}
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
              >
                {showSignupPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            <button className="submit-btn">Sign Up</button>

            <p className="switch-text">
              Already have an account?{" "}
              <button onClick={() => setShowSignup(false)}>Log in</button>
            </p>
          </div>
        </div>
      </div>

      {/* Sliding Image Panel */}
      <div
        className="image-panel"
        style={{ backgroundImage: `url(${images[currentImageIndex].url})` }}
      >
        <div className="image-content">
          <div className="top-buttons">
            <button onClick={() => setShowSignup(true)}>Sign Up</button>
            <button>Join Us</button>
          </div>
          <div
            className="image-text"
            dangerouslySetInnerHTML={{
              __html: images[currentImageIndex].text,
            }}
          />
        </div>
      </div>
    </div>
  );
}
