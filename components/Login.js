import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import styles from '../styles/mainStyles';
import FireBaseTools, { firebaseAuth, firebaseApp } from '../utils/firebase'
import firebase from 'firebase';

import Expo from 'expo';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      val: "",
      signUpEmail: "",
      signUpPassword: "",
      logInEmail: "",
      logInPassword: "",
      user: ""
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
    this.faceBookAuth = this.faceBookAuth.bind(this);
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
    firebaseAuth.createUserWithEmailAndPassword(this.state.signUpEmail, this.state.signUpPassword).catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
    })
    .then(() => {
      this.props.navigation.navigate('Profile')
    })
  }

  faceBookAuth (token){

    console.log(token, "that's the token");
    const provider = FireBaseTools.getProvider('facebook');
    console.log(provider, "that's the provider")
    const credential = provider.credential(token);
    console.log(credential, "let's go");
    return firebaseAuth.signInWithCredential(credential);
  }

  handleFacebookLogin () {
    var self = this;

    async function logIn() {
        const { type, token }  = await Expo.Facebook.logInWithReadPermissionsAsync('1475591312496976') // string is App ID
      if (type === "success"){
        // self.faceBookAuth(token)
        // .then(() => {
          self.props.navigation.navigate('Profile')
        //});
      } else if (type === "cancel"){
        alert("Sign-in cancelled")
      } else {
        alert("Sign-in unsuccessful")
      }
   }
   logIn();
  }

  componentDidMount(){
    if (firebaseAuth.currentUser){
      this.props.navigation.navigate('Profile')
    }
    firebaseAuth.onAuthStateChanged(user => {
      console.log(this.props);
      if (user){
      this.props.navigation ? this.props.navigation.navigate(('Profile', { name: 'Jane' })) : console.log("no props received")

      }
    });
  }

  render() {
    console.log("hi", this.LoginManager)
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
       <View>
        <View>
          <Text> {this.state.user ? this.state.user : "" } here he is!! </Text>
          <Text style={styles.text}>Login</Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(logInEmail) => {
              this.setState({logInEmail});
            }}
            value={this.state.logInEmail}
          />
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(logInPassword) => {
              this.setState({logInPassword})
            }}
            value={this.state.logInPassword}
          />
          <Button
            title="Go to Jane's profile"
            onPress={() =>
              navigate('Profile', { name: 'Jane' })
            }
          />
          <Button
            title="Login"
            onPress={this.handleLogin}
          />
          <Text style={styles.text}> or </Text>
          <Text style={styles.text}> Sign Up </Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(signUpEmail) => {
              this.setState({signUpEmail});
            }}
            value={this.state.signUpEmail}
          />
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(signUpPassword) => {
              this.setState({signUpPassword})
            }}
            value={this.state.signUpPassword}
          />
          <Button
            title="Sign up"
            onPress={this.handleSignUp}
          />
          <Text> Sign in thru Facebook </Text>
          <Button
            title="Facebook"
            onPress={this.handleFacebookLogin}
          />
        </View>
      </View>
    </View>
    );
  }
}
