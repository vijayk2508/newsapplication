const textmining = {};
const textminingData = require('../data/textmining-data');
const fileParser = require('../helper/fileParser');
const fs = require("fs");
const jsonXlsx = require('icg-json-to-xlsx');
const path = require('path');
const jwtValidator = require('../auth/jwtValidation');
const exportFromJSON = require('export-from-json')
const textminingModel = require('../models/textminingModel');
const KeywordsExtraction = require('../models/KeywordsExtractionModel');
const Promise = require("bluebird");
var excel = require('excel4node');
var Excel = require('exceljs');
textmining.createProject = (req) => {
    return new Promise((resolve, reject) => {
        console.log("library", req.headers['authorization']);
        let token = jwtValidator.decodedToken(req.headers['authorization'])
    });
};

textmining.createTextminingdetails = (textminingInfo) => {
    return new Promise((resolve, reject) => {
        textminingData.Createtextmining(textminingInfo).then(result => {
            return resolve(result);
        })
    });
};

textmining.getProject = (req, textminingInfo) => {
    console.log("::::::::::::::::::::::::::::=>",req,"textmining")
    return new Promise((resolve, reject) => {
        textminingData.gettextminingQuery(req, textminingInfo).then(result => {
            return resolve(result);
        })
    });
};

textmining.editProject = (textminingInfo, userData) => {
    return new Promise((resolve, reject) => {
        textminingData.updateTextminingQuery(textminingInfo, userData.userId).then(result => {
            return resolve(result);
        })
    });
};

textmining.deleteCard = (textMiningId, projectId, userData) => {
    return new Promise((resolve, reject) => {
        textminingData.deleteTextminingQuery(textMiningId, projectId, userData.userId).then(result => {
            return resolve(result);
        })
    });
};

textmining.parseHierarchies = (fields, files) => {
    return new Promise((resolve, reject) => {
      
        fileParser.csvParser(files.file.path, files.file.name);
        textminingData.fileExtraction(fields, files.file.path, files.file.name).then(result => {
            return resolve(result);
        })
    });
};

textmining.parsetextHierarchies = (fields, files) => {
    return new Promise((resolve, reject) => {
    
        let fieldsToObject = JSON.parse(fields.text);
     
        fileParser.csvParser(files.refFile.path, files.refFile.name);
        textminingData.textExtraction(fieldsToObject.val.projectId, fieldsToObject.val.cardId, fieldsToObject.val.text, files.refFile.path, files.refFile.name).then(result => {
            return resolve(result);
        })
    });
};

// textmining.exportCard = (textminingInfo, userData) => {
//     return new Promise((resolve, reject) => {
//         const data = [textminingInfo[0]];
//         const fileName = 'download'
//         const exportType = 'xls'
//         const result = exportFromJSON({
//             data,
//             fileName,
//             exportType,
//             processor(content, type, fileName) {
//                 switch (type) {
//                     case 'txt':
//                         response.setHeader('Content-Type', 'text/plain')
//                         break
//                     case 'json':
//                         response.setHeader('Content-Type', 'text/plain')
//                         break
//                     case 'csv':
//                         response.setHeader('Content-Type', 'text/csv')
//                         break
//                     case 'xls':
//                         response.setHeader('Content-Type', 'application/vnd.ms-excel')
//                         break
//                 }
//                 response.setHeader('Content-disposition', 'attachment;filename=' + fileName)
//                 return content
//             }
//         })
//         response.write(content)
//         response.end()
//         return resolve(content);
//     });
// };

textmining.exportCard = (textminingInfo, userData) => {
    return new Promise((resolve, reject) => {
        let fileName = 'download.xlsx'
        let filePath = 'E:\\Nodejs\\@nodeGit\\backend\\bin\\wwwroot\\download\\'+fileName;
       // let filepath='D:\Demo'
        console.log(filePath);
       // addRowToNewExcel(filePath);
        textminingData.addRowToNewExcel(filePath,textminingInfo).then(result => {
            return resolve(result);
        })
    });
};
    // let fileName = 'download.xlsx'
    // var options = {
    //     filename: 'http://172.16.20.62:3001/static/wwwroot/download/'+fileName,
    //     useStyles: true,
    //     useSharedStrings: true
    // };

    // var workbook = new Excel.stream.xlsx.WorkbookWriter(options);
    // var worksheet = workbook.addWorksheet('Rate Sheet',{properties:{tabColor:{argb:'FFC0000'}}});
    // worksheet.columns = [textminingInfo[0]];
       
    // //array.forEach(function(row){ worksheet.addRow(row); })
    //     return resolve(options.filename);
    


function addRowToNewExcel(excelFilePath) {
    //excelFilePath: Provide path and file name for excel file
    
}

textmining.textExtraction = (userData, textminingInfo) => {
    return new Promise((resolve, reject) => {
        textminingData.textExtractiondata(userData.userId, textminingInfo).then(result => {
            return resolve(result);
        })
    });
};

textmining.getTextMiningKeywordsList = (textminingId, projectId) => {
    return new Promise((resolve, reject) => {
        textminingData.getTextminingList(textminingId, projectId).then(async result => {
          
            let tablename = result[0].tabname;
            let Textmining = textminingModel.GetTextminingSchema(tablename);

            let resKeywordExtractionList = await getVocabulary(Textmining);

            let resArray = KeywordsExtractionList(resKeywordExtractionList)
            return resolve(resArray)


            //let resKeywordExtractionList = []
            // Textmining.find({}).then(items => {
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


const getVocabulary = async (Textmining) => {
    return await Textmining.find({}, { keywordid: 1, _id: 0 }).lean().exec().then(async resultArr => {
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
                        "frequency": "$frequency",
                        "tags": [],
                        "description":"$description",
                        "acronyms": "$acronyms",
                        "relevance" : "$relevance"
                    }
                }
            ]).then(resultArrObj => {
                return resultArrObj[0]
            })
        }).then(returnData => { return returnData })
    })
}
let KeywordsExtractionList = (data) => {
    let resChildrenArray = [];
    let resClusterArray = [];
    data.forEach((item) => {
            resChildrenArray.push({
                antonyms: item.antonyms,
                frequency: item.frequency,
              //  entity: item.Entitytype,
                synonyms: item.synonyms,
                id: item.id,
                title: item.title,
                relevance: item.relevance
            });
        });
        
        // Finding Distinct Category start
        let objCategory = [];
        data.forEach(item => {
            objCategory.push(item.group_name);
        });
        objCategory = objCategory.filter((item, i, ar) => ar.indexOf(item) === i);
        objCategory.forEach(itemCategory => {
            let resByCategory = data.filter(obj => obj.group_name == itemCategory);
            resByCategory.forEach((item) => {
                resClusterArray.push({
                    acronyms: item.acronyms,
                    antonyms: item.antonyms,
                    frequency: item.frequency,
                    description: item.description,
                    entity: item.Entitytype,
                    group_name: item.group_name,
                    id: item.id,
                    synonyms: item.synonyms,
                    termType: " ",
                    title: item.title,
                    url: item.url,
                    relevance: item.relevance,
                });
            });
        });

    resClusterArray = resClusterArray.reduce(function (r, a) {
        r[a.group_name] = r[a.group_name] || [];
        r[a.group_name].push(a);
        return r;
    }, Object.create(null));
    let resNewClusterArray = [];
    let resClusterArrayKeys = Object.keys(resClusterArray)
    for (let item of resClusterArrayKeys) {
        resNewClusterArray.push(
            {
                [item]: resClusterArray[[item]]
            });
    }
    let resArray =
    {
        result: {
            children: resChildrenArray,
            clusters: resNewClusterArray
        },
        status: 200,
    }
    return resArray;
};

module.exports = textmining;