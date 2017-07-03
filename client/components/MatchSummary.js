import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth, firebaseQuestionsRef } from '../../utils/firebase.js';
import { Link } from 'react-router';

export default class MatchSummary extends React.Component {

  render(){
    return(
      <div>
        <img className="logo-top" src="./img/sm-logo.png" />

          <h2> Compatibility Review </h2>

          <Link className="btn btn-info" role="button"
              to="/profile">
            View Profile</Link>

            <Link className="btn btn-info" role="button"
                to="/profile">
              Chat with MATCH NAME</Link>



      </div>
    )
  }
}
