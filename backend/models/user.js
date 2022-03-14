
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
          type: Sequelize.STRING
      },
      admin: {
          type: Sequelize.BOOLEAN
      }
    },
    {
        sequelize,
        modelName: 'User',
    });
    User.associate = function (models) {
      User.hasMany(models.posts,{
        foreignKey: 'userId',
        as: 'posts', 
      }); 
    };

    return User;
  };