// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');

const db = require('./app/models/index');
// Importujemy modele: User, Blog i Post
const { User, Blog, Post, Comment } = db;
const app = express();

app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'jesusisabread', // zmień na własną, trudną do odgadnięcia wartość
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // ustaw na true przy użyciu HTTPS
}));

(async () => {
  try {
    // Połączenie z bazą
    await db.authenticate();
    await db.sync();

    // Sprawdzenie czy baza (tabela Users) jest pusta
    const userCount = await User.count();
    if (userCount === 0) {
      // Tworzymy testowego użytkownika
      const testUser = await User.create({
        username: "test",
        password: "test",
      });
      console.log("Utworzono użytkownika:", testUser.toJSON());
      
      // Tworzymy testowy blog przypisany do tego użytkownika
      const testBlog = await Blog.create({
        title: "Testowy Blog",
        description: "Opis testowego blogu",
        userId: testUser.id,  // klucz obcy wskazujący na użytkownika
      });
      console.log("Utworzono blog:", testBlog.toJSON());
      
      // Tworzymy testowy post w utworzonym blogu, przypisany również do użytkownika jako autor
      const testPost = await Post.create({
        blogId: testBlog.id, // klucz obcy do bloga
        userId: testUser.id, // klucz obcy do użytkownika (autor posta)
        title: "Testowy Post",
        content: "Treść testowego posta"
      });
      console.log("Utworzono post:", testPost.toJSON());
    } else {
      console.log("Baza zawiera już dane, testowe rekordy nie zostały dodane.");
      testPost = await Post.findOne();
    }
    const commentCount = await Comment.count();
    if (commentCount === 0) {
      if (testPost) {
        const testComment = await Comment.create({
          postId: testPost.id,
          userId: testPost.userId,
          content: "Testowy komentarz"
        });
        console.log("Utworzono komentarz:", testComment.toJSON());
      } else {
        console.log("Brak posta do dodania komentarza testowego.");
      }
    }
  } catch (error) {
    console.error("Błąd podczas inicjalizacji bazy danych:", error);
  }
})();

// Endpoint zwracający wszystkie blogi (z przypisanymi postami)
app.get('/select-all', async (req, res) => {
  try {
    const results = await Blog.findAll({
      include: [{ model: Post, as: 'posts' }],
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Opcjonalnie ładujemy pozostałe trasy (np. dla blogów)
require("./app/routes/blog.routes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
