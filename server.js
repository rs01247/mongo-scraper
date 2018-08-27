// REQUIRE NPM
const express = require('express')
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const logger = require('morgan');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const axios = require('axios');
const request = require('request');

// ACCESS MODELS FOLDER W/ ARTICLE AND NOTE
const db = require('./models')

// ROUTING
// const htmlRoutes = require('./routes/htmlRoutes');
// const apiRoutes = require('./routes/apiRoutes');

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

app.get('/', function (req, res) {
    res.render('index'), {
        title: 'Scraper'
    }
})

// GET ROUTE FOR SCRAPING THE VERGE
app.get('/scrape', function (req, res) {
    axios.get('https://www.theverge.com/archives')
        .then(resp => {

            // LOAD RESPONSE INTO CHEERIO AND SAVE AS '$'
            const $ = cheerio.load(resp.data);

            // GRAB EVERY LINK W/ TITLE CLASS
            $('h2.c-entry-box--compact__title').each((i, elem) => {
                const result = {};

                result.title = $(this)
                    .children("a")
                    .text();
                result.link = $(this)
                    .children("a")
                    .attr("href");

                db.Article.create(result)
                    .then(dbArticle => console.log(dbArticle))
                    .catch(err => { return res.json(err) });
            });

            // res.send('Your Scrape has completed');
        });
});

// GET ARTICLES FROM ARTICLE DB
app.get('/articles', (req, res) => {
    db.Article.find({})
        .then(dbArticle => res.json(dbArticle))
        .catch(err => res.json(err));
});

// GET SPECIFIC ARTICLE BY ID, POPULATE W/ NOTE
app.get('/articles/:id', (req, res) => {
    db.Article.findOne({ _id: req.params.id })
        .populate('note')
        .then(dbNote => res.json(dbNote))
        .catch(err => res.json(err));
});

app.post('/articles/:id', (req, res) => {
    db.Note.create(req.body)
        .then(dbNote => {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
        })
        .then(dbArticle => res.json(dbArticle))
        .catch(err => res.json(err));
})

app.listen(PORT, function () {
    console.log(`Listening on ${PORT}`)
});