import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import { Profile, Login, EditProfile, DailyMatch, Signup, Quiz, PickQuestion, Waiting, Answer, Random } from './components';

ReactDOM.render(
   <Router history={browserHistory}>
      <Route path="/" >
        <IndexRoute component={Login} />
        <Route path="/profile" component={Profile}/>
         <Route path="/profile/edit" component={EditProfile} />
        <Route path="/login" component={Login}/>
        <Route path="/quiz" component={Quiz}/>
        <Route path="/pickquestion" component={PickQuestion}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/match" component={DailyMatch}/>
        <Route path="/waiting" component={Waiting}/>
        <Route path="/answer" component={Answer}/>
        <Route path="/random" component={Random}/>
      </Route>
    </Router>,
    document.getElementById('app')
)
