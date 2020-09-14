import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import CountryDropdown from './Dropdown/Country/index';
import CategoryDropDown from './Dropdown/Category/index';
import axios from 'axios';
import './index.css';
import './style.css';
import * as NewsAction from '../../action-reducer/news/newsActions'
import NewsModal from './Modal/index';
import DeleteNewsModal from './Modal/deleteNews';
import newsConstants from '../../action-reducer/news/newsConstants';
import Pagination from './Pagination';
import BookMarkedNewsList from './BookMarkedNewsList';


function News(props) {
    const [showNewsModal, setNewsModal] = useState(false);
    const [newsArray, setNewsArray] = useState([]);
    // const [bookMarkedNewsArray, setBookMarkedNewsArray] = useState([]);
    // const [actionType, setActionType] = useState('');
    // const [editIndex, setEditIndex] = useState(null)
    const [newsCrudAction, setnewsCrudAction] = useState({})
    const [showDeleteNewsModal, setDeleteNewsModal] = useState(false);

    const [loading, setLoading] = useState(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [newsPerPage, setNewsPerPage] = useState(4);


    /*
      author:
      content: 
      description:
      publishedAt: "2019-12-19T09:06:00Z"
      source:
      title:
      url: 
      urlToImage: 
    */

    useEffect(() => {
        props.GetResponseSendToReducer()
    }, []);

    useEffect(() => {
        props.GetAllBookMarked()
    }, []);

    useEffect(() => {
        if (props.NewsDataArray == undefined) {
            setNewsArray([])
            setLoading(false);
        } else {
            setLoading(true);
            setNewsArray(props.NewsDataArray)
            props.GetAllBookMarked()
        }
    }, [props.NewsDataArray]);

    // useEffect(() => {
    //     if (props.bookmarkednewsArray == undefined) {
    //         setBookMarkedNewsArray([])
    //     } else {
    //         setBookMarkedNewsArray(props.bookmarkednewsArray)
    //     }

    // }, [props.bookmarkednewsArray])

    const editNewsClick = (id) => {
        setnewsCrudAction(
            {
                id: id,
                actionType: newsConstants.EditNews
            }
        )

        //setEditIndex(idx)
        //setActionType(newsConstants.EditNews)
        setNewsModal(true);
    }

    const deleteNewsClick = (id) => {
        // setEditIndex(idx)
        // setActionType(newsConstants.DeleteNews)
        setnewsCrudAction(
            {
                id: id,
                actionType: newsConstants.DeleteNews
            });

        setDeleteNewsModal(true)
    }

    const bookmarkedNewsClick = (id) => {
        let data = {
           id : id 
        };
        props.NewsCrudActions(newsArray, data, newsConstants.Bookmarked);
    }

    const addNewsClick = () => {
        //setActionType(newsConstants.AddNews)
        setnewsCrudAction(
            {
                id: 0,
                actionType: newsConstants.AddNews
            });

        setNewsModal(true)
    }

    const indexOfLastNews = currentPage * newsPerPage;

    const indexOfFirstNews = indexOfLastNews - newsPerPage;

    const currentNewsList = newsArray.slice(indexOfFirstNews, indexOfLastNews)
    

    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    return (
        <div>

            <div className="row custom-row">
                <div className="col-md-3">
                    <CountryDropdown {...props}></CountryDropdown>
                </div>
                <div className="col-md-3">
                    <CategoryDropDown {...props}></CategoryDropDown>
                </div>
                <div>
                    <div>
                        <button className="custom-btn" size="sm" onClick={addNewsClick}>   Add News </button>

                    </div>
                    {
                        showNewsModal && <NewsModal crudAction={newsCrudAction} {...props} show={showNewsModal} onClose={() => setNewsModal()} />
                    }
                    {
                        showDeleteNewsModal && <DeleteNewsModal crudAction={newsCrudAction} {...props} show={showDeleteNewsModal} onClose={() => setDeleteNewsModal()} />
                    }
                </div>
            </div>

            <div className="row custom-row">
                <div className="col-md-12">
                    <p className="heading">
                        Latest News
                     </p>
                </div>
            </div>
            <div className="row custom-row">
                {
                    loading && currentNewsList.length > 0 ?

                        currentNewsList.map((datum, idx) => (
                            <div className="col-lg-3 col-md-3" key={idx} id={idx}>
                                <div className="card vocabulary-list-card">
                                    <div className="dropdown project-down">
                                        <a
                                            className="dropdown-default"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="true"
                                            href="# "
                                        >
                                            <i className="fa fa-ellipsis-v" />
                                        </a>
                                        {/* <ul className={`dropdown-menu dropdown-menu-right${item.active ? "show" : ""}`}> */}
                                        <ul className="dropdown-menu dropdown-menu-right">
                                            <li>
                                                <a className="dropdown-item" href="# " onClick={() => { editNewsClick(datum.id) }} >
                                                    Edit
                                             </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="# " onClick={() => { deleteNewsClick(datum.id) }}>
                                                    Delete
                                             </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="# " onClick={() => bookmarkedNewsClick(datum.id)}>
                                                    Bookmarked
                                             </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="card-body no-border">
                                        <div className="cardheader">
                                            <h6 className="card-name">
                                                {datum.title != undefined && datum.title.length > 10 ? `${datum.title.substring(0, 30)}...` : datum.title}
                                            </h6>
                                        </div>
                                        <div class="thumbnail">
                                            <img className="news-img" src={datum.urlToImage}></img>
                                        </div>
                                        <div className="card-content">
                                            <p>{datum.description != undefined && datum.description.length >= 500 ? `${datum.description.substring(0, 500)}...` : datum.description}</p>
                                            {datum.bookmarked && <i class="fa fa-bookmark"></i>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : loading == true && <div className="col-md-12">Record not found.</div>
                }
                <div className="col-md-12">
                    <Pagination newsPerPage={newsPerPage} totalNews={newsArray.length} paginate={paginate}></Pagination>
                </div>
            </div>

            <BookMarkedNewsList {...props}></BookMarkedNewsList>
        </div>
    )
}


//export default UserList;
const mapStateToProps = (state) => {
    return {
        NewsDataArray: state.news.news,
        sourceDataArray: state.news.source,
        bookmarkednewsArray: state.news.bookmarkednews

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        //NewsActions: bindActionCreators(NewsAction, dispatch)
        NewsCrudActions : (oldArray, data, type) => dispatch(NewsAction.Crud(oldArray, data, type)),
        GetResponseSendToReducer : (category,country) => dispatch(NewsAction.GetResponseSendToReducer(category,country)),
        GetAllBookMarked : () => dispatch(NewsAction.GetAllBookMarked()),
        GetNewsCategory : ()=> dispatch(NewsAction.GetNewsCategory()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(News);