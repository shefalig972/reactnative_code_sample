'use strict';
import{
  AsyncStorage
} from 'react-native';

var users = {};
module.exports = users;

var userLoggedIn = null;

users.guestAccount = async function(){
  try {
    const guest = await AsyncStorage.getItem("authUser");
    if (guest !== null){
      return JSON.parse(guest);
    }else {
      return null;
    }

  } catch (e) {
    throw(e);
  }
}

users.clearGuestAccount = async function(){
  try {
    await AsyncStorage.removeItem("authUser");
  } catch (error) {
    throw(error)
  }
  return true;
}

users.setGuestAccount = async function(data){
  try {
    const guest = await AsyncStorage.setItem("authUser",JSON.stringify(data));
    return guest;
  } catch (e) {
    throw(e);
  }
}
