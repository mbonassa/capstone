import React from 'react';
import { browserHistory } from 'react-router';
import FireBaseTools, { firebaseUsersRef, firebaseAuth } from '../../utils/firebase.js';
import { Link } from 'react-router';
import DailyMatch from './'

export default class UserView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      partnerId: '',
      waiting: false,
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

    this.setState({'waiting': true}, () => {
      let activeUsers = Object.keys(this.state.usersObj).map(key => {
          let objIdx = {};
          objIdx = this.state.usersObj[key];
          objIdx.key = key;
          return objIdx
        }).filter(el => {
        return el.active === true
      })
     .filter(el => {
       return el.partnerId === ""
     })
      console.log(activeUsers)
      if (activeUsers.length){
        let partnerId = activeUsers[0].key
        return firebaseUsersRef.child(firebaseAuth.currentUser.uid).update({
            partnerId: partnerId
          })
        .then(() => {
          return firebaseUsersRef.child(partnerId).update({
            active: false,
            partnerId: firebaseAuth.currentUser.uid
          });
        })
      } else {
         console.log("no match found")
         return firebaseUsersRef.child(firebaseAuth.currentUser.uid).update({
            active: true
          });
      }
    })
    this.setState({'waiting': false})
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
        browserHistory.push('/login')
      }
  }

  componentWillUnmount(){
    firebaseUsersRef.off('value')
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
      <img className="logo-top" src="./img/sm-logo.png" />
      <div id="profile-main" className="">
        <div className="row default-container">
      	</div>
          <div>
            <img className="profile-image"src={`${this.state.val.imageUrl}`} />
          </div>
          <div >
            {this.state.val.name ? (
              <div>
                <h3>{this.state.val.name}, {this.state.val.age}</h3>
                <Link to={`/profile/edit`}><p style={{'color': '#ffffff'}}className='fancy-type'>(EDIT PROFILE)</p></Link>
              </div>) : null}
            <h5>{this.state.val.bio}</h5>
            <button
              className="btn misc-btn"
              title="Log out"
              onClick={this.handleLogout}
            >LOG OUT </button>
            {!this.state.val.partnerId ?
              <button
              className="btn misc-btn"
              title="Score"
              onClick={this.setActive}
            >GO SCORE </button> :
            !this.state.waiting ?
             <button
              className="btn misc-btn"
              title="Score"
              onClick={this.setActive}
              disabled="disabled"
            >You already have a match!</button> :
          !this.state.waiting ?
           <div>
            <h4
            >You have a match!</h4>
              <Link to={
            {
              pathname: "match",
              state: {
                partnerId: this.state.val.partnerId
              }
            }
            }> Your Match </Link>
          </div>:
          <button
             className="btn misc-btn"
            title="Score"
            onClick={this.setActive}
            disabled="disabled"
          >Finding your match...</button>

          }
        </div>
       </div>
      </div>

      )

  }
}
