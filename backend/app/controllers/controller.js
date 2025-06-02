// controller.js
const db = require("../models");
const Blog = db.Blog;
const Post = db.Post;
const User = db.User;
const Comment = db.Comment;

//Znajdz wszytskie blogi
exports.findAll = (req,res) => {
    Blog.findAll()
    .then(data => res.send(data))
    .catch(err => {
        res.status(500).send({ message: err.message || "Błąd przy pobieraniu Blogów." });
      });
};

// Znajdź jeden blog po id (w tym przykładzie łączy również powiązane posty)
exports.findOne = (req, res) => {
    const id = req.params.id;
    Blog.findByPk(id, {
        include: [{ model: Post, as: 'posts' },
        { model: User, as: 'owner', attributes: ['username'] } ]// dołączenie właściciela bloga
      })
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({ message: `Nie znaleziono bloga z id=${id}` });
        }
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  };

  // Znajdź wszystkie komentarze dla danego posta
exports.findByPost = (req, res) => {
    const postId = req.params.postId;
  
    Comment.findAll({
      where: { postId: postId },
      include: [
        {
          model: User,
          as: "author", // zgodnie z definicją as w modelu Comment
          attributes: ["id", "username"], 
        },
      ],
    })
      .then((comments) => {
        res.send(comments);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Błąd podczas pobierania komentarzy dla posta.",
        });
      });
  };

  // Rejestracja użytkownika
exports.register = async (req, res) => {
  const { username, password } = req.body;

  // Sprawdzamy, czy wszystkie pola są podane
  if (!username || !password) {
    return res.status(400).json({ message: "Wszystkie pola są wymagane." });
  }

  try {
    // Jeśli użytkownik o podanym loginie już istnieje, zwróć błąd
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Login jest już zajęty." });
    }

    // Tworzymy użytkownika – w produkcji warto dodatkowo haszować hasło
    await User.create({ username, password });
    return res.status(201).json({ message: "Użytkownik zarejestrowany pomyślnie." });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Błąd rejestracji." });
  }
};

// Metoda logowania użytkownika
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Sprawdzamy, czy pola zostały podane
  if (!username || !password) {
    return res.status(400).json({ message: "Wszystkie pola są wymagane." });
  }

  try {
    // Szukamy użytkownika o podanym username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Niepoprawny login lub hasło." });
    }

    // Sprawdzamy czy hasło się zgadza
    if (user.password !== password) {
      return res.status(400).json({ message: "Niepoprawny login lub hasło." });
    }

    // Poprawne logowanie – ustawiamy dane użytkownika w sesji
    req.session.user = { id: user.id, username: user.username };

    // W przypadku powodzenia możemy zwrócić dane lub token (dla uproszczenia zwracamy komunikat)
    return res.status(200).json({ message: "Zalogowano pomyślnie." });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Błąd logowania." });
  }
};

exports.sesja = async (req, res) => {
  router.get("/session", (req, res) => {
    if (req.session.user) {
      res.status(200).json({ user: req.session.user });
    } else {
      res.status(200).json({ user: null });
    }
  });
};

// Pobierz blogi użytkownika zalogowanego w sesji
exports.getMyBlogs = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Nie jesteś zalogowany." });
  }
  
  try {
    const blogs = await Blog.findAll({
      where: { userId: req.session.user.id }
    });
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Błąd przy pobieraniu blogów." });
  }
};

// Utwórz nowy blog dla zalogowanego użytkownika
exports.createBlog = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Nie jesteś zalogowany." });
  }
  
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ message: "Tytuł bloga jest wymagany." });
  }
  
  try {
    const blog = await Blog.create({
      title,
      description,
      userId: req.session.user.id
    });
  
    return res.status(201).json(blog);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Błąd przy tworzeniu bloga." });
  }
};

// Dodaj na końcu lub w odpowiednim miejscu w pliku controller.js
exports.createPost = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Nie jesteś zalogowany." });
  }
  
  const blogId = req.params.id;  // zakładamy, że w trasie mamy /blogs/:id/posts
  const { title, content } = req.body;
  // Walidacja
  if (!title || !content) {
    return res.status(400).json({ message: "Tytuł i treść posta są wymagane." });
  }
  
  try {
    // Znajdź blog, aby sprawdzić, czy użytkownik jest jego właścicielem
    const blog = await Blog.findOne({ where: { id: blogId } });
    if (!blog) {
      return res.status(404).json({ message: "Blog nie został znaleziony." });
    }
    if (blog.userId !== req.session.user.id) {
      return res.status(403).json({ message: "Nie masz uprawnień do tworzenia posta dla tego bloga." });
    }
    
    // Tworzymy nowy post
    const newPost = await Post.create({
      blogId: blogId,
      userId: req.session.user.id,
      title: title,
      content: content,
    });
    return res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Błąd przy tworzeniu posta." });
  }
};

// Pobierz posty użytkownika zalogowanego na sesji
exports.getMyPosts = async (req, res) => {
  // Upewnij się, że użytkownik jest zalogowany
  if (!req.session.user) {
    return res.status(401).json({ message: "Nie jesteś zalogowany." });
  }
  
  try {
    const posts = await Post.findAll({
      where: { userId: req.session.user.id }
    });
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Błąd przy pobieraniu postów." });
  }
};

// Tworzenie komentarza dla danego posta
exports.createComment = async (req, res) => {
  // Sprawdzamy, czy użytkownik jest zalogowany
  if (!req.session.user) {
    return res.status(401).json({ message: "Nie jesteś zalogowany." });
  }
  
  const postId = req.params.postId;
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({ message: "Treść komentarza jest wymagana." });
  }
  
  try {
    // Tworzymy komentarz; zakładamy, że model Comment został prawidłowo powiązany
    const comment = await Comment.create({
      content: content,
      postId: postId,
      userId: req.session.user.id
    });
    
    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Błąd przy tworzeniu komentarza." });
  }
};