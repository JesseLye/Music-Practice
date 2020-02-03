require("dotenv").config();
const express = require("express");
const app = express();
const graphqlHTTP = require('express-graphql');
const session = require("express-session");
const cors = require("cors");
const redis = require("redis");
const RateLimit = require("express-rate-limit");
const RateLimitRedisStore = require("rate-limit-redis");
const models = require("./models");
const errorHandler = require("./src/handlers/error");
const genSchema = require("./utils/genSchema");
const { applyMiddleware } = require("graphql-middleware");
const whiteList = [
    "http://localhost:4200", 
    "http://127.0.0.1:4200", 
    "http://localhost:8080",
];
const middleware = require("./middleware");

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
}));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

let RedisStore = require('connect-redis')(session);
let redisClient = null;
if (process.env.REDIS_URL) {
    redisClient = redis.createClient(process.env.REDIS_URL);
} else {
    redisClient = redis.createClient();
}

app.use(
    session({
        name: "qid",
        secret: "someThing",
        resave: false,
        saveUninitialized: false,
        store: new RedisStore({ client: redisClient }),
        cookie: {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        }
    })
);

const schema = genSchema();
applyMiddleware(schema, middleware);

app.use('/graphql', graphqlHTTP((req) => ({
    schema,
    context: {
        req,
        models,
        redisClient
    },
    // graphiql: true
})));

const limiter = new RateLimit({
    store: new RateLimitRedisStore({
        client: redis
    }),
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    delayMs: 0
});

app.use(limiter);

const PORT = process.env.PORT || 8080;

app.use(errorHandler);

app.listen(PORT, () => {
    // development only
    // models.sequelize.sync();
    console.log(`Server is now running on: ${PORT}`);
});