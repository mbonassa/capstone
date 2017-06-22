import { combineReducers } from 'redux';
import FireBaseUserReducer from './firebaseUserReducer';

const rootReducer = combineReducers({
    currentUser: FireBaseUserReducer,
});

export default rootReducer;
