const Guid = require('guid');
const random = require('random')
const axios = require('axios');
var mammoth = require("mammoth");
const fs = require('fs');
var Promise = require("bluebird");
const mongoose = require("mongoose");
var randomstring = require("randomstring");
var path = require('path')
const pdf = require('pdf-parse');
const projectModel = require("../models/project");
const vocabularyQuery = require("./queries/vocabulary-query");
const VocabularySchema = require('../models/VocabularyModel');
const VocabularyLib = require('../library/vocabulary-lib');
const sequelizeVocabulary = VocabularySchema.seqVocabulary;
const csv = require('csv-parser');
const mongoXlsx = require('mongo-xlsx');
const xlsx = require('xlsx');
let getVocabularyList = (Vocabulary_Id, projectId) => {
    return new Promise(async (resolve, reject) => {
        await sequelizeVocabulary.findAll({
            where: {
                vocabularyId: Vocabulary_Id,
                projectId: projectId,
            }
        }).then(results => {
            for (let idx = 0; idx < results.length; idx++) {
                results[idx].autofillStatus = results[idx].autofillStatus != "" ? JSON.parse(results[idx].autofillStatus) : [];
                results[idx].subjectareas = results[idx].subjectareas != "" ? JSON.parse(results[idx].subjectareas) : [];
            }
            return (resolve(results));
        }).catch(function (err) {
            console.log("create failed with error: " + err);
            return (reject(err));
        });
    });
}

let getVocabularyTableName = (cardid, projectId) => {
    return new Promise(async (resolve, reject) => {
        projectModel.getProjects.query(vocabularyQuery.getVocabularyTableNameQuery(cardid, projectId)).then(([results, metadata]) => {
            if (results.length) {
                //return (resolve(commomObjCreater.getTaxonomyObj(results)));
                console.log(results)
                return (resolve(results));
            }
        }, err => { console.log(err) })
    })
};
let getVocabularyProject = (projectId) => {
    return new Promise(async (resolve, reject) => {
        await projectModel.getProjects.query(vocabularyQuery.getVocabularyProjectQuery(projectId)).then(([results, metadata]) => {
            if (results.length) {
                for (let idx = 0; idx < results.length; idx++) {
                   // results[idx].autofillStatus = JSON.parse(results[idx].autofillStatus);//jsonArr.Extraction_fields != "" ? JSON.parse(jsonArr.Extraction_fields) : []
                   // results[idx].subjectareas = JSON.parse(results[idx].subjectareas);
                    results[idx].autofillStatus=results[idx].autofillStatus != "" ? JSON.parse(results[idx].autofillStatus) : [];
                    results[idx].subjectareas = results[idx].subjectareas != "" ? JSON.parse(results[idx].subjectareas) : [];
                }

                return (resolve(results));
            }
        }, err => { console.log(err) })
    })
};


let deletevocabularyQuery = (vocabularyId, projectId, userId) => {
    return new Promise(async (resolve, reject) => {
        projectModel.getProjects.query(vocabularyQuery.deletevocabulary(vocabularyId, projectId, userId.userId)).then((results, metadata) => {
            return (resolve(results));
        }, err => { console.log(err) })
    })
};


let deletekeyword = (vocabularyId, projectId, deleteobj) => {
    return new Promise(async (resolve, reject) => {
        projectModel.getProjects.query(vocabularyQuery.getVocabularyTableNameQuery(vocabularyId, projectId)).then((results, metadata) => {
            let tablename = results[0][0].tabname;
            const deleteSchema = VocabularySchema.DeleteKeywordModel(`delete${tablename}`, tablename);
            deleteobj.map(eachKeyword => {
                deleteSchema.deleteOne({ keywordid: eachKeyword }).then(result => {
                    // return (resolve(deleteobj));
                }, err => { return reject(err) })
            });
            deleteModel(`delete${tablename}`);
            return (resolve(deleteobj));

            // deleteobj.forEach(element => {
            //     let delete_keyword = element;
            //     db.collection(tablename).deleteOne({ keywordid: delete_keyword }, function (err, obj) {
            //         if (err) throw err;
            //         db.close();
            //     });
            // })
            // return (resolve(deleteobj));
        }, err => { console.log(err) })
    })
};

let fileExtraction = (fields, filesfilepath, filesfilename) => {
    let ext = path.extname(filesfilename);
    return new Promise(async (resolve, reject) => {
        let cardid = fields['cardId']
        let projectId = fields['projectId'];
        projectModel.getProjects.query(vocabularyQuery.getVocabularyTableNameQuery(cardid, projectId)).then((results, metadata) => {
            let tablename = results[0][0].tabname;
            if (ext == '.doc' || ext == '.docx') {
                mammoth.extractRawText({ path: filesfilepath })
                    .then(function (result) {
                        let text = result.value; // The raw text
                        console.log(text);
                        let messages = result.messages;
                        let objToJson = text;
                        let person = {}; let object = {};
                        let key = "text";
                        let obj = "data";
                        person[key] = objToJson;
                        object[obj] = person;
                        console.log(object);
                        axios.post('http://172.16.20.57:5001/text/extraction', object).then(function (response) {
                            console.log(response);
                            resp = response.data;
                            let returndata = resp["result"];
                            let details = returndata;
                            let cluster = details.clusters;
                            console.log(cluster);
                            for (let i = 0; i < cluster.length; i++) {
                                let clusterdata = cluster[i];
                                let db = mongoose.connection;
                                db.on("error", console.error.bind(console, "connection error"));
                                db.once("open", function (callback) {
                                    console.log("Connection succeeded.");
                                });
                                let collection = db.collection('keywordsextraction');
                                for (let country of Object.keys(clusterdata)) {
                                    let capital = clusterdata[country];
                                    console.log(country, capital);
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
                                        console.log(cursor)
                                        Promise.each(cursor, function (item) {
                                            return Promise;
                                        }).then(function (result) {
                                            console.log(result.length)
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
                                                    //    console.log(synonyms);
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
                            let reskeywordList = VocabularyLib.getVocabularyKeywordList(cardid, projectId)
                            return (resolve(reskeywordList));
                        })
                            .catch(function (error) {
                                console.log(error);
                            });

                    })
                    .done();
            }
            else if (ext == '.pdf') {
                let dataBuffer = fs.readFileSync(filesfilepath);
                pdf(dataBuffer).then(function (data) {
                    let objToJson = data.text;
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
                        console.log(cluster);
                        for (let i = 0; i < cluster.length; i++) {
                            let clusterdata = cluster[i];
                            let db = mongoose.connection;
                            db.on("error", console.error.bind(console, "connection error"));
                            db.once("open", function (callback) {
                                console.log("Connection succeeded.");
                            });
                            let collection = db.collection('keywordsextraction');
                            for (let country of Object.keys(clusterdata)) {
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
                                            let tags=[]
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
                        let reskeywordList = VocabularyLib.getVocabularyKeywordList(cardid, projectId)
                        return (resolve(reskeywordList));
                        //return (resolve(details));
                    })
                        .catch(function (error) {
                            console.log(error);
                        });

                });

            }
            else if (ext == '.xlsx' || ext == '.xls') {
                let model = null;
                mongoXlsx.xlsx2MongoData(filesfilepath, model, function (err, mongoData) {
                    console.log('Mongo data:', mongoData);
                    let datavalue = []; let dt = {}; let dtcol = {};
                    for (let i = 0; i < mongoData.length; i++) {
                        let docs2 = [];
                        let workbook = xlsx.readFile(filesfilepath)
                        let sheetsList = workbook.SheetNames[i];
                        let first_sheet_name = workbook.SheetNames[i];
                        let eexceldata = mongoData[i];
                        dt[sheetsList] = mongoData[i];
                        console.log(dt);
                        datavalue = dt;
                        for (let country of Object.keys(eexceldata[0])) {
                            let capital = eexceldata[0][country];
                            console.log(country);
                            docs2.push(country);
                        }
                        dtcol[sheetsList] = docs2;
                    }
                    let returndata = {};
                    returndata["data"] = datavalue;
                    returndata["Coldata"] = dtcol;
                    returndata["status"] = 200;
                    return (resolve(returndata));
                });
            }
            else if (ext == '.csv') {
                let result = [];
                fs.createReadStream(filesfilepath)
                    .pipe(csv())
                    .on('data', (row) => {
                        console.log(row);
                        result.push(row);
                    })
                    .on('end', () => {
                        console.log('CSV file successfully processed');
                        return (resolve(result));
                       
                    });

            }

        }, err => { console.log(err) })
    })
};

const deleteModel = (modelName) => {
    mongoose.connection.deleteModel(modelName);;
}


module.exports = {
    getVocabularyList,
    deleteModel,
    fileExtraction,
    deletekeyword,
    deletevocabularyQuery,
    getVocabularyProject,
    getVocabularyTableName
}


