exports.getTaxonomyQuery = (projectId, userId) => {
    return `select taxonomyUuid as id, taxonomyName as title, taxonomyType as type, description, recommendationStatus, autoSyncStatus, projectId,createdBy as [userId],createdAt as createdDate,updatedAt as updatedDate,levelsCount,\n
(Select department, departmentName from taxonomy_departments_map A Join taxonomyDepartments C on C.departmentId = A.department where taxonomyCreation.taxonomyUuid = A.taxonomyId\n
for Json Path, Include_Null_Values) as taxoDept,\n
(Select taxonomysettingsId, taxonomyMatrixId, settings,concat('[',[restrict],',',[permit],',',[changeProperties],',',[notifyMe],']')as matrix from taxonomy_settings_map A Join TaxonomySettings C on C.settingsId = A.taxonomysettingsId Join taxonomySettings_matrix D on A.taxonomyMatrixId = D.id where taxonomyCreation.taxonomyUuid = A.taxonomyId\n
for Json Path, Include_Null_Values) as taxoSettings\n
from taxonomyCreation taxonomyCreation where projectId = '${projectId}' and createdBy = '${userId}'\n`
};
exports.getTaxonomyTypeAttr = () => {
    return `Select taxonomyTypeId as id,taxonomyType as title from TaxonomyType`;
};
exports.getTaxonomySettingsAttr = () => {
    return `Select settingsId as id,settings as title from TaxonomySettings`;
};
exports.getTaxonomyDepartmentAttr = () => {
    return `Select departmentId as id,departmentName as title from taxonomyDepartments`;
};

//Get Taxonomy Query
exports.getTaxonomyInfoQuery = (taxonomyId, projectId, userId) => {
    return `select taxonomyUuid as id, taxonomyName as title, taxonomyType as type, description, recommendationStatus, autoSyncStatus, projectId,createdBy as [userId],createdAt as createdDate,updatedAt as updatedDate,levelsCount,\n
    (Select department, departmentName from taxonomy_departments_map A Join taxonomyDepartments C on C.departmentId = A.department where taxonomyCreation.taxonomyUuid = A.taxonomyId\n
    for Json Path, Include_Null_Values) as taxoDept,\n
    (Select taxonomysettingsId, taxonomyMatrixId, settings,concat('[',[restrict],',',[permit],',',[changeProperties],',',[notifyMe],']')as matrix from taxonomy_settings_map A Join TaxonomySettings C on C.settingsId = A.taxonomysettingsId Join taxonomySettings_matrix D on A.taxonomyMatrixId = D.id where taxonomyCreation.taxonomyUuid = A.taxonomyId\n
    for Json Path, Include_Null_Values) as taxoSettings\n
    from taxonomyCreation taxonomyCreation where taxonomyUuid = '${taxonomyId}' and projectId = '${projectId}' and createdBy = ${userId} \n`
};
exports.getTaxonomyTableQuery = (taxonomyId, projectId) => {
    return `Select taxonomyTable as tableName,r_tablename,rootnode as [name],levels from hierarchies Where projectId='${projectId}' and taxonomyId='${taxonomyId}'`
};
exports.getTaxonomyTreeQuery = (table, startIndex, lastIndex) => {
    return `SELECT parentId,name,id,primaryFontColor,primaryFontSize,primaryFontFamily,primaryNodeColor,LevelName,c.LevelId \n
    FROM(SELECT DISTINCT LevelId FROM ${table}) c \n
    CROSS APPLY(SELECT ROW_NUMBER() OVER(ORDER BY(select 0)) AS MyRowNumber, *FROM ${table} t \n
    WHERE \n
    Convert(int, c.LevelId) = Convert(int, t.LevelId) \n
    ) x where MyRowNumber between ${startIndex} and ${lastIndex} order by convert(int, c.levelId) \n`
};
exports.getCurrentTaxonomy = (taxonomyId, projectId, userId) => {
    return `select taxonomyName as title \n
    from taxonomyCreation taxonomyCreation where taxonomyUuid = '${taxonomyId}' and projectId = '${projectId}' and createdBy = ${userId}`
};
exports.getTaxonomySettingsMatrix = (arrOptions) => {
    return `Select id from taxonomySettings_matrix where [restrict] = '${arrOptions[0]}' and [permit] = '${arrOptions[1]}' and [changeProperties] = '${arrOptions[2]}' and [notifyMe] = '${arrOptions[3]}'`
}