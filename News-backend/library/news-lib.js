const news = {};
const newsModel = require("../models/news");

news.CreateNewsBookMarked = (data) => {
    return new Promise(async (resolve, reject) => {
        const BookMarkedNews = new newsModel({
            title: data.title,
            description: data.description,
            bookMarkedId: data.bookMarkedId,
        });

        await BookMarkedNews.save()
            .then(result => {
                return (resolve(result));
            }).catch(err => {
                console.log("create failed with error: " + err);
                return (resolve(err));
            });
    })
};

news.GetAllBookMarkedNews = () => {
    return new Promise(async (resolve, reject) => {
        await newsModel.find({})
            .then(items => {
                console.log(items)
                return (resolve(items));
            }).catch(err => {
                return (resolve(err));
            });
    })
};

module.exports = news;