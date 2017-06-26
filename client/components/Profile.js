import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseAuth } from '../../utils/firebase.js';

export default class UserView extends React.Component{
  constructor(props){
    super(props)
    this.state = {val: {
      name: '',
      age: '',
      bio: '',
      imageUrl: ''
    }}

    this.handleLogout = this.handleLogout.bind(this);
    this.handleRejectPress = this.handleRejectPress.bind(this);
    this.handleLikePress = this.handleLikePress.bind(this);
  }

  handleLogout(){
    firebaseAuth.signOut()
    .then(() => {
      browserHistory.push('..')
    })
  }

  componentDidMount(){
    if (firebaseAuth.currentUser){
      firebaseUsersRef.child(firebaseAuth.currentUser.uid).on("value",
        (snapshot) => {
        this.setState({val: snapshot.val()});
      },
        (errorObject) => {
        console.log("The read failed: " + errorObject.code);
      });
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
      return (
      <div>
        <div>

        <div>

        </div>

          {this.state.name ? (<h4>{this.state.val.name}, {this.state.val.age}</h4>) : null}
          <h4>{this.state.val.bio}</h4>
          <h4>FOR TESTING PURPOSES: {this.state.val.email}</h4>


        <div>

          <button
            title="Log out"
            onClick={this.handleLogout}
          />
         </div>
        </div>
      </div>
      )
  }
}


          // <img
          //   src={require('../assets/icons/broken_heart.png')}
          //   onClick={this.handleRejectPress} />


          // <img
          //   src={require('../assets/icons/heart_eyes.png')}
          //   onClick={this.handleLikePress} />     <img
          //   src={`${this.state.val.imageUrl}`}
          //   />
          //    <img
          //   src={require('../assets/icons/house.jpg')}
          //   />
          //   <h4>Despacito</h4>
          // <img
          //   source={require('../assets/icons/speech_bubble.png')}
          //   />
