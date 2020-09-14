const jwtValidator = {};
const jwt = require("jsonwebtoken");
const fs = require("fs");
const privateKey = fs.readFileSync('private.pem');
const publicKey = fs.readFileSync('public.pem');
const httpErrors = require('../utils/httpErrors');

jwtValidator.validateToken = (req, res, next) => {
    let token = req.headers['authorization'];
    if (token) {
        let decoded = jwt.verify(token, publicKey, { algorithm: "RS256" }, function (err, decoded) {
            if (!err) {
                req.decoded = decoded;
                next();
            }
            else {
                res.status(httpErrors.UNAUTHORIZED.status).send({ message: "Token Expired", status: httpErrors.UNAUTHORIZED.status });;
            }
        });
    } else {
        console.log("wohoooo token expired hahaha");
        // res.sta
    }
}
jwtValidator.generateToken = (userDetails) => {
    return jwt.sign({ user: userDetails["orguserEmail"], userId: userDetails["orgUserId"], userName: userDetails["orgUserName"] }, privateKey, { expiresIn: "2d", algorithm: "RS256" });
}
module.exports = jwtValidator;