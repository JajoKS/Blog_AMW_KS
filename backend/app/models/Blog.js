// models/Blog.js
module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    "Blog",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },
    },
    {
      timestamps: true,
    }
  );

  Blog.associate = (models) => {
    Blog.belongsTo(models.User, { foreignKey: "userId", as: "owner" });
    Blog.hasMany(models.Post, { foreignKey: "blogId", as: "posts" });
  };

  return Blog;
};
