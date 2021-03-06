

const { post } = require("../routes/user");


module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement :true
      },
      content: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      imageUrl: {
          type: Sequelize.STRING,
      },
    },
    );

    return Post;
  };