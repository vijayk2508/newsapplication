//delete textmining  where projectUuid='" + ProjectID + "' and textMiningId='" + textMiningId + "'"

exports.deleteTextmining = (textminingId, projectId,userId) => {
    return `delete textmining  where projectUuid= '${projectId}' and textMiningId = '${textminingId}' and createdBy='${userId}'`
};

exports.getTableNameTable = (cardid, projectId) => {
    return `select tabname from textmining where textMiningId='${cardid}' and projectUuid='${projectId}'`
};


exports.getTextminingdetails = (cardid, projectId,userId) => {
    return `Select  textMiningId as textMiningId,id as id,modelName as List_name ,description as Description,domain as Domain,textminingType as Tags,createdBy as createdBy,tabname as tabname, projectUuid as ProjectID,createdAt as createdAt,updatedAt as updatedAt,extractionFields as Extraction_fields from TextMining where textMiningId='${cardid}' and projectUuid='${projectId}' and createdBy='${userId}'`
};


exports.gettextmining  = (projectId, userId) => {
    return `Select  textMiningId as textMiningId,id as id,modelName as List_name ,description as Description,domain as Domain,textminingType as Tags,createdBy as createdBy,tabname as tabname, projectUuid as ProjectID,createdAt as createdAt,updatedAt as updatedAt,extractionFields as Extraction_fields from TextMining where  projectUuid = '${projectId}' and createdBy = '${userId}'\n`
};

exports.updateTextmining = (projectId,textMiningId,Description, userId,List_name,Domain,Tags,Extraction_fields,updatedAt) => {
    return `Update TextMining set modelName='${List_name}' , description='${Description}',domain='${Domain}',textminingType='${ Tags }',extractionFields='${Extraction_fields}',updatedAt='${updatedAt}' where textMiningId='${textMiningId}' and projectUuid='${projectId}'  and createdBy='${userId}'`
};
