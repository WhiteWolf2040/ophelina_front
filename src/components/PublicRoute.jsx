// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../config/auth";

export default function PublicRoute({ children }) {
  return isAuthenticated() ? <Navigate to="/home" replace /> : children;
}