// models/Comment.js

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(
      "Comment",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        timestamps: true,
      }
    );
  
    Comment.associate = (models) => {
      // Komentarz należy do postu
      Comment.belongsTo(models.Post, { foreignKey: "postId", as: "post" });
      // Komentarz należy do użytkownika (autora)
      Comment.belongsTo(models.User, { foreignKey: "userId", as: "author" });
    };
  
    return Comment;
  };
  