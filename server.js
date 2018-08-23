// REQUIRE NPM
const express = require('express')
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const logger = require('morgan');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const request = require('request');

// ROUTES AND MODELS
const htmlRoutes = require('./routes/htmlRoutes');
const apiRoutes = require('./routes/apiRoutes');
const db = require('./models')

const app = express();  
const PORT = process.env.PORT || 8080;

// WHEN DEPLOYED, USE DEPLOYED DB, OTHERWISE USE LOCAL mongoHeadlines DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// ACCESS TO PUBLIC FOLDER
app.use(express.static(__dirname + '/public'));

// MORGAN LOGGER
app.use(logger("dev"));

// BODY PARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//HANDLEBARS
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");;

// USE ROUTES
app.use(htmlRoutes);
app.use(apiRoutes);

// ES6 PROMISES ON MONGOOSE
mongoose.Promise = Promise;
// CONNECT TO MONGO DB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
});

app.listen(PORT, function () {
    console.log(`Listening on ${PORT}`)
});