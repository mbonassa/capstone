import { StackNavigator, StyleSheet } from 'react-native'
// import LaunchScreen from '../Containers/LaunchScreen'
import LoginScreen from './Login'

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1F0808'
  }
})

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  //LaunchScreen: { screen: LaunchScreen },
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: { title: 'Login' }
  }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'LaunchScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
