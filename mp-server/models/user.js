module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
      id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4
      },
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
      },
      password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
              len: {
                  args: 6,
                  msg: "Password must be greater than 6 characters",
              },
          },
      },
  });
  User.associate = (models) => {
      User.hasMany(models.Song);
      User.hasMany(models.Exercise);
  }
  return User;
}