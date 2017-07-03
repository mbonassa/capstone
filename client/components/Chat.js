import React from 'react'
import { firebaseDb, firebaseAuth, firebaseUsersRef } from '../../utils/firebase'
import ignite, { withAuth, FireInput } from '../../utils/ignite'
import { browserHistory } from 'react-router';
import { randomize } from '../../utils/helperFunctions'

const users = firebaseDb.ref('Users')
    , nickname = uid => users.child(uid).child('name')

const Nickname = ignite(
  ({value}) => <span className='chat-message-nick'>{value}</span>
)

const ChatMessage = ignite(
  ({value}) => {
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
    this.state = {
      userInfo: {},
      partnerInfo: {},
      randomNumbers: [],
      questions: []
    }
    this.sendMessage = this.sendMessage.bind(this)
  }

  componentDidMount(){
    firebaseDb.ref('Questions').on('value', snapshot => {
      this.setState({questions: snapshot.val()})
    })
    this.setState({randomNumbers: randomize(20).slice(2)})
    firebaseAuth.onAuthStateChanged((user) => {

      if (user){
        firebaseUsersRef.child(firebaseAuth.currentUser.uid).on('value', snapshot => {
          this.setState({userInfo: snapshot.val()})
        });
        firebaseUsersRef.child(this.props.partnerId).on('value', snapshot => {
          this.setState({partnerInfo: snapshot.val()})
        });
      } else {
        alert("You're not logged in")
        browserHistory.push('login')
      }
    })
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

  askQuestion(number){
    return () => {
      console.log(this.state.questions[number])
      firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('matches').child(this.state.userInfo.partnerId).update({
        selectedQuestion: this.state.questions[number],
        isAsker: false,
        isAnswerer: false,
        isJudge: true
      })
      firebaseUsersRef.child(this.state.userInfo.partnerId).child('matches').child(firebaseAuth.currentUser.uid).update({
        selectedQuestion: this.state.questions[number],
        isAsker: false,
        isAnswerer: true,
        isJudge: false
      })
    }
  }

  render() {
    console.log(this.state)
    const {user, snapshot, asEntries} = this.props
        , messages = asEntries(snapshot)
    return (
      <div>
       {
          messages.map(({key, fireRef}) => {
            return <ChatMessage key={key} fireRef={fireRef}/>
          })
        }
        <hr />
      {
        this.state.userInfo.matches && this.state.userInfo.matches[this.state.userInfo.partnerId].isAsker ?
      <div>
        <p> YOU'RE ASKING! </p>
        {
          this.state.randomNumbers.map(number => {
            return <p onClick={this.askQuestion(number)}> {this.state.questions[number]} </p>
          })
        }
      </div>
      :
      this.state.userInfo.matches && this.state.userInfo.matches[this.state.userInfo.partnerId].isAnswerer ?
      <div>
      <p> YOU'RE ANSWERING </p>
        <p> Your question: </p>
        <p> { this.state.userInfo.matches[this.state.userInfo.partnerId].selectedQuestion } </p>
        <div className='chat-log'>
        </div>
        <div>
        {this.renderSendMsg(user)}
        </div>
    </div>
    :
    <div>
    <p> YOU'RE JUDGING </p>
    </div>
      }
      </div>
      )
  }
}))
