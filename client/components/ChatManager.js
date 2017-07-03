import React from 'react';
import { Route } from 'react-router';
import { firebaseDb, firebaseAuth, firebaseUsersRef } from '../../utils/firebase';
import { Link } from 'react-router';

const db = firebaseDb
    , auth = firebaseAuth

import Chat from './Chat'

// This component is a little piece of glue between React router
// and our Scratchpad component. It takes in props.params.title, and
// shows the Scratchpad along with that title.
export default class ChatManager extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userInfo: {},
            partnerInfo: {}
        }
        this.partnerId =  this.props.params.partnerId || ''
        this.userId = ''
        this.renderChat = this.renderChat.bind(this)
    }

    componentDidMount(){
        firebaseAuth.onAuthStateChanged(user => {
            if (user) {
                console.log('firing')
                firebaseUsersRef.child(firebaseAuth.currentUser.uid).on('value', snapshot => {
                this.setState({userInfo: snapshot.val()}, () => {
                    console.log(this.state)
                    })
                })
                firebaseUsersRef.child(this.props.params.partnerId).on('value', snapshot => {
                this.setState({partnerInfo: snapshot.val()}, () => {
                    console.log('changing')
                    this.userId = firebaseAuth.currentUser.uid
                    this.setState({})
                })
                });
            }
        })
    }

    componentWillUnmount(){
        firebaseUsersRef.off();
        firebaseUsersRef.child(this.props.params.partnerId).off();
    }

    renderChat(){
     return <Chat
          auth={auth}
          fireRef={db.ref('Users').child(this.userId).child('matches').child(this.partnerId).child('chat')}
          partnerId={this.partnerId}
        />
    }

    render(){
        return (
      <div>
        <h1>Your chat with {this.state.partnerInfo.name ? this.state.partnerInfo.name : 'Bob'}</h1>
        {/* Here, we're passing in a Firebase reference to
            /scratchpads/$scratchpadTitle. This is where the scratchpad is
            stored in Firebase. Each scratchpad is just a string that the
            component will listen to, but it could be the root of a more complex
            data structure if we wanted. */}
        {this.userId ? <div> {this.renderChat()} </div>: null}
        <Link to="/profile"><p className="caps back"><span className="glyphicon glyphicon-chevron-left"></span>back to profile</p></Link>
      </div>
     )
    }
}
