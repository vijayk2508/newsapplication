const profileQuery = require("./queries/profile-query");
const profileModel = require("../models/User");
const projectModel = require("../models/project");
const projectSchema = require('../models/user');
const sequelizeproject = projectSchema.validateUser;
const Sequelize = require('sequelize');
const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const server = http.createServer();
const config = require("../env/env");
const multer = require('multer');
let countryObj = [];
const PromiseFtp = require('promise-ftp');

exports.getuserProfile = (userData) => {
    return new Promise(async (resolve, reject) => {
        projectModel.getProjects.query(profileQuery.getProfileQuery(userData.userId)).then(([results, metadata]) => {
            let data = {};
            if (results.length) {
                projectModel.getProjects.query(profileQuery.getdistinctcountry()).then((result, metadata) => {
                    if (result[0].length > 0) {
                        let countrydata = result[0];
                        let countryArray = {};
                        for (let i = 0; i < countrydata.length; i++) {
                            let countryvalue = countrydata[i].countryId;
                            let country = countrydata[i].countryName
                            projectModel.getProjects.query(profileQuery.getdistinctstate(countryvalue)).then((stateValue, metadata) => {
                                if (stateValue[0].length > 0) {
                                    let stateData = stateValue[0];
                                    let stateArray = {};
                                    for (let j = 0; j < stateData.length; j++) {
                                        let cityArray = [];
                                        let stateValues = stateData[j].stateId;
                                        let state = stateData[j].stateName;
                                        projectModel.getProjects.query(profileQuery.getcitybyId(stateValues)).then((cityValue, metadata) => {
                                            if (cityValue[0].length > 0) {
                                                let cityData = cityValue[0];
                                                for (let k = 0; k < cityData.length; k++) {
                                                    let cityNmae = cityData[k].cityname;
                                                    cityArray.push(cityNmae);
                                                }
                                                stateArray[state] = cityArray;
                                                countryArray[country] = stateArray;
                                                countryObj.push(countryArray);
                                            }
                                        })
                                        if (Object.keys(countryObj).length != 0) {
                                            // console.log(countryObj[0])

                                            data =
                                                {
                                                    city: results[0].city,
                                                    country: results[0].country,
                                                    email: results[0].email,
                                                    empId: results[0].empId,
                                                    image: results[0].image,
                                                    name: results[0].name,
                                                    phoneNumber: results[0].phoneNumber,
                                                    stateValue: results[0].stateValue,
                                                    countryDetails: countryObj[0]
                                                }
                                            return (resolve(data));
                                        }
                                    }


                                }
                                else { }
                            });
                        }
                    } else { }
                });
            }
        }), err => { console.log(err) }
    })
}

exports.updatinguser = async (userData, updatingUser) => {
    let userid = userData.userId;
    return new Promise(async (resolve, reject) => {
        let editcurrentProject = edituser(userid, updatingUser);
        return resolve(userid)
    });
}


let edituser = (userid, updatingUser) => {
    console.log(updatingUser);
    let cityName = updatingUser.city;
    projectModel.getProjects.query(profileQuery.getcityNamebyId(cityName)).then((results, metadata) => {
        let updatedCityid = results[0][0].cityId;
        return new Promise(async (resolve, reject) => {
            projectSchema.validateUser.update({
                orgUserName: updatingUser.name,
                orguserEmail: updatingUser.email,
                PhoneNumber: updatingUser.phoneNumber,
                cityId: updatedCityid
            }, {
                where: {
                    orgUserId: userid,
                }
            }).then(async (results) => {
                return resolve(userid)
            }).catch(function (err) {
                console.log("create failed with error: " + err);
                return (resolve(err));
            });
        });
    })
}

exports.imgupload = (filePath, userData) => {
    return new Promise(async (resolve, reject) => {
        projectSchema.validateUser.update({
            userProfileUrl: filePath
        }, {
            where: {
                orgUserId: userData.userId,
            }
        }).then(async (results) => {
            return resolve()
        }).catch(function (err) {
            console.log("create failed with error: " + err);
            return (resolve(err));
        });
    });
};

exports.uploadImage = () => {

}


let newFileUpload = function (oldpath, fileName, next) {

    // sftp settings  

    const Client = require('ftp');
    console.log('CONNECTING...')
    const c = new Client();
    c.connect({
        host: "172.16.20.57",
        port: 22,
        user: "pcadmin",
        password: "!etl_dmx_pro!_admin",
        debug: console.log
    });
    let downloadurl = "http://" + c.options.host + ':' + config.port + '/myimages/' + fileName;
    let uploadurl = '172.16.20.57:3001/myimages/' + fileName;
    console.log(uploadurl);
    c.on('ready', function () {
        console.log('READY');
        c.put(oldpath, uploadurl, function (err) {
            if (err) { console.log('PUT err : ' + err); };
            c.end();
        });
    });
    // c.rename(oldpath, uploadurl, function (err) {
    //     if (err) throw err;
    //     // you may respond with another html page
    //     res.write('File uploaded and moved!');
    //     res.end();
    // });
    // let form = new formidable.IncomingForm();
    // form.parse(oldpath);
    // form.on('fileBegin', function (name, file) {
    //     file.path = __dirname + '/uploads/' + file.name;
    // });
    var ftp = new PromiseFtp();
    ftp.connect({ host: "172.16.20.57", user: "pcadmin", password: "!etl_dmx_pro!_admin" })
        .then(function (serverMessage) {
            return ftp.put(oldpath, uploadurl);
        }).then(function () {
            return ftp.end();
        });

    // connect to ftp server
    // var ftp = new Client();
    // let uploadfile = fs.createReadStream(oldpath);
    // ftp.on('ready', function() {
    //     uploadfile.on('data', function(buffer) {
    //         var segmentLength = buffer.length;
    //         uploadedSize += segmentLength;
    //         console.log("Progress:\t" + ((uploadedSize/f.size*100).toFixed(2) + "%"));
    //     });
    //     ftp.put(uploadfile, uploadurl, function(err) {
    //         if (err) throw err;
    //             ftp.end();
    //     });
    // });
    console.log(c);
    return downloadurl;
}

