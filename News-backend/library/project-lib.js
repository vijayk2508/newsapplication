const projectData = require('../data/project-data');
const jwtValidator = require("../auth/jwtValidation");

//get all projects
exports.getProject = (userData) => {
    return new Promise((resolve, reject) => {
        console.log(userData, "user");
        projectData.getProjects(userData).then(result => {
            return resolve(result);
        })
    });
};

//get particular project info
exports.getProjectInfo = (projectId) => {
    return new Promise((resolve, reject) => {
        projectData.getProjectInfo(projectId).then(result => {
            return resolve(result);
        })
    });
};

//get app'wise project infos based on main project
exports.getRecentProjectInfo = (projectId) => {
    return new Promise((resolve, reject) => {
        projectData.getRecentProjectInfo(projectId).then(result => {
            console.log(result);
            return resolve(result);
        })
    });
};

//get project attributes
exports.getAttributes = () => {
    return new Promise((resolve, reject) => {
        projectData.getAttributes().then(result => {
            return resolve(result);
        })
    });
};


exports.createnewProject = (projectInfo, userData) => {
    return new Promise((resolve, reject) => {
        projectData.createProject(projectInfo, userData).then(result => {
            return resolve(result);
        })
    });
};



//get project attributes
exports.getProjectName = (projectId) => {
    return new Promise((resolve, reject) => {
        projectData.getProjectName(projectId).then(result => {
            console.log(result, "final");
            return resolve(result);
        })
    });
};


exports.editProjectdata = (projectInfo, userData) => {
    return new Promise((resolve, reject) => {
        projectData.projectEdit(projectInfo).then(result => {
            return resolve(result);
        })
    });
};

exports.deleteProjectdata = (projectInfo, userData) => {
    let userId = userData.userId;
    return new Promise((resolve, reject) => {
        projectData.deleteProjectrecord(projectInfo, userId).then(result => {
            return resolve(result);
        })
    });
};
