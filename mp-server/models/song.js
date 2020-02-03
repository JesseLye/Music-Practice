module.exports = (sequelize, DataTypes) => {
    const Song = sequelize.define("Song", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        songName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        artistName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    Song.associate = (models) => {
        Song.hasMany(models.Section);
    }
    return Song;
}