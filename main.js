import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import 'react-native-fbsdk';

import UserView from './components/UserView';

import firebase from 'firebase';
import { FIREBASE_CONFIG } from './config';
import Login from './components/Login';
import { firebaseUsersRef } from './utils/firebase';
import styles from './styles/mainStyles';


import {
  StackNavigator,
} from 'react-navigation';

const App = StackNavigator({
  Main: {screen: Login},
  Profile: {screen: UserView},
});


// class App extends React.Component {
//   constructor(props){
//     super(props);
//     this.state = {
//       val: ""
//     }
//   }

  // handleFacebookLogin () {
  //   const provider = new firebase.auth.FacebookAuthProvider();
  //   firebase.auth().signInWithCredential(provider)
  //   .then(() => {
  //       alert("We did it")
  //   })
  //   .catch(error => {
  //       // alert("An error occurred", error.code, error.message);
  //       return ({
  //           errorCode: error.code,
  //           errorMessage: error.message,
  //       })
  //   });
  // }
  // componentDidMount(){
  //   firebaseUsersRef.on("value",
  //     (snapshot) => {
  //     this.setState({val: snapshot.val()});
  //   },
  //     (errorObject) => {
  //     console.log("The read failed: " + errorObject.code);
  //   }
  //   )}
//
//   render() {
//     return (
//       <View style={styles.container}>
//
//         < UserView />
//         <Login />
//         <View>
//           <Text style={styles.text}>Open up main.js to start working on your app!</Text>
//           <Text style={styles.text}>{firebaseUsersRef.key} </Text>
//           <Text style={styles.text}>{this.state.val}</Text>
//         </View>
//         <View>
//           <Text style={styles.text}>Login with</Text>
//           </View>
//           <View>
//           <Text style={styles.text}>{this.state.val}</Text>
//           </View>
//         </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

Expo.registerRootComponent(App);
