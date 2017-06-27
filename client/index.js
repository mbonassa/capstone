import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Profile, Login, EditProfile} from './components';

ReactDOM.render(
   <Router history={browserHistory}>
      <Route path="/" >
        <IndexRoute component={Profile} />
        <Route path="/profile" component={Profile}/>
         <Route path="/profile/edit" component={EditProfile} />
        <Route path="/login" component={Login}/>
      </Route>
    </Router>,
    document.getElementById('app')
)
