import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { firebaseUsersRef } from './utils/firebase'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      val: ""
    }
  }

  componentDidMount(){
    firebaseUsersRef.on("value",
      (snapshot) => {
      console.log("------------------------VAL-------------",snapshot)
      this.setState({val: snapshot.val()});
    },
      (errorObject) => {
      console.log("The read failed: " + errorObject.code);
    }
    )}

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up main.js to start working on your app!</Text>
        <Text>{firebaseUsersRef.key} </Text>
        <Text>{this.state.val}</Text>
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
