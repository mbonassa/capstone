import React from 'react';
import { browserHistory } from 'react-router';
import FireBaseTools, { firebaseUsersRef, firebaseAuth } from '../../utils/firebase';
import { arrayify, arrayifyWithKey} from '../../utils/helperFunctions'
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
    }
  }

    this.handleLogout = this.handleLogout.bind(this);
    this.setActive = this.setActive.bind(this);
  }

  setActive(){

    this.setState({'waiting': true}, () => {
      firebaseUsersRef.child(firebaseAuth.currentUser.uid).update({
        active: true
      })
      .then(() => {
      let activeUsers = arrayifyWithKey(this.state.usersObj).filter(el => {
        if (!el.pastMatches) el.pastMatches = {};
        if (
          !arrayify(el.pastMatches).includes(firebaseAuth.currentUser.uid) &&
          el.active === true &&
          el.partnerId === "" &&
          el.key !== firebaseAuth.currentUser.uid
          ){
            console.log("EL", el)
            return el
          }
     })
      if (activeUsers.length){
        let partnerId = activeUsers[0].key
        return firebaseUsersRef.child(firebaseAuth.currentUser.uid).update({
            active: true,
            partnerId: partnerId
        })
        .then(() => {
          firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('pastMatches').update({
            [partnerId]: true
          })
        })
        .then(() => {
          return firebaseUsersRef.child(partnerId).update({
            active: true,
            partnerId: firebaseAuth.currentUser.uid
          });
        })
        .then(() => {
          firebaseUsersRef.child(partnerId).child('pastMatches').update({
            [firebaseAuth.currentUser.uid]: true
          })
        })
      } else {
         console.log("no match found")
         alert("no matches yet!")
      }
    });
    this.setState({'waiting': false})
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
        browserHistory.push('/login')
      }
  }

  componentWillUnmount(){
    firebaseUsersRef.off('value')
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).off('value')
  }

  render() {
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
            <div>
             <button
              className="btn misc-btn"
              title="Score"
              onClick={this.setActive}
              disabled="disabled"
            >You already have a match!</button>
              <Link to={
            {
              pathname: "match",
              state: {
                partnerId: this.state.val.partnerId
              }
            }
            }> See your Match </Link>
          </div> :
          <button
            className="btn misc-btn"
            title="Score"
            onClick={this.setActive}
            disabled="disabled"
          >Finding your match</button>

        }
        {
          this.state.val.partnerId ?
          <Link to={
            {
            pathname:`/chat/${this.state.val.partnerId}`,
            state: {partnerInfo: this.state.usersObj[this.state.val.partnerId]}
            }
          }> Chat </Link> : null
        }
        </div>
       </div>
      </div>

      )

  }
}
