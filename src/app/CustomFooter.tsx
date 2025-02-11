'use client'

// CustomFooter.tsx
import React from "react";

export const CustomFooter = () => {
  return (
    <footer
      style={{
        zIndex: 1000,
        backgroundColor: "#f8f9fa",
           padding: "auto",
        textAlign: "center",
        // borderTop: "1px solid #e9ecef",
        position: "fixed",
        bottom: 0,
        width: "100%",
        height: "2rem",
        fontSize: "0.8rem",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <p style={{ margin: "auto" }}>{`© 2025 by Sensor Lab • IoT Platform Extension v1.2.1`}</p>
    </footer>
  );
};
