import React from 'react'
import { View } from 'react-native'
import firebase from 'firebase'
import ignite, {withAuth, FireInput} from '../utils/ignite'

const users = firebase.database().ref('users')
    , nickname = uid => users.child(uid).child('nickname')

const Nickname = ignite(
  ({value}) => <span className='chat-message-nick'>{value}</span>
)

const ChatMessage = ignite(
  ({value}) => {
    if (!value) return null
    const {from, body} = value
    return <div className='chat-message'>
      <Nickname fireRef={nickname(from)} />
      <span className='chat-message-body'>{body}</span>
    </div>
  }
)

export default class Chat extends React.Component {
  // Write is defined using the class property syntax.
  // This is roughly equivalent to saying,
  //
  //    this.sendMessage = event => (etc...)
  //
  // in the constructor. Incidentally, this means that write
  // is always bound to this.
  sendMessage = event => {
    event.preventDefault()
    if (!this.props.fireRef) return
    this.props.fireRef.push({
      from: firebase.auth().currentUser.uid,
      body: event.target.body.value
    })
  }

  renderSendMsg(user) {
    if (!user) {
      return <span>You must be logged in to send messages.</span>
    }
    return <form onSubmit={this.sendMessage}>
      <FireInput fireRef={nickname(user.uid)} />
      <input name='body'/>
      <input type='submit'/>
    </form>
  }

  render() {
    const {user, snapshot, asEntries} = this.props
        , messages = asEntries(snapshot)
    return <View>
      <View className='chat-log'> {
        messages.map(({key, fireRef}) => <ChatMessage key={key} fireRef={fireRef}/>)
      } </View>
      {this.renderSendMsg(user)}
    </View>
  }
}
