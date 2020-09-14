const router = require("express").Router();
const bodyParser = require('../middlewares/bodyParser');
const newsLibrary = require('../library/news-lib');
const httpErrors = require('../utils/httpErrors');
const formidable = require('formidable');
const Vocabulary = require("../data/vocabulary-data");
const randomstring = require("randomstring");
const TimeStamp = require("../helper/unixTimeConverter");

const { Random } = require("random-js");
const random = new Random();

router.get('/GetAllBookMarkedNews', function (req, res, next) {
    newsLibrary.GetAllBookMarkedNews().then(result => {
        res.status(httpErrors.OK.status).send({ result, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});


router.post('/createbookmarked', bodyParser, function (req, res, next) {
    
    let item = req.body;
    console.log(item)
    let data = {
        title: item.title,
        description: item.description,
        bookMarkedId: randomstring.generate({ length: 12, charset: 'alphabetic' })
    }

    newsLibrary.CreateNewsBookMarked(data).then(result => {
        res.status(httpErrors.OK.status).send({ result, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })

});



module.exports = router;