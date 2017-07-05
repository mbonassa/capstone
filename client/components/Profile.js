import React from 'react';
import { browserHistory } from 'react-router';
import FireBaseTools, { firebaseUsersRef, firebaseAuth } from '../../utils/firebase';
import { arrayify, arrayifyWithKey} from '../../utils/helperFunctions';
import { Link } from 'react-router';
import DailyMatch from './';
import Wait from './';

export default class UserView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      disabled: true,
      partnerId: '',
      waiting: false,
      usersObj: [],
      val: {
        name: '',
        age: '',
        bio: '',
        imageUrl: '',
        active: ''
    }
  }

    this.handleLogout = this.handleLogout.bind(this);
    this.setActive = this.setActive.bind(this);
  }

  setActive(){

    this.setState({
              waiting: true,
              disabled: true
      }, () => {
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
            return el
          }
     })
      if (activeUsers.length){
        let partnerId = activeUsers[0].key;
        let userId = firebaseAuth.currentUser.uid;
        console.log(partnerId, userId)
        return firebaseUsersRef.child(userId).update({
            active: true,
            partnerId: partnerId
        })
        .then(() => {
          firebaseUsersRef.child(userId).child('pastMatches').update({
            [partnerId]: true
          })
        })
        .then(() => {
          return firebaseUsersRef.child(partnerId).update({
            active: true,
            partnerId: userId
          });
        })
        .then(() => {
          firebaseUsersRef.child(partnerId).child('pastMatches').update({
            [userId]: true
          })
        })
      } else {
         console.log("no match found")
      }
    });
    this.setState({
          waiting: false,
          disabled: false
        })
    });
  }

  handleLogout(){
    firebaseAuth.signOut();
    browserHistory.push('/login');
  }

  componentDidMount(){
     firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
          firebaseUsersRef.on("value", (snapshot) => {
          this.setState({usersObj: snapshot.val()});
      },
        (errorObject) => {
        console.log("The read failed: " + errorObject.code);
      })
          firebaseUsersRef.child(firebaseAuth.currentUser.uid).on("value",
            (snapshot) => {
            this.setState({val: snapshot.val()});
          },
            (errorObject) => {
            console.log("The read failed: " + errorObject.code);
          });
        this.setState({disabled: false})
      } else {
        browserHistory.push('/login')
      }
     });

     console.log(firebaseAuth.currentUser)
  }

  componentWillUnmount(){
    firebaseUsersRef.off()
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).off()
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
                <h3 className="inline-block">{this.state.val.name}, {this.state.val.age}</h3>
                <Link to={`/profile/edit`}><small style={{'color': '#ffffff'}} className='inline-block edit'>(EDIT PROFILE)</small></Link>
              </div>) : null}
            <h5 id="bio">{this.state.val.bio}</h5>

            {!this.state.val.partnerId ?
                <button
                id="find-match"
                disabled={this.state.val.active && !this.state.val.partnerId ? "disabled" : this.state.disabled}
                className="btn misc-btn caps"
                title="Score"
                onClick={this.setActive}
              >find a match</button> :
              <div>
               <Link to={
              {
                pathname: "match",
                state: {
                  partnerId: this.state.val.partnerId
                }
              }
              }><button
                id="see-match"
                className="btn misc-btn caps"
              >See my match</button></Link>
            </div>
         }
         {this.state.waiting && !this.state.val.partnerId ? browserHistory.push('/wait') : null}
        <Link to={
            {
              pathname: "matchHistory",
            }
            }> <button
              id="past-matches"
              className="btn misc-btn caps"
              title="pastMatches"
            >my matches </button> </Link>

        <button
              className="btn misc-btn caps"
              title="Log out"
              onClick={this.handleLogout}
            >LOG OUT </button>
        </div>
       </div>
      </div>

      )

  }
}
