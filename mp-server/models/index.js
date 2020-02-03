const Sequelize = require("sequelize");
let sequelize = null
if (process.env.DATABASE_URL) {
    // the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        port: 5432,
        host: "http://immense-caverns-15639.herokuapp.com/",
        logging: true //false
    })
} else {
    sequelize = new Sequelize(
        "music_practice",
        "jesse",
        "password",
        {
            host: "localhost",
            dialect: "postgres",
        },
    );
}

const db = {
    User: sequelize.import("./user"),
    Song: sequelize.import("./song"),
    Exercise: sequelize.import("./exercise"),
    Section: sequelize.import("./section"),
    Bpm: sequelize.import("./bpm"),
};

Object.keys(db).forEach((modelName) => {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;

module.exports = db;