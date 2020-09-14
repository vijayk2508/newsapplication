const router = require('express').Router();
const bodyParser = require('../middlewares/bodyParser');
const httpErrors = require('../utils/httpErrors');
const authLibrary = require('../library/auth-lib');
const formidable = require('formidable');
router.post('/login', bodyParser, (req, res) => {
	authLibrary.login(req.body.email, req.body.password).then(isAuth => {
		res.status(httpErrors.OK.status).send({ token: isAuth, status: httpErrors.OK.status });
	}, error => {
		res.status(httpErrors.UNAUTHORIZED.status).send(httpErrors.UNAUTHORIZED);
	});
});

module.exports = router;