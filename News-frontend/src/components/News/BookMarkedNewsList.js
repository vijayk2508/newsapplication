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


function BookMarkedNewsList(props) {

    const [bookMarkedNewsArray, setBookMarkedNewsArray] = useState([]);
    const [loading, setLoading] = useState(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [newsPerPage, setNewsPerPage] = useState(4);


    useEffect(() => {
        // console.log('bookmarked', props.bookmarkednewsArray)
        if (props.bookmarkednewsArray == undefined) {
            setLoading(false);
            setBookMarkedNewsArray([])
        } else {
            setLoading(true);
            setBookMarkedNewsArray(props.bookmarkednewsArray)
        }

    }, [props.bookmarkednewsArray])

    const indexOfLastNews = currentPage * newsPerPage;

    const indexOfFirstNews = indexOfLastNews - newsPerPage;

    const currentBookMarkedNewsList = bookMarkedNewsArray.slice(indexOfFirstNews, indexOfLastNews)

    const paginate = (pageNumber) => setCurrentPage(pageNumber)



    return (
        <div>
            <div className="row custom-row">
                <div className="col-md-12">
                    <p className="heading">
                        Bookmarked News
                     </p>
                </div>
            </div>
            <div className="row custom-row">
                {
                

                loading && currentBookMarkedNewsList.length > 0 ?

                        currentBookMarkedNewsList.map((datum, idx) => (
                            <div className="col-lg-3 col-md-3" key={idx} id={idx}>
                                <div className="card vocabulary-list-card">
                                    <div className="card-body no-border">
                                        <div className="cardheader">
                                            <h6 className="card-name">
                                                {datum.title != undefined && datum.title.length > 10 ? `${datum.title.substring(0, 30)}...` : datum.title}
                                            </h6>
                                        </div>
                                        <div class="thumbnail">
                                            <img className="news-img" src={require('../../assets/img/default-img.png')}></img>
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
                    <Pagination newsPerPage={newsPerPage} totalNews={bookMarkedNewsArray.length} paginate={paginate}></Pagination>
                </div>
            </div>
        </div>
    )
}

export default BookMarkedNewsList;