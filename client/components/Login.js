import React from 'react';
import { browserHistory } from 'react-router';
import FireBaseTools, { firebaseUsersRef, firebaseAuth, firebaseApp } from '../../utils/firebase'
import firebase from 'firebase';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      val: "",
      signUpEmail: "email",
      signUpPassword: "password",
      logInEmail: "email",
      logInPassword: "password",
      user: "",
      toggleLogin: true,
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    // this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
  }

  handleLogin (event) {
    firebaseAuth.signInWithEmailAndPassword(this.state.logInEmail, this.state.logInPassword).catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
    })
    .then(() => {
      browserHistory.push("profile")
    })
  }

  handleSignUp (event) {
    console.log("Firing");
    if (firebaseAuth){
    firebaseAuth.createUserWithEmailAndPassword(this.state.signUpEmail, this.state.signUpPassword)
    .then(() => {
      return firebaseUsersRef.child(firebaseAuth.currentUser.uid).set({
        name: "Happy Fullstacker",
        email: this.state.signUpEmail,
        password: this.state.signUpPassword,
        age: 22,
        bio: "Fullstack rules"
      }, () => {
      browserHistory.push('profile');
      });
    })
    .catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
    })
    } else {
      alert("Auth db not connected")
    }
  }

  componentDidMount(){
    firebaseAuth.signOut();

    if (firebaseAuth.currentUser){
      this.setState({user: firebaseAuth.currentUser.uid})
    }
  }

  render() {
    return (
      <div>
       <div>
        <div>
        <p> Can you see me </p>
         {this.state.toggleLogin ? ( <div>
              <input
                onChange={(evt) => {
                  this.setState({logInEmail:  evt.target.value});
                }}
                value={this.state.logInEmail}
              />
              <input
                onChange={(evt) => {
                  this.setState({logInPassword:  evt.target.value})
                }}
                value={this.state.logInPassword}
              />
              <button
                title="Login"
                color="white"
                onClick={this.handleLogin}
              > Log in </button>
            </div>) : (<div>
            <input
              onChange={(evt) => {
                this.setState({signUpEmail: evt.target.value});
              }}
              value={this.state.signUpEmail}
            />
            <input
              onChange={(evt) => {
                this.setState({signUpPassword: evt.target.value})
              }}
              value={this.state.signUpPassword}
            />
            <button
              title="Sign up"
              onClick={this.handleSignUp}
              color="white"
            > Sign up </button>
          </div>)}
          <button color="white" title={!this.state.toggleLogin ? "Returning? Login" : "New here? Sign up"} onClick={()=>{this.setState({toggleLogin: !this.state.toggleLogin})}} > Toggle me </button>
        </div>
      </div>
    </div>
    );
  }
}

          // <img src='img/logo.png' />


      // <button
          //   title="Sign in with Facebook"
          //   onClick={this.handleFacebookLogin}
          // />


  // handleFacebookLogin () {
  //   var self = this;

  //   async function logIn() {
  //       const { type, token }  = await Expo.Facebook.logInWithReadPermissionsAsync('1475591312496976') // string is App ID
  //     if (type === "success"){
  //       const credential = firebase.auth.FacebookAuthProvider.credential(token);
  //       firebaseAuth.signInWithCredential(credential)
  //       .then(() => {
  //         //have to get their facebook name somehow
  //         if (!firebaseUsersRef.child(firebaseAuth.currentUser.uid).child("name")){
  //           firebaseUsersRef.child(firebaseAuth.currentUser.uid).set({
  //             name: "Cool Facebooker",
  //             age: 22,
  //             bio: "Check me out on facebook"
  //           })
  //         }
  //       })
  //       .then(() => {
  //         self.props.navigation.navigate('Profile')
  //       })
  //       .catch((error) => {
  //         console.log("ERROR", error)
  //         alert("Sorry, but you got an error:", error)
  //       });
  //     } else if (type === "cancel"){
  //       alert("Sign-in cancelled")
  //     } else {
  //       alert("Sign-in unsuccessful")
  //     }
  //  }
  //  logIn();

  // }
