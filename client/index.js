import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import { Profile, Login, EditProfile, DailyMatch, Signup, Quiz, PickQuestion, Waiting, Answer, GameOver, Random, Chat, ViewAnswer } from './components';

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
        <Route path="/viewanswer" component={ViewAnswer}/>
        <Route path="/gameover" component={GameOver}/>
        <Route path="/random" component={Random}/>
        <Route path="/chat/:partnerId" component={Chat}/>
      </Route>
    </Router>,
    document.getElementById('app')
)
