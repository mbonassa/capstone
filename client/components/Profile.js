import React from 'react';
import { browserHistory } from 'react-router';
import FireBaseTools, { firebaseUsersRef, firebaseAuth } from '../../utils/firebase.js';
import { Link } from 'react-router';
import DailyMatch from './'

export default class UserView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      usersObj: [],
      val: {
        name: '',
        age: '',
        bio: '',
        imageUrl: '',
        active: false
    }
  }

    this.handleLogout = this.handleLogout.bind(this);
    this.setActive = this.setActive.bind(this);
    this.handleRejectPress = this.handleRejectPress.bind(this);
    this.handleLikePress = this.handleLikePress.bind(this);
  }

  setActive(){
     firebaseUsersRef.child(firebaseAuth.currentUser.uid).update({
       active: !this.state.val.active
     })
     .then(() => {
      var activeUsers = Object.keys(this.state.usersObj).map(key => {
        let objIdx = {};
        objIdx = this.state.usersObj[key];
        objIdx.key = key;
        return objIdx
      }).filter(el => {
       return el.active === true
     })
    //  .filter(el => {
    //    return el.gender === "male"
    //  })
        console.log(activeUsers)
        firebaseUsersRef.child(firebaseAuth.currentUser.uid).update({partnerId: activeUsers[0].key})
     });
  }

  handleLogout(){
    firebaseAuth.signOut()
    .then(() => {
      browserHistory.push('/login')
    })
  }

  componentDidMount(){
      firebaseUsersRef.on("value", (snapshot) => {
        this.setState({usersObj: snapshot.val()});
      },
        (errorObject) => {
        console.log("The read failed: " + errorObject.code);
      })
      if (firebaseAuth.currentUser){
          firebaseUsersRef.child(firebaseAuth.currentUser.uid).on("value",
            (snapshot) => {
            this.setState({val: snapshot.val()});
          },
            (errorObject) => {
            console.log("The read failed: " + errorObject.code);
          });
      } else {
        alert("You are not logged in.")
      }
  }

  handleRejectPress(){
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('viewed').update({User1: true})
  }

  handleLikePress(){
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('viewed').update({User1: true})
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('likes').update({User1: true})
  }

  render() {
      console.log(this.state)
      return (
      <div className="user-page">
      <img id="logo-top" src="./img/logo.png" />
        <div className="row default-container">
      		<Link to={`/profile/edit`}><p style={{'color': '#ffffff'}}className='fancy-type'>EDIT INFO</p></Link>
      	</div>
        <div>
        <img className="profile-image"src={`${this.state.val.imageUrl}`} />
        </div>
        <div>
          {this.state.val.name ? (<h3>{this.state.val.name}, {this.state.val.age}</h3>) : null}
          <hr className="horizontal-line" />
          <h5>{this.state.val.bio}</h5>
          <button
            title="Log out"
            onClick={this.handleLogout}
          >LOG OUT </button>
          {!this.state.val.active ?
            <button
            title="Score"
            onClick={this.setActive}
          >GO SCORE </button> :
          <button
            title="Score"
            onClick={this.setActive}
            disabled="disabled"
          >GO SCORE</button>
          }
        </div>
         <Link to={
           {
             pathname: "match",
             state: {
               partnerId: this.state.val.partnerId
            }
           }
          }> Your Daily Match </Link>
      </div>
      )
  }
}
