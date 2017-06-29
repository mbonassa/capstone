import React from 'react'
import { firebaseDb, firebaseAuth } from '../../utils/firebase'
import ignite, { withAuth, FireInput } from '../../utils/ignite'

const users = firebaseDb.ref('Users')
    , nickname = uid => users.child(uid).child('name')

const Nickname = ignite(
  ({value}) => <span className='chat-message-nick'>{value}</span>
)

const ChatMessage = ignite(
  ({value}) => {
    console.log(value)
    if (!value) return null
    const {from, body, timestamp} = value
    let realTime;
    if (timestamp){
      realTime = new Date(timestamp).toTimeString();
      realTime = realTime.slice(0, 5)
    } else {
      realTime = "unknown time"
    }
    return <div className='chat-message'>
      <Nickname fireRef={nickname(from)} />
      <span className='chat-message-body'>{` (${realTime})`}</span>
      <span className='chat-message-body'>{`: ${body}`}</span>
    </div>
  }
)

export default ignite(withAuth(class extends React.Component {

  constructor(props){
    super(props);
    this.sendMessage = this.sendMessage.bind(this)
  }

  sendMessage(event){
    event.preventDefault()
    if (!this.props.fireRef) return
    let msg = event.target.body.value
    this.props.fireRef.push({
      timestamp: Date.now(),
      from: firebaseAuth.currentUser.uid,
      body: `${msg}`
    })
    .then(() => {
      firebaseDb.ref('Users').child(this.props.partnerId).child('matches').child(firebaseAuth.currentUser.uid).child('chat').push({
        timestamp: Date.now(),
        from: firebaseAuth.currentUser.uid,
        body: `${msg}`
      })
    })
  }

  renderSendMsg(user) {
    if (!user) {
      return <span>You must be logged in to send messages.</span>
    }
    return (
      <form onSubmit={this.sendMessage}>
        <input name='body'/>
        <input type='submit'/>
      </form>
    )
  }

  render() {
    const {user, snapshot, asEntries} = this.props
        , messages = asEntries(snapshot)
    return (
      <div>
        <div className='chat-log'>
        {
          messages.map(({key, fireRef}) => {
            return <ChatMessage key={key} fireRef={fireRef}/>
          })
        }
        </div>
        <div>
        {this.renderSendMsg(user)}
        </div>
    </div>
    )
  }
}))
