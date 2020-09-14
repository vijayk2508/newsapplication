let mongoose = require('mongoose')
const db = require('../db/db');

const KeywordsExtractionSchema = new mongoose.Schema({
    keywordid: String,
    title: String,
    category: [
        {
            key: String,
            catid: String,
            cat: String,
        }
    ],
    synonyms: [],
    acronyms: String,
    antonyms: [],
    rels: String,
    frequency: Number,
    relevance: Number,
    description: String,
    tags: [],
    Entitytype: String,
    url: String,
    id: Number
},
    { strict: false, toJSON: true, collection: "keywordsextraction" }
);

exports.KeywordsExtractionModel = mongoose.model("keywordsextraction", KeywordsExtractionSchema);


