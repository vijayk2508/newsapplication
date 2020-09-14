const mongoose = require("mongoose");
const _ = require("underscore")._;
const shortId = require("shortid");
const fs = require("fs");
const taxonomyQuery = require("./queries/taxonomy-query");
const projectModel = require("../models/project");
const taxonomyModel = require("../models/taxonomyModel");
const commomObjCreater = require("../helper/commonObjFormation");
const timeStamp = require("../helper/unixTimeConverter");
const db = require("../db/db");

exports.getHierarchies = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', function (err, data) {
            if (!err) {
                var dataArray = data.split(/\r?\n/);
                let columnArr = dataArray[0].replace(/"/g, '');
                return resolve(columnArr.split(","))
            }
        });
    })
}

exports.getTaxonomies = (projectId, userId) => {
    return new Promise(async (resolve, reject) => {
        projectModel.getProjects.query(taxonomyQuery.getTaxonomyQuery(projectId, userId)).then(([results, metadata]) => {
            if (results.length) {
                return (resolve(commomObjCreater.getTaxonomyObj(results)));
            }
            return resolve({})
        }, err => { console.log(err) })
    })
};
exports.getAttributes = () => {
    return new Promise(async (resolve, reject) => {
        return resolve({
            type: await this.getTaxonomyTypeAttr(),
            settings: await this.getTaxonomySettingsAttr(),
            departments: await this.getTaxonomyDepartmentAttr(),
        })
    })
};
exports.getTaxonomyTypeAttr = async () => {
    return projectModel.getProjects.query(taxonomyQuery.getTaxonomyTypeAttr()).then(([results, metadata]) => {
        if (results.length) {
            return results;
        } else return null;
    }, err => { console.log(err); });
};
exports.getTaxonomySettingsAttr = async () => {
    return projectModel.getProjects.query(taxonomyQuery.getTaxonomySettingsAttr()).then(([results, metadata]) => {
        if (results.length) {
            return results;
        } else return null;
    }, err => { console.log(err) })
};
exports.getTaxonomyDepartmentAttr = async () => {
    return projectModel.getProjects.query(taxonomyQuery.getTaxonomyDepartmentAttr()).then(([results, metadata]) => {
        if (results.length) {
            return results;
        } else return null;
    }, err => { console.log(err) })
};
exports.createTaxonomy = async (userId, taxonomyInfo) => {
    let departments = taxonomyInfo.department;
    let settingsObj = taxonomyInfo.settings
    let taxonomyId = shortId.generate();
    console.log(taxonomyId, "taxonomyInfo")
    // const transaction = new Sequelize.Transaction();
    return new Promise(async (resolve, reject) => {
        await db.transaction(async function (t) {
            return await taxonomyModel.TaxonomyCreation.create({
                taxonomyUuid: taxonomyId,
                taxonomyName: taxonomyInfo.title,
                taxonomyType: taxonomyInfo.type,
                description: taxonomyInfo.description,
                recommendationStatus: taxonomyInfo.recommendationStatus,
                autoSyncStatus: taxonomyInfo.autoSyncStatus,
                projectId: taxonomyInfo.projectId,
                createdBy: userId,
                createdAt: timeStamp.UNIXTIMESTAMP,
                updatedAt: timeStamp.UNIXTIMESTAMP,
                levelsCount: 0,
            }, { transaction: t }).then(async function (test) {
                await require('bluebird').mapSeries(departments, async (eachDept, index, length) => {
                    return await taxonomyModel.TaxonomyDepartment.create({
                        department: eachDept['id'],
                        taxonomyId: taxonomyId,
                    }, { transaction: t }).then(res => { return res });
                }).then(res => console.log(res, "helllooo"))
                let toLoop = []
                Object.keys(settingsObj).map(async (eachKeys, id, arr) => {
                    toLoop.push(eachKeys);
                });
                require('bluebird').mapSeries(toLoop, (eachKeys) => {
                    getTaxonomySettings(settingsObj[eachKeys], t, eachKeys).then(async resultObj => {
                        console.log(resultObj, 'resultObj');
                        return taxonomyModel.TaxonomySettingsMap.create({
                            taxonomySettingsId: resultObj.settingsId,
                            taxonomyMatrixId: resultObj.id,
                            taxonomyId: taxonomyId,
                        }).then(res => {
                            console.log(res, "sampleRes");
                            return res;
                        }, err => console.log(err))
                    })
                });
            }, err => { console.log(err) })
        });
        return resolve(commomObjCreater.createTaxonomyObj(taxonomyInfo, taxonomyId, timeStamp.UNIXTIMESTAMP))
    })
};

function getTaxonomySettings(eachArrVal, t, eachKeys) {
    return new Promise(async (resolve, reject) => {
        const id = await taxonomyModel.TaxonomySettingsMatrix.findOne({
            where: {
                restrict: eachArrVal[0],
                permit: eachArrVal[1],
                changeProperties: eachArrVal[2],
                notifyMe: eachArrVal[3],
            },
            attributes: ['id'],
            order: ['id']
        }, { transaction: t }).then(matrix => {
            return JSON.parse(JSON.stringify(matrix, null, 4));
        }, err => {
            console.log(err); return null;
        });
        const settingsId = await taxonomyModel.TaxonomySettings.findOne({
            where: { settings: eachKeys },
            attributes: ['id'],
            order: ['id']
        }, { transaction: t }).then(settings => {
            return JSON.parse(JSON.stringify(settings, null, 4));
        }, err => console.log(err));
        return resolve({ id: id.id, settingsId: settingsId.id })
    });
};

exports.getTaxonomyTree = async (taxonomyAttributes) => {
    let taxonomyId = taxonomyAttributes.taxonomyId;
    let projectId = taxonomyAttributes.projectId;;
    let startIndex = taxonomyAttributes.startIndex;
    let lastIndex = taxonomyAttributes.lastIndex;;
    let userId = taxonomyAttributes.userId;
    let relationShip = [];
    return new Promise(async (resolve, reject) => {
        let taxonomyInfo = commomObjCreater.getTaxonomyObj(await this.getTaxonomyInfo(taxonomyId, projectId, userId));
        let taxonomyTableInfo = await this.getTaxonomyTable(taxonomyId, projectId);
        if (taxonomyTableInfo) {
            let modelName = `read${taxonomyTableInfo[0]['tableName']}`;
            const getTreeSchema = taxonomyModel.getTreeSchema(modelName, taxonomyTableInfo[0]['tableName']);
            const treeData = await getTreeSchema.find({ 'rownum': { '$gte': parseInt(startIndex), '$lt': parseInt(lastIndex) } }, { _id: 0 }).lean().then((tree) => {
                return tree;
            }, err => console.log(err));

            // const treeData = await mongoose.Collection.find({ 'rownum': { '$gte': parseInt(startIndex), '$lt': parseInt(lastIndex) } }, { _id: 0 }).lean().then((tree) => {
            //     return tree;
            // }, err => console.log(err));

            mongoose.connection.deleteModel(modelName);
            relationShip.slice();
            treeData.map((eachRel, ind) => {
                return relationShip.push(...eachRel['relationShip']);
            });
            let treeObj = {
                root: commomObjCreater.rootObj(taxonomyTableInfo),
                data: treeData,
                levels: JSON.parse(taxonomyTableInfo[0]['levels']),
                relationship: relationShip.length ? relationShip : []
            };
            return resolve({ treeObj, taxonomyInfo })
        }
        else {
            console.log(":::::=>bullet---->");
            let treeObj = {
                root: [],
                data: [],
                levels: [],
                relationship: []
            };
            return resolve({ treeObj, taxonomyInfo })
        }
    }).catch(err => console.log(err))
};
exports.getTaxonomyInfo = async (taxonomyId, projectId, userId) => {
    return projectModel.getProjects.query(taxonomyQuery.getTaxonomyInfoQuery(taxonomyId, projectId, userId)).then(([results, metadata]) => {
        if (results.length) {
            return results;
        } else return null;
    }, err => { console.log(err) })
};
exports.getTaxonomyTable = async (taxonomyId, projectId) => {
    return projectModel.getProjects.query(taxonomyQuery.getTaxonomyTableQuery(taxonomyId, projectId)).then(([results, metadata]) => {
        if (results.length) {
            return results;
        } else return null;
    }, err => { console.log(err) })
};
exports.getCurrentTaxonomy = async (taxoAttrib) => {
    const { taxonomyId, projectId, userId } = taxoAttrib;
    return new Promise((resolve, reject) => {
        projectModel.getProjects.query(taxonomyQuery.getCurrentTaxonomy(taxonomyId, projectId, userId)).then(([results, metadata]) => {
            if (results.length) {
                console.log(results[0]["title"], "hjjkj")
                return resolve(results[0]["title"]);
            } else console.log("dwyygwugui");
        }, err => { console.log(err) })
    })
};

exports.importFile = (taxonomyFileImport, data) => {
    let dynamicRow = new taxonomyFileImport(data);
    dynamicRow.save()
        .then(data => {
            console.log("data", data._id);
        }, err => console.log(err))
};

exports.createTree = async (taxonomyAttrib) => {
    const { taxonomyId, projectId, userId, levels, root, file, fileName } = taxonomyAttrib;
    let arrIdColumns = [];
    let fieldstobeShown = "";
    let hierarchyId = shortId.generate();
    let rawDataCollectionName = fileName.split(".");
    rawDataCollectionName = rawDataCollectionName[0];
    // const taxonomyFileImport = new mongoose.model('xshsihcichish', new mongoose.Schema({}, { strict: false }));
    const taxonomyFileSchema = taxonomyModel.importFile(`write${rawDataCollectionName}`, rawDataCollectionName)
    await require("../helper/fileParser").csvParser(file, fileName).then((data) => {
        taxonomyFileSchema.insertMany(data, { ordered: true }).then(result => { return result });
    }, err => { console.log(err) });
    mongoose.connection.deleteModel(`write${rawDataCollectionName}`);
    const getDefaultSchema = taxonomyModel.createDynamicmodel(`read${rawDataCollectionName}`, rawDataCollectionName);
    for (let k of levels) {
        console.log(k);
        arrIdColumns.push(k + "_id");
        if (fieldstobeShown === "") {
            fieldstobeShown = '"' + k + '"' + ':' + '"$' + k + '"';
        }
        else {
            fieldstobeShown += ',"' + k + '"' + ':' + '"$' + k + '"';
        }
    }
    return new Promise(async (resolve, reject) => {
        let insertVal = "";
        let dataObj = {};
        let dataArr = [];
        let resultArr = [];
        let resultData = await getDefaultSchema.aggregate().group({ "_id": JSON.parse(`{${fieldstobeShown}}`) }).then(res => {
            return res.map(eachObj => { return eachObj['_id'] })
        }, err => { console.log(err) });
        mongoose.connection.deleteModel(`read${rawDataCollectionName}`);
        arrIdColumns.slice();
        arrIdColumns = [...arrIdColumns, ...levels];
        for (let j = 0; j < levels.length; j++) {
            let idColumn = `${levels[j]}_id`;
            let actualColumn = levels[j];
            for (let i = 0; i < resultData.length; i++) {
                if (j === 0) {
                    insertVal = resultData[i][actualColumn];
                }
                else {
                    let parentCol = levels[j - 1];
                    insertVal = resultData[i][actualColumn] + resultData[i][parentCol];
                }
                resultData[i][idColumn] = insertVal;
            }
        }
        let rowNum = 0;
        if (resultData.length) {
            for (let j = 0; j < levels.length; j++) {
                if (j === 0) {
                    dataArr = [];
                    let columnName = levels[j];
                    for (let i = 0; i < resultData.length; i++) {
                        rowNum = parseInt(rowNum + 1);
                        dataArr.push(commomObjCreater.formTreeObj(resultData, levels, i, j, columnName, "", 0));
                    }
                    resultArr.push(...commomObjCreater.distinctData(dataArr, 0));
                } else {
                    if (j > 1) {
                        dataArr = [];
                        let columnName = levels[j];
                        let parent = levels[j - 1];
                        for (let k = 0; k < arrIdColumns.length; k++) {
                            if (arrIdColumns[k] === levels[j]) {
                                for (let i = 0; i < resultData.length; i++) {
                                    rowNum = parseInt(rowNum + 1);
                                    let ParentId = resultData[i][parent + "_id"];
                                    dataArr.push(commomObjCreater.formTreeObj(resultData, levels, i, j, columnName, ParentId, 1));
                                };
                                resultArr.push(...commomObjCreater.distinctData(dataArr, 2));
                            }
                        }
                    }
                    else {
                        dataArr = [];
                        let columnName = levels[j];
                        let parent = levels[j - 1];
                        for (let k = 0; k < arrIdColumns.length; k++) {
                            if (arrIdColumns[k] === levels[j]) {
                                for (let i = 0; i < resultData.length; i++) {
                                    rowNum = parseInt(rowNum + 1);
                                    let ParentId = resultData[i][parent + "_id"]
                                    dataArr.push(commomObjCreater.formTreeObj(resultData, levels, i, j, columnName, ParentId, 1));
                                };
                                resultArr.push(...commomObjCreater.distinctData(dataArr, 1));
                            }
                        }
                    }
                }
            }
            const collectionName = `taxonomy${shortId.generate()}`;
            console.log(collectionName);
            const createTreeSchema = taxonomyModel.CreateTree(collectionName, collectionName);
            resultArr.map((eachDoc, ind) => {
                return eachDoc.rownum = ind + 1
            });
            createTreeSchema.insertMany(resultArr, { ordered: true }).then(result => { return result }, err => { console.log(err, "Error while creating a tree") });
            await taxonomyModel.SaveHierarchies.create({
                hierarchyId: hierarchyId,
                taxonomyId: taxonomyId,
                rootnode: root,
                levels: JSON.stringify(levels),
                projectId: projectId,
                userId: userId,
                tableName: rawDataCollectionName,
                taxonomyTable: collectionName,
            }).then(res => console.log(res, "insert"), err => console.log(err, "insert"));
            await taxonomyModel.UpdateLevelCount.update({ levelsCount: levels.length }, { where: { taxonomyUuid: taxonomyId } })
                .then(res => console.log(res, "update"), err => console.log(err, "update"));
            return resolve({
                root: commomObjCreater.rootObj({}, "test"),
                data: resultArr.slice(0, 20),
                relationship: []
            })
        }
    })
};
exports.updateTree = async (taxonomyAttrib) => {
    const { taxonomyId, projectId, userId, levelId, name } = taxonomyAttrib;
    return new Promise(async (resolve, reject) => {
        let taxonomyTableInfo = await this.getTaxonomyTable(taxonomyId, projectId);
        let modelName = `read${taxonomyTableInfo[0]['tableName']}`;
        const updateTreeModel = taxonomyModel.UpdateTreeModel(modelName, taxonomyTableInfo[0]['tableName']);
        updateTreeModel.updateOne({ "id": levelId }, { "name": name }).then(res => { console.log(res); return resolve() }, err => console.log(err));
        mongoose.connection.deleteModel(modelName);
    })
};
exports.getChildNodes = async (taxonomyAttrib) => {
    const { taxonomyId, projectId, parentId } = taxonomyAttrib;
    return new Promise(async (resolve, reject) => {
        let taxonomyTableInfo = await this.getTaxonomyTable(taxonomyId, projectId);
        let modelName = `read${taxonomyTableInfo[0]['tableName']}`;
        const getTreeSchema = taxonomyModel.getTreeSchema(modelName, taxonomyTableInfo[0]['tableName']);
        await getTreeSchema.find({ "parentId": parentId }, { _id: 0 }).lean().then(res => { console.log(res); return resolve({ data: res }) }, err => console.log(err));
        mongoose.connection.deleteModel(modelName);
    })
};
exports.dragNdropNodes = async (taxonomyAttrib) => {
    const { taxonomyId, projectId, userId, dragId, dropId, isInsert } = taxonomyAttrib;
    return new Promise(async (resolve, reject) => {
        let taxonomyTableInfo = await this.getTaxonomyTable(taxonomyId, projectId);
        let modelName = `read${taxonomyTableInfo[0]['tableName']}`;
        const updateTreeModel = taxonomyModel.UpdateTreeModel(modelName, taxonomyTableInfo[0]['tableName']);
        if (!isInsert) {
            updateTreeModel.updateOne({ "id": dragId }, { "parentId": dropId }).then(res => { console.log(res); return resolve() }, err => console.log(err));
        };
        mongoose.connection.deleteModel(modelName);
    })
};
exports.setRelationShip = async (taxonomyAttrib) => {
    const { taxonomyId, projectId, userId, destId, sourceId, primaryLineType, primaryDirectionType, primaryLineColor, relationTitle } = taxonomyAttrib;
    return new Promise(async (resolve, reject) => {
        let taxonomyTableInfo = await this.getTaxonomyTable(taxonomyId, projectId);
        let modelName = `update${taxonomyTableInfo[0]['tableName']}`;
        let relation = {
            sourceId: sourceId,
            destId: destId,
            relationTitle: relationTitle,
            primaryLineType: primaryLineType,
            primaryLineColor: primaryLineColor,
            primaryDirectionType: primaryDirectionType,
        };
        const updateTreeModel = taxonomyModel.UpdateTreeModel(modelName, taxonomyTableInfo[0]['tableName']);
        updateTreeModel.updateOne({ "id": sourceId }, { $push: { relationShip: relation } }).then(res => { console.log(res); return resolve() }, err => console.log(err));
        mongoose.connection.deleteModel(modelName);
    })
};
exports.deleteRelation = async (taxonomyAttrib) => {
    const { taxonomyId, projectId, userId, destId, sourceId } = taxonomyAttrib;
    return new Promise(async (resolve, reject) => {
        let taxonomyTableInfo = await this.getTaxonomyTable(taxonomyId, projectId);
        let modelName = `delete${taxonomyTableInfo[0]['tableName']}`;
        const deleteTreeModel = taxonomyModel.UpdateTreeModel(modelName, taxonomyTableInfo[0]['tableName']);
        deleteTreeModel.updateMany({ "id": sourceId, "relationShip.sourceId": sourceId, "relationShip.destId": destId }, { $pull: { relationShip: { "sourceId": sourceId, "destId": destId } } }).then(res => { console.log(res); return resolve() }, err => console.log(err));
        mongoose.connection.deleteModel(modelName);
    })
};
exports.editRelation = async (taxonomyAttrib) => {
    const { taxonomyId, projectId, userId, destId, sourceId, primaryLineType, primaryDirectionType, primaryLineColor, relationTitle } = taxonomyAttrib;
    return new Promise(async (resolve, reject) => {
        let taxonomyTableInfo = await this.getTaxonomyTable(taxonomyId, projectId);
        let modelName = `delete${taxonomyTableInfo[0]['tableName']}`;
        const editTreeModel = taxonomyModel.UpdateTreeModel(modelName, taxonomyTableInfo[0]['tableName']);
        editTreeModel.updateMany({ "id": sourceId, 'relationShip.sourceId': sourceId, 'relationShip.destId': destId }, { $set: { 'relationShip.$.primaryLineType': primaryLineType, 'relationShip.$.primaryLineColor': primaryLineColor, 'relationShip.$.relationTitle': relationTitle, 'relationShip.$.primaryDirectionType': primaryDirectionType } }).then(res => { console.log(res); return resolve() }, err => console.log(err));
        mongoose.connection.deleteModel(modelName);
    })
};
exports.addNode = async (taxonomyAttrib) => {
    const { name, parentId, id, projectId, taxonomyId, LevelID, LevelName, insertNodeID, userId } = taxonomyAttrib;
    return new Promise(async (resolve, reject) => {
        let taxonomyTableInfo = await this.getTaxonomyTable(taxonomyId, projectId);
        let findModel = "ModelFind";
        let modelName = `insert${taxonomyTableInfo[0]['tableName']}`;
        const findTreeModel = taxonomyModel.UpdateTreeModel(findModel, taxonomyTableInfo[0]['tableName']);
        let rowNum = await findTreeModel.findOne({}, { _id: 0, rownum: 1 }).lean().sort({ rownum: -1 }).limit(1).then(res => {
            return res.rownum
        });
        const insertNodeModel = taxonomyModel.CreateTree(modelName, taxonomyTableInfo[0]['tableName']);
        insertNodeModel.insertMany({
            parentId: parentId, name: name, id: id, createdAt: timeStamp.UNIXTIMESTAMP, updatedAt: timeStamp.UNIXTIMESTAMP,
            createdBy: userId, approvalStatus: "Pending", LevelName: LevelName, LevelId: LevelID, Dscription: "",
            updatedBy: userId, orphanStatus: "false", consensessMember: 0, ApprovedCount: 0, ApprovePending: 0,
            primaryFontColor: "", primaryFontSize: "", primaryFontFamily: "", primaryNodeColor: "", rownum: parseInt(rowNum + 1),
            relationShip: [],
        }).then(res => { mongoose.connection.deleteModel(findModel); mongoose.connection.deleteModel(modelName); return resolve(), err => console.log(err) });
    });
};