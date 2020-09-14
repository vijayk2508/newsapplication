const router = require("express").Router();
const projectLibrary = require("../library/project-lib");
const bodyParser = require('../middlewares/bodyParser');
const httpErrors = require('../utils/httpErrors');
const formidable = require('formidable');

//Create New Taxonomy Project
router.get('/getProject', bodyParser, function (req, res) {
    projectLibrary.getProject(req.decoded).then(projects => {
        res.status(httpErrors.OK.status).send({ ProjectObj: projects, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});

//Get project info
router.get('/getProjectInfo', bodyParser, function (req, res) {
    projectLibrary.getProjectInfo(req.query.id).then(projects => {
        console.log(projects)
        res.status(httpErrors.OK.status).send({ ProjectObj: projects, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});

//Get project Name
router.get('/getcurrentproject', function (req, res) {
    projectLibrary.getProjectName(req.query.id).then(projects => {
        res.status(httpErrors.OK.status).send({ ...projects, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});

//App project info (Recent)
router.get('/recentProjects', bodyParser, function (req, res) {
    projectLibrary.getRecentProjectInfo(req.query.id).then(recentProjects => {
        res.status(httpErrors.OK.status).send({ ...recentProjects, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});

//Project Attributes
router.get('/getAttributes', bodyParser, function (req, res) {
    projectLibrary.getAttributes().then(projectAttributes => {
        res.status(httpErrors.OK.status).send({ projectDropDownData: projectAttributes, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});

router.post('/createproject', bodyParser, function (req, res, next) {
    let projectData = req.body.ProjectData;
    projectLibrary.createnewProject(projectData, req.decoded).then(result => {
        console.log(result);
        res.status(httpErrors.OK.status)
            .send({ projectId: result, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })

});


router.get('/getprojectname', bodyParser, function (req, res) {
    projectLibrary.getProjectName(req.query.id).then(projects => {
        res.status(httpErrors.OK.status).send({ title: projects.title, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});


router.post('/editproject', bodyParser, function (req, res, next) {
    let projectData = req.body.editProject;
    projectLibrary.editProjectdata(projectData, req.decoded).then(result => {
        res.status(httpErrors.OK.status)
            .send({ projectId: result, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })

});


router.delete('/deleteproject', bodyParser, function (req, res, next) {
    let projectData = req.query.projectId;
    projectLibrary.deleteProjectdata(projectData, req.decoded).then(result => {
        res.status(httpErrors.OK.status)
            .send({ projectId: projectData, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })

});

module.exports = router;