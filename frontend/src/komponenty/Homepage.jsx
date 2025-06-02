import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";
const Homepage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Zakładamy, że endpoint API zwraca listę blogów
    axios
      .get("http://localhost:5432/")
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((err) => console.error("Błąd pobierania blogów:", err))
      .finally(() => setLoading(false));
  }, []);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px", 
    maxHeight: "90vh", 
    overflowY: "auto"
  };
    
  if (loading) return <div>Ładowanie…</div>;

  return (
    <div className="container mt-3 text-center" style={containerStyle}>
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="blog-card"
            onClick={() => navigate(`/blogs/${blog.id}`)}
          >
          <h3>{blog.title}</h3>
          </div>
        ))}
    </div>
  );

}

export default Homepage;
