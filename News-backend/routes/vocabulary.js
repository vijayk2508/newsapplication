const router = require("express").Router();
const bodyParser = require('../middlewares/bodyParser');
const vocabularyLibrary = require('../library/vocabulary-lib');
const httpErrors = require('../utils/httpErrors');
const formidable = require('formidable');
const Vocabulary = require("../data/vocabulary-data");
const randomstring = require("randomstring");
const TimeStamp = require("../helper/unixTimeConverter");

const { Random } = require("random-js");
const random = new Random();

router.get('/getkeywords', function (req, res, next) {

    let obj = req.query.projectId;
    let objstring = obj.split(",");
    let vocabulary_Id = objstring[1];
    let project_Id = objstring[0];

    vocabularyLibrary.getVocabularyKeywordList(vocabulary_Id, project_Id).then(data => {
        // console.log("Hi")
        // console.log(data);
        res.status(httpErrors.OK.status)
            .send({
                ...data,
                status: httpErrors.OK.status
            });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});

router.get('/getProject', function (req, res, next) {
    //Vocabulary/getProject?projectId=${projectId}
    let projectId = req.query.projectId;

    vocabularyLibrary.getVocabularyProject(projectId).then(data => {
        console.log("Hi")
        console.log(data);
        let dt={};
         dt=data.memberList;
     
        //data.autofillStatus =JSON.parse(data.autofillStatus);
       
       
        console.log(data);

        res.status(httpErrors.OK.status)
            .send({
                ...data,
                status: httpErrors.OK.status
            });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
})

router.post('/create', bodyParser, function (req, res, next) {

    /*
    req.body.projectId
    req.body.New_vocabulary 
    */

    let NewVocabularyData = req.body.New_vocabulary;
    NewVocabularyData.projectId = req.body.projectId;
    NewVocabularyData.Vocabulary_Id = randomstring.generate({ length: 12, charset: 'alphabetic' });
    NewVocabularyData.createdBy = req.decoded.userId;
    NewVocabularyData.tabname = "Vocabulary" + "" + random.integer(1, 1000);
    NewVocabularyData.createddate = TimeStamp.UNIXTIMESTAMP;

    vocabularyLibrary.CreateVocabulary(NewVocabularyData).then(result => {

        res.status(httpErrors.OK.status)
            .send({ ProjectObj: result.projectId, cardDetails: result.vocabularyId, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })

});


router.delete('/deletecard', function (req, res) {
    let objString = req.query.projectId.split(',');
    let vocabularyId = objString[1];
    let projectId = objString[0];
    vocabularyLibrary.deleteCard(objString, req.decoded).then(textmining => {
        res.status(httpErrors.OK.status).send({ status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});

router.post('/deletekeyword',bodyParser, function (req, res) {
    let objString = req.body;
    let vocabularyId = objString.cardId;
    let projectId = objString.projectId;
    vocabularyLibrary.deleteCardkeyword(objString, req.decoded).then(Vocabulary => {
        res.status(httpErrors.OK.status).send({ result:Vocabulary,status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});


router.post('/filextraction', function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (!err) {
            vocabularyLibrary.parseHierarchies(fields, files).then(textmining => {
                res.status(httpErrors.OK.status).send({ result: textmining, status: httpErrors.OK.status });
            });
        }else{
            res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
        }
    });
});


router.get('/getchartdata', function (req, res, next) {
    let objQueryString = req.query.projectId.split(",")
    let vocabulary_Id = objQueryString[1];
    let project_ID = objQueryString[0];

    console.log("result","hahaha vocab")
    vocabularyLibrary.GetListChart(vocabulary_Id,project_ID).then(result => {
        let data = {
            result,
            status: httpErrors.OK.status 
        }

        res.status(httpErrors.OK.status).send(data);
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    });
});

router.post('/manualinsert',bodyParser, function (req, res) {
    let objString = req.body;
    
    vocabularyLibrary.maualinsertoption(objString, req.decoded).then(Vocabulary => {
        res.status(httpErrors.OK.status).send({ result:Vocabulary.result,status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});


router.post('/editcarddetail', bodyParser, function (req, res) {
    let dataVocabulary = req.body.New_vocabulary;
    dataVocabulary.updatedAt = TimeStamp.UNIXTIMESTAMP;

    vocabularyLibrary.UpdateVocabulary(dataVocabulary).then(result => {
        let data = {
            projectDetails: result[0],
            status: httpErrors.OK.status,
            cardId:dataVocabulary.Vocabulary_Id
        }

        console.log(data)

        res.status(httpErrors.OK.status).send(data);
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    });
});


module.exports = router;