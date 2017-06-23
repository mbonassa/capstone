import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { firebaseUsersRef } from './utils/firebase';
import { LoginButton } from 'react-native-fbsdk';

var Login = React.createClass({
  render: function() {
    return (
      <View>
        <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("Login failed with error: " + result.error);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                alert("Login was successful with permissions: " + result.grantedPermissions)
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")}/>
      </View>
    );
  }
});

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
    <View>
      <View style={styles.container}>
        <Text>Open up main.js to start working on your app!</Text>
        <Text>{firebaseUsersRef.key} </Text>
        <Text>{this.state.val}</Text>
      </View>
      <View>
        <Text>Login with</Text>
          <Button
            title='facebook'
            color='#000000'
            onPress={function(){
              console.log("hi")
            }}
            >
          </Button>
          <LoginButton
          color="#ffaa99"
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("Login failed with error: " + result.error);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                alert("Login was successful with permissions: " + result.grantedPermissions)
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")} />
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
