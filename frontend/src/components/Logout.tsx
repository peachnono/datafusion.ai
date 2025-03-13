import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/AuthService";
import { useAuth } from "../utils/AuthContext";
import "./css/Logout.css";

const Logout: React.FC = () => {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    if (token) {
      logout(token)
        .then(() => {
          localStorage.removeItem("token");
          navigate("/login");
          setIsAuthenticated(false);
        })
        .catch((error) => {
          console.error("Logout failed:", error);
        });
    }
  };

  return <div className="logout"><button onClick={handleLogout}>Logout</button></div>;
};

export default Logout;
