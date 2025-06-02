// models/Post.js

module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define(
      "Post",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        blogId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "Blogs", key: "id" },
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "Users", key: "id" },
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
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
  
    Post.associate = (models) => {
      // Post należy do Blog – dodaje relację wielu postów do jednego bloga
      Post.belongsTo(models.Blog, { foreignKey: "blogId", as: "blog" });
      // Post należy do użytkownika (autora)
      Post.belongsTo(models.User, { foreignKey: "userId", as: "author" });
      // Post może mieć wiele komentarzy
      Post.hasMany(models.Comment, { foreignKey: "postId", as: "comments" });
    };
  
    return Post;
  };
  