const db = require('../db/db');
const Sequelize = require('sequelize');
const mongoose = require("mongoose");
exports.GetVocabularySchema = (tableName) => {
    const mongoose = db.mongoose
    const VocabularySchema = new mongoose.Schema({
        _id: Object,
        catid: String,
        keywordid: String,
        projectId: String,
        cardid: String
    });
    const Vocabulary = mongoose.model(tableName, VocabularySchema);
    mongoose.connection.deleteModel(tableName);
    return Vocabulary;
}

exports.DeleteKeywordModel = (collectionName,collection) => {
    return mongoose.model(collectionName, new mongoose.Schema({}, { strict: false, toJSON: true, collection: collection }));
}

exports.seqVocabulary = db.define('vocabulary', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    vocabularyId: {
        type: Sequelize.STRING,
        allowNull: true
    },
    vocabularyName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    version: {
        type: Sequelize.STRING,
        allowNull: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    vocabularyType: {
        type: Sequelize.STRING,
        allowNull: true
    },
    industry: {
        type: Sequelize.STRING,
        allowNull: true
    },
    language: {
        type: Sequelize.STRING,
        allowNull: true
    },
    location: {
        type: Sequelize.STRING,
        allowNull: true
    },
    autofillStatus: {
        type: Sequelize.STRING,
        allowNull: true
    },
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tabname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    projectId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    createddate: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    subjectareas: {
        type: Sequelize.STRING,
        allowNull: true
    },
}, {
    freezeTableName: true,
    tableName: 'vocabulary',
    timestamps: false
})
// module.exports = User;
/*

SELECT TOP (1000)
       [id]
      ,[vocabularyId]
      ,[vocabularyName]
      ,[version]
      ,[description]
      ,[vocabularyType]
      ,[industry]
      ,[language]
      ,[location]
      ,[autofillStatus]
      ,[createdBy]
      ,[tabname]
      ,[projectId]
      ,[createddate]
      ,[subjectareas]
  FROM [DMX].[dbo].[vocabulary]

  //new Date().getTime()

  dialectOptions: {
    supportBigNumbers: true,
    bigNumberStrings: true
  }

*/