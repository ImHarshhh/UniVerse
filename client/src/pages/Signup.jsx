import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/authServices";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const data = await signup({ username, email, password });
      console.log("Signup successful");
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setError("No token received from server");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
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
          height: 650px;
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
          padding-top: 120px;
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
        p.signup-link {
          color: #fff;
          margin-top: 20px;
          margin-left:80px;
        }
      `}
      </style>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />

      <div className="container">
        <div className="screen">
          <div className="screen__content">
            <form className="login" onSubmit={handleSignup}>
              <div className="login__field">
                <i className="login__icon fas fa-user"></i>
                <input
                  type="text"
                  className="login__input"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="login__field">
                <i className="login__icon fas fa-envelope"></i>
                <input
                  type="email"
                  className="login__input"
                  placeholder="Email"
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
                <span className="button__text">Sign Up</span>
                <i className="button__icon fas fa-chevron-right"></i>
              </button>
            </form>
            <p className="signup-link">
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#fff", textDecoration: "underline" }}>
                Log In
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

export default Signup;
