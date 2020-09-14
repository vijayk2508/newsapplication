const mongoose = require("mongoose");

module.exports = mongoose.model("BookmarkedNews",
    mongoose.Schema({
        title: String,
        description: String,
        bookMarkedId : String,
    }, { strict: false, collection: "BookmarkedNews" })
);