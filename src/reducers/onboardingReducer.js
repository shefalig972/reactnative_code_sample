function onboardingReducer(state = { screenData: null, isLoading:false}, action) {
  switch (action.type) {

    case "NEXT_STEP":
    return Object.assign({}, state,[]);

    case "UPDATE_CURRENT_STEP":
      return Object.assign({}, state,{screenData:action.payload});
      break;

      case "UPDATE_CURRENT_SCREEN":
      let oldScreenData = state.screenData;
      oldScreenData.current_screen = action.payload;
      return Object.assign({}, state,{screenData:oldScreenData});
        break;

      case "START_LOADING":
        return Object.assign({}, state,{isLoading:true});
        break;

      case "STOP_LOADING":
        return Object.assign({}, state,{isLoading:false});
        break;
      default:
        return state
  }
}

export default onboardingReducer
