import React from 'react';
import { Route, IndexRoute } from 'react-router';
import requireAuth from '../utils/authenticated';

import { App, HomePage, Login, Logout, Main, UserProfile, PasswordChange } from './components'

export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomePage} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/reset" component={PasswordChange} />
        <Route path="/profile" component={UserProfile} onEnter={requireAuth} />
    </Route>

);


// <Route path="/register" component={UserRegister} />
