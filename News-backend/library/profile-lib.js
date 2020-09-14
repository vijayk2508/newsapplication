const profileData = require('../data/userProfile-data');
const multer = require('multer');

exports.getProfiledata = (userData) => {
    return new Promise((resolve, reject) => {
        profileData.getuserProfile(userData).then(result => {
            return resolve(result);
        })
    });
};


exports.updateUser = (userData, updatingData) => {
    return new Promise((resolve, reject) => {
        profileData.updatinguser(userData, updatingData).then(result => {
            return resolve(result);
        })
    });
};

exports.parseprofileHierarchies = (filePath, userData) => {
    return new Promise((resolve, reject) => {
        profileData.imgupload(filePath, userData).then(result => {
            return resolve(result);
        })
    });
};