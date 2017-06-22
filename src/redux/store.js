import { createStore, applyMiddleware } from 'redux';
// import ReduxPromise from 'redux-promise';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware()(createStore);

export default createStoreWithMiddleware(reducers)
