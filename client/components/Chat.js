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
    if (!value) return null
    const {from, body} = value
    return <div className='chat-message'>
      <Nickname fireRef={nickname(from)} />
      <span className='chat-message-body'>{body}</span>
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
    this.props.fireRef.push({
      from: firebaseAuth.currentUser.uid,
      body: ` ${event.target.body.value}`
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
