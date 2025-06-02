// TwojeBlogi.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const TwojeBlogi = () => {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Pobranie blogów zalogowanego użytkownika
  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:5432/myblogs", { withCredentials: true });
      setBlogs(response.data);
    } catch (err) {
      console.error("Błąd przy pobieraniu Twoich blogów:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Toggle formularza tworzenia bloga
  const toggleForm = () => {
    setShowForm(!showForm);
    setMessage("");
  };

  // Obsługa tworzenia bloga
  const CreateBlog = async (e) => {
    e.preventDefault(); // zatrzymuje przeładowanie strony
    try {
      const response = await axios.post("http://localhost:5432/blogs", { title, description }, { withCredentials: true });
      setMessage("Blog utworzony pomyślnie!");
      setTitle("");
      setDescription("");
      setShowForm(false);
      fetchBlogs(); // odświeżenie listy blogów
    } catch (err) {
      console.error("Błąd przy tworzeniu bloga:", err);
      setMessage("Błąd przy tworzeniu bloga");
    }
  };

  return (
    <div className="container mt-3" style={{ maxHeight: "90vh", overflowY: "auto" }}>
      <h2 className="text-center">Twoje Blogi</h2>
      <div className="text-center mb-3">
        <button className="btn btn-success" onClick={toggleForm}>
          {showForm ? "Anuluj" : "Stwórz nowy blog"}
        </button>
      </div>
      
      {showForm && (
        <form onSubmit={CreateBlog} className="mb-3">
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Tytuł bloga"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <textarea
              className="form-control"
              placeholder="Opis bloga"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Utwórz blog
          </button>
        </form>
      )}

      {message && <div className="alert alert-info text-center">{message}</div>}
      
      <div>
        {blogs.length === 0 ? (
          <p className="text-center">Nie masz jeszcze blogów.</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="card mb-3">
              <div className="card-body" onClick={() => navigate(`/blogs/${blog.id}`)}>
                <h5 className="card-title">{blog.title}</h5>
                <p className="card-text">{blog.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TwojeBlogi;
