import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseAuth } from '../../utils/firebase.js';
import { browserHistory, Link } from 'react-router';
import { randomize } from '../../utils/helperFunctions'


export default class DailyMatch extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      partnerId: '',
      userObj: '',
      partnerInfo: {}
    }
    this.handleMatch = this.handleMatch.bind(this);
    this.dismissMatch = this.dismissMatch.bind(this);
    this.enterQuiz = this.enterQuiz.bind(this);

  }

  enterQuiz(){
    browserHistory.push('quiz')
  }

  handleMatch(){
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).update({
      active: false
    })
   .then(() => {
     if (!this.state.partnerInfo.active) {
      let numbersString = randomize(120).join(",")
      firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('matches').child(this.state.partnerId).set({
        heartStatus: 0,
        numbers: `${numbersString}`,
        round1: {},
        timestamp: Date.now(),
        turnToAsk: true,
        askedQuestions: 0,
        isAsker: true,
        isAnswerer: false,
        isJudge: false,
      })
      .then(() => {
        return firebaseUsersRef.child(this.state.partnerId).child('matches').child(firebaseAuth.currentUser.uid).set({
          heartStatus: 0,
          numbers: `${numbersString}`,
          round1: {},
          timestamp: Date.now(),
          turnToAsk: true,
          askedQuestions: 0,
          isAsker: true,
          isAnswerer: false,
          isJudge: false,
        });
      })
      .then(() => {
        browserHistory.push('quiz')
      })
     }
   });
  }

  dismissMatch(){
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).update({
        active: false,
        partnerId: ''
    })
    .then(()=> {
      firebaseUsersRef.child(this.state.partnerId).update({
        active: false,
        partnerId: ''
      });
    })
    .then(() => {
      browserHistory.push('profile')
    })
  }

  componentDidMount(){
      firebaseAuth.onAuthStateChanged((user) => {
        firebaseUsersRef.child(firebaseAuth.currentUser.uid).on("value", (snapshot) => {
            this.setState({userObj: snapshot.val()})
      });
    });

    if (this.props.location.state.partnerId){
        this.setState({partnerId: this.props.location.state.partnerId}, () => {
        firebaseUsersRef.child(this.props.location.state.partnerId).on("value",
          (snapshot) => {
          this.setState({partnerInfo: snapshot.val()}, () => {
            let partnerMatches = [];
            if (this.state.partnerInfo.matches){
              partnerMatches = Object.keys(this.state.partnerInfo.matches).map(key => {
                let objIdx = {};
                objIdx = this.state.partnerInfo.matches[key];
                objIdx.key = key;
                return objIdx
              });
            }
            this.setState({partnerMatches})
          });
        },
          (errorObject) => {
          console.log("The read failed: " + errorObject.code);
        });
      })
    } else {
      alert("No partner loaded")
      browserHistory.push('profile')
    }

  }

  componentWillUnmount(){
    firebaseUsersRef.off();
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).off()
    if (this.props.location.state) firebaseUsersRef.child(this.props.location.state.partnerId).off()
  }

  render(){
    return (
    <div className="user-page">
      <img className="logo-top" src="./img/sm-logo.png" />
      <div id="match-main">
        <h1 id="your-match" className="center fancy-type caps">your match</h1>
          <div className="row default-container">
        	</div>
          <div>
          <img id="match-photo" className="profile-image"src={`${this.state.partnerInfo.imageUrl}`} />
          </div>
          <div>
            {this.state.partnerInfo.name ? (<h3>{this.state.partnerInfo.name}, {this.state.partnerInfo.age}</h3>) : null}
            <h5>{this.state.partnerInfo.bio}</h5>
          </div>
          <hr/>
        {
          this.state.partnerMatches && this.state.partnerMatches.filter(el => {
             return el.key === firebaseAuth.currentUser.uid
          }).length ?
          <div>
            <h2 id="ready-one" className="fancy-type caps center"> Ready Player One? </h2>
            <button
            id="quiz-btn"
            className="btn misc-btn caps"
            onClick={this.enterQuiz}
            >quiz</button>
          </div>
          :
          this.state.userObj && !this.state.userObj.active && this.state.partnerInfo.active ?
          <div>
            <h4> Waiting for {this.state.partnerInfo.name} </h4>
            <Link to="profile"> Return to Profile </Link>
          </div>
          :
          <div>
            <button
            className="btn misc-btn"
            onClick={this.handleMatch}
            >GET STARTED</button>
            <button
            className="btn misc-btn"
            onClick={this.dismissMatch}
            >LEAVE MATCH</button>
          </div>
        }
        </div>
        <Link to="/profile"><p className="caps back"><span className="glyphicon glyphicon-chevron-left"></span>back to profile</p></Link>
      </div>
    )
  }
}
