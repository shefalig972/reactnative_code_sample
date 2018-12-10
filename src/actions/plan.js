export function setUserPlan(data) {
  return {
    type: "SET_USER_PLAN",
    payload: data
  }
}

export function updateFoodItems(data) {
  return {
    type: "UPDATE_FOOD_ITEMS",
    payload: data
  }
}

export function removePhaseFoodItems(itemName){
  return {
    type: "REMOVE_PHASE_FOOD_ITEMS",
    payload: itemName
  }
}

export function removePaceFoodItem(itemName, pace, phase){
  return {
    type: "REMOVE_PACE_FOOD_ITEM",
    payload: {name: itemName, pace: pace, phase: phase}
  }
}

export function updateUserPlan(key,val){
  return {
    type: "UPDATE_USER_PLAN",
    payload: {key:key,val:val}
  }
}

export function updatePhaseItems(pace,phase,newArr){
  return {
    type: "UPDATE_PHASE_ITEMS",
    payload: {pace:pace,phase:phase,items:newArr}
  }
}
