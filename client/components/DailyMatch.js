import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseAuth } from '../../utils/firebase.js';
import { browserHistory } from 'react-router';



export default class DailyMatch extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      user: '',
      partnerInfo: {}
    }
    this.handleMatch = this.handleMatch.bind(this);
  }

 handleMatch(){
    browserHistory.push('quiz', {state: {partnerId: 'User1'}})
  }

  componentDidMount(){
    if (this.props.location.state.partnerId){
      firebaseUsersRef.child(this.props.location.state.partnerId).on("value",
        (snapshot) => {
        this.setState({partnerInfo: snapshot.val()});
      },
        (errorObject) => {
        console.log("The read failed: " + errorObject.code);
      });
    } else {
      alert("No partner loaded")
    }
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
        <button
        onClick={this.handleMatch}
        >GET STARTED</button>
        <button>Run away...</button>
      </div>
    )
  }
}
