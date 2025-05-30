import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const StronaRejestruj = () => {
    const containerStyle = {overflowY: "auto" };
    
  return (
    <div className="container mt-3 text-center" style={containerStyle}>
        <div style={containerStyle}>
            REGISTER
        </div>
        <div style={containerStyle}>
            TEST2
        </div>
    </div>
  );

}

export default StronaRejestruj;
