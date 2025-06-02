// models/index.js

const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Pobierz URL bazy z pliku .env
const databaseUrl = process.env.DB_URL;

// Utwórz instancję Sequelize
const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false, // Opcjonalnie, wyłącza logi SQL
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Utwórz obiekt, który będzie eksportowany
const db = {
  Sequelize,
  sequelize,
};

// Import modeli (zakładamy, że pliki User.js, Post.js oraz Comment.js znajdują się w folderze models)
db.User = require("./User")(sequelize, DataTypes);
db.Post = require("./Post")(sequelize, DataTypes);
db.Blog = require("./Blog")(sequelize, DataTypes);
db.Comment = require("./Comment")(sequelize, DataTypes);

// Wywołaj metodę associate, jeśli model ją posiada
Object.keys(db).forEach((modelName) => {
  if (db[modelName] && typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
});

// Metoda do autentykacji bazy danych
db.authenticate = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("--------------- Połączenie z bazą OK");
  } catch (err) {
    console.error("----------- Błąd połączenia z bazą:", err);
  }
};

// Metoda synchronizacji bazy danych
db.sync = async () => {
  try {
    await sequelize.sync();
    console.log("Synchronizacja bazy zakończona");
  } catch (error) {
    console.error("Błąd synchronizacji:", error);
  }
};

module.exports = db;
