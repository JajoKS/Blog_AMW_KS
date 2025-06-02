import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const KomentarzePosta = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentMessage, setCommentMessage] = useState("");

  const GetComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5432/posts/${postId}/comments`, { withCredentials: true });
      setComments(res.data);
    } catch (err) {
      console.error("Błąd pobierania komentarzy:", err);
      setError("Błąd pobierania komentarzy");
    } finally {
      setLoading(false);
    }
  };

  const Session = async () => {
    try {
      const res = await axios.get("http://localhost:5432/session", { withCredentials: true });
      setCurrentUser(res.data.user);
    } catch (err) {
      console.error("Błąd przy pobieraniu sesji:", err);
    }
  };

  useEffect(() => {
    GetComments();
  }, [postId]);

  useEffect(() => {
    Session();
  }, []);

  // Funkcja toggle formularza
  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
    setCommentMessage("");
  };

  // Obsługa wysłania nowego komentarza
  const handleCreateComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:5432/posts/${postId}/comments`, 
        { content: newComment }, 
        { withCredentials: true }
      );
      setCommentMessage("Komentarz dodany pomyślnie!");
      setNewComment("");
      setShowCommentForm(false);
      // Odświeżamy komentarze
      GetComments();
    } catch (err) {
      console.error("Błąd przy dodawaniu komentarza:", err);
      setCommentMessage("Błąd przy dodawaniu komentarza");
    }
  };

  if (loading) return <div>Ładowanie komentarzy...</div>;
  if (error) return <div>{error}</div>;

  const commentCardStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    margin: "10px 0",
    boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div style={{ padding: "20px", maxHeight: "90vh", overflowY: "auto" }}>
      <h2>Komentarze dla posta {postId}:</h2>

      {/* Wyświetlamy przycisk "Dodaj komentarz" tylko, gdy aktualny użytkownik jest zalogowany */}
      {currentUser && (
        <div style={{ marginBottom: "15px" }}>
          <button 
            className="btn btn-success"
            onClick={toggleCommentForm}
          >
            {showCommentForm ? "Anuluj" : "Dodaj komentarz"}
          </button>
          {showCommentForm && (
            <form onSubmit={handleCreateComment} style={{ marginTop: "10px" }}>
              <div className="mb-2">
                <textarea
                  className="form-control"
                  placeholder="Treść komentarza"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Zapisz komentarz
              </button>
              {commentMessage && (
                <div className="mt-2 alert alert-info text-center">
                  {commentMessage}
                </div>
              )}
            </form>
          )}
        </div>
      )}

      {comments.length === 0 ? (
        <p>Brak komentarzy.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} style={commentCardStyle}>
            <p>{comment.content}</p>
            <p>
              <strong>Autor:</strong>{" "}
              {comment.author ? comment.author.username : "Nieznany"}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default KomentarzePosta;
