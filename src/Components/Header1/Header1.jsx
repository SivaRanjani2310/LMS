// src/components/Header.js
import "./Header.css";

const Header1 = () => {
  // const user = JSON.parse(localStorage.getItem('userdata'))
  // const {username} = JSON.parse(resuser)
  // console.log(username);
  // const user = username;
  
  return (
    <header className="header">
      <div className="welcome-message">
        <h1>Welcome Back, Admin!</h1>
        <p>
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration
        </p>
        {/* <button>Get Started</button> */}
      </div>
    </header>
  );
};

export default Header1;
