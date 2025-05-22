import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      console.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css?family=Raleway:400,700');
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: Raleway, sans-serif;
        }
        body {
          background: linear-gradient(90deg, #C7C5F4, #776BCC);
        }
        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .screen {
          background: linear-gradient(90deg, #5D54A4, #7C78B8);
          position: relative;
          height: 600px;
          width: 360px;
          box-shadow: 0px 0px 24px #5C5696;
        }
        .screen__content {
          z-index: 1;
          position: relative;
          height: 100%;
        }
        .screen__background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          clip-path: inset(0 0 0 0);
        }
        .screen__background__shape {
          transform: rotate(45deg);
          position: absolute;
        }
        .screen__background__shape1 {
          height: 520px;
          width: 520px;
          background: #FFF;
          top: -50px;
          right: 120px;
          border-radius: 0 72px 0 0;
        }
        .screen__background__shape2 {
          height: 220px;
          width: 220px;
          background: #6C63AC;
          top: -172px;
          right: 0;
          border-radius: 32px;
        }
        .screen__background__shape3 {
          height: 540px;
          width: 190px;
          background: linear-gradient(270deg, #5D54A4, #6A679E);
          top: -24px;
          right: 0;
          border-radius: 32px;
        }
        .screen__background__shape4 {
          height: 400px;
          width: 200px;
          background: #7E7BB9;
          top: 420px;
          right: 50px;
          border-radius: 60px;
        }
        .login {
          width: 320px;
          padding: 30px;
          padding-top: 156px;
        }
        .login__field {
          padding: 20px 0px;
          position: relative;
        }
        .login__icon {
          position: absolute;
          top: 30px;
          color: #7875B5;
        }
        .login__input {
          border: none;
          border-bottom: 2px solid #D1D1D4;
          background: none;
          padding: 10px;
          padding-left: 24px;
          font-weight: 700;
          width: 75%;
          transition: .2s;
        }
        .login__input:active,
        .login__input:focus,
        .login__input:hover {
          outline: none;
          border-bottom-color: #6A679E;
        }
        .login__submit {
          background: #fff;
          font-size: 14px;
          margin-top: 30px;
          padding: 16px 20px;
          border-radius: 26px;
          border: 1px solid #D4D3E8;
          text-transform: uppercase;
          font-weight: 700;
          display: flex;
          align-items: center;
          width: 100%;
          color: #4C489D;
          box-shadow: 0px 2px 2px #5C5696;
          cursor: pointer;
          transition: .2s;
        }
        .login__submit:active,
        .login__submit:focus,
        .login__submit:hover {
          border-color: #6A679E;
          outline: none;
        }
        .button__icon {
          font-size: 24px;
          margin-left: auto;
          color: #7875B5;
        }
        .social-login {
          position: absolute;
          height: 140px;
          width: 160px;
          text-align: center;
          bottom: 0px;
          right: 0px;
          color: #fff;
        }
        .social-icons {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .social-login__icon {
          padding: 20px 10px;
          color: #fff;
          text-decoration: none;
          text-shadow: 0px 0px 8px #7875B5;
        }
        .social-login__icon:hover {
          transform: scale(1.5);
        }
      `}
      </style>

      {/* Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />

      <div className="container">
        <div className="screen">
          <div className="screen__content">
            <form className="login" onSubmit={handleLogin}>
              <div className="login__field">
                <i className="login__icon fas fa-user"></i>
                <input
                  type="email"
                  className="login__input"
                  placeholder="User name / Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="login__field">
                <i className="login__icon fas fa-lock"></i>
                <input
                  type="password"
                  className="login__input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="button login__submit" type="submit">
                <span className="button__text">Log In Now</span>
                <i className="button__icon fas fa-chevron-right"></i>
              </button>
            </form>
            <div className="social-login">
              <h3>log in via</h3>
              <div className="social-icons">
                <a href="#" className="social-login__icon fab fa-instagram"></a>
                <a href="#" className="social-login__icon fab fa-facebook"></a>
                <a href="#" className="social-login__icon fab fa-twitter"></a>
              </div>
            </div>
            <p style={{ color: "#fff", marginTop: "20px",marginLeft:"100px",marginBottom:"30px" }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: "#fff", textDecoration: "underline" }}>
                Sign Up
              </Link>
            </p>
          </div>
          <div className="screen__background">
            <span className="screen__background__shape screen__background__shape4"></span>
            <span className="screen__background__shape screen__background__shape3"></span>
            <span className="screen__background__shape screen__background__shape2"></span>
            <span className="screen__background__shape screen__background__shape1"></span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
