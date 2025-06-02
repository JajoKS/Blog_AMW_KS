// models/User.js

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      "User",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        timestamps: true, // dodaje createdAt oraz updatedAt
      }
    );
  
    User.associate = (models) => {
      // Jeden użytkownik może mieć wiele postów
      User.hasMany(models.Post, { foreignKey: "userId", as: "posts" });
      // Jeden użytkownik może mieć wiele komentarzy
      User.hasMany(models.Comment, { foreignKey: "userId", as: "comments" });
    // Jeden użytkownik może mieć wiele blogów
      User.hasMany(models.Blog, { foreignKey: "userId", as: "blogs" });
    };
  
    return User;
  };
  