// REQUIRE NPM
const express = require('express')
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const logger = require('morgan');
const mongoose = require('mongoose');
// const cheerio = require('cheerio');
// const axios = require('axios');
const request = require('request');

// // ACCESS MODELS FOLDER W/ ARTICLE AND NOTE
// const db = require('./models')

// ROUTING
const htmlRoutes = require('./routes/htmlRoutes');
const apiRoutes = require('./routes/apiRoutes');

// WHEN DEPLOYED, USE DEPLOYED DB, OTHERWISE USE LOCAL mongoHeadlines DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
const PORT = process.env.PORT || 8080;
const app = express();
// request('http://www.reddit.com', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });


// MORGAN LOGGER
app.use(logger("dev"));

// BODY PARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//HANDLEBARS
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");;

// ACCESS TO PUBLIC FOLDER
app.use(express.static(__dirname + '/public'));

// ES6 PROMISES ON MONGOOSE
mongoose.Promise = Promise;

// CONNECT TO MONGO DB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
});

// mongoose.connection.on('error', function () {
//     console.error('MongoDB Connection Error. Make sure MongoDB is running.');
// });
// mongoose.connection.once("open", function () {
//     console.log("Mongoose connection successful.");
// });

app.use(apiRoutes);
app.use(htmlRoutes);


app.listen(PORT, function () {
    console.log(`Listening on ${PORT}`)
});