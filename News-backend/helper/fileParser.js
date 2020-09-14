const csvParse = require("csv-parse");
const mongoose = require("mongoose");
const taxonomyData = require("../data/taxonomy-data");
const fs = require("fs");
const multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(callback,"hahaha dest")
        callback(null, './bin/wwwroot/ProfileImages/');
    },
    filename: function (req, file, callback) {
        console.log(file, "hahaha filename");
        callback(null, file.originalname);
    }
});

var upload = multer({ storage: storage }).single('file');

exports.csvParser = async (file, name) => {
    let fileName = name.split(".");
    let rows = [];
    // const taxonomyFileImport = new mongoose.model(fileName[0], new mongoose.Schema({}, { strict: false }));
    return await new Promise(async (resolve, reject) => {
        fs.createReadStream(file).pipe(csvParse({ columns: true })).on('data', (row, col) => {
            rows.push(row);
        }).on('error', (err) => { return reject(err) }).on('end', () => { }).on("end", () => {
            console.log("error::::::=>")
            return resolve(rows);
        });
    })
};

exports.imageUpload = (req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, function (err,res) {
            console.log(err,res)
            if (err) {
                console.log(err);
                return reject();
            } else {
                return resolve(`http://172.16.20.62:3001/static/wwwroot/profileimages/${req.file.originalname}`)
            }
        })
    })
}