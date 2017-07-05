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
    this.askQuestion = this.askQuestion.bind(this)
    this.renderAnswerForm = this.renderAnswerForm.bind(this);
    this.answerQuestion = this.answerQuestion.bind(this)
    this.judgeQuestion = this.judgeQuestion.bind(this)
    this.currentMatch = null;

  }

  //---------------- LIFECYCLE HOOKS  ----------- //


  componentDidMount(){
     firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({randomNumbers: randomize(20).slice(2)})

        //grabbing question data, current user data, and all user data

        firebaseDb.ref('Questions').on('value', snapshot => {
          this.setState({questions: snapshot.val()})
        })

        firebaseUsersRef.child(firebaseAuth.currentUser.uid).on('value', snapshot => {
          this.setState({userInfo: snapshot.val()}, () => {
            this.currentMatch = this.state.userInfo.matches[this.props.partnerId]
            if (
              this.props.partnerId === this.state.userInfo.partnerId &&
              (
                this.state.userInfo.matches[this.state.userInfo.partnerId].heartStatus > 4 || this.state.userInfo.matches[this.state.userInfo.partnerId].heartStatus < 0 ||
                this.state.userInfo.matches[this.state.userInfo.partnerId].askedQuestions < 8
              )
            ){
              this.unmatch();
            }
          })
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

  componentWillUnmount(){
    firebaseDb.ref('Questions').off()
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).off();
    firebaseUsersRef.child(this.props.partnerId).off();
  }

  //---------------- UTILITY FUNCTIONS  ----------- //

  unmatch(){
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).update({
      partnerId: ''
    })
    firebaseUsersRef.child(this.props.partnerId).update({
      partnerId: ''
    })
  }

  sendMessage(event, text){
    //we call this directly and from two other functions. if it is called from another function we only care about the text. otherwise let's use the event value

    let msg;
    if (event){
      event.preventDefault()
      msg = event.target.body.value
    }
    if (!this.props.fireRef) return
    if (text) {
      msg = text
    }
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
      <form onSubmit={(evt) =>{
        this.sendMessage(evt)
      }
    }>
        <input name='body'/>
        <input type='submit'/>
      </form>
    )
  }

  renderAnswerForm(user) {
    if (!user) {
      return <span>You must be logged in to send messages.</span>
    }
    return (
      <form onSubmit={(evt) =>{
        this.answerQuestion(evt)
      }
    }>
        <input name='body'/>
        <input type='submit'/>
      </form>
    )
  }

  //---------------- ROLE FUNCTIONS ----------- //

// these functions define each role, so there are three (waiters dont have anything to do)


// pick from four predefined questions. at the start both players are the asker, and when one player picks, the other player becomes the answerer

  askQuestion(number){
    return () => {
      firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('matches').child(this.props.partnerId).update({
        selectedQuestion: this.state.questions[number],
        isAsker: false,
        isAnswerer: false,
        isJudge: false
      })
      firebaseUsersRef.child(this.props.partnerId).child('matches').child(firebaseAuth.currentUser.uid).update({
        selectedQuestion: this.state.questions[number],
        isAsker: false,
        isAnswerer: true,
        isJudge: false
      })
      let msg = `Question ${this.state.userInfo.matches[this.props.partnerId].askedQuestions}: ${this.state.questions[number]}`
      this.sendMessage(null, msg)
    }
  }


//sends one message. better be a good one

  answerQuestion(event, text){
    let msg;
    if (event){
      event.preventDefault()
      msg = event.target.body.value
    }
    if (text) msg = text
    if (!this.props.fireRef) return
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
    .then(() => {
      firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('matches').child(this.props.partnerId).update({
        selectedQuestion: 'Waiting...',
        isAsker: false,
        isAnswerer: false,
        isJudge: false
      })
      firebaseUsersRef.child(this.props.partnerId).child('matches').child(firebaseAuth.currentUser.uid).update({
        selectedQuestion: 'Waiting...',
        isAsker: false,
        isAnswerer: false,
        isJudge: true
      })
    })
  }


//curried function. returns a function that changes the heartstatus by whatever heartsToAdd is set at

  judgeQuestion(heartsToAdd){
    return () => {
      let newHearts = this.state.userInfo.matches[this.props.partnerId].heartStatus + heartsToAdd
      firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('matches').child(this.props.partnerId).update({
        selectedQuestion: 'Waiting...',
        heartStatus: newHearts,
        askedQuestions: this.currentMatch.askedQuestions + 1,
        isAsker: false,
        isAnswerer: false,
        isJudge: false
      })
      firebaseUsersRef.child(this.props.partnerId).child('matches').child(firebaseAuth.currentUser.uid).update({
        selectedQuestion: 'Waiting...',
        askedQuestions: this.currentMatch.askedQuestions + 1,
        heartStatus: newHearts,
        isAsker: true,
        isAnswerer: false,
        isJudge: false
      })
      let msg = `${this.state.userInfo.name} changed the heartstatus by ${heartsToAdd}!`
      this.sendMessage(null, msg)
    }
  }


// chat renders message history all the time.
// after that it sees if the match is won or lost. if either it just displays that.
// after that it checks to see your state in the game. there are four states you can be in. it checks questioner -> answerer -> judge -> waiter, and renders one of these four states

  render() {
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
        this.currentMatch && this.currentMatch.heartStatus > 4 ?
        <div>
          <p> YOU WIN!!! Get chattin'! </p>
          {this.renderSendMsg(user)}
        </div>
        :
        this.currentMatch && (this.currentMatch.heartStatus < 0 || this.currentMatch.askedQuestions > 8) ?
        <div>
          <p> YOU LOSE </p>
        </div>
        :
        this.state.userInfo.matches && this.state.userInfo.matches[this.props.partnerId].isAsker ?
      <div>
        <p> YOU'RE ASKING! </p>
        {
          this.state.randomNumbers.map(number => {
            return <p key={number} onClick={this.askQuestion(number)}> {this.state.questions[number]} </p>
          })
        }
      </div>
      :
      this.state.userInfo.matches && this.state.userInfo.matches[this.props.partnerId].isAnswerer ?
      <div>
      <p>YOU'RE ANSWERING</p>
        <p> Your question: </p>
        <p> { this.state.userInfo.matches[this.props.partnerId].selectedQuestion } </p>
        <div className='chat-log'>
        </div>
        <div>
        {this.renderAnswerForm(user)}
        </div>
    </div>
    :
     this.state.userInfo.matches && this.state.userInfo.matches[this.props.partnerId].isJudge ?
    <div>
    <p> YOU'RE JUDGING </p>
      <button onClick={this.judgeQuestion(1)}>LIKE</button>
      <button onClick={this.judgeQuestion(-1)}>DON'T LIKE</button>
    </div>
      :
      <p> Waiting on your partner's response... </p>
      }
      <div>
      <p> You have {this.state.userInfo.matches ? this.state.userInfo.matches[this.props.partnerId].heartStatus : 0} hearts </p>
      </div>
      </div>
      )
  }
}))
