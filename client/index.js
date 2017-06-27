import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Profile, Login, Signup } from './components';

ReactDOM.render(
   <Router history={browserHistory}>
      <Route path="/" >
        <IndexRoute component={Profile} />
        <Route path="/profile" component={Profile}/>
        <Route path="/login" component={Login}/>
        <Route path="/signup" component={Signup}/>
      </Route>
    </Router>,
    document.getElementById('app')
)
