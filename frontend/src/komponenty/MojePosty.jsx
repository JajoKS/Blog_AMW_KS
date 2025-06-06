// MojePosty.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_URL
const MojePosty = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Funkcja pobierająca posty użytkownika
  const fetchMyPosts = async () => {
    try {
      const response = await axios.get("/myposts", { withCredentials: true });
      setPosts(response.data);
    } catch (err) {
      console.error("Błąd przy pobieraniu postów:", err);
      setError("Błąd pobierania postów");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const containerStyle = { overflowY: "auto" };

  if (loading) return <div className="container mt-3 text-center" style={containerStyle}>Ładowanie...</div>;
  if (error) return <div className="container mt-3 text-center" style={containerStyle}>{error}</div>;

  return (
    <div className="container mt-3" style={containerStyle}>
      <h2 className="text-center my-3">Twoje Posty</h2>
      {posts.length === 0 ? (
        <p className="text-center">Nie znaleziono postów.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="card my-3">
            <div className="card-body">
              <h5 className="card-title">{post.title}</h5>
              <p className="card-text">{post.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MojePosty;
