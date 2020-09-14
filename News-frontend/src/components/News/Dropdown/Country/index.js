import React from 'react';
import { connect } from "react-redux";

let data = require('./data.json')

function CountryDropdown(props) {
    const selectCountry=(e)=>{
      // console.log('select country',e.target.value)
       let country = e.target.value ;
       console.log('country--------->', props.NewsDataArray)
       let category= (props.NewsDataArray!==undefined && props.NewsDataArray.length>0) ? props.NewsDataArray.sortBy.category : 'entertainment'
       props.GetResponseSendToReducer(category,country);
    }

    return (
    <div className="form-group">
        <select className="form-control" id="drpCountry" onChange={selectCountry}>
            <option value="select">select country</option>
            {
                data.map((item, i) => (
                    <option key={i} value={item.code}>{item.name}</option>
                ))
            }
        </select>
    </div>
    )
}

export default CountryDropdown;