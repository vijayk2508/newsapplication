const db = require('../db/db');
const Sequelize = require('sequelize');
exports.getProjects = db;


exports.seqProjectcreate = db.define('project', {
    // projectId: {
    //     type: Sequelize.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true
    // },
    projectUuid: {
        type: Sequelize.STRING,
        allowNull: true
    },
    projectName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    projectDescription: {
        type: Sequelize.STRING,
        allowNull: true
    },
    projectType: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    operatingUnits: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    projectGoal: {
        type: Sequelize.STRING,
        allowNull: true
    },
    workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    // projectVisibility: {
    //     type: Sequelize.STRING,
    //     allowNull: true
    // },
    projectStatus: {
        type: Sequelize.STRING,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    updatedAt: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    priorityId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    dbName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dateFrom: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    dateTo: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    archive: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    archive_by: {
        type: Sequelize.BIGINT,
        allowNull: true
    },

}, {
    freezeTableName: true,
    tableName: 'project',
    timestamps: false
})


exports.seqtargetcreate = db.define('project_target_audience_map', {
    projectId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    targetaudience: {
        type: Sequelize.INTEGER,
        allowNull: false
    }

}, {
    freezeTableName: true,
    tableName: 'project_target_audience_map',
    timestamps: false
})


exports.seqtargetindustrycreate = db.define('project_industry_map', {
    projectId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    targetIndustry: {
        type: Sequelize.INTEGER,
        allowNull: false
    }

}, {
    freezeTableName: true,
    tableName: 'project_industry_map',
    timestamps: false
})


exports.seqdepartmentcreate = db.define('project_department_involved_map', {
    projectId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    departmentsInvolved: {
        type: Sequelize.INTEGER,
        allowNull: false
    }

}, {
    freezeTableName: true,
    tableName: 'project_department_involved_map',
    timestamps: false
})


exports.seqproject_typecreate = db.define('project_type_map', {
    projectId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    projectTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }

}, {
    freezeTableName: true,
    tableName: 'project_type_map',
    timestamps: false
})


exports.Subjectarea = db.define('project_subject_area_map', {
    projectId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    subjectArea: {
        type: Sequelize.INTEGER,
        allowNull: false
    }

}, {
    freezeTableName: true,
    tableName: 'project_subject_area_map',
    timestamps: false
})