// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';
import StronaLogin from './komponenty/StronaLogin';
import StronaRejestruj from './komponenty/StronaRejestruj';
import MojePosty from './komponenty/MojePosty';
import Obserwowani from './komponenty/Obserwowani';
import Polubienia from './komponenty/Polubienia';
import Homepage from './komponenty/Homepage';
import 'bootstrap/dist/css/bootstrap.min.css'; 

// Header – baner u góry z czarnym tłem
const Header = () => {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Link do Homepage po lewej stronie */}
        <Link to="/" className="navbar-brand">
          Homepage
        </Link>

        {/* Linki po prawej stronie */}
        <div>
          <Link to="/login" className="nav-link d-inline text-white mx-2">
            Zaloguj się
          </Link>
          <Link to="/register" className="nav-link d-inline text-white mx-2">
            Zarejestruj się
          </Link>
        </div>
      </div>
    </nav>
  );
};

// Sidebar – lewy panel z listą opcji
const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logika wylogowania, np. usuwanie tokenów, ustawienie stanu itp.
    console.log('Wylogowano!');
    //Tutaj dodać funkcje logout która wychodzi z sesji
    // Przekierowanie do strony logowania
    navigate('/login');
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
        Polubienia
      </Link>
      <button
        onClick={handleLogout}
        className="list-group-item list-group-item-action text-start btn btn-link"
      >
        Wyloguj się
      </button>
    </div>
  );
};

// RightSidebar – przykładowy prawy panel
const RightSidebar = () => {
  return (
    <div>
      <h5>Panel Prawy</h5>
      <p>Dodatkowe informacje lub widgety</p>
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
  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <div className="container-fluid flex-grow-1 overflow-hidden">
        <div className="row h-100">

          <div className="col-md-2 bg-light p-3">
            <Sidebar />
          </div>

          <div
            className="col-md-8 p-3 overflow-auto"
            style={{ backgroundColor: '#001f3f', color: 'white' }}
          >
            <Outlet/>
          </div>

          <div className="col-md-2 bg-light p-3">
            <RightSidebar />
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
          <Route path="likes" element={<Polubienia/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
