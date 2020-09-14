//projectId = F13EDCEE-6820-4674-9B2B-11E68DC6805C cardid=5xaRxJ0E9tsp 
exports.getVocabularyTableNameQuery = (cardid, projectId) => {
    return `select tabname from vocabulary where vocabularyId='${cardid}' and projectid='${projectId}'`
};

exports.getVocabularyProjectQuery = (projectId) => {
    return `Select  * from vocabulary where projectid='${projectId}' order by id`
};


exports.InsertVocabularyQuery = (data) => {
    let query = `Insert Into Vocabulary (vocabularyId,projectId,createddate,vocabularyName,version,description,vocabularyType,industry,language,location,autofillStatus,createdBy,tabname,subjectareas)  values('${data.Vocabulary_Id}','${data.projectId}',${ new Date().getTime() },'${data.VocabularyName}','${data.Vocabulary_version}','${data.description}','${data.Vocabulary_Type}','${data.Industry_type_terminologies}','${data.language}','${data.location}','${data.checkes}',${data.createdBy},'${data.tabname}','${JSON.stringify(data.subjectAreas)}')`;

    console.log(query)
    return query; 
}

exports.deletevocabulary = (vocabularyId, projectId,userId) => {
    return `delete Vocabulary  where projectId= '${projectId}' and vocabularyId = '${vocabularyId}' and createdBy='${userId}'`
};
