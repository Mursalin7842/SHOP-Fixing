import { combineReducers } from 'redux';
import sellersReducer from './sellersReducer';
import productsReducer from './productsReducer';
import shopsReducer from './shopsReducer';
import paymentsReducer from './paymentsReducer';
import reportsReducer from './reportsReducer';
import ordersReducer from './ordersReducer';
import supportReducer from './supportReducer';

// This is a comment to explain the purpose of this file.
// This file combines all the reducers into a single root reducer.

const rootReducer = combineReducers({
    sellers: sellersReducer,
    products: productsReducer,
    shops: shopsReducer,
    payments: paymentsReducer,
    reports: reportsReducer,
    orders: ordersReducer,
    support: supportReducer,
});

export default rootReducer;
