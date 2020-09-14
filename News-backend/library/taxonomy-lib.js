const taxonomy = {};
const taxonomyData = require('../data/taxonomy-data');
const fileParser = require('../helper/fileParser');
const fs = require("fs");
const jwtValidator = require('../auth/jwtValidation');

taxonomy.createProject = (req) => {
    return new Promise((resolve, reject) => {
        // let departments = req.body.department;
        // let settingsObj = req.settings;
        // let projectId = req.projectId;
        // let created = new Date(new Date().toUTCString());
        console.log("library", req.headers['authorization']);
        let token = jwtValidator.decodedToken(req.headers['authorization'])
    });
};

taxonomy.getHierarchies = (fields, files) => {
    return new Promise((resolve, reject) => {
        taxonomyData.getHierarchies(files.file.path).then(result => {
            return resolve(result)
        })
    })
}

taxonomy.parseHierarchies = (fields, files) => {
    return new Promise((resolve, reject) => {
        console.log("library", fields, files);
        fileParser.csvParser(files.file.path, files.file.name);
    });
};

taxonomy.getTaxonomies = (projectId, userData) => {
    return new Promise((resolve, reject) => {
        taxonomyData.getTaxonomies(projectId, userData["userId"]).then(result => {
            return resolve(result)
        })
    });
};

//get Taxonomy attributes
taxonomy.getAttributes = () => {
    return new Promise((resolve, reject) => {
        taxonomyData.getAttributes().then(result => {
            return resolve(result);
        })
    });
};

taxonomy.createTaxonomy = (userData, taxonomyInfo) => {
    return new Promise((resolve, reject) => {
        taxonomyData.createTaxonomy(userData.userId, taxonomyInfo).then(result => {
            return resolve(result);
        })
    });
};

taxonomy.getTaxonomyTree = (taxonomyAttrib, userData) => {
    let taxonomyInfo = {
        taxonomyId: taxonomyAttrib.taxonomyId,
        projectId: taxonomyAttrib.projectId,
        startIndex: taxonomyAttrib.startIndex,
        lastIndex: taxonomyAttrib.lastIndex,
        userId: userData.userId
    }
    return new Promise((resolve, reject) => {
        taxonomyData.getTaxonomyTree(taxonomyInfo).then(result => {
            return resolve(result);
        })
    });
};
taxonomy.getCurrentTaxonomy = (taxonomyAttrib, userData) => {
    let taxoAttrib = {
        taxonomyId: taxonomyAttrib.taxonomyId,
        projectId: taxonomyAttrib.projectId,
        userId: userData.userId
    };
    return new Promise((resolve, reject) => {
        taxonomyData.getCurrentTaxonomy(taxoAttrib).then(result => {
            return resolve(result);
        })
    });
}
taxonomy.createTaxonomyTree = (fields, files, userData) => {
    let taxonomyAttrib = {
        taxonomyId: fields.taxonomyId,
        projectId: fields.projectId,
        userId: userData.userId,
        levels: fields.hierarchies.split(","),
        root: fields.root,
        file: files.file.path,
        fileName: files.file.name
    };
    return new Promise((resolve, reject) => {
        taxonomyData.createTree(taxonomyAttrib).then(result => {
            return resolve(result);
        })
    });
};

taxonomy.updateTree = (userData, taxonomyAttrib) => {
    let taxoAttrib = {
        taxonomyId: taxonomyAttrib.taxonomyId,
        projectId: taxonomyAttrib.projectId,
        userId: userData.userId,
        levelId: taxonomyAttrib.parentId,
        name: taxonomyAttrib.treeNode.name
    };
    return new Promise((resolve, reject) => {
        taxonomyData.updateTree(taxoAttrib).then(result => {
            return resolve(result);
        })
    });
};

taxonomy.getChildNodes = (taxonomyAttrib) => {
    let taxoAttrib = {
        taxonomyId: taxonomyAttrib.taxonomyId, projectId: taxonomyAttrib.projectId, parentId: taxonomyAttrib.parentId
    };
    return new Promise((resolve, reject) => {
        taxonomyData.getChildNodes(taxoAttrib).then(result => {
            return resolve(result);
        }, err => { console.log(err, "testscwo"); return reject(err) })
    });
};
taxonomy.dragNdropNodes = (userData, taxonomyAttrib) => {
    let taxoAttrib = {
        taxonomyId: taxonomyAttrib.taxonomyId,
        projectId: taxonomyAttrib.projectId,
        userId: userData.userId,
        dragId: taxonomyAttrib.dragId,
        dropId: taxonomyAttrib.dropId
    };
    return new Promise((resolve, reject) => {
        taxonomyData.dragNdropNodes(taxoAttrib).then(result => {
            return resolve(result);
        })
    });
};
taxonomy.setRelationShip = (userData, taxonomyAttrib) => {
    let taxoAttrib = {
        taxonomyId: taxonomyAttrib.nodeId,
        projectId: taxonomyAttrib.projectId,
        sourceId: taxonomyAttrib.sourceId,
        destId: taxonomyAttrib.destId,
        relationTitle: taxonomyAttrib.relationTitle,
        primaryLineType: taxonomyAttrib.primaryLineType,
        primaryLineColor: taxonomyAttrib.primaryLineColor,
        primaryDirectionType: taxonomyAttrib.primaryDirectionType,
        userId: userData.userId
    };
    console.log(taxoAttrib);
    return new Promise((resolve, reject) => {
        taxonomyData.setRelationShip(taxoAttrib).then(result => {
            return resolve(result);
        })
    })
};
taxonomy.deleteRelation = (userData, taxonomyAttrib) => {
    let taxoAttrib = {
        taxonomyId: taxonomyAttrib.nodeId,
        projectId: taxonomyAttrib.projectId,
        sourceId: taxonomyAttrib.sourceId,
        destId: taxonomyAttrib.destId,
        userId: userData.userId
    };
    return new Promise((resolve, reject) => {
        taxonomyData.deleteRelation(taxoAttrib).then(result => {
            return resolve(result);
        })
    })
};
taxonomy.editRelation = (userData, taxonomyAttrib) => {
    let taxoAttrib = {
        taxonomyId: taxonomyAttrib.nodeId,
        projectId: taxonomyAttrib.projectId,
        sourceId: taxonomyAttrib.sourceId,
        destId: taxonomyAttrib.destId,
        relationTitle: taxonomyAttrib.updateData.relationTitle,
        primaryLineType: taxonomyAttrib.updateData.primaryLineType,
        primaryLineColor: taxonomyAttrib.updateData.primaryLineColor,
        primaryDirectionType: taxonomyAttrib.updateData.primaryDirectionType,
        userId: userData.userId
    };
    return new Promise((resolve, reject) => {
        taxonomyData.editRelation(taxoAttrib).then(result => {
            return resolve(result);
        })
    })
};
taxonomy.addNode = (userData, taxonomyAttrib) => {
    let id = taxonomyAttrib.parentId + taxonomyAttrib.treeNode[0]['name'].substring(0, 3);
    console.log(taxonomyAttrib)
    console.log(id,"hahaha id",taxonomyAttrib.parentId + taxonomyAttrib.treeNode[0]['name'].substring(0, 3));
    let taxoAttrib = {
        taxonomyId: taxonomyAttrib.taxonomyId,
        projectId: taxonomyAttrib.projectId,
        name: taxonomyAttrib.treeNode[0]['name'],
        parentId: taxonomyAttrib.parentId,
        id: id,
        LevelID: taxonomyAttrib.treeNode[0]['LevelId'],
        LevelName: taxonomyAttrib.treeNode[0]['LevelName'],
        insertNodeID: taxonomyAttrib.treeNode[0]['id'],
        userId: userData.userId
    };
    console.log(taxoAttrib);
    return new Promise((resolve, reject) => {
        taxonomyData.addNode(taxoAttrib).then(result => {
            return resolve(result);
        })
    })
}
module.exports = taxonomy;