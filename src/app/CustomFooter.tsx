'use client'

// CustomFooter.tsx
import React from "react";

export const CustomFooter = () => {
  return (
    <footer
      style={{
        // backgroundColor: "#f8f9fa",
           padding: "auto",
        // textAlign: "center",
        // borderTop: "1px solid #e9ecef",
        position: "fixed",
        bottom: 0,
        width: "100%",
        height: "2rem",
        
        alignContent: "center",
      }}
    >
      <p style={{ margin: "auto", paddingLeft: "1rem" }}>&lt;/&gt; 2024. IoT Platform Extension by Thai-Son Nguyen.</p>
    </footer>
  );
};
