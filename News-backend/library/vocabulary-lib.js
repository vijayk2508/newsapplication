const vocabulary = {};
const vocabularyData = require('../data/vocabulary-data');
const fileParser = require('../helper/fileParser');
const fs = require("fs");
const jwtValidator = require('../auth/jwtValidation');
const Promise = require("bluebird");
const mongoose = require('mongoose');
const VocabularySchema = require('../models/VocabularyModel');
const sequelizeVocabulary = VocabularySchema.seqVocabulary;
const KeywordsExtraction = require('../models/KeywordsExtractionModel');
const projectModel = require("../models/project");
const random = require('random')
const axios = require('axios');
const mammoth = require("mammoth");
const randomstring = require("randomstring");
const vocabularyQuery = require('../data/queries/vocabulary-query')


/* getVocabularyKeywordList start*/
vocabulary.getVocabularyKeywordList = (vocabularyId, projectId) => {
    return new Promise((resolve, reject) => {
        vocabularyData.getVocabularyList(vocabularyId, projectId).then(async result => {
            let tablename = result[0].tabname;
            let Vocabulary = VocabularySchema.GetVocabularySchema(tablename);
            let resKeywordExtractionList = await getVocabulary(Vocabulary);
            return resolve({ result: { children: resKeywordExtractionList } })

            // Vocabulary.find({}).then(items => {
            //     for (let item of items) {
            //         let itemData = FindByKeyWordID(item.keywordid)
            //         resKeywordExtractionList.push(itemData)
            //     }
            //     Promise.each(resKeywordExtractionList, function (item) {
            //         return Promise
            //     }).then(function (result) {
            //         let resArray = KeywordsExtractionList(result)

            //         return resolve(resArray);
            //     }).catch(function (rejection) {
            //         console.log("Catch: " + rejection);
            //     });
            // }).catch(err => {
            //     return reject({
            //         message: err.message || "Something went wrong."
            //     })
            // });
        })
    });
};


vocabulary.getVocabularyProject = (projectId) => {
    return new Promise(async (resolve, reject) => {
        await vocabularyData.getVocabularyProject(projectId).then(resultArray => {

            var arrItems = [];
            for (let itemCount of resultArray) {
                arrItems.push(getData(itemCount))
            }
            Promise.each(arrItems, function (item) {
                return Promise
            }).then((result) => {

                let data = {}
                for (let idx = 0; idx < result.length; idx++) {
                    let key = Object.keys(result[idx]);
                    data[[key]] = result[idx][[key]];
                }
                return resolve({ memberList: data, status: 200 });
            })
        })
    });
};


const getData = (itemCount) => {
    let dbConnection = mongoose.connection;
    return new Promise(async (resolve, reject) => {
        let tablename = itemCount.tabname;
        await dbConnection.collection(tablename).find({}).count().then((count) => {
            let data = {};
            let Vocabulary_Id = itemCount.vocabularyId;
            data[Vocabulary_Id] =
                {
                    id: itemCount.id,
                    tablename: tablename,
                    Vocabulary_Id: Vocabulary_Id,
                    VocabularyName: itemCount.vocabularyName,
                    Vocabulary_version: itemCount.version,
                    description: itemCount.description,
                    Vocabulary_Type: itemCount.vocabularyType,
                    Industry_type_terminologies: itemCount.industry,
                    language: itemCount.language,
                    terms: count,
                    location: itemCount.location,
                    autofillStatus: itemCount.autofillStatus,
                    createdBy: itemCount.createdBy,
                    tabname: itemCount.tabname,
                    projectId: itemCount.projectId,
                    createddate: itemCount.createddate,
                    subjectAreas: itemCount.subjectareas
                }
            return resolve(data);
        }, err => { return reject(err) });
    }, err => { return reject(err) })
}


const editData = (itemCount) => {
    let dbConnection = mongoose.connection;
    return new Promise(async (resolve, reject) => {
        let tablename = itemCount.tabname;
        await dbConnection.collection(tablename).find({}).count().then((count) => {
            let data = {};
            let Vocabulary_Id = itemCount.vocabularyId;
            data =
                {
                    id: itemCount.id,
                    tablename: tablename,
                    Vocabulary_Id: Vocabulary_Id,
                    VocabularyName: itemCount.vocabularyName,
                    Vocabulary_version: itemCount.version,
                    description: itemCount.description,
                    Vocabulary_Type: itemCount.vocabularyType,
                    Industry_type_terminologies: itemCount.industry,
                    language: itemCount.language,
                    terms: count,
                    location: itemCount.location,
                    autofillStatus: itemCount.autofillStatus,
                    createdBy: itemCount.createdBy,
                    tabname: itemCount.tabname,
                    projectId: itemCount.projectId,
                    createddate: itemCount.createddate,
                    subjectAreas: itemCount.subjectareas
                }
            return resolve(data);
        }, err => { return reject(err) });
    }, err => { return reject(err) })
}


vocabulary.CreateVocabulary = (data) => {
    return new Promise(async (resolve, reject) => {
        await sequelizeVocabulary.create({
            vocabularyId: data.Vocabulary_Id,
            vocabularyName: data.VocabularyName,
            version: data.Vocabulary_version,
            description: data.description,
            vocabularyType: data.Vocabulary_Type,
            industry: data.Industry_type_terminologies,
            language: data.language,
            location: data.location,
            autofillStatus: JSON.stringify(data.checkes),
            createdBy: data.createdBy,
            tabname: data.tabname,
            projectId: data.projectId,
            createddate: data.createddate,
            subjectareas: JSON.stringify(data.subjectAreas),
        }).then(results => {
            return (resolve(results));
        }).catch(function (err) {
            console.log("create failed with error: " + err);
            return (resolve(err));
        });

    })
};


vocabulary.deleteCard = (objString, data) => {
    let vocabularyId = objString[1];
    let projectId = objString[0];
    return new Promise((resolve, reject) => {
        vocabularyData.deletevocabularyQuery(vocabularyId, projectId, data).then(result => {
            return resolve(result);
        })
    });
};


vocabulary.deleteCardkeyword = (objString, data) => {
    let vocabularyId = objString.cardId;
    let projectId = objString.projectId;
    let deletekeyword = objString.deletedData;
    return new Promise((resolve, reject) => {
        vocabularyData.deletekeyword(vocabularyId, projectId, deletekeyword).then(result => {
            return resolve(result);
        })
    });
};


vocabulary.maualinsertoption = (objString, data) => {
    let cardid = objString.formData.cardId;
    let projectId = objString.formData.projectId;
    let insertobj = objString.formData.data;
    return new Promise(async (resolve, reject) => {
        projectModel.getProjects.query(vocabularyQuery.getVocabularyTableNameQuery(cardid, projectId)).then((results, metadata) => {

            tablename = results[0][0].tabname;
            let modelname = insertobj;
            let title = modelname.title;
            let query = {
                "title": title
            };
            let projection = {
                "title": "$title",
                "keywordid": "$keywordid",
                "_id": 0
            };
            let db = mongoose.connection;
            db.on("error", console.error.bind(console, "connection error"));
            db.once("open", function (callback) {
                console.log("Connection succeeded.");
            });
            let collection = db.collection('keywordsextraction');
            let cursor = collection.find(query).project(projection).toArray();
            Promise.each(cursor, function (item) {
                return Promise;
            }).then(function (result) {

                if (result.length > 0) {
                    let keywordid = result[0].keywordid;
                    let catid = randomstring.generate({ length: 7, charset: 'alphabetic' });
                    let db = mongoose.connection;
                    db.on("error", console.error.bind(console, "connection error"));
                    db.once("open", function (callback) {
                        console.log("Connection succeeded.");
                    });
                    let usercollection = db.collection(tablename);
                    let userdata = [{ keywordid, catid, cardid, projectId }];
                    usercollection.insertMany(userdata);
                }
                else {
                    let description = modelname.description;
                    let acronyms = modelname.acronyms;
                    let myantonymsdata = modelname.antonyms;// taken as array
                    let mysynonymsdata = modelname.synonyms;// taken as array
                    let synonyms = [];
                    for (let a = 0; a < mysynonymsdata.length; a++) {
                        synonyms.push(mysynonymsdata[a]); //
                    }
                    let antonyms = [];
                    for (let a = 0; a < myantonymsdata.length; a++) {
                        antonyms.push(myantonymsdata[a]); //
                    }
                    let mytags = modelname.tags;
                    let Tags = [];
                    for (let a = 0; a < mytags.length; a++) {
                        Tags.push(mytags[a]);
                    }
                    let frequency = modelname.frequency;
                    let id = modelname.id;
                    let relevance = modelname.relevance;
                    let url = modelname.url;
                    let groupname = modelname.group_name;
                    let rels = modelname.rels;
                    let category = [];
                    let keywordid = randomstring.generate({ length: 7, charset: 'alphabetic' });
                    let catid = randomstring.generate({ length: 7, charset: 'alphabetic' });
                    category.push({ keywordid: keywordid, catid: catid, cat: groupname });
                    let docs = [{ keywordid, antonyms, synonyms, frequency, id, category, relevance, title, url, acronyms, rels, Tags, description }];
                    let db = mongoose.connection;
                    db.on("error", console.error.bind(console, "connection error"));
                    db.once("open", function (callback) {
                        console.log("Connection succeeded.");
                    });
                    let collection = db.collection('keywordsextraction');
                    let doc1 = docs;
                    collection.insert(doc1);
                    let usercollection = db.collection(tablename);
                    let userdata = [{ keywordid, catid, cardid, projectId }];
                    usercollection.insert(userdata);
                }
                let reskeywordList = vocabulary.getVocabularyKeywordList(cardid, projectId)
                return (resolve(reskeywordList));
            });
        }, err => { console.log(err) })
    })
};




vocabulary.parseHierarchies = (fields, files) => {
    return new Promise((resolve, reject) => {

        fileParser.csvParser(files.file.path, files.file.name);
        vocabularyData.fileExtraction(fields, files.file.path, files.file.name).then(result => {
            return resolve(result);
        })
    });
};

vocabulary.GetListChart = (Vocabulary_Id, projectId) => {
    return new Promise((resolve, reject) => {
        vocabularyData.getVocabularyList(Vocabulary_Id, projectId).then(async result => {
            let tablename = result[0].tabname;
            let vocabularyname = result[0].vocabularyName;
            let Vocabulary = VocabularySchema.GetVocabularySchema(tablename);
            let promisedDocs = await getVocabulary(Vocabulary);
            let arrCatagories = []
            promisedDocs.map(eachCategory => {
                if (!arrCatagories.filter(d => d.name === eachCategory['categoryName']).length) {
                    arrCatagories.push({ name: eachCategory['categoryName'], id: eachCategory['catid'], children: [] })
                }
            })
            let resultObject = {
                name: vocabularyname,
                id: vocabularyname,
                children: [],
                status: 200
            }
            promisedDocs.map(eachObj => {
                arrCatagories.map(eachCat => {
                    if (eachObj['categoryName'] === eachCat['name']) {
                        eachCat['children'].push({
                            name: eachObj.title,
                            id: eachObj.keywordid,
                            parentId: eachCat.id,
                        })
                    }
                })
            })
            resultObject['children'] = arrCatagories;
            return (resolve(resultObject))
        })
    });
}


const getVocabulary = async (Vocabulary) => {
    return await Vocabulary.find({}, { keywordid: 1, _id: 0 }).lean().exec().then(async resultArr => {
        return Promise.map(resultArr, (elem) => {
            return KeywordsExtraction.KeywordsExtractionModel.aggregate([
                {
                    "$match": { "keywordid": elem.keywordid }
                },
                {
                    "$unwind": "$category"
                },
                {
                    "$project": {
                        "group_name": "$category.cat",
                        "keywordid": "$keywordid",
                        "catid": "$category.catid",
                        "title": "$title",
                        "antonyms": "$antonyms",
                        "synonyms": "$synonyms",
                        "count": "$frequency",
                        "tags": [],
                        "description":"$description",
                        "acronyms": "$acronyms"
                    }
                }
            ]).then(resultArrObj => {
                return resultArrObj[0]
            })
        }).then(returnData => { return returnData })
    })


    // return await Vocabulary.find({}, { keywordid: 1, _id: 0 }).lean().then(resultArr => {
    //     return Promise.map(resultArr, (elem) => {
    //         return KeywordsExtraction.KeywordsExtractionModel.findOne({ keywordid: elem.keywordid }, { _id: 0 }).lean().then(resultData => {
    //             return resultData;
    //         })
    //     }).then(returnData => { return returnData })
    // });
    // return promisedDocs;
}



vocabulary.UpdateVocabulary = (data) => {
    return new Promise(async (resolve, reject) => {
        await sequelizeVocabulary.update({
            vocabularyName: data.VocabularyName,
            version: data.Vocabulary_version,
            description: data.description,
            vocabularyType: data.Vocabulary_Type,
            industry: data.Industry_type_terminologies,
            language: data.language,
            location: data.location,
            autofillStatus: JSON.stringify(data.autofillStatus),
            tabname: data.tabname,
            subjectAreas: JSON.stringify(data.subjectAreas),
            createdBy: data.createdBy,
        }, {
            where: {
                vocabularyId: data.Vocabulary_Id,
                projectId: data.projectId,
            }
        }).then(async (results) => {
            await vocabularyData.getVocabularyList(data.Vocabulary_Id, data.projectId).then(result => {
                let arrItems = [];
                for (let itemCount of result) {

                    arrItems.push(editData(itemCount))
                }
                Promise.each(arrItems, function (item) {
                    return Promise
                }).then((resObject) => {
                    return resolve(resObject);
                })
            }).catch(function (err) {
                console.log("create failed with error: " + err);
                return (resolve(err));
            });
        }).catch(function (err) {
            console.log("create failed with error: " + err);
            return (resolve(err));
        });
    })
};
/* getVocabularyProject end*/







module.exports = vocabulary;