import { combineReducers } from 'redux';
import sellersReducer from './sellersReducer';

// This is a comment to explain the purpose of this file.
// This file combines all the reducers into a single root reducer.

const rootReducer = combineReducers({
    sellers: sellersReducer
});

export default rootReducer;
