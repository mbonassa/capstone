import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import Login from './Login'
import { Provider } from 'react-redux'
import store from '../redux/store'
// import StartupActions from '../Redux/StartupRedux'
// import ReduxPersist from '../Config/ReduxPersist'
import { StyleSheet } from 'react-native'

// Styles
const style = StyleSheet.create({
    flex: 1
})
class RootContainer extends Component {
  // componentDidMount () {
  //   // if redux persist is not active fire startup action
  //   if (!ReduxPersist.active) {
  //     this.props.startup()
  //   }
  // }

  render () {
    return (
    <Provider store={store}>
      <View style={style}>
        <StatusBar barStyle='light-content' />
        <Login />
      </View>
    </Provider>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => {}
})

//dispatch(StartupActions.startup())

export default RootContainer
