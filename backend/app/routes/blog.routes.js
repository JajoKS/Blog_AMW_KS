module.exports = app => {
    const Controller = require("../controllers/controller.js");
    const router = require("express").Router();
  
    // Endpoint pobierający wszystkie blogi
    router.get("/", Controller.findAll);
  
    // Endpoint pobierający komentarze dla danego posta
    router.get("/posts/:postId/comments", Controller.findByPost);
  
    // Endpoint pobierający szczegóły pojedynczego bloga na podstawie jego id
    router.get("/blogs/:id", Controller.findOne);
  
    // Endpoint rejestracji użytkownika
    router.post("/register", Controller.register);
  
    // Endpoint logowania użytkownika
    router.post("/login", Controller.login);

    router.get("/myblogs", Controller.getMyBlogs);
    router.post("/blogs", Controller.createBlog);

    router.get("/myposts", Controller.getMyPosts);

    // Endpoint tworzenia komentarza dla danego posta
    router.post("/posts/:postId/comments", Controller.createComment);

    // Endpoint tworzenia posta dla danego bloga  
    router.post("/blogs/:id/posts", Controller.createPost);

    // Nowy endpoint zwracający informację o sesji
    router.get("/session", (req, res) => {
        if (req.session.user) {
        res.status(200).json({ user: req.session.user });
        } else {
        res.status(200).json({ user: null });
        }
    });

    // Endpoint wylogowania użytkownika
    router.post("/logout", (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Wylogowywanie nie powiodło się." });
            }
            // Jeśli używasz domyślnej nazwy ciasteczka (connect.sid), usuń je:
            res.clearCookie("connect.sid");
            res.status(200).json({ message: "Wylogowano pomyślnie." });
        });
    });

    // Montujemy router na ścieżce głównej
    app.use("/", router);
  };
  