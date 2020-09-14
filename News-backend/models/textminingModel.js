const Sequelize = require('sequelize');
const db = require('../db/db');
const mongoose = require('mongoose')

exports.textminingCreation = db.define('TextMining', {
    //  id: {
    //    type: Sequelize.INTEGER,
    //     allowNull: false,
    //     primaryKey:true,
    //     autoIncrement:true
    // },
    textMiningId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    projectUuid: {
        type: Sequelize.STRING,
        allowNull: false
    },
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    updatedAt: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    textminingType: {
        type: Sequelize.STRING,
        allowNull: true
    },
    modelId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    modelName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    domain: {
        type: Sequelize.STRING,
        allowNull: true
    },
    tabname: {
        type: Sequelize.STRING,
        allowNull: true
    },
    extractionFields: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true,
    tableName: 'TextMining',
    timestamps: false
})


exports.GetTextminingSchema = (tableName) => {
    

    const TextminingSchema = new mongoose.Schema({
        _id: Object,
        catid: String,
        keywordid: String,
        projectId: String,
        cardid: String
    });

    const Textmining = mongoose.model(tableName, TextminingSchema);
    mongoose.connection.deleteModel(tableName);

    return Textmining;
}

// exports.GetTextminingSchema = (modelname, collection) => {
//     return mongoose.model(modelname, new mongoose.Schema({}, { strict: false, toJSON: true, collection: collection }));
// }