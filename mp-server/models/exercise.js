module.exports = (sequelize, DataTypes) => {
  const Exercise = sequelize.define("Exercise", {
      id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4
      },
      exerciseName: {
          type: DataTypes.STRING,
          allowNull: false,
      },
  });
  Exercise.associate = (models) => {
      Exercise.hasMany(models.Section);
  }
  return Exercise;
}