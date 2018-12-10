
var axios = require('axios');
var querystring = require("querystring");
var DeviceInfo = require('react-native-device-info');
const deviceId = DeviceInfo.getDeviceId();
const appId = '********';
const appKey = '***********';
var api = {};
const hostURL = "http://0.0.0.0:3000/"
api.fetch = async function(method, path, params, apiConfig){
  var url = hostURL + path;
  var options = {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };

  // if (users.isLoggedIn()) {
  //   options.headers.ex_uid = users.getUid();
  //   options.headers.ex_token = users.getToken();
  // }
  if(method == 'POST' || method == 'PATCH') {
    if (params) {
      options.body = JSON.stringify(params);
    }else{
      options.body = JSON.stringify({device_id: deviceId });
    }
  }
  if (method == 'GET' && params) {
    url += "?" + querystring.stringify(params);
  }
  return fetch(url, options).then((response) =>{
    return response.json();
  }).catch((error) => {
    console.log("API error:", method, url, params, error);
    throw({error: 501, description: error});
  }).then((responseJson) => {
    console.log(responseJson);
    if (!responseJson.error){
      return responseJson;
    }
    throw(responseJson);
  });
}

api.getHostURL = function() {
  return hostURL;
}

api.signUpGuestUser = function(){
  return api.fetch('POST','user/create_guest_account',null,null);
}

api.getHomePage = function(userData){
  return api.fetch('POST','home/get_home_page',userData,null);
}
api.processScreen = function(controller,action,userData){
  return api.fetch('POST',controller+'/'+action,userData,null);
}
api.getCurrentOnboardingScreen = function(data){
  return api.fetch('POST','onboarding/get_current_step',data);
}

api.checkUsernameAvailability = function(data){
  return api.fetch('POST','user/username_exists',data);
}

api.getPlan = function(data){
  return api.fetch('POST','plan/get_plans',data);
}

api.getUserRecipe = function(authData){
  return api.fetch('POST','recipe/get_user_recipes',authData);
}

api.getUserPlan = function(authData){
  return api.fetch('POST','plan/get_user_plan',authData);
}

api.startPlan = function(postData){
  return api.fetch('POST','plan/start_plan',postData);
}

api.updateUserPlan = function(postData){
  return api.fetch('POST','plan/update_user_plan',postData);
}

api.getRecipeDetails = function(recipeId){
  console.log(`https://api.edamam.com/search?r=${recipeId}&app_id=${appId}&app_key=${appKey}`);
  return axios.get(`https://api.edamam.com/search?r=${recipeId}&app_id=${appId}&app_key=${appKey}`)
      .then(res => {
        if (res.status === 200) {
          const recipedata = res.data[0];
          return recipedata;
        } throw res;
      }).catch(err=>{
        throw err;
      })
}

api.addFavouriteRecipe = function(userData){
  return api.fetch('POST','recipe/add_favourite',userData);
}

api.getRecipes = function(searchText,str, offset){
  let offsetStart = offset ? offset : 0;
  let url = `https://api.edamam.com/search?q="${searchText}"&app_id=${appId}&app_key=${appKey}&from=${offsetStart}${str}`;
  console.log(url);
  return axios.get(url)
      .then(res => {
        if (res.status === 200) {
          return res.data.hits;
        } throw res;
      }).catch(err=>{
        throw err;
      })
}

api.getUserSymptoms = function(authData){
    return api.fetch('POST','user/symptoms',authData);
}

api.saveSymptomLog = function(authData){
  return api.fetch('POST','user/add_symptom_logs',authData);
}


api.errorDescription = function(responseJson){
  if(responseJson.error && responseJson.error.message) {
    return responseJson.error.message;
  }else {
    return "System Busy";
  }
}


module.exports = api;
