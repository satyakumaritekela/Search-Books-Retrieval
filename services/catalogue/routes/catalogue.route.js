const express = require('express')
const router = express.Router()
const bookModel = require('../models/catalogue.model')

router.get('/catalogue/:keyword', (request, response) => {
    var keyword = request.params.keyword;
    bookModel.aggregate(
        [
            { $limit: 100},
            { $match: { $or: [{ Author: { "$regex": keyword, "$options": "i" } }, { Title: { "$regex": keyword, "$options": "i" } }] } }
        ], (err, books) => {
        if (err) {
            console.log("error occured")
        }
        else {
            response.json(books)
        }
    })
})

module.exports = router