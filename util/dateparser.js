exports.getCurrentDate = function(){
    let date_ob = new Date();
    let date = date_ob.getDate();
    if(date <10) date='0'+ date;
    let month = date_ob.getMonth() + 1;
    if(month <10) month='0'+ month;
    let year = date_ob.getFullYear();
    return year + "-" + month + "-" + date;
}

exports.todayStartDatetime = function(){
    return this.getCurrentDate() + ' 00:00:00';
}

exports.todayEndDatetime =function() {
    return this.getCurrentDate() + ' 23:59:59';
}