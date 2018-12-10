'use strict';
import moment from 'moment';

var services = {};
module.exports = services;

services.removeByAttr = function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i]
           && arr[i].hasOwnProperty(attr)
           && (arguments.length > 2 && arr[i][attr] === value ) ){

           arr.splice(i,1);

       }
    }
    return arr;
}

services.validateInputs = function(type,inputText){

  switch (type) {
    case 'string':
    if (inputText.length < 1) {
      return false;
    }
    var re = /^[A-Za-z0-9'\.\-\s\,]+$/i;
    return re.test(inputText);
      break;

    case 'alphabetic':
    if (inputText.length < 1) {
      return false;
    }
    var re = /^[a-zA-Z]+$/i;
    return re.test(inputText);
      break;

    case 'number':
    if (inputText.length < 1) {
      return false;
    }
    var re = /^[0-9]+$/i;
    return re.test(inputText);
      break;

    case 'email':
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(inputText);
      break;

    case 'phone':
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(inputText.match(phoneno)) {
      return true;
    }
    else {
      return false;
    }
      break;

    case 'password':
    if (inputText.length < 6) {
      return false;
    }
    return true;
      break;

    default:

  }
}

services.timestampToDate = function(timeString){
  return moment.unix(timeString).format("MMMM DD, YYYY");
}

services.timestampToDate1 = function(timeString){
  return moment(timeString).format("MMMM DD, YYYY");
}

services.timestampToDateString = function(timeString){
  return moment.unix(timeString).format("Y-m-d h:i:s");
}

services.convertToJSONDate = function(strDate){
    console.log(moment(strDate).unix());
    return moment(strDate).unix();
    // var dt = new Date(strDate);
    // var newDate = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()));
    // return newDate.getTime();
}

services.timedifference = function (nextTime) {
  //const dateDiff = moment().isBefore(nextTime);
  const dayDiff = moment().diff(moment.unix(nextTime), 'days') + 1;
  return (dayDiff > 0) ? dayDiff : 0;
};

services.today = function(){
  return moment();
}

services.yesterday = function(){
  return moment().add(-1, 'days');
}

services.sortArray = function(itemArr,key){
  return itemArr.sort( function( a, b ) { return a[key] - b[key]});
}

services.sortItemsByKey = function(itemArr,key){
  if (itemArr) {
    const groupBy = (xs, key) => xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});

    const foods = groupBy(itemArr, key);
    return foods;
  }
}

services.getDietName = function(diet){
  switch (diet) {
    case 'Vegetarian':
      return 'vegetarian';
      break;

    case 'High-Protein':
      return 'high-protein';
      break;

    case 'Paleo':
      return 'paleo';
      break;

    case 'Vegan':
      return 'vegan';
      break;

    case 'Low-Carb':
      return 'low-carb';
      break;

    default:
      return 'vegetarian';
  }
}

services.removeDuplicates = function(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

services.convertToQueryParams = function (foodName) {
  let name = '';
  if (foodName.includes(',')) {
     name = foodName.replace(', ', '+');
  } else {
     name = foodName.split(' ').join('+');
  }
  return name;
};

services.getsubstr = function (str, splitStr) {
  const index = str.indexOf(splitStr);
  if (index > -1) {
    return str.substring(index + 1, str.length);
  }
  return null;
};
