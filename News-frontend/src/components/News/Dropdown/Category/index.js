import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CategoryDropdown(props) {
    //const url = "https://newsapi.org/v2/sources?apiKey=6ebf3b591b4044d8bd10515c81bd6522";

    useEffect(() => {
        props.GetNewsCategory()
    }, [])

    const selectCategory=(e)=>{
        console.log('select category',e.target.value)
        let category = e.target.value ;
        console.log('category--------->', props.NewsDataArray)
        let country= (props.NewsDataArray!==undefined && props.NewsDataArray.length>0) ? props.NewsDataArray.sortBy.country : 'us'
        props.GetResponseSendToReducer(category,country);
     }

    return (
        <div className="form-group">
            <select className="form-control" id="drpCategory" onChange={selectCategory}>
                <option value="select">select category</option>
                {
                   props.sourceDataArray!==undefined &&  props.sourceDataArray.map((item, i) => (
                        <option key={i} value={item.category}>{item.name}</option>
                    ))
                }
            </select>
        </div>
    )
}


export default CategoryDropdown;