// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';
import StronaLogin from './komponenty/StronaLogin';
import StronaRejestruj from './komponenty/StronaRejestruj';
import MojePosty from './komponenty/MojePosty';
import Obserwowani from './komponenty/Obserwowani';
import TwojeBlogi from './komponenty/TwojeBlogi';
import Homepage from './komponenty/Homepage';
import BlogPage from './komponenty/Blogpage';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import KomentarzePosta from './komponenty/KomentarzePosta';
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_URL

// Header – baner u góry z czarnym tłem
const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Pobieramy dane sesji z backendu
    axios.get("/session", { withCredentials: true })
      .then(response => {
        if (response.data.user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(err => {
        console.error("Błąd przy sprawdzaniu sesji:", err);
        setIsLoggedIn(false);
      });
  }, []); // Ma się wykonać tylko raz przy montowaniu Layout

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Link do Homepage po lewej stronie */}
        <Link to="/" className="navbar-brand">
          Homepage
        </Link>

        {/* Linki po prawej stronie */}
        {!isLoggedIn && (
        <div>
          <Link to="/login" className="nav-link d-inline text-white mx-2">
            Zaloguj się
          </Link>
          <Link to="/register" className="nav-link d-inline text-white mx-2">
            Zarejestruj się
          </Link>
        </div>)}
      </div>
    </nav>
  );
};

// Sidebar – lewy panel z listą opcji
const Sidebar = () => {
  const navigate = useNavigate();

  const Logout = async () => {
    try {
      // Wywołaj endpoint wylogowania, jeśli taki masz (np. POST "/logout")
      await axios.post("/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Błąd przy wylogowywaniu:", err);
    }
    // Logika wylogowania, np. usuwanie tokenów, ustawienie stanu itp.
    console.log('Wylogowano!');
    // Przekierowanie do strony logowania
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="list-group">
      <Link to="/posts" className="list-group-item list-group-item-action">
        Twoje posty
      </Link>
      <Link to="/following" className="list-group-item list-group-item-action">
        Obserwowani
      </Link>
      <Link to="/likes" className="list-group-item list-group-item-action">
        Twoje Blogi
      </Link>
      <button
        onClick={Logout}
        className="list-group-item list-group-item-action text-start btn btn-link"
      >
        Wyloguj się
      </button>
    </div>
  );
};

// Footer – stopka z szarym tłem i białym tekstem
const Footer = () => {
  return (
    <footer className="bg-secondary text-white text-center py-2">
      Wykonał: Krzysztof Serafin
    </footer>
  );
};

// Layout – główny szablon wszystkie sekcje (header, sidebar, main, right sidebar, footer)
const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Pobieramy dane sesji z backendu
    axios.get("http://localhost:5432/session", { withCredentials: true })
      .then(response => {
        if (response.data.user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(err => {
        console.error("Błąd przy sprawdzaniu sesji:", err);
        setIsLoggedIn(false);
      });
  }, []); // Ma się wykonać tylko raz przy montowaniu Layout

  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <div className="container-fluid flex-grow-1 overflow-hidden">
        <div className="row h-100">
          {isLoggedIn && (
            <div className="col-md-2 bg-light p-3">
              <Sidebar />
            </div>
          )}
          <div
            className={isLoggedIn ? "col-md-10 p-3 overflow-auto" : "col-md-12 p-3 overflow-auto"}
            style={{ backgroundColor: '#001f3f', color: 'white' }}
          >
            <Outlet/>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Główna aplikacja
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage/>} />
          <Route path="login" element={<StronaLogin/>} />
          <Route path="register" element={<StronaRejestruj/>} />
          <Route path="posts" element={<MojePosty/>} />
          <Route path="following" element={<Obserwowani/>} />
          <Route path="likes" element={<TwojeBlogi/>} />
          <Route path="/blogs/:id" element={<BlogPage />} />
          <Route path="/posts/:postId/comments" element={<KomentarzePosta />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
