const router = require("express").Router();
const bodyParser = require('../middlewares/bodyParser');
const taxonomyLibrary = require('../library/taxonomy-lib');
const httpErrors = require('../utils/httpErrors');
const formidable = require('formidable');

//Create New Taxonomy Project
router.post('/createProject', bodyParser, function (req, res) {
    console.log(req.department)
    taxonomyLibrary.createProject(req).then(isCreated => {
        console.log("Created Successfully...");
    }, error => {
        console.log("Error during creating a project...");
    })
});

router.post('/importFiles', function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (!err) {
            taxonomyLibrary.parseHierarchies(fields, files)
        }
    });
});

router.get('/gettaxonomy', function (req, res) {
    taxonomyLibrary.getTaxonomies(req.query.projectId, req.decoded).then(taxonomies => {
        res.status(httpErrors.OK.status).send({ taxonomyDetails: taxonomies, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});

//Taxonomy Attributes
router.get('/getAttributes', bodyParser, function (req, res) {
    taxonomyLibrary.getAttributes().then(taxonomyAttributes => {
        res.status(httpErrors.OK.status).send({ attributes: taxonomyAttributes, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});
//Taxonomy
router.post('/getHierarchies', function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (!err) {
            taxonomyLibrary.getHierarchies(fields, files).then(hierarchies => {
                res.status(httpErrors.OK.status).send({ Hierarchies: hierarchies, status: httpErrors.OK.status });
            }, error => {
                res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
            })
        }
    });
});


router.post('/createTaxonomy', bodyParser, function (req, res) {
    taxonomyLibrary.createTaxonomy(req.decoded, req.body).then(taxonomyAttributes => {
        res.status(httpErrors.OK.status).send({ taxonomyDetails: taxonomyAttributes, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});
router.get('/gettree', bodyParser, function (req, res) {
    console.log(req.query, "qwerg")
    taxonomyLibrary.getTaxonomyTree(req.query, req.decoded).then(taxonomyAttributes => {
        res.status(httpErrors.OK.status).send({ taxonomyDetails: taxonomyAttributes['taxonomyInfo'], treeData: taxonomyAttributes['treeObj'], status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});
router.get('/getcurrenttaxonomy', bodyParser, function (req, res) {
    taxonomyLibrary.getCurrentTaxonomy(req.query, req.decoded).then(taxonomyAttributes => {
        res.status(httpErrors.OK.status).send({ title: taxonomyAttributes, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});
router.post('/createTree', function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (!err) {
            taxonomyLibrary.createTaxonomyTree(fields, files, req.decoded).then(taxonomyAttributes => {
                res.status(httpErrors.OK.status).send({ ...taxonomyAttributes, status: httpErrors.OK.status });
            }, error => {
                res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
            })
        }
    });
});
router.post('/updateTree', bodyParser, function (req, res) {
    taxonomyLibrary.updateTree(req.decoded, req.body).then(taxonomyAttributes => {
        res.status(httpErrors.OK.status).send({ status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});
router.get('/getchildnodes', function (req, res) {
    taxonomyLibrary.getChildNodes(req.query).then(taxonomyAttributes => {
        res.status(httpErrors.OK.status).send({ ...taxonomyAttributes, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});
router.post('/dargdropnode', bodyParser, function (req, res) {
    taxonomyLibrary.dragNdropNodes(req.decoded, req.body).then(taxonomyAttributes => {
        res.status(httpErrors.OK.status).send({ status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});
router.post('/setrelation', bodyParser, function (req, res) {
    taxonomyLibrary.setRelationShip(req.decoded, req.body).then(taxonomyAttributes => {
        res.status(httpErrors.OK.status).send({ status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});
router.post('/deleterelation', bodyParser, function (req, res) {
    taxonomyLibrary.deleteRelation(req.decoded, req.body).then(taxonomyAttributes => {
        res.status(httpErrors.OK.status).send({ status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});
router.post('/editrelation', bodyParser, function (req, res) {
    taxonomyLibrary.editRelation(req.decoded, req.body).then(taxonomyAttributes => {
        res.status(httpErrors.OK.status).send({ status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});
router.post('/addnode', bodyParser, function (req, res) {
    taxonomyLibrary.addNode(req.decoded, req.body).then(taxonomyAttributes => {
        res.status(httpErrors.OK.status).send({ status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});
module.exports = router;