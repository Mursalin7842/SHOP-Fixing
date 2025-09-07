import { combineReducers } from 'redux';
import sellersReducer from './sellersReducer';
import productsReducer from './productsReducer';
import shopsReducer from './shopsReducer';
import paymentsReducer from './paymentsReducer';
import reportsReducer from './reportsReducer';

// This is a comment to explain the purpose of this file.
// This file combines all the reducers into a single root reducer.

const rootReducer = combineReducers({
    sellers: sellersReducer,
    products: productsReducer,
    shops: shopsReducer,
    payments: paymentsReducer,
    reports: reportsReducer,
});

export default rootReducer;
