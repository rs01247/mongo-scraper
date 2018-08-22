const express = require('express')
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const request = require('request');
const htmlRoutes = require('./routes/htmlRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost/my_database');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");;

app.use(htmlRoutes);
app.use(apiRoutes);


app.listen(PORT, function () {
    console.log(`Listening on ${PORT}`)
});