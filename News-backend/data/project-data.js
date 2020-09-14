const Guid = require('guid');
const projectModel = require("../models/project");
const projectQuery = require("./queries/project-query");
const commomObjCreater = require("../helper/commonObjFormation");
const projectSchema = require('../models/project');
const sequelizeproject = projectSchema.seqProjectcreate;
const timeStamp = require("../helper/unixTimeConverter");
const Sequelize = require('sequelize');
//get all projects
exports.getProjects = (userData) => {
    return new Promise(async (resolve, reject) => {
        projectModel.getProjects.query(projectQuery.getProjectQuery(userData.userId)).then(([results, metadata]) => {
            if (results.length) {
                return (resolve(commomObjCreater.formResultObj(results)));
            }
        }, err => { console.log(err) })
    })
}

//get all name
exports.getProjectName = (projectId) => {
    return new Promise(async (resolve, reject) => {
        projectModel.getProjects.query(projectQuery.getProjectName(projectId)).then(([results, metadata]) => {
            if (results.length) {
                return (resolve({ title: results[0]['title'] }));
            }
        }, err => { console.log(err) })
    })
}

//get particular project info
exports.getProjectInfo = (projectId) => {
    return new Promise(async (resolve, reject) => {
        projectModel.getProjects.query(projectQuery.getProjectInfoQuery(projectId)).then(([results, metadata]) => {
            if (results.length) {
                return (resolve(commomObjCreater.formResultObj(results)));
            }
        }, err => { console.log(err) })
    })
}

//get app'wise project infos based on main project
exports.getRecentProjectInfo = (projectId) => {
    return new Promise(async (resolve, reject) => {
        projectModel.getProjects.query(projectQuery.getGroupsQuery()).then(async ([results, metadata]) => {
            if (results.length) {
               // console.log(results);
                let result = await commomObjCreater.recentProjectInfo(results, projectId);
               // console.log(result);
                return resolve(result);
            }
        }, err => { console.log(err) })
    })
}
//get project attributes
exports.getAttributes = () => {
    return new Promise(async (resolve, reject) => {
        return resolve({
            projectType: await this.getProjectType(),
            opearatingUnits: await this.getOperatingUnits(),
            targetIndustry: await this.getTargetIndustry(),
            targetAudience: await this.getTargetAudience(),
            departmentInvolved: await this.getDepartments(),
            subjectAreas: await this.getSubjectArea(),
            chooseFeature: await this.getFeatures(),
        })
    })
}

exports.getProjectType = async () => {
    return projectModel.getProjects.query(projectQuery.getProjectType()).then(([results, metadata]) => {
        if (results.length) {
            return results;
        } else return null;
    }, err => { console.log(err); });
};
exports.getOperatingUnits = async (opearatingUnits) => {
    return projectModel.getProjects.query(projectQuery.getOperatingUnits()).then(([results, metadata]) => {
        if (results.length) {
            return results;
        } else return null;
    }, err => { console.log(err) })
};
exports.getTargetIndustry = async (targetIndustry) => {
    return projectModel.getProjects.query(projectQuery.getTargetIndustry()).then(([results, metadata]) => {
        if (results.length) {
            return results;
        } else return null;
    }, err => { console.log(err) })
};
exports.getTargetAudience = async (targetAudience) => {
    return projectModel.getProjects.query(projectQuery.getTargetAudience()).then(([results, metadata]) => {
        if (results.length) {
            return results;
        } else return null;
    }, err => { console.log(err) })
};
exports.getDepartments = async (departmentInvolved) => {
    return projectModel.getProjects.query(projectQuery.getDepartments()).then(([results, metadata]) => {
        if (results.length) {
            return results;
        } else return null;
    }, err => { console.log(err) })
};
exports.getSubjectArea = async (subjectAreas) => {
    return projectModel.getProjects.query(projectQuery.getSubjectArea()).then(([results, metadata]) => {
        if (results.length) {
            return results;
        } else return null;
    }, err => { console.log(err) })
};
exports.getFeatures = async (chooseFeature) => {
    return projectModel.getProjects.query(projectQuery.getFeatures()).then(([results, metadata]) => {
        if (results.length) {
            console.log(results);
            return projectModel.getProjects.query(projectQuery.getdistinctFeatures()).then(([distinct, metadata]) => {
                if (distinct.length) {
                    let featureObj = {};
                    console.log(distinct);

                    for (let j = 0; j < distinct.length; j++) {
                        let subFeatureArr = [];
                        for (let i = 0; i < results.length; i++) {
                            if (distinct[j]["featureName"] == results[i]["featureName"]) {
                                subFeatureArr.push(results[i]["sub_featureName"]);
                            }
                        }
                        featureObj[distinct[j]["featureName"]] = subFeatureArr;
                    }
                    //console.log(featureObj);
                    return featureObj;
                } else return null;
            }, err => { console.log(err) })

            //console.log(featureObj);
            //return results;
        } else return null;
    }, err => { console.log(err) })
};

let createnewProject = async (projectInfo, userData, projectId) => {
    console.log(projectInfo);
    console.log(userData.userId);
    let createdDate = timeStamp.UNIXTIMESTAMP;
    let updatedDate = timeStamp.UNIXTIMESTAMP;
    let opearatingUnitDetails = projectInfo.operatingUnits[0].id;
    let temp = projectInfo.title + "_" + userData.userId;
    let dbName = temp + "_DWH";
    projectModel.getProjects.query(projectQuery.createdb(dbName));
    return new Promise(async (resolve, reject) => {
        await projectSchema.seqProjectcreate.create({
            projectUuid: projectId,
            projectName: projectInfo.title,
            projectDescription: projectInfo.description,
            operatingUnits: opearatingUnitDetails,
            projectGoal: projectInfo.projectGoal,
            // projectVisibility: projectInfo.projectVisibility,
            createdBy: userData.userId,
            dbName: dbName,
            dateFrom: projectInfo.startDate,
            dateTo: projectInfo.dueDate,
            createdAt: createdDate,
            updatedAt: updatedDate,
            archive: 1
        }).then(results => {
            let itemData = createtargetaudience(projectInfo, projectId);
            let targetIndustryitem = createtargetIndustry(projectInfo, projectId);
            let projectDepartment = createprojectDepartment(projectInfo, projectId);
            let projecttype = createprojecttype(projectInfo, projectId);
            let subjectAreamap = Subjectareacreate(projectInfo, projectId);
            return projectId;
        }).catch(function (err) {
            console.log("create failed with error: " + err);
            return (resolve(err));
        });

    });
};

let createtargetaudience = async (projectInfo, projectId) => {
    let tagetlen = projectInfo.targetAudience;
    console.log(tagetlen);
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < tagetlen.length; i++) {
            let targetAudience = tagetlen[i].id;
            await projectSchema.seqtargetcreate.create({
                projectId: projectId,
                targetaudience: targetAudience
            })
        }
        return projectId;
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return (resolve(err));
    });
};

let createtargetIndustry = async (projectInfo, projectId) => {
    let targetIndustycount = projectInfo.targetIndustry
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < targetIndustycount.length; i++) {
            let targetIndustrydata = targetIndustycount[i].id;
            await projectSchema.seqtargetindustrycreate.create({
                projectId: projectId,
                targetIndustry: targetIndustrydata
            })
        }
        return projectId;
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return (resolve(err));
    });
};

let createprojectDepartment = async (projectInfo, projectId) => {
    console.log(projectInfo);
    let deptInvolved = projectInfo.departmentInvolved;
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < deptInvolved.length; i++) {
            let deptData = deptInvolved[i].id;
            await projectSchema.seqdepartmentcreate.create({
                projectId: projectId,
                departmentsInvolved: deptData
            })
        }
        return projectId;
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return (resolve(err));
    });
};

let createprojecttype = async (projectInfo, projectId) => {
    console.log(projectInfo);
    let projectTypes = projectInfo.projectType;
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < projectTypes.length; i++) {
            let projectData = projectTypes[i].id;
            await projectSchema.seqproject_typecreate.create({
                projectId: projectId,
                projectTypeId: projectData
            })
        }
        return projectId;
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return (resolve(err));
    });
};

let Subjectareacreate = async (projectInfo, projectId) => {
    console.log(projectInfo);
    let subjectDetails = projectInfo.subjectAreas;
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < subjectDetails.length; i++) {
            let subjectData = subjectDetails[i].id;
            await projectSchema.Subjectarea.create({
                projectId: projectId,
                subjectArea: subjectData
            })
        }
        return projectId;
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return (resolve(err));
    });
};

exports.createProject = async (projectInfo, userData) => {
    let guid = Guid.create();
    let projectId = guid.value;
    return new Promise(async (resolve, reject) => {
        let createdprojects = createnewProject(projectInfo, userData, projectId);
        return resolve(projectId)
    })
}

exports.getProjectTitle = async (projectId) => {
    return projectModel.getProjects.query(projectQuery.getProjecttitle(projectId)).then(([results, metadata]) => {
        if (results.length) {
            return results[0];
        } else return null;
    }, err => { console.log(err); });
};


exports.deleteProjectrecord = async (projectId, userData) => {
    return projectModel.getProjects.query(projectQuery.deleteProjectName(projectId)).then((results, metadata) => {
        console.log(results);
        let tableName = results[0];
        projectSchema.seqProjectcreate.update({
            archive: 0,
            archive_by: userData
        }, {
            where: {
                projectUuid: projectId,
            }
        })
    }).then(async (results) => {
        // let editcurrentProject = deletechildTable(projectId);
        return projectId;
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return (resolve(err));
    });
};

let deletechildTable = (projectId) => {
    return projectModel.getProjects.query(projectQuery.getChildtable(projectId)).then((results, metadata) => {
        console.log(results);
        let tableList = results[0];
        for (let k = 0; k < tableList.length; k++) {
            let tableName = tableList[k].table_name;
            console.log(tableName);
            projectModel.getProjects.query(projectQuery.deleteChildtable(tableName, projectId));
        }
    }).then(async (results) => {
        return projectId;
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return (err);
    });
};

exports.projectEdit = async (projectInfo) => {
    let projectId = projectInfo.projectId;
    return new Promise(async (resolve, reject) => {
        let editcurrentProject = editProject(projectInfo, projectId);
        return resolve(projectId)
    })

}


let editProject = (projectInfo, projectId) => {
    let opearatingUnitDetails = projectInfo.operatingUnits[0].id;
    let updatedDate = timeStamp.UNIXTIMESTAMP;
    return new Promise(async (resolve, reject) => {
        projectSchema.seqProjectcreate.update({
            projectName: projectInfo.title,
            projectDescription: projectInfo.description,
            operatingUnits: opearatingUnitDetails,
            projectGoal: projectInfo.projectGoal,
            createdBy: projectInfo.userId,
            dateFrom: projectInfo.startDate,
            dateTo: projectInfo.dueDate,
            updatedAt: updatedDate
        }, {
            where: {
                projectUuid: projectId,
            }
        }).then(async (results) => {
            let editargetaudience = editTargetaudience(projectInfo, projectId);
            let editTargetIndustry = edittargetIndustry(projectInfo, projectId);
            let editdepartment = editDepartment(projectInfo, projectId);
            let editProjecttype = editprojecttype(projectInfo, projectId);
            let editSubjectAreamap = editSubjectarea(projectInfo, projectId);
            return resolve(projectId)
        }).catch(function (err) {
            console.log("create failed with error: " + err);
            return (resolve(err));
        });
    })
};

let editTargetaudience = async (projectInfo, projectId) => {
    let tagetlen = projectInfo.targetAudience;
    console.log(tagetlen);
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < tagetlen.length; i++) {
            let targetAudience = tagetlen[i].id;
            projectModel.getProjects.query(projectQuery.updateTargetid(targetAudience, projectId)).then((results, metadata) => {
                console.log(results);
                if (results[0][0][""] == 0) {
                    projectSchema.seqtargetcreate.create({
                        projectId: projectId,
                        targetaudience: targetAudience
                    })
                }
            });
        }
        return projectId;
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return (resolve(err));
    });
};

let edittargetIndustry = async (projectInfo, projectId) => {
    let targetIndustycount = projectInfo.targetIndustry
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < targetIndustycount.length; i++) {
            let targetIndustrydata = targetIndustycount[i].id;
            projectModel.getProjects.query(projectQuery.updatetargetIndustryid(targetIndustrydata, projectId)).then((results, metadata) => {
                if (results[0][0][""] == 0) {
                    projectSchema.seqtargetindustrycreate.create({
                        projectId: projectId,
                        targetIndustry: targetIndustrydata
                    })
                }
            });
        }
        return projectId;
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return (resolve(err));
    });
};

let editDepartment = async (projectInfo, projectId) => {
    let deptInvolved = projectInfo.departmentInvolved;
    console.log(deptInvolved);
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < deptInvolved.length; i++) {
            let deptinvolveddata = deptInvolved[i].id;
            projectModel.getProjects.query(projectQuery.updateDepartmentid(deptinvolveddata, projectId)).then((results, metadata) => {
                console.log(results);
                if (results[0][0][""] == 0) {
                    projectSchema.seqdepartmentcreate.create({
                        projectId: projectId,
                        departmentsInvolved: deptinvolveddata
                    })
                }
            });
        }
        return projectId;
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return (resolve(err));
    });
};

let editprojecttype = async (projectInfo, projectId) => {
    let projectTypes = projectInfo.projectType;
    console.log(projectTypes);
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < projectTypes.length; i++) {
            let projectTypesdata = projectTypes[i].id;
            projectModel.getProjects.query(projectQuery.updateProjectTypeid(projectTypesdata, projectId)).then((results, metadata) => {
                console.log(results);
                if (results[0][0][""] == 0) {
                    projectSchema.seqproject_typecreate.create({
                        projectId: projectId,
                        projectTypeId: projectTypesdata
                    })
                }
            });
        }
        return projectId;
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return (resolve(err));
    });
};

let editSubjectarea = async (projectInfo, projectId) => {
    let subjectDetails = projectInfo.subjectAreas;
    console.log(subjectDetails);
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < subjectDetails.length; i++) {
            let subjectDetailsdata = subjectDetails[i].id;
            projectModel.getProjects.query(projectQuery.updateSubjectareaid(subjectDetailsdata, projectId)).then((results, metadata) => {
                console.log(results);
                if (results[0][0][""] == 0) {
                    projectSchema.Subjectarea.create({
                        projectId: projectId,
                        subjectArea: subjectDetailsdata
                    })
                }
            });
        }
        return projectId;
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return (resolve(err));
    });
};
