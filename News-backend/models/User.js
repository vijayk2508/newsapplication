const Sequelize = require('sequelize');
const db = require('../db/db');

exports.validateUser = db.define('org_user', {
    orguserEmail: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    orgUserId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    orgUserName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    PhoneNumber: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    userProfileUrl: {
        type: Sequelize.STRING,
        allowNull: false

    },
    cityId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    tableName: 'org_user'
})
// module.exports = User;