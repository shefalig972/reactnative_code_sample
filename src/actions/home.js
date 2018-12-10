
export function updateHomeContent(data) {
  return {
    type: 'UPDATE_HOME_CONTENT',
    payload: data
  };
}

export function updateHomeScreen(itemKey, itemVal) {
  return {
    type: 'UPDATE_HOME_SCREEN',
    payload: { key: itemKey, val: itemVal }
  };
}

export function setHomeContent(data) {
  return {
    type: 'SET_HOME_CONTENT',
    payload: data
  };
}

export function setUserRecipies(data) {
  return {
    type: 'SET_USER_RECIPES',
    payload: data
  };
}

export function updateUserRecipies(data) {
  return {
    type: 'UPDATE_USER_RECIPES',
    payload: data
  };
}

export function updateUserFoodsSenstivities(data) {
  return {
    type: 'UPDATE_USER_FOODS_SENSTIVITIES',
    payload: data
  };
}

export function updateFavouriteRecipies(data) {
  return {
    type: 'UPDATE_FAVOURITE_RECIPIES',
    payload: data
  };
}
