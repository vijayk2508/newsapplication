const Sequelize = require('sequelize');
let mongoose = require('mongoose')
const db = require('../db/db');
let dynamicModel = {};
exports.TaxonomyCreation = db.define('TaxonomyCreation', {
    taxonomyUuid: {
        type: Sequelize.STRING,
        allowNull: false
    },
    taxonomyName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    taxonomyType: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    recommendationStatus: {
        type: Sequelize.STRING,
        allowNull: true
    },
    autoSyncStatus: {
        type: Sequelize.STRING,
        allowNull: true
    },
    projectId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    levelsCount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
}, {
    freezeTableName: true,
    tableName: 'taxonomyCreation',
    timestamps: false
})
exports.TaxonomyDepartment = db.define('taxonomy_departments_map', {
    department: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    taxonomyId: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    freezeTableName: true,
    tableName: 'taxonomy_departments_map',
    timestamps: false
});
exports.TaxonomySettingsMap = db.define('taxonomy_settings_map', {
    taxonomySettingsId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    taxonomyMatrixId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    taxonomyId: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    freezeTableName: true,
    tableName: 'taxonomy_settings_map',
    timestamps: false
});

exports.getTreeSchema = (modelName, collection) => {
    return mongoose.model(modelName, new mongoose.Schema({}, { strict: false, toJSON: true, collection: collection }));
};

exports.createDynamicmodel = (modelname, collection) => {
    return mongoose.model(modelname, new mongoose.Schema({}, { strict: false, toJSON: true, collection: collection }));
}



exports.TaxonomySettingsMatrix = db.define('TaxonomySettingsMatrix', {},
    {
        freezeTableName: true,
        tableName: 'taxonomySettings_matrix',
        timestamps: false
    });
exports.TaxonomySettings = db.define('TaxonomySettings', {},
    {
        freezeTableName: true,
        tableName: 'TaxonomySettings',
        timestamps: false
    });

exports.CreateTree = (modelname, collection) => {
    return mongoose.model(modelname, new mongoose.Schema({
        parentId: {
            type: String,
            required: false
        },
        name: {
            type: String,
            required: false
        },
        id: {
            type: String,
            required: false
        },
        createdAt: {
            type: String,
            required: false
        },
        updatedAt: {
            type: String,
            required: false
        },
        createdBy: {
            type: String,
            required: false
        },
        approvalStatus: {
            type: String,
            required: false
        },
        LevelName: {
            type: String,
            required: false
        },
        LevelId: {
            type: Number,
            required: false
        },
        Dscription: {
            type: String,
            required: false
        },
        updatedBy: {
            type: String,
            required: false
        },
        orphanStatus: {
            type: String,
            required: false
        },
        consensessMember: {
            type: Number,
            required: false
        },
        ApprovedCount: {
            type: Number,
            required: false
        },
        ApprovePending: {
            type: Number,
            required: false
        },
        primaryFontColor: {
            type: String,
            required: false
        },
        primaryFontSize: {
            type: String,
            required: false
        },
        primaryFontFamily: {
            type: String,
            required: false
        },
        primaryNodeColor: {
            type: String,
            required: false
        },
        rownum: {
            type: Number,
            required: false,
        },
        relationShip: {
            type: Array,
            required: false
        },
    }, { strict: true, toJSON: true, collection: collection }));
};
exports.importFile = (modelName, collection) => {
    return mongoose.model(modelName, new mongoose.Schema({}, { strict: false, toJSON: true, collection: collection }))
};
exports.SaveHierarchies = db.define('insertHierarchies', {
    hierarchyId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    taxonomyId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    rootnode: {
        type: Sequelize.STRING,
        allowNull: false
    },
    levels: {
        type: Sequelize.STRING,
        allowNull: false
    },
    projectId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tableName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    taxonomyTable: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    freezeTableName: true,
    tableName: 'hierarchies',
    timestamps: false
});
exports.UpdateLevelCount = db.define("UpdateLevelCount", {}, {
    freezeTableName: true,
    tableName: 'taxonomyCreation',
    timestamps: false
})
exports.UpdateTreeModel = (modelName, collection) => {
    return mongoose.model(modelName, new mongoose.Schema({}, { strict: false, toJSON: true, collection: collection }))
}