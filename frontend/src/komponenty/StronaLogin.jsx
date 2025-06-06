import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.baseURL = import.meta.env.VITE_URL
const StronaLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const Submit = async (e) => {
    e.preventDefault();
    try {
      // Wysyłamy dane na endpoint logowania
      const response = await axios.post("/login", {
        username,
        password,
      }, { withCredentials: true }); // wysyłamy ciasteczka wraz z żądaniem
      setMessage(response.data.message);
      navigate('/');
      window.location.reload()

    } catch (err) {
      setMessage( // jeśli istnieją
        err.response &&
          err.response.data &&
          err.response.data.message
          ? err.response.data.message
          : "Błąd logowania"
      );
    }
  };
    
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4 text-center">Logowanie</h2>
          <form onSubmit={Submit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Login
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Hasło
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Zaloguj
            </button>
          </form>
          {message && (
            <div className="mt-3 alert alert-info text-center">{message}</div>
          )}
        </div>
      </div>
      </div>
  );

}

export default StronaLogin;
