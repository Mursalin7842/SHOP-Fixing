import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

// This is a comment to explain the purpose of this file.
// This file creates the Redux store.

const store = configureStore({
    reducer: rootReducer,
});

export default store;
