// import React, { useState, useEffect } from 'react';
// import { connect } from "react-redux";
// import { bindActionCreators } from 'redux'
// import CountryDropdown from './Dropdown/Country/index';
// import CategoryDropDown from './Dropdown/Category/index';
// import axios from 'axios';
// import './index.css';
// import './style.css';
// import * as NewsAction from '../../action-reducer/news/newsActions'
// import NewsModal from './Modal/index';
// import DeleteNewsModal from './Modal/deleteNews';
// import newsConstants from '../../action-reducer/news/newsConstants';
// import Pagination from './Pagination';


// function NewsList(props) {
//     const [showNewsModal, setNewsModal] = useState(false);
//     const [newsArray, setNewsArray] = useState([]);
//     const [bookMarkedNewsArray, setBookMarkedNewsArray] = useState([]);
//     const [actionType, setActionType] = useState('');
//     const [editIndex, setEditIndex] = useState(null)
//     const [newsCrudAction, setnewsCrudAction] = useState({})
//     const [showDeleteNewsModal, setDeleteNewsModal] = useState(false);

//     const [loading, setLoading] = useState(undefined);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [newsPerPage, setNewsPerPage] = useState(4);



//     useEffect(() => {
//         props.NewsActions.GetResponseSendToReducer()
//     }, []);

//     useEffect(() => {
//         props.NewsActions.GetAllBookMarked()
//     }, []);

//     useEffect(() => {
//         if (props.NewsDataArray == undefined) {
//             setNewsArray([])
//             setLoading(false);
//         } else {
//             setLoading(true);
//             setNewsArray(props.NewsDataArray)
//             props.NewsActions.GetAllBookMarked()
//         }
//     }, [props.NewsDataArray]);

//     useEffect(() => {
//         if (props.bookmarkednewsArray == undefined) {
//             setBookMarkedNewsArray([])
//         } else {
//             setBookMarkedNewsArray(props.bookmarkednewsArray)
//         }

//     }, [props.bookmarkednewsArray])

//     const editNewsClick = (idx) => {
//         setnewsCrudAction(
//             {
//                 index: idx,
//                 actionType: newsConstants.EditNews
//             }
//         )

//         //setEditIndex(idx)
//         //setActionType(newsConstants.EditNews)
//         setNewsModal(true);
//     }

//     const deleteNewsClick = (idx) => {
//         // setEditIndex(idx)
//         // setActionType(newsConstants.DeleteNews)
//         setnewsCrudAction(
//             {
//                 index: idx,
//                 actionType: newsConstants.DeleteNews
//             });

//         setDeleteNewsModal(true)
//     }

//     const bookmarkedNewsClick = (idx) => {
//         let data = {
//             index: idx,
//             newsData: props.NewsDataArray[idx]
//         };
//         props.NewsActions.Crud(props.NewsDataArray, data, newsConstants.Bookmarked);
//     }

//     const addNewsClick = () => {
//         //setActionType(newsConstants.AddNews)
//         setnewsCrudAction(
//             {
//                 index: null,
//                 actionType: newsConstants.AddNews
//             });

//         setNewsModal(true)
//     }

//     const indexOfLastNews = currentPage * newsPerPage;

//     const indexOfFirstNews = indexOfLastNews - newsPerPage;

//     const currentNewsList = newsArray.slice(indexOfFirstNews, indexOfLastNews)

//     const paginate = (pageNumber) => setCurrentPage(pageNumber)

//     return (
//         <div>
//             <div className="row custom-row">
//                 <div className="col-md-12">
//                     <p className="heading">
//                         Latest News
//                      </p>
//                 </div>
//             </div>
//             <div className="row custom-row">
//                 {
//                     loading &&
//                         currentNewsList !== undefined && currentNewsList.length > 0 ?

//                         currentNewsList.map((datum, idx) => (
//                             <div className="col-lg-3 col-md-3" key={idx} id={idx}>
//                                 <div className="card vocabulary-list-card">
//                                     <div className="dropdown project-down">
//                                         <a
//                                             className="dropdown-default"
//                                             data-toggle="dropdown"
//                                             aria-haspopup="true"
//                                             aria-expanded="true"
//                                             href="# "
//                                         >
//                                             <i className="fa fa-ellipsis-v" />
//                                         </a>

//                                         <ul className="dropdown-menu dropdown-menu-right">
//                                             <li>
//                                                 <a className="dropdown-item" href="# " onClick={() => { editNewsClick(idx) }} >
//                                                     Edit
//                                              </a>
//                                             </li>
//                                             <li>
//                                                 <a className="dropdown-item" href="# " onClick={() => { deleteNewsClick(idx) }}>
//                                                     Delete
//                                              </a>
//                                             </li>
//                                             <li>
//                                                 <a className="dropdown-item" href="# " onClick={() => bookmarkedNewsClick(idx)}>
//                                                     Bookmarked
//                                              </a>
//                                             </li>
//                                         </ul>
//                                     </div>
//                                     <div className="card-body no-border">
//                                         <div className="cardheader">
//                                             <h6 className="card-name">
//                                                 {datum.title != undefined && datum.title.length > 10 ? `${datum.title.substring(0, 30)}...` : datum.title}
//                                             </h6>
//                                         </div>
//                                         <div class="thumbnail">
//                                             <img className="news-img" src={datum.urlToImage}></img>
//                                         </div>
//                                         <div className="card-content">
//                                             <p>{datum.description != undefined && datum.description.length >= 500 ? `${datum.description.substring(0, 500)}...` : datum.description}</p>
//                                             {datum.bookmarked && <i class="fa fa-bookmark"></i>}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )) : loading == true && <div className="col-md-12">Record not found.</div>
//                 }
//                 <div className="col-md-12">
//                     <Pagination newsPerPage={newsPerPage} totalNews={newsArray.length} paginate={paginate}></Pagination>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default NewsList;