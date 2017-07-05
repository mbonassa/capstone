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
          theirName: '',
          finishedQuiz: true,
          userObj: {},
          allUsersObj: '',
          quizData: {},
          data: {}
      }
      this.partnerId = this.props.params.partnerId || {};
    }

    componentDidMount(){
      firebaseUsersRef.on('value', snapshot => {
        this.setState({
          allUsersObj: snapshot.val()
        })
      })

       firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
      firebaseUsersRef.child(firebaseAuth.currentUser.uid).on('value',
        snapshot => {
        this.setState({userObj: snapshot.val()}, () => {
              firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('matches').on('value',
              (snapshot) => {
                  this.setState({
                      questionNumbers: snapshot.val().numbers.split(',')
                  })
              });
          }
        )
      });
        }
       });

       firebaseQuizRef.on('value',
           (snapshot) => {
               this.setState({
                 data: snapshot.val()
               })
           },
           (errorObject) => {
               console.error('The read failed: ' + errorObject.code)
           })
    }

    componentWillUnmount(){
      firebaseUsersRef.child(firebaseAuth.currentUser.uid).off('value')
      firebaseUsersRef.off('value')
    }

  render(){
    let questionNumbers = this.state.questionNumbers;
    let question = questionNumbers ? this.state.data[questionNumbers[this.state.current]] : null;
      console.log('jen', this.state.userObj)
      console.log('question', question)
      console.log('data', this.state.data)
      console.log('qnumbers', questionNumbers)
      console.log('partner', this.partnerId.numbers)


    return (
      <div>
        <img className="logo-top" src="./img/sm-logo.png" />
        {this.state.userObj.matches && arrayifyWithKey(this.state.userObj.matches).length ?
          <div>
          {
            arrayifyWithKey(this.state.userObj.matches).map(match => {
            console.log('match', (this.state.allUsersObj[match.key]))
            return (
                <div key={match.key}>

                <h3 className="inline-block"> Compatibility Cheat Sheet </h3>
                <p>In case you forgot...</p>

                <p>{this.state.allUsersObj && (this.state.allUsersObj[match.key]).matches.numbers}</p>



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
          <span></span>
        </div>
      }
      </div>
    )
  }
}
