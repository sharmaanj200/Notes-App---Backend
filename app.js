const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit')
const slowDown = require('express-slow-down');
require('dotenv').config();
require('./src/db/dbconn.js');

const routes = require('./src/api/routes/routes.js');

const app = express();

const apiRequestLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    handler: (req, res) => {
        return res.status(429).json({
            message: "Too many requests, please try again later."
        });
    }
});

const apiSpeedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 25,
    delayMs: () => 1000,
});

app.use(apiRequestLimiter);
app.use(apiSpeedLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Welcome to Notes APIs!");
});

app.use('/api', routes);

app.get('*', (req, res) => {
    res.status(404).send({
        message: "Not found",
        path: req.path
    });
});

module.exports = app;