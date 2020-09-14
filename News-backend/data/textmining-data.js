const mongoose = require("mongoose");
const _ = require("underscore")._;
const shortId = require("shortid");
const fs = require("fs");
const Guid = require('guid');
const random = require('random')
const axios = require('axios');
var mammoth = require("mammoth");
var Promise = require("bluebird");
var randomstring = require("randomstring");
const textminingQuery = require("./queries/textmining-query");
const projectModel = require("../models/project");
const textminingModel = require("../models/textminingModel");
const commomObjCreater = require("../helper/commonObjFormation");
const timeStamp = require("../helper/unixTimeConverter");
const db = require("../db/db");
const sequelizeTextminingModel = textminingModel.textminingCreation;
var Excel = require('exceljs');
exports.Createtextmining = (data) => {
    let guid = Guid.create();
    let textMiningId = guid.value
    const value = random.integer(1, 1000);
    let tablename = "Textmining_" + "" + value;
    return new Promise(async (resolve, reject) => {
        await textminingModel.textminingCreation.create({
            textMiningId: textMiningId,
            modelName: data.List_name,
            description: data.Description,
            domain: data.Domain,
            textminingType: JSON.stringify(data.Tags),
            extractionFields: JSON.stringify(data.Extraction_fields),
            createdBy: data.createdBy,
            tabname: tablename,
            projectUuid: data.ProjectID,
            updatedAt: timeStamp.UNIXTIMESTAMP,
            createdAt: timeStamp.UNIXTIMESTAMP,
        }).then(results => {
            let resData = {}
            resData.id = results.id;
            resData.textMiningId = results.textMiningId
            resData.List_name = results.modelName;
            resData.Description = results.description;
            resData.Domain = results.domain;
            resData.Tags = JSON.parse(results.textminingType)
            resData.Extraction_fields = JSON.parse(results.extractionFields);
            resData.createdBy = results.createdBy;
            resData.tabname = results.tabname;
            resData.ProjectID = results.projectUuid;
            resData.createdAt = results.createdAt;
            resData.updatedAt = results.updatedAt;
            return (resolve(resData));
        }).catch(function (err) {
            console.log("create failed with error: " + err);
            return (resolve(err));
        });
    })
};


exports.createTextminingQuery = (userId, textminingInfo) => {
    return new Promise(async (resolve, reject) => {
        let model_children = textminingInfo.children.Model_info;
        let updatedAt = timeStamp.UNIXTIMESTAMP;
        let List_name = model_children.List_name;
        guid = Guid.create();
        let textMiningId = guid.value;
        let Description = model_children.Description;
        let Domain = model_children.Domain;
        let Tags = JSON.stringify(model_children.Tags);
        let ProjectID = textminingInfo.children.ProjectID;
        let Extraction_fields = JSON.stringify(textminingInfo.children.Extraction_fields);
        projectModel.getProjects.query(textminingQuery.updateTextmining(ProjectID, textMiningId, Description, userId, List_name, Domain, Tags, Extraction_fields, updatedAt));
        projectModel.getProjects.query(textminingQuery.getTextminingdetails(textMiningId, ProjectID, userId)).then((results, metadata) => {
            let jsonArr = results[0][0];
            let data = {};
            let textMiningId = jsonArr.textMiningId;
            let obj = {};
            obj['id'] = jsonArr.id,
            obj['textMiningId'] = textMiningId,
            obj['List_name'] = jsonArr.List_name,
            obj['Description'] = jsonArr.description,
            obj['Domain'] = jsonArr.Domain,
            obj['Tags'] = jsonArr.Tags != "" ? JSON.parse(jsonArr.Tags) : [],
            obj['createdBy'] = jsonArr.createdBy,
            obj['tabname'] = jsonArr.tabname,
            obj['ProjectID'] = jsonArr.ProjectID,
            obj['createdAt'] = jsonArr.createdAt,
            obj['updatedAt'] = jsonArr.updatedAt,
            obj['Extraction_fields'] = jsonArr.Extraction_fields != "" ? JSON.parse(jsonArr.Extraction_fields) : []
            return resolve(obj);
        }, err => { console.log(err) })
    })
};

exports.gettextminingQuery = (projectId, userId) => {
    return new Promise(async (resolve, reject) => {
        projectModel.getProjects.query(textminingQuery.gettextmining(projectId, userId.userId)).then((results, metadata) => {
            let objValue = results[0];
            if (objValue.length) {
                let data = {}
                for (let idx = 0; idx < objValue.length; idx++) {
                    let jsonArr = objValue[idx];
                    let textMiningId = jsonArr.textMiningId;
                    data[textMiningId] =
                        {
                            id: jsonArr.id,
                            textMiningId: textMiningId,
                            List_name: jsonArr.List_name,
                            Description: jsonArr.Description,
                            Domain: jsonArr.Domain,
                            Tags: jsonArr.Tags != "" ? JSON.parse(jsonArr.Tags) : [],
                            createdBy: jsonArr.createdBy,
                            tabname: jsonArr.tabname,
                            ProjectID: jsonArr.ProjectID,
                            createdAt: jsonArr.createdAt,
                            updatedAt: jsonArr.updatedAt,
                            Extraction_fields: jsonArr.Extraction_fields != "" ? JSON.parse(jsonArr.Extraction_fields) : [],
                        }
                }
                console.log(data,"::::::::::::::::::::::::::::::=>---->textmining")
                return resolve(data);
            }else{
                return resolve();
            }
        }, err => { console.log(err) })
    })
};


exports.updateTextminingQuery = (textminingInfo, userId) => {
    return new Promise(async (resolve, reject) => {
        let model_children = textminingInfo.children.Model_info;
        let updatedAt = timeStamp.UNIXTIMESTAMP;
        let List_name = model_children.List_name;
        let textMiningId = model_children.textMiningId;
        let Description = model_children.Description;
        let Domain = model_children.Domain;
        let Tags = JSON.stringify(model_children.Tags);
        let ProjectID = textminingInfo.children.ProjectID;
        console.log(ProjectID,"::::::::::::::::::::::::::::::========>");
        let Extraction_fields = JSON.stringify(textminingInfo.children.Extraction_fields);
        projectModel.getProjects.query(textminingQuery.updateTextmining(ProjectID, textMiningId, Description, userId, List_name, Domain, Tags, Extraction_fields, updatedAt));
        projectModel.getProjects.query(textminingQuery.getTextminingdetails(textMiningId, ProjectID, userId)).then((results, metadata) => {
            let jsonArr = results[0][0];
            let data = {};
            let textMiningId = jsonArr.textMiningId;
            let obj = {};
            obj['id'] = jsonArr.id,
            obj['textMiningId'] = textMiningId,
            obj['List_name'] = jsonArr.List_name,
            obj['Description'] = jsonArr.description,
            obj['Domain'] = jsonArr.Domain,
            obj['Tags'] = jsonArr.Tags != "" ? JSON.parse(jsonArr.Tags) : [],
            obj['createdBy'] = jsonArr.createdBy,
            obj['tabname'] = jsonArr.tabname,
            obj['ProjectID'] = jsonArr.ProjectID,
            obj['createdAt'] = jsonArr.createdAt,
            obj['updatedAt'] = jsonArr.updatedAt,
            obj['Extraction_fields'] = jsonArr.Extraction_fields != "" ? JSON.parse(jsonArr.Extraction_fields) : []
            return resolve(obj);
        }, err => { console.log(err) })
    })
};


exports.deleteTextminingQuery = (textminingId, projectId, userId) => {
    return new Promise(async (resolve, reject) => {
        projectModel.getProjects.query(textminingQuery.deleteTextmining(textminingId, projectId, userId)).then((results, metadata) => {
            return (resolve(results));
        }, err => { console.log(err) })
    })
};



exports.fileExtraction = (fields, filesfilepath, filesfilename) => {
    return new Promise(async (resolve, reject) => {
        let cardid = fields['cardId']
        let projectId = fields['projectId'];
        projectModel.getProjects.query(textminingQuery.getTableNameTable(cardid, projectId)).then((results, metadata) => {
            let tablename = results[0][0].tabname;
            mammoth.extractRawText({ path: filesfilepath })
                .then(function (result) {
                    let text = result.value; // The raw text
                    let messages = result.messages;
                    let objToJson = text;
                    let person = {}; let object = {};
                    let key = "text";
                    let obj = "data";
                    person[key] = objToJson;
                    object[obj] = person;
                    axios.post('http://172.16.20.57:5001/text/extraction', object).then(function (response) {
                        console.log(response);
                        resp = response.data;
                        let returndata = resp["result"];
                        let details = returndata;
                        let cluster = details.clusters;
                        let db = mongoose.connection;
                        db.on("error", console.error.bind(console, "connection error"));
                        db.once("open", function (callback) {
                            console.log("Connection succeeded.");
                        });
                        let collection = db.collection('keywordsextraction');
                        for (let i = 0; i < cluster.length; i++) {
                            let clusterdata = cluster[i];
                            let country = Object.keys(clusterdata)
                            let capital = clusterdata[country];
                            for (let j = 0; j < capital.length; j++) {
                                let title = capital[j].title;
                                let query = {
                                    "title": title
                                };
                                let projection = {
                                    "title": "$title",
                                    "keywordid": "$keywordid",
                                    "_id": 0
                                };
                                let cursor = collection.find(query).project(projection).toArray();
                                Promise.each(cursor, function (item) {
                                    return Promise;
                                }).then(function (result) {
                                    if (result.length > 0) {
                                        let keywordid = result[0].keywordid;
                                        let catid = randomstring.generate({ length: 7, charset: 'alphabetic' });
                                        let usercollection = db.collection(tablename);
                                        let userdata = [{ keywordid, catid, cardid, projectId }];
                                        usercollection.insertMany(userdata);
                                    }
                                    else {
                                        let keywordid = randomstring.generate({ length: 7, charset: 'alphabetic' });
                                        let catid = randomstring.generate({ length: 7, charset: 'alphabetic' });
                                        let myantonymsdata = capital[j].antonyms;// taken as array
                                        let mysynonymsdata = capital[j].synonyms;// taken as array
                                        let synonyms = [];
                                        for (let a = 0; a < mysynonymsdata.length; a++) {
                                            synonyms.push(mysynonymsdata[a]); //                                  
                                        }
                                        let antonyms = [];
                                        for (let a = 0; a < myantonymsdata.length; a++) {
                                            antonyms.push(myantonymsdata[a]); //
                                        }
                                        let frequency = capital[j].count;
                                        let entity = "entity";
                                        let id = capital[j].id;
                                        let relevance = capital[j].weightage;
                                        let acronyms = capital[j].acronyms;
                                        let category = [];
                                        let groupname = capital[j].group_name;
                                        category.push({ keywordid: keywordid, catid: catid, cat: groupname });
                                        let description = capital[j].description;
                                        let tags=[];
                                        let docs = [{ keywordid, antonyms, synonyms, frequency, entity, id, relevance, title, category, description, acronyms,tags }];
                                        collection = db.collection('keywordsextraction');
                                        let doc1 = docs;
                                        collection.insert(doc1);
                                        let usercollection = db.collection(tablename);
                                        let userdata = [{ keywordid, catid, cardid, projectId }];
                                        usercollection.insertMany(userdata);
                                    }
                                }).catch(function (rejection) {
                                    console.log("Catch: " + rejection);
                                });
                            }
                        }
                        for (let idx = 0; idx < details.children.length; idx++) {
                            details.children[idx].frequency = details.children[idx].count;
                            details.children[idx].relevance = details.children[idx].weightage;
                        }
                        for (let i = 0; i < details.clusters.length; i++) {
                            let objCluster = details.clusters[i];
                            let clusterKeyName = Object.keys(objCluster);
                            let groupname = clusterKeyName[0];
                            let clusterItem = details.clusters[i][[groupname]];
                            for (let j = 0; j < clusterItem.length; j++) {
                                {
                                    clusterItem[j].frequency = clusterItem[j].count
                                    clusterItem[j].relevance = clusterItem[j].weightage
                                }
                            }
                        }
                        return (resolve(details));
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).done();
        }, err => { console.log(err) })
    })
};


exports.textExtraction = (projectid, cardId, text, reffile, filename) => {
    return new Promise(async (resolve, reject) => {
        let cardid = cardId
        let projectId = projectid;
        projectModel.getProjects.query(textminingQuery.getTableNameTable(cardid, projectId)).then((results, metadata) => {
            let tablename = results[0][0].tabname;
            axios.post('http://172.16.20.57:5001/text/extraction', text).then(function (response) {
                resp = response.data;
                let returndata = resp["result"];
                let details = returndata;
                let cluster = details.clusters;
                let clusterdata = cluster[0];
                let db = mongoose.connection;
                db.on("error", console.error.bind(console, "connection error"));
                db.once("open", function (callback) {
                    console.log("Connection succeeded.");
                });
                let collection = db.collection('keywordsextraction');
                for (let i = 0; i < cluster.length; i++) {
                    let clusterdata = cluster[i];
                    let country = Object.keys(clusterdata)
                    let capital = clusterdata[country];
                    for (let j = 0; j < capital.length; j++) {
                        let title = capital[j].title;
                        let query = {
                            "title": title
                        };
                        let projection = {
                            "title": "$title",
                            "keywordid": "$keywordid",
                            "_id": 0
                        };
                        let cursor = collection.find(query).project(projection).toArray();
                        Promise.each(cursor, function (item) {
                            return Promise;
                        }).then(function (result) {
                            if (result.length > 0) {
                                let keywordid = result[0].keywordid;
                                let catid = randomstring.generate({ length: 7, charset: 'alphabetic' });
                                let usercollection = db.collection(tablename);
                                let userdata = [{ keywordid, catid, cardid, projectId }];
                                usercollection.insertMany(userdata);
                            }
                            else {
                                let keywordid = randomstring.generate({ length: 7, charset: 'alphabetic' });
                                let catid = randomstring.generate({ length: 7, charset: 'alphabetic' });
                                let myantonymsdata = capital[j].antonyms;// taken as array
                                let mysynonymsdata = capital[j].synonyms;// taken as array
                                let synonyms = [];
                                for (let a = 0; a < mysynonymsdata.length; a++) {
                                    synonyms.push(mysynonymsdata[a]); //
                                }
                                let antonyms = [];
                                for (let a = 0; a < myantonymsdata.length; a++) {
                                    antonyms.push(myantonymsdata[a]); //
                                }
                                let frequency = capital[j].count;
                                let entity = "entity";
                                let id = capital[j].id;
                                let relevance = capital[j].weightage;
                                let acronyms = capital[j].acronyms;
                                let category = [];
                                let groupname = capital[j].group_name;
                                category.push({ keywordid: keywordid, catid: catid, cat: groupname });
                                let description = capital[j].description;
                                let tags=[];
                                let docs = [{ keywordid, antonyms, synonyms, frequency, entity, id, relevance, title, category, description, acronyms,tags }];
                                collection = db.collection('keywordsextraction');
                                let doc1 = docs;
                                collection.insert(doc1);
                                let usercollection = db.collection(tablename);
                                let userdata = [{ keywordid, catid, cardid, projectId }];
                                usercollection.insertMany(userdata);
                            }
                        }).catch(function (rejection) {
                            console.log("Catch: " + rejection);
                        });
                    }
                }
                for (let idx = 0; idx < details.children.length; idx++) {
                    details.children[idx].frequency = details.children[idx].count;
                    details.children[idx].relevance = details.children[idx].weightage;
                }
                for (let i = 0; i < details.clusters.length; i++) {
                    let objCluster = details.clusters[i];
                    let clusterKeyName = Object.keys(objCluster);
                    let groupname = clusterKeyName[0];
                    let clusterItem = details.clusters[i][[groupname]];
                    for (let j = 0; j < clusterItem.length; j++) {
                        {
                            clusterItem[j].frequency = clusterItem[j].count
                            clusterItem[j].relevance = clusterItem[j].weightage
                        }
                    }
                }
                return (resolve(details));
            })
                .catch(function (error) {
                    return (reject(error));
                    console.log(error);
                });


        }, err => { console.log(err) })
    })
};


exports.getTextminingList = (textMiningId, projectId) => {
    return new Promise(async (resolve, reject) => {
        await sequelizeTextminingModel.findAll({
            where: {
                textMiningId: textMiningId,
                projectUuid: projectId,
            }
        }).then(results => {
            for (let idx = 0; idx < results.length; idx++) {
                results[idx].extractionFields = JSON.parse(results[idx].extractionFields);
            }
            return (resolve(results));
        }).catch(function (err) {
            console.log("create failed with error: " + err);
            return (reject(err));
        });

    });
}


exports.addRowToNewExcel = (filepath, textminingExportdata) => {
    return new Promise(async (resolve, reject) => {
        // load exceljs module
    var workbook = new Excel.Workbook(); //create object of workbook
    //add sheet to workbook
    var newSheet = workbook.addWorksheet('TestData');
   
      //Create an array  to enter row
    var rowData = textminingExportdata;
  
    //use addRow to write row on created sheet
    newSheet.addRow(rowData);
 
    //use write file function to create new file
    workbook.xlsx.writeFile(filepath) 
        .then(function () {
            console.log("excel file created successfully");
        });
        return resolve(filepath)
    });
    
}