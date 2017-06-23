import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import 'react-native-fbsdk';
import { FBLogin } from 'react-native-facebook-login';
import firebase from 'firebase';
import { FIREBASE_CONFIG } from './config';


const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
const firebaseAuth = firebaseApp.auth();
const firebaseDb = firebaseApp.database();
const firebaseUsersRef = firebaseApp.database().ref("test");

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      val: ""
    }
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
          <Text>Open up main.js to start working on your app!</Text>
          <Text>{firebaseUsersRef.key} </Text>
          <Text>{this.state.val}</Text>
        </View>
        <View>
          <Text>Login with</Text>
          <FBLogin
          loginBehavior="Native"/>
          </View>
          <View>
          <Text>{this.state.val}</Text>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Expo.registerRootComponent(App);
