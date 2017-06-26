import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import styles from '../styles/mainStyles';
import FireBaseTools, { firebaseUsersRef, firebaseAuth, firebaseApp } from '../utils/firebase'
import firebase from 'firebase';
import Expo from 'expo';

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
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
  }

  handleLogin (event) {
    firebaseAuth.signInWithEmailAndPassword(this.state.logInEmail, this.state.logInPassword).catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
    })
    .then(() => {
      this.props.navigation.navigate('Profile')
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
      this.props.navigation.navigate('Profile');
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

  handleFacebookLogin () {
    var self = this;

    async function logIn() {
        const { type, token }  = await Expo.Facebook.logInWithReadPermissionsAsync('1475591312496976') // string is App ID
      if (type === "success"){
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        firebaseAuth.signInWithCredential(credential)
        .then(() => {
          //have to get their facebook name somehow
          if (!firebaseUsersRef.child(firebaseAuth.currentUser.uid).child("name")){
            firebaseUsersRef.child(firebaseAuth.currentUser.uid).set({
              name: "Cool Facebooker",
              age: 22,
              bio: "Check me out on facebook"
            })
          }
        })
        .then(() => {
          self.props.navigation.navigate('Profile')
        })
        .catch((error) => {
          console.log("ERROR", error)
          alert("Sorry, but you got an error:", error)
        });
      } else if (type === "cancel"){
        alert("Sign-in cancelled")
      } else {
        alert("Sign-in unsuccessful")
      }
   }
   logIn();

  }

  componentDidMount(){
    firebaseAuth.signOut();

    if (firebaseAuth.currentUser){
      this.setState({user: firebaseAuth.currentUser.uid})
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
       <View>
        <View>
          <Image source={require('../assets/icons/logo.png')} style={{height: 220, width:220, marginTop: 20, marginBottom: -30}} />
         {this.state.toggleLogin ? ( <View>
              <TextInput
                style={styles.input}
                onChangeText={(logInEmail) => {
                  this.setState({logInEmail});
                }}
                value={this.state.logInEmail}
              />
              <TextInput
                style={styles.input}
                onChangeText={(logInPassword) => {
                  this.setState({logInPassword})
                }}
                value={this.state.logInPassword}
              />
              <Button
                buttonStyle={styles.button}
                title="Login"
                color="white"
                onPress={this.handleLogin}
              />
            </View>) : (<View>
            <TextInput
              style={styles.input}
              onChangeText={(signUpEmail) => {
                this.setState({signUpEmail});
              }}
              value={this.state.signUpEmail}
            />
            <TextInput
              style={styles.input}
              onChangeText={(signUpPassword) => {
                this.setState({signUpPassword})
              }}
              value={this.state.signUpPassword}
            />
            <Button
              title="Sign up"
              onPress={this.handleSignUp}
              color="white"
            />
          </View>)}
          <Button style={styles.header} color="white" title={!this.state.toggleLogin ? "Returning? Login" : "New here? Sign up"} onPress={()=>{this.setState({toggleLogin: !this.state.toggleLogin})}} />

          <Button
            title="Sign in with Facebook"
            onPress={this.handleFacebookLogin}
          />
        </View>
      </View>
    </View>
    );
  }
}
