'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.hashPassword = (myPlaintextPassword) => {
    bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
        console.log(hash);
    });
}
exports.comparePassword = async (myPlaintextPassword,hash) => {
    await bcrypt.compare(myPlaintextPassword, hash, function (err, res) {
        return res;
    })
}