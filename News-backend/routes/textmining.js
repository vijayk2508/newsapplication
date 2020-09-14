const router = require("express").Router();
const bodyParser = require('../middlewares/bodyParser');
const textminingLibrary = require('../library/textmining-lib');
const httpErrors = require('../utils/httpErrors');
const formidable = require('formidable');
const json2xls = require('json2xls');
const fs = require("fs");

//Create New Textmining Project
router.post('/createText', bodyParser, function (req, res) {
    console.log(req.body)
    res.send(res.body);
    textminingLibrary.createProject(req).then(isCreated => {
        console.log("Created Successfully...");
    }, error => {
        console.log("Error during creating a project...");
    })
});


router.post('/create', bodyParser, function (req, res) {
    let data = req.body.children.Model_info;
    data.Extraction_fields = req.body.children.Extraction_fields;
    data.ProjectID = req.body.children.ProjectID;
    data.createdBy = req.decoded.userId;
    textminingLibrary.createTextminingdetails(data).then(textminingAttributes => {
        let data = {
            ProjectObj: textminingAttributes,
            cardDetails: textminingAttributes.textMiningId,
            status: httpErrors.OK.status
        }
        res.status(httpErrors.OK.status).send(data);
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});

router.get('/getProject', function (req, res) {
    console.log("=====================>", req.query, "textmining");
    textminingLibrary.getProject(req.query.projectId, req.decoded).then(textmining => {
        console.log(textmining);
        res.status(httpErrors.OK.status).send({ memberList: textmining, status: httpErrors.OK.status });
        console.log(res);
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});


router.post('/editcarddetail', bodyParser, function (req, res) {
    textminingLibrary.editProject(req.body, req.decoded).then(textmining => {
        res.status(httpErrors.OK.status).send({ ProjectObj: textmining, cardDetails: req.body.children.Model_info.textMiningId, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});

router.delete('/deletecard', function (req, res) {
    let objString = req.query.projectId.split(',');
    let textminingId = objString[1];
    let projectId = objString[0];
    textminingLibrary.deleteCard(textminingId, projectId, req.decoded).then(textmining => {
        res.status(httpErrors.OK.status).send({ status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});


router.post('/export', bodyParser, function (req, res) {
    let excelform = req.body.data;
    let filename = 'downloads.xlsx';

    let xls = json2xls(excelform);
    fs.writeFileSync('./bin/wwwroot/download/' + filename, xls, 'binary', (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    });

    let hostedIp = req.connection.remoteAddress;
    let hostedPort = req.connection.localPort;
    let Url = 'http://' + hostedIp + ':' + hostedPort + '/static/wwwroot/download/' + filename;
    console.log(hostedIp, hostedPort, Url);

    res.status(httpErrors.OK.status).send({ path: Url, status: httpErrors.OK.status });
});

router.post('/fileextracttion', function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (!err) {
            textminingLibrary.parseHierarchies(fields, files).then(textmining => {
                res.status(httpErrors.OK.status).send({ result: textmining, status: httpErrors.OK.status });
            });
        }
    });
});


router.post('/textextraction', function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (!err) {
            textminingLibrary.parsetextHierarchies(fields, files).then(textmining => {
                res.status(httpErrors.OK.status).send({ result: textmining, status: httpErrors.OK.status });
            });
        }
    });
});


router.get('/getkeywords', function (req, res) {
    let obj = req.query.projectId;
    let objstring = obj.split(",");
    let vocabulary_Id = objstring[1];
    let project_Id = objstring[0];
    textminingLibrary.getTextMiningKeywordsList(vocabulary_Id, project_Id).then(data => {
        console.log("Hi")
        console.log(data);
        res.status(httpErrors.OK.status)
            .send({
                ...data,
                status: httpErrors.OK.status
            });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});

module.exports = router;