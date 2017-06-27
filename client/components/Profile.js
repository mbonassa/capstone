import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseAuth } from '../../utils/firebase.js';
import { Link } from 'react-router';

export default class UserView extends React.Component {
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
    // if (firebaseAuth.currentUser){
      firebaseUsersRef.child('User1').on("value",
        (snapshot) => {
        this.setState({val: snapshot.val()});
      },
        (errorObject) => {
        console.log("The read failed: " + errorObject.code);
      });
    }
  // }

  handleRejectPress(){
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('viewed').update({User1: true})
  }

  handleLikePress(){
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('viewed').update({User1: true})
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('likes').update({User1: true})
  }

  render() {
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
        </div>

      </div>
      )
  }
}

// firebaseAuth.currentUser.uid
