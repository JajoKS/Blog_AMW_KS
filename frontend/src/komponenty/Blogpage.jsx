import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [postMessage, setPostMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5432/blogs/${id}`)
      .then((res) => {
        setBlog(res.data);
      })
      .catch((err) => {
        console.error("Błąd pobierania bloga:", err);
        setError("Błąd pobierania bloga");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Pobieramy dane aktualnie zalogowanego użytkownika z sesji
  useEffect(() => {
    axios
      .get("http://localhost:5432/session", { withCredentials: true })
      .then((res) => {
        setCurrentUser(res.data.user);
      })
      .catch((err) => {
        console.error("Błąd przy pobieraniu sesji:", err);
      });
  }, []);

  if (loading) return <div>Ładowanie szczegółów bloga...</div>;
  if (error) return <div>{error}</div>;
  if (!blog) return <div>Brak danych dla tego bloga</div>;

  const postCardStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    margin: "10px 0",
    boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.1)"
  };

  // Obsługa toggle formularza tworzenia posta
  const togglePostForm = () => {
    setShowPostForm(!showPostForm);
    setPostMessage("");
  };

  // Obsługa wysyłania formularza do stworzenia posta
  const CreatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5432/blogs/${id}/posts`,
        { title: newPostTitle, content: newPostContent },
        { withCredentials: true }
      );
      setPostMessage("Post utworzony pomyślnie!");
      setNewPostTitle("");
      setNewPostContent("");
      setShowPostForm(false);
      // Odświeżamy blog (możemy np. dodać nowy post do listy lub ponownie pobrać bloga)
      const res = await axios.get(`http://localhost:5432/blogs/${id}`, { withCredentials: true });
      setBlog(res.data);
    } catch (err) {
      console.error("Błąd przy tworzeniu posta:", err);
      setPostMessage("Błąd przy tworzeniu posta");
    }
  };

  return (
    <div style={{ padding: "20px", maxHeight: "90vh", overflowY: "auto" }}>
        <p>Utworzony przez: {blog.userId}</p>
        <h1>{blog.title}</h1>
        <p>{blog.description}</p>
        
        {/* Jeżeli aktualny użytkownik jest właścicielem bloga, wyświetlamy przycisk i formularz do tworzenia posta */}
      {currentUser && currentUser.id === blog.userId && (
        <div style={{ margin: "20px 0" }}>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={togglePostForm}
          >
            {showPostForm ? "Anuluj tworzenie posta" : "Utwórz nowy post"}
          </button>
          {showPostForm && (
            <form onSubmit={CreatePost} style={{ marginTop: "15px" }}>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tytuł posta"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <textarea
                  className="form-control"
                  placeholder="Treść posta"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: "8px 16px" }}
              >
                Zapisz post
              </button>
              {postMessage && (
                <div className="mt-2 alert alert-info text-center">
                  {postMessage}
                </div>
              )}
            </form>
          )}
        </div>
      )}
        <h2>Posty:</h2>
      {blog.posts && blog.posts.length > 0 ? (
        blog.posts.map((post) => (
          <div key={post.id} style={postCardStyle}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button 
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                backgroundColor: "#007bff",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/posts/${post.id}/comments`)}
            >
              View Comments
            </button>
          </div>
        ))
      ) : (
        <p>Nie znaleziono postów dla tego bloga.</p>
      )}
    </div>
  );
};

export default BlogPage;
