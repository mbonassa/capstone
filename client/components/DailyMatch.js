import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseAuth } from '../../utils/firebase.js';
import { browserHistory } from 'react-router';



export default class DailyMatch extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      partnerId: '',
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
    var q1 = Math.floor(Math.random() * 100)
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('matches').child(this.state.partnerId).set({
      heartStatus: 0,
      numbers: `${q1}, ${q1 + 1}, ${q1 - 1}, ${q1 + 2}, ${q1 - 2}`,
      round1: {},
      timestamp: Date.now()
    })
    .then(() => {
      return firebaseUsersRef.child(this.state.partnerId).child('matches').child(firebaseAuth.currentUser.uid).set({
        heartStatus: 0,
        numbers: `${q1}, ${q1 + 1}, ${q1 - 1}, ${q1 + 2}, ${q1 - 2}`,
        round1: {},
        timestamp: Date.now()
      });
    })
    .then(() => {
      browserHistory.push('quiz')
    })
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
    if (this.props.location.state.partnerId){
        this.setState({partnerId: this.props.location.state.partnerId}, () => {
        firebaseUsersRef.child(this.props.location.state.partnerId).on("value",
          (snapshot) => {
          this.setState({partnerInfo: snapshot.val()}, () => {
             var partnerMatches = Object.keys(this.state.partnerInfo.matches).map(key => {
              let objIdx = {};
              objIdx = this.state.partnerInfo.matches[key];
              objIdx.key = key;
              return objIdx
            });
            this.setState({partnerMatches})
          });
        },
          (errorObject) => {
          console.log("The read failed: " + errorObject.code);
        });
      })
    } else {
      alert("No partner loaded")
    }
  }

  componentWillUnmount(){
    firebaseUsersRef.off('value');
  }

  render(){
    return (
    <div className="user-page">
      <h1>Here's your match!</h1>
        <div className="row default-container">
      	</div>
        <div>
        <img className="profile-image"src={`${this.state.partnerInfo.imageUrl}`} />
        </div>
        <div>
          {this.state.partnerInfo.name ? (<h3>{this.state.partnerInfo.name}, {this.state.partnerInfo.age}</h3>) : null}
          <hr className="horizontal-line" />
          <h5>{this.state.partnerInfo.bio}</h5>
        </div>
        <hr/>
      {
        this.state.partnerMatches && this.state.partnerMatches.filter(el => {
           return el.key === firebaseAuth.currentUser.uid
        }).length ?
        <div>
          <h5> You're already in a match! </h5>
          <button
          onClick={this.enterQuiz}
          >Go to your quiz...</button>
        </div>
        :
        <div>
          <button
          onClick={this.handleMatch}
          >GET STARTED</button>
          <button
          onClick={this.dismissMatch}
          >Run away...</button>
        </div>
      }
      </div>
    )
  }
}
