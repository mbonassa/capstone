import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Router, browserHistory } from 'react-router';
import routes from './routes';
import store from './redux/store'

import Test from './components'

// for bundling your styles
import './index.scss';

ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={Test} />
      </Router>
    </Provider>
  , document.getElementById('app'));
