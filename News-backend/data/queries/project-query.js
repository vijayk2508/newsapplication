exports.getProjectQuery = (userId) => {
    let Query = `SELECT project.projectName AS title, project.projectDescription AS description, project.createdBy AS userId, project.projectUuid,projectGoal,createdAt as createDate,dateFrom as startDate,dateTo as endDate,

    (SELECT departments_involved.departmentsInvolvedName as [name],project_department_involved_map.projectDepartmentInvolvedMapId as id FROM project_department_involved_map INNER JOIN
    departments_involved ON project_department_involved_map.departmentsInvolved = departments_involved.departmentsInvolvedId
    WHERE project.projectUuid = project_department_involved_map.projectId FOR JSON PATH) AS departmentInvolved,

    (SELECT target_audience.targetAudienceName as [name], project_target_audience_map.targetaudience AS id
    FROM  target_audience INNER JOIN project_target_audience_map ON target_audience.targetAudienceId = project_target_audience_map.targetaudience
    WHERE project.projectUuid = project_target_audience_map.projectId
    FOR JSON PATH) AS targetAudience,

    (SELECT target_Industry.targetIndustryName as [name], project_industry_map.targetIndustry AS id
    FROM  target_Industry INNER JOIN project_industry_map ON target_Industry.targetIndustryId = project_industry_map.targetIndustry
    WHERE project.projectUuid = project_industry_map.projectId
    FOR JSON PATH) AS targetIndustry,

    (SELECT project_subject_areas.projectSubjectAreaName as [name], project_subject_area_map.subjectArea AS id
    FROM  project_subject_areas INNER JOIN project_subject_area_map ON project_subject_areas.projectSubjectAreaId = project_subject_area_map.subjectArea
    WHERE project.projectUuid = project_subject_area_map.projectId
    FOR JSON PATH) AS subjectAreas,

    (SELECT project_type.projectTypeName as [name], project_type_map.projectTypeId AS id
    FROM  project_type INNER JOIN project_type_map ON project_type.projectTypeId = project_type_map.projectTypeId
    WHERE project.projectUuid = project_type_map.projectId
    FOR JSON PATH) AS projectType,

    (Select operating_units.operatingUnitName as [name],project.operatingUnits as [id] FROM project Inner Join operating_units on project.operatingUnits = operating_units.operatingUnitId 
    where operating_units.operatingUnitId = project.operatingUnits
    FOR JSON PATH) AS operatingUnits

    FROM project Where project.createdBy = ${userId} and project.archive=1`
    return Query;
    // FROM project Where project.createdBy = 4`;
}
exports.getProjectInfoQuery = (projectId) => {
    let Query = `SELECT project.projectName AS title, project.projectDescription AS description, project.createdBy AS userId, project.projectUuid,projectGoal,createdAt as createDate,dateFrom as startDate,dateTo as endDate,

    (SELECT departments_involved.departmentsInvolvedName as [name],project_department_involved_map.projectDepartmentInvolvedMapId as id FROM project_department_involved_map INNER JOIN
    departments_involved ON project_department_involved_map.departmentsInvolved = departments_involved.departmentsInvolvedId
    WHERE project.projectUuid = project_department_involved_map.projectId FOR JSON PATH) AS departmentInvolved,

    (SELECT target_audience.targetAudienceName as [name], project_target_audience_map.targetaudience AS id
    FROM  target_audience INNER JOIN project_target_audience_map ON target_audience.targetAudienceId = project_target_audience_map.targetaudience
    WHERE project.projectUuid = project_target_audience_map.projectId
    FOR JSON PATH) AS targetAudience,

    (SELECT target_Industry.targetIndustryName as [name], project_industry_map.targetIndustry AS id
    FROM  target_Industry INNER JOIN project_industry_map ON target_Industry.targetIndustryId = project_industry_map.targetIndustry
    WHERE project.projectUuid = project_industry_map.projectId
    FOR JSON PATH) AS targetIndustry,

    (SELECT project_subject_areas.projectSubjectAreaName as [name], project_subject_area_map.subjectArea AS id
    FROM  project_subject_areas INNER JOIN project_subject_area_map ON project_subject_areas.projectSubjectAreaId = project_subject_area_map.subjectArea
    WHERE project.projectUuid = project_subject_area_map.projectId
    FOR JSON PATH) AS subjectAreas,

    (SELECT project_type.projectTypeName as [name], project_type_map.projectTypeId AS id
    FROM  project_type INNER JOIN project_type_map ON project_type.projectTypeId = project_type_map.projectTypeId
    WHERE project.projectUuid = project_type_map.projectId
    FOR JSON PATH) AS projectType,

    (Select operating_units.operatingUnitName as [name],project.operatingUnits as [id] FROM project Inner Join operating_units on project.operatingUnits = operating_units.operatingUnitId 
    where operating_units.operatingUnitId = project.operatingUnits
    FOR JSON PATH) AS operatingUnits

    FROM project Where ProjectUuid = '${projectId}' and project.archive=1`
    return Query;
    // FROM project Where project.createdBy = 4`;
};
exports.getGroupsQuery = () => {
    return `select groupId, groupName from [group]`;
};
exports.getAppProjectCount = (app, projectId) => {
    return `SELECT  count(*)  as Indesx from  ${app}  where projectId='${projectId}'`;
};
exports.getTextMiningProjectCount = (app, projectId) => {
    return `SELECT  count(*)  as Indesx from  ${app}  where projectUuid='${projectId}'`;
};
exports.getVocabularyQuery = (projectId) => {
    return `SELECT   project.projectUuid as projectId,
    project.projectName as projectName,project.projectDescription as projectDesc,vocabulary.vocabularyId,vocabulary.vocabularyName,vocabulary.[description] as vocabularydesp
    from [project]  inner join vocabulary on[project].projectUuid = vocabulary.projectId
    where vocabulary.projectId =  '${projectId}' and project.archive=1`
};
exports.getTaxonomyQuery = (projectId) => {
    return `SELECT   project.projectUuid as projectId,
    project.projectName as projectName,project.projectDescription as projectDesc,taxonomyCreation.taxonomyUuid as taxonomyId,taxonomyCreation.taxonomyName,taxonomyCreation.[description] as vocabularydesp
     from [project]  inner join taxonomyCreation on [project].projectUuid = taxonomyCreation.projectId
    where taxonomyCreation.projectId =  '${projectId}' and project.archive=1`
};
exports.getETLQuery = (projectId) => {
    return `SELECT distinct   project.projectUuid as projectId,
    project.projectName as projectName,project.projectDescription as projectDesc
    from [project] inner join project_process on project_process.projectId =  [project].projectUuid
    where project_process.projectId =  '${projectId}' and project.archive=1`
};
exports.getTextMiningQuery = (projectId) => {
    console.log(`SELECT   project.projectUuid as projectId,
    project.projectName as projectName,project.projectDescription as projectDesc,textmining.textMiningId,textmining.modelName,textmining.[description] as vocabularydesp
     from [project]  inner join textmining on[project].projectUuid = textmining.projectuuid
    where textmining.projectuuid =  '${projectId}'`)
    return `SELECT   project.projectUuid as projectId,
    project.projectName as projectName,project.projectDescription as projectDesc,textmining.textMiningId,textmining.modelName,textmining.[description] as vocabularydesp
    from [project]  inner join textmining on[project].projectUuid = textmining.projectuuid
    where textmining.projectuuid =  '${projectId}' and project.archive=1`
};
exports.getQuestionQuery = (projectId) => {
    return `select * from Questionslist`
};
exports.getConsensusQuery = (projectId, gid) => {
    return `SELECT   project.projectUuid as projectId,project_user_role_map.groupId,
    project.projectName as projectName,project.projectDescription as projectDesc,vocabulary.vocabularyName,vocabulary.[description] as vocabularydesp
    from [project]  inner join vocabulary on[project].projectUuid = vocabulary.projectId
    inner join project_user_role_map on project_user_role_map.projectId = vocabulary.projectId
    inner join[group] on project_user_role_map.groupId =[group].groupId where vocabulary.projectId =  '${projectId}'  and project_user_role_map.groupId = '${gid}' and project.archive=1`
};
exports.getProjectType = () => {
    return `Select projectTypeId as id,projectTypeName as [name] from project_type`
};
exports.getOperatingUnits = () => {
    return `Select OperatingUnitId as id,OperatingUnitName as [name] from operating_Units`
};
exports.getTargetIndustry = () => {
    return `Select targetIndustryId as id,targetIndustryName as [name] from target_industry`
};
exports.getTargetAudience = () => {
    return `Select targetAudienceId as id,targetAudienceName as [name] from target_audience`
};
exports.getDepartments = () => {
    return `Select departmentsInvolvedId as id,departmentsInvolvedName as [name] from departments_involved`
};
exports.getSubjectArea = () => {
    return `Select projectSubjectAreaId as id,projectSubjectAreaName as [name] from project_subject_areas`
};
exports.getFeatures = () => {
    return `Select A.featureName,B.sub_featureName from features A Join sub_project_features B On A.featureId = B.featureId`
};

exports.getdistinctFeatures = () => {
    return `Select A.featureName from features A`
};

exports.createdb = (dbName) => {
    console.log("Create Database dbName");
    return `Create Database ${dbName}`
};

exports.getProjecttitle = (projectId) => {
    return `Select projectName as title from project where projectUuid =  '${projectId}' and archive=1`
};
exports.getProjectName = (projectId) => {
    console.log(projectId, "hahaha")
    return `Select ProjectName as title from project where projectUuid = '${projectId}' and archive=1`
};

exports.deleteProjectName = (projectId) => {
    return `select distinct table_name from INFORMATION_SCHEMA.COLUMNS where COLUMN_NAME like '%projectId%' and table_name = 'project'`
};

exports.getChildtable = (projectId) => {
    return `select distinct table_name from INFORMATION_SCHEMA.COLUMNS where COLUMN_NAME like '%projectId%' and table_name != 'project'`
};
exports.deleteChildtable = (tableName, projectId) => {
    return `delete  ${tableName}  where projectid = '${projectId}'`
};

exports.updateTargetid = (targetId, projectId) => {
    return `select count(targetaudience) from project_target_audience_map where targetaudience='${targetId}' and  projectId='${projectId}' `
};

exports.updatetargetIndustryid = (targetId, projectId) => {
    return `select count(targetIndustry) from project_industry_map where targetIndustry='${targetId}' and  projectId='${projectId}' `
};

exports.updatetargetIndustryid = (targetId, projectId) => {
    return `select count(departmentsInvolved) from project_department_involved_map where departmentsInvolved='${targetId}' and  projectId='${projectId}' `
};

exports.updateProjectTypeid = (targetId, projectId) => {
    return `select count(projectTypeId) from project_type_map where projectTypeId='${targetId}' and  projectId='${projectId}' `
};

exports.updateSubjectareaid = (targetId, projectId) => {
    return `select count(subjectArea) from project_subject_area_map where subjectArea='${targetId}' and  projectId='${projectId}' `
};

exports.updateDepartmentid = (targetId, projectId) => {
    return `select count(departmentsInvolved) from project_department_involved_map where departmentsInvolved='${targetId}' and  projectId='${projectId}' `
};

exports.getrecentQuestions = () => {
    return `select * from Questionslist`
};