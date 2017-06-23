import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import FireBaseTools, { firebaseUsersRef } from '../utils/firebase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class UserView extends React.Component{
  constructor(props){
    super(props)
    this.state = {val: ''}
  }

  componentDidMount(){
    firebaseUsersRef.on("value",
      (snapshot) => {
      this.setState({val: snapshot.val()});
    },
      (errorObject) => {
      console.log("The read failed: " + errorObject.code);
    });
  }

  render() {
      return (
      <View style={styles.container}>
        <View>
          <Text>Your User Page</Text>
          <Text>{firebaseUsersRef.key} </Text>
          <Text>{this.state.val}</Text>
        </View>
      </View>
      )
  }
}
