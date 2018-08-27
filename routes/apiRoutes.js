const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const db = require('../models')
const router = express.Router();

// GET ROUTE FOR SCRAPING THE VERGE
router.get('/scrape', function (req, res) {
    axios.get('https://www.theverge.com/archives')
        .then(resp => {

            // LOAD RESPONSE INTO CHEERIO AND SAVE AS '$'
            const $ = cheerio.load(resp.data);

            // GRAB EVERY LINK W/ TITLE CLASS
            $('div h2').each((i, elem) => {
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

            res.send('Your Scrape has completed');
        });
});

// GET ARTICLES FROM ARTICLE DB
router.get('/articles', (req, res) => {
    db.Article.find({})
        .then(dbArticle => res.json(dbArticle))
        .catch(err => res.json(err));
});

// GET SPECIFIC ARTICLE BY ID, POPULATE W/ NOTE
router.get('/articles/:id', (req, res) => {
    db.Article.findOne({ _id: req.params.id })
        .populate('note')
        .then(dbNote => res.json(dbNote))
        .catch(err => res.json(err));
});

router.post('/articles/:id', (req, res) => {
    db.Note.create(req.body)
        .then(dbNote => {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
        })
        .then(dbArticle => res.json(dbArticle))
        .catch(err => res.json(err));
})

module.exports = router;