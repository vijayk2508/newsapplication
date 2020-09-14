import newsConstants from "./newsConstants";
import * as NEWSAPIConfig from './newsAPIConfig';
import axios from 'axios';
import sendApiRequest from "../../services/auth";
import apiEndpoints from "../../apiEndpoints";

export function GetAllBookMarked() {

    // return async dispatch => {
    //     await axios.get('http://127.0.0.1:3005/news/GetAllBookMarkedNews').then(res => {
    //         //console.log('get all',res.data.result);
    //         dispatch({ type: newsConstants.GetAllBookMarkedNews, data: res.data.result })
    //     })
    // }

    return async function(dispatch) {
        const response = await sendApiRequest({
          url: '/subject/getall', //http://localhost:5001/subject/getall
          method: "get",
        });
        if (response.status === "success") {
          // logged in successfully
          dispatch({ type: newsConstants.GetAllBookMarkedNews, data: response.data.result })
        } else {
          // error in logging in
         // onFailure(response);
        }
      };
}


export function GetResponseSendToReducer(...args) {
    let category = 'entertainment', country = 'us'
    if (args.length > 0) {
        category = args[0]
        country = args[1]
    }

    //let url = `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&apiKey=${key}`;
    const query = `category=${category==undefined? 'entertainment' : category}&country=${country==undefined?   'us': country}`;
    console.log(query);

    const newsurl = `${NEWSAPIConfig.topheadlineURL}&${query}`;

    return dispatch => {
        axios.get(newsurl).then(response => {
            //   console.log('news', newsurl)
            let newsArray = response.data.articles;
            newsArray = newsArray.map((obj, idx) => ({ ...obj, bookmarked: false, id: idx + 1 }))
            newsArray.sortBy = {
                country: country,
                category: category
            }
            dispatch({ type: newsConstants.GetResponseFromNewsAPI, data: newsArray })
        })
    }
}

export function GetNewsCategory() {
    let sourceurl = `${NEWSAPIConfig.sourceUrl}`;
    return dispatch => {
        axios.get(sourceurl).then(response => {
            //     console.log('source', sourceurl)
            let sourceArray = response.data.sources;
            //   console.log('actioon', sourceArray)
            dispatch({ type: newsConstants.GetSourceFromNewsAPI, sourcedata: sourceArray })
        })
    }
}


export function Crud(oldArray, data, type) {
    return async dispatch => {
        let tmp = [...oldArray]

        switch (type) {
            case newsConstants.AddNews: tmp.push(data)
                break
            case newsConstants.EditNews:
                let EditNewsidx = oldArray.findIndex((obj => obj.id == data.id));
                tmp = {
                    ...tmp,
                    [EditNewsidx]: {
                        ...tmp[EditNewsidx],
                        ...data
                    }
                }
                tmp = Object.values(tmp)
                break
            case newsConstants.DeleteNews:
            
            //tmp = tmp.filter((obj, i) => obj.id !== data.id);
             //delete tmp[data.index];

                let deleteObject = oldArray.filter((obj => obj.id == data.id));
                let i = tmp.indexOf(deleteObject[0]);
                if(i != -1) {
                 tmp.splice(i, 1);
                }
               
                break
            case newsConstants.Bookmarked:
                let currentData = oldArray.filter(x => x.id == data.id)
                await axios.post(`http://127.0.0.1:3005/news/createbookmarked`, currentData[0])
                    .then(res => {

                       let idx = oldArray.findIndex((obj => obj.id == data.id));
                        tmp = {
                            ...tmp,
                            [idx]: {
                                ...tmp[idx],
                                bookmarked: true
                            }
                        }

                        tmp = Object.values(tmp)
                    })
                break
            default: break
        }

        tmp.sortBy = oldArray.sortBy

        // console.log('final ',tmp)
        await dispatch({ type: newsConstants.GetResponseFromNewsAPI, data: tmp })
    }
}




    // let obj={ 
    //     "source":{ 
    //        "id":null,
    //        "name":"Thewrap.com"
    //     },
    //     "author":"Phil Owen",
    //     "title":"‘Star Wars: The Rise of Skywalker’ Actually Makes ‘The Last Jedi’ and ‘The Force Awakens’ Worse - TheWrap",
    //     "description":"Emperor Palpatine's epic shenanigans in \"Star Wars: The Rise of Skywalker\" are simply too crazy to make sense after the last two movies",
    //     "url":"http://www.thewrap.com/star-wars-the-rise-of-skywalker-actually-makes-the-last-jedi-and-the-force-awakens-worse-ix/",
    //     "urlToImage":"https://www.thewrap.com/wp-content/uploads/2019/12/star-wars-episode-ix-the-rise-of-skywalker-emperor-palpatine-makes-the-force-awakens-and-the-last-jedi-worse.jpg",
    //     "publishedAt":"2019-12-20T10:20:00Z",
    //     "content":"(Major spoilers ahead for “Star Wars: The Rise of Skywalker”)\r\nThere is a lot going on in “Star Wars: The Rise of Skywalker,” and it moves at a super fast pace in hopes that you won’t have enough time to think about how the pieces fit together. Because they d… [+7589 chars]"
    //  }