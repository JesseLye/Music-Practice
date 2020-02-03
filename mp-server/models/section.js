module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define("Section", {
      id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4
      },
      sectionName: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      targetBPM: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
  });
  Section.associate = (models) => {
      Section.hasMany(models.Bpm);
  }
  return Section;
}