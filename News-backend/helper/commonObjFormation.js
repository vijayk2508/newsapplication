const _ = require("underscore")._;
const projectQuery = require("../data/queries/project-query");
const projectModel = require("../models/project");
const timeStamp = require("./unixTimeConverter");

exports.recentProjectInfo = async (results, projectId) => {
    let infoObj = {};    let questionDetails=[];let finalObj={};
    for (let j = 0; j < results.length; j++) {
        let groupId = results[j]["groupId"];
        let groupName = results[j]["groupName"].toUpperCase();
        if (groupName === "VOCABULARY") {
            let resultarr = [];
            let resultObj = {};
            await projectModel.getProjects.query(projectQuery.getAppProjectCount('vocabulary', projectId)).then(([AppProjectresults, metadata]) => {
                if (AppProjectresults.length) {
                    let index = AppProjectresults[0]['Indesx'];
                    projectModel.getProjects.query(projectQuery.getVocabularyQuery(projectId)).then(([VocabularyResults, metadata]) => {
                        if (VocabularyResults.length) {
                            let temparr = [];
                            for (let i = 0; i < VocabularyResults.length; i++) {
                                // let eachVocabProject = {};
                                temparr = VocabularyResults[i];
                                let eachVocabProject = {
                                    projectId: temparr["projectId"],
                                    projectName: temparr["vocabularyName"],
                                    projectDesc: temparr["vocabularydesp"],
                                    vocabularyId: temparr["vocabularyId"],
                                    groupName: groupName
                                };
                                resultObj = {
                                    ...resultObj,
                                    index: index,
                                    description: eachVocabProject
                                };
                                resultarr.push(resultObj);
                            }
                            infoObj[groupName] = resultarr;
                        }
                    })
                }
            })
        }
        else if (groupName === "TAXONOMY") {
            let resultarr = [];
            let resultObj = {};
            await projectModel.getProjects.query(projectQuery.getAppProjectCount('hierarchies', projectId)).then(([AppProjectresults, metadata]) => {
                if (AppProjectresults.length) {
                    let index = AppProjectresults[0]['Indesx'];
                    projectModel.getProjects.query(projectQuery.getTaxonomyQuery(projectId)).then(([VocabularyResults, metadata]) => {
                        if (VocabularyResults.length) {
                            let temparr = [];
                            for (let i = 0; i < VocabularyResults.length; i++) {
                                temparr = VocabularyResults[i];
                                let eachVocabProject = {
                                    projectId: temparr["projectId"],
                                    projectName: temparr["taxonomyName"],
                                    projectDesc: temparr["vocabularydesp"],
                                    taxonomyId: temparr["taxonomyId"],
                                    groupName: groupName
                                };
                                resultObj = {
                                    ...resultObj,
                                    index: index,
                                    description: eachVocabProject
                                };
                                resultarr.push(resultObj);
                            }
                            infoObj[groupName] = resultarr;
                        }
                    })
                }
            })
        }
        else if (groupName === "ETL") {
            let resultarr = [];
            let resultObj = {};
            await projectModel.getProjects.query(projectQuery.getAppProjectCount('project_process', projectId)).then(([AppProjectresults, metadata]) => {
                if (AppProjectresults.length) {
                    let index = AppProjectresults[0]['Indesx'];
                    projectModel.getProjects.query(projectQuery.getETLQuery(projectId)).then(([VocabularyResults, metadata]) => {
                        if (VocabularyResults.length) {
                            let temparr = [];
                            for (let i = 0; i < VocabularyResults.length; i++) {
                                temparr = VocabularyResults[i];
                                let eachVocabProject = {
                                    projectId: temparr["projectId"],
                                    projectName: temparr["projectName"],
                                    projectDesc: temparr["projectDesc"],
                                    groupName: groupName
                                };
                                resultObj = {
                                    ...resultObj,
                                    index: index,
                                    description: eachVocabProject
                                };
                                resultarr.push(resultObj);
                            }
                            infoObj[groupName] = resultarr;
                        }
                    })
                }
            })
        }
        else if (groupName === "CONSENSUS MANAGEMENT") {
            // projectModel.getProjects.query(projectQuery.getAppProjectCount('vocabulary', projectId)).then(([AppProjectresults, metadata]) => {
            //     if (AppProjectresults.length) {
            //         let index = AppProjectresults[0]['Indesx'];
            //         projectModel.getProjects.query(projectQuery.getConsensusQuery(projectId,groupId)).then(([VocabularyResults, metadata]) => {
            //             if (VocabularyResults.length) {
            //                 let temparr = [];
            //                 let eachVocabProject = {};
            //                 for (let i = 0; i < VocabularyResults.length; i++) {
            //                     temparr = VocabularyResults[i];
            //                     eachVocabProject = {
            //                         ...eachVocabProject,
            //                         description: {
            //                             projectId: temparr["projectId"],
            //                             projectName: temparr["projectName"],
            //                             projectDesc: temparr["projectDesc"],
            //                             vocabularyName: temparr["vocabularyName"],
            //                             vocabularydesp: temparr["vocabularydesp"],
            //                             groupName: groupName
            //                         }
            //                     };
            //                 }
            //                 infoObj[groupName] = eachVocabProject
            //             }
            //         })
            //     }
            // })
        }
        else if (groupName === "TEXT MINING") {
            let resultarr = [];
            let resultObj = {};
            await projectModel.getProjects.query(projectQuery.getTextMiningProjectCount('textmining', projectId)).then(([AppProjectresults, metadata]) => {
                console.log(AppProjectresults);
                if (AppProjectresults.length) {
                    let index = AppProjectresults[0]['Indesx'];
                    projectModel.getProjects.query(projectQuery.getTextMiningQuery(projectId)).then(([VocabularyResults, metadata]) => {
                        if (VocabularyResults.length) {
                            let temparr = [];
                            for (let i = 0; i < VocabularyResults.length; i++) {
                                temparr = VocabularyResults[i];
                                let eachVocabProject = {
                                    projectId: temparr["projectId"],
                                    projectName: temparr["modelName"],
                                    projectDesc: temparr["vocabularydesp"],
                                    textminingId: temparr["textMiningId"],
                                    groupName: groupName
                                };
                                resultObj = {
                                    ...resultObj,
                                    index: index,
                                    description: eachVocabProject
                                };
                                resultarr.push(resultObj);
                            }
                            infoObj[groupName] = resultarr;
                        }
                    })
                }
            })
        }
    
    }
   await projectModel.getProjects.query(projectQuery.getrecentQuestions()).then((questionResult, metadata) => {
    
        if (questionResult.length) {
            questionDetails = questionResult[0]
        }
        finalObj = questionDetails;
    });
    let objs=[];
    objs.slice();
    let resultObj = {
        recentquestion:finalObj,
        obj:infoObj
    }
    objs.push(resultObj);
    return resultObj;
    
};
//formation of commom=n project objects

exports.formResultObj = (results) => {
    let eachProject = {};
    let temparr = [];
    for (let i = 0; i < results.length; i++) {
        temparr = results[i];
        eachProject = {
            ...eachProject,
            [temparr["projectUuid"]]: {
                title: temparr["title"],
                description: temparr["description"],
                userId: temparr["userId"],
                projectId: temparr["projectUuid"],
                departmentInvolved: JSON.parse(temparr["departmentInvolved"]),
                targetAudience: JSON.parse(temparr["targetAudience"]),
                targetIndustry: JSON.parse(temparr["targetIndustry"]),
                subjectAreas: JSON.parse(temparr["subjectAreas"]),
                operatingUnits: JSON.parse(temparr["operatingUnits"]),
                projectType: JSON.parse(temparr["projectType"]),
                projectGoal: temparr["projectGoal"],
                createDate: Number(temparr["createDate"]),
                startDate: Number(temparr["startDate"]),
                endDate: Number(temparr["endDate"]),
                
                projectStatus: "inProgress"
            }
        }
    }
    return eachProject;
}
//formation of commom=n project objects end
exports.getTaxonomyObj = (results) => {
    let eachProject = {};
    let temparr = [];
    let resultArr = [];
    let resultObj = {};
    for (let i = 0; i < results.length; i++) {
        temparr = results[i];
        eachProject = {
            ...eachProject,
            id: temparr["id"],
            title: temparr["title"],
            description: temparr["description"],
            type: temparr["type"],
            recommendationStatus: temparr["recommendationStatus"],
            autoSyncStatus: temparr["autoSyncStatus"],
            projectId: temparr["projectId"],
            userId: temparr["userId"],
            created: temparr["createdDate"],
            updated: temparr["updatedDate"],
            settings: temparr["taxoSettings"] != "" ? JSON.parse(temparr["taxoSettings"]) : [],
            department: temparr["taxoDept"] != "" ? JSON.parse(temparr["taxoDept"]) : [],
            levelsCount: temparr["levelsCount"] != "" ? temparr["levelsCount"] : 0,
        }
        resultArr.push(eachProject);
    }
    // console.log(resultArr,"obj");
    for (let j = 0; j < resultArr.length; j++) {
        let settingsObj = {};
        let eachProj = resultArr[j];
        let settingsArr = eachProj['settings'];
        if (settingsArr) {
            for (let k = 0; k < settingsArr.length; k++) {
                let title = settingsArr[k]["settings"];
                let matrix = JSON.parse(settingsArr[k]["matrix"]);
                settingsArr[k]["matrix"] = matrix;
                settingsObj[title] = matrix
            }
        }
        resultObj[resultArr[j]["id"]] = eachProj;
        resultObj[resultArr[j]["id"]]["settings"] = settingsObj
    }
    return resultObj;
};
exports.createTaxonomyObj = (taxonomyObj, taxonomyId, timeStamp) => {
    return {
        [taxonomyId]: {
            title: taxonomyObj.title,
            id: taxonomyId,
            description: taxonomyObj.description,
            projectId: taxonomyObj.projectId,
            type: taxonomyObj.type,
            autoSyncStatus: taxonomyObj.autoSyncStatus,
            recommendationStatus: taxonomyObj.recommendationStatus,
            department: taxonomyObj.department,
            settings: taxonomyObj.settings,
            created: timeStamp,
            updated: timeStamp,
            levelsCount: 0
        }
    }
};
exports.rootObj = (dataObj, alias) => {
    return [{
        parentId: 'root',
        id: 'r1',
        name: dataObj.length ? dataObj[0]['name'] : alias
    }];
};
//Taxonomy Tree Grouper
exports.distinctData = (dataArr, depth) => {
    if (depth === 0) {
        var grouper = function (row) { return row.id };
        var groupedData = _.chain(dataArr)
            .groupBy(grouper)
            .map(function (rows) { return rows[0] })
            .value();
        return groupedData;
    }
    else if (depth === 1) {
        var grouper = function (row) { return row.parentId, row.name, row.id };
        var groupedData = _.chain(dataArr)
            .groupBy(grouper)
            .map(function (rows) { return rows[0] })
            .value();
        return groupedData;
    } else {
        var grouper = function (row) { return row.parentId, row.name, row.id };
        var groupedData = _.chain(dataArr)
            .groupBy(grouper)
            .map(function (rows) { return rows[0] })
            .value();
        return groupedData;
    }
};

exports.formTreeObj = (resultData, levels, i = dataIndex, j = levelIndex, nodeName, parentId, depth) => {
    return {
        parentId: depth === 0 ? "" : parentId,
        name: resultData[i][nodeName],
        id: resultData[i]["" + levels[j] + "_id"],
        createdAt: timeStamp.UNIXTIMESTAMP,
        updatedAt: timeStamp.UNIXTIMESTAMP,
        createdBy: "",
        approvalStatus: "Pending",
        LevelName: levels[j],
        LevelId: j,
        Dscription: "",
        updatedBy: "",
        orphanStatus: "false",
        consensessMember: 0,
        ApprovedCount: 0,
        ApprovePending: 0,
        primaryFontColor: "",
        primaryFontSize: "",
        primaryFontFamily: "",
        primaryNodeColor: "",
        relationShip: []
    }
}   