import { StyleSheet } from 'react-native';

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#fc5f5d',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    backgroundColor: '#fc5f5d',
    textAlign: 'center',
    marginTop: 5
  },
  header: {
    color: 'white',
    backgroundColor: '#fc5f5d',
    textAlign: 'center',
    fontSize: 20,
  },
  login: {
    color: 'white',
    backgroundColor: '#fc5f5d',
    textAlign: 'center',
    fontSize: 20,
    marginTop: -60
  },
  or: {
    color: 'white',
    backgroundColor: '#fc5f5d',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.8)',
    paddingLeft: 5
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    color: 'white',
    borderColor: 'white',
    fontSize: 50

  }
});

export default styles;
