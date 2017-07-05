import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth, firebaseQuestionsRef } from '../../utils/firebase.js';
import { Link, browserHistory } from 'react-router';
import { arrayifyWithKey } from '../../utils/helperFunctions';


export default class MatchSummary extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
          usersObj: {},
          userData: {},
          otherData: {},
          allMatches: {},
          myAnswers: [],
          theirAnswers: [],
          heartStatus: 0,
          theirName: '',
          finishedQuiz: true,
          userObj: {},
          allUsersObj: '',
          quizData: {}
      }
    }

    componentDidMount(){
       firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
      firebaseUsersRef.child(firebaseAuth.currentUser.uid).on('value', snapshot => {
        this.setState({userObj: snapshot.val()}, () => {
          firebaseUsersRef.on('value', snapshot => {
            this.setState({allUsersObj: snapshot.val()})
          })
        })
      });
        }
       });
    }

    componentWillUnmount(){
      firebaseUsersRef.child(firebaseAuth.currentUser.uid).off('value')
      firebaseUsersRef.off('value')
    }

  render(){
    let questionNumbers = this.state.questionNumbers;
    let question = questionNumbers ? this.state.data[questionNumbers[this.state.current]] : null;
      console.log('jen', this.state.userObj)
      console.log(questionNumbers)
      console.log('companero', this.partnerId)
    return (
      <div>
        <img className="logo-top" src="./img/sm-logo.png" />
        {this.state.userObj.matches && arrayifyWithKey(this.state.userObj.matches).length ?
          <div>
          {
            arrayifyWithKey(this.state.userObj.matches).map(match => {
            console.log('match', match)
            return (
                <div key={match.key}>

          <h3 className="inline-block"> Compatibility Cheat Sheet </h3>
          <p>In case you forgot...</p>




          <Link className="btn btn-info" role="button"
              to="/profile">
            View Profile</Link>

            <Link className="btn btn-info" role="button"
                to={
                  {
                  pathname:`/chat/${match.key}`,
                  state: {partnerInfo: this.state.allUsersObj[match.key]}
                  }
              }>
              Chat with {this.state.allUsersObj && (this.state.allUsersObj[match.key]).name} </Link>

               </div>
              )
            })
           }
        </div> :
        <div>
          <span>blahblahblah</span>
        </div>
      }
      </div>
    )
  }
}
