const express = require('express');
const app = express();
const router = require('./routes/index.route');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
require('dotenv').config()
const session = require('express-session');
const passport = require('passport');
const User = require('./models/user');
const logger = require('./utils/logger');


// Mongo DB Connections
mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => {
        console.log('MongoDB Connection Succeeded.');
    }).catch(error => {
        console.log('Error in DB connection: ' + error);
    });


// Middleware Connections
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    cookie: { name: "user", secret: process.env.SECRET, expiresIn: 60 * 1000 },
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Routes



app.use(logger)
app.use('/', router);

// Connection
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('App running in port: ' + PORT)
})