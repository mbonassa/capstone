import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import FireBaseTools, { firebaseUsersRef } from '../utils/firebase';

export default class InitialMatch extends React.Component{
  constructor(props){
    super(props)
    this.state = {val: ''}
  }

  render (){
    return(
      <View>
     <Text>You Matched!</Text>
     </View>
    )
  }
}
