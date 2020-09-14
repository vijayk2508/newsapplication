exports.getProfileQuery = (userId) => {
    let Query = `Select A.orgUserName as name,A.orgUserEmail as email,A.userProfileUrl as [image],A.empId,
    A.phoneNumber,userProfileUrl,B.cityName as city,c.stateName as stateValue,D.countryName as country from org_user
    A Join city B ON A.cityId = B.cityId Join state C on B.stateId = c.stateId Join country D on
    c.countryId = D.countryId Where A.orgUserId = '${userId}'`;
    return Query;
};


exports.getCitycountry  = () => {
    let Query = `Select distinct  C.countryId as [State_countryId],D.countryId,B.cityName as [city],c.stateName as [state],D.countryName as [country] from city B Join state C on B.stateId = c.stateId Right Join country D on c.countryId = D.countryId order By D.countryId`
    return Query;
};

exports.getdistinctcountry  = () => {
    let Query = `select distinct * from [country] inner join [state] on  [country].countryId= [state].countryId`
    return Query;
};

exports.getdistinctstate  = (countryId) => {
    let Query = `select distinct * from [state] where countryId='${countryId}'`
    return Query;
};

exports.getcitybyId  = (stateId) => {
    let Query = `select  distinct cityname,stateId from city where stateId='${stateId}'`
    return Query;
};

exports.getcityNamebyId  = (cityname) => {
    let Query = `select top 1  cityname,cityId from city where cityname like '${cityname}'`
    console.log(Query);
    return Query;
};