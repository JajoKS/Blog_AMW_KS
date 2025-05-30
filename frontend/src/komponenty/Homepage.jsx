import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Homepage = () => {
    const containerStyle = {overflowY: "auto" };
    
  return (
    <div className="container mt-3 text-center" style={containerStyle}>
        <div style={containerStyle}>
            HOMEPAGE
        </div>
        <div style={containerStyle}>
            TEST2
        </div>
    </div>
  );

}

export default Homepage;
