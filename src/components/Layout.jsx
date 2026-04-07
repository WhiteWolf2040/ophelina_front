// src/components/Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: "250px", padding: "20px", backgroundColor: "#f5f5f5" }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;