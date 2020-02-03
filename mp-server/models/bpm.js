module.exports = (sequelize, DataTypes) => {
  const Bpm = sequelize.define("Bpm", {
      id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4
      },
      bpm: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
  });
  return Bpm; 
}