const router = require("express").Router();
const bodyParser = require('../middlewares/bodyParser');
const httpErrors = require('../utils/httpErrors');
const formidable = require('formidable');
const profileLibrary = require('../library/profile-lib');
const fileParser = require('../helper/fileParser');


router.get('/getattributes', bodyParser, function (req, res) {
    profileLibrary.getProfiledata(req.decoded).then(projects => {
        res.status(httpErrors.OK.status).send({ result: projects, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});


router.put('/updateuser', bodyParser, function (req, res) {
    let updatingData = req.body.userDetails;
    profileLibrary.updateUser(req.decoded, updatingData).then(projects => {
        res.status(httpErrors.OK.status).send({ result: projects, status: httpErrors.OK.status });
    }, error => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});

router.post('/fileupload', function (req, res) {
    fileParser.imageUpload(req, res).then(filePath => {
        console.log(filePath);
        profileLibrary.parseprofileHierarchies(filePath, req.decoded).then(profileData => {
            console.log(profileData);
            res.status(httpErrors.OK.status).send({ image: filePath, status: httpErrors.OK.status });
        })
    }).catch(err => {
        res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
    })
});

module.exports = router;
