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
            const result = {};

            // GRAB EVERY TITLE AND LINK FROM TIHS DIV W/ H2
            $('div.c-entry-box--compact__body').each((i, elem) => {

                result.title = $(elem)
                    .find('h2.c-entry-box--compact__title')
                    .text();
                result.link = $(elem)
                    .find('a')
                    .attr("href");

                db.Article.create(result)
                    .then(dbArticle => console.log(dbArticle))
                    .catch(err => { return res.json(err) });
            });

            res.render("index", { Article: data })
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