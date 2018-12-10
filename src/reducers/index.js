
import { combineReducers } from 'redux';
import onboardingReducer from './onboardingReducer';

// Combine all the reducers
const rootReducer = combineReducers({
    onboardingReducer
    // ,[ANOTHER REDUCER], [ANOTHER REDUCER] ....
})

export default rootReducer;
