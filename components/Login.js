import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import 'react-native-fbsdk';
// import { FBLogin } from 'react-native-facebook-login';
import firebase from 'firebase';
import { FIREBASE_CONFIG } from '../config';
import { firebaseUsersRef } from '../utils/firebase';
import styles from '../styles/mainStyles';
import { firebaseAuth } from '../utils/firebase'


export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      val: "",
      email: "",
      password: ""
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignUp (event) {
    firebaseAuth.createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
    })
  }

  handleLogin (event) {
    firebaseAuth.signInWithEmailAndPassword(this.state.email , this.state.password).catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
    })
  }

  handleFacebookLogin () {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithCredential(provider)
    .then(() => {
        alert("We did it")
    })
    .catch(error => {
        // alert("An error occurred", error.code, error.message);
        return ({
            errorCode: error.code,
            errorMessage: error.message,
        })
    });
  }
  componentDidMount(){
    firebaseUsersRef.on("value",
      (snapshot) => {
      this.setState({val: snapshot.val()});
    },
      (errorObject) => {
      console.log("The read failed: " + errorObject.code);
    }
    )}

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.text}>Login</Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(email) => {
              console.log(email)
              this.setState({email});
              console.log(this.state)
            }}
            value={this.state.email}
          />
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(password) => {
              this.setState({password})
            }}
            value={this.state.password}
          />
          <Button
            title="Login"
            onPress={this.handleLogin}></Button>
          <Text style={styles.text}> or </Text>
          <Text style={styles.text}> Sign Up </Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(email) => {
              this.setState({email});
            }}
            value={this.state.email}
          />
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(password) => {
              this.setState({password})
            }}
            value={this.state.password}
          />
          <Button
            title="Login"
            onPress={this.handleSignUp}></Button>
        </View>
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

Expo.registerRootComponent(App);

