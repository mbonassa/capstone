import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import FireBaseTools, { firebaseUsersRef, firebaseAuth } from '../utils/firebase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    flexDirection: 'column'
  },
});

export default class UserView extends React.Component{
  constructor(props){
    super(props)
    this.state = {val: {
      name: '',
      age: '',
      bio: '',
      imageUrl: ''
    }}

    this.handleLogout = this.handleLogout.bind(this);
    this.handleRejectPress = this.handleRejectPress.bind(this);
    this.handleLikePress = this.handleLikePress.bind(this);
  }

  handleLogout(){
    firebaseAuth.signOut()
    .then(() => {
      this.props.navigation.navigate('Main')
    })
  }

  componentDidMount(){
    if (firebaseAuth.currentUser){
      firebaseUsersRef.child(firebaseAuth.currentUser.uid).on("value",
        (snapshot) => {
        this.setState({val: snapshot.val()});
      },
        (errorObject) => {
        console.log("The read failed: " + errorObject.code);
      });
    }
  }

  handleRejectPress(){
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('viewed').update({User1: true})
  }

  handleLikePress(){
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('viewed').update({User1: true})
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('likes').update({User1: true})
  }

  render() {
    console.log('image', this.state.val.imageUrl)
      return (
      <View style={styles.container}>
        <View>

        <View style={{
          justifyContent: 'space-between',
          flexDirection: 'row'
        }}>
          <Image
            source={require('../assets/icons/house.jpg')}
            style={{width:50, height: 50}} />
            <Text>Despacito</Text>
          <Image
            source={require('../assets/icons/speech_bubble.png')}
            style={{width:50, height: 50}} />
        </View>

          <Image
            source={{uri: this.state.val.imageUrl}}
            style={{width: 300, height: 500, zIndex: 0}} />
          <Text>{this.state.val.name}, {this.state.val.age}</Text>
          <Text>{this.state.val.bio}</Text>
          <Text>FOR TESTING PURPOSES: {this.state.val.email}</Text>


        <View style={{
          justifyContent: 'space-between',
          flexDirection: 'row'
        }}>

          <Image
            source={require('../assets/icons/broken_heart.png')}
            style={{width:50, height: 50}}
            onPress={this.handleRejectPress} />


          <Image
            source={require('../assets/icons/heart_eyes.png')}
            style={{width:50, height: 50}}
            onPress={this.handleLikePress} />


          <Button
            title="Log out"
            onPress={this.handleLogout}
          />

        </View>
        </View>
      </View>
      )
  }
}
