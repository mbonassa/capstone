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
                //grab user info and partner info
                firebaseUsersRef.child(firebaseAuth.currentUser.uid).on('value', snapshot => {
                    this.setState({userInfo: snapshot.val()})
                })
                firebaseUsersRef.child(this.props.params.partnerId).on('value', snapshot => {
                    this.setState({partnerInfo: snapshot.val()}, () => {
                        this.userId = firebaseAuth.currentUser.uid
                        // have to trigger a rerender, so...
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

    // let's only render chat after we've received proper info from our db!
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
        <h1>Your chat with {this.state.partnerInfo.name ? this.state.partnerInfo.name : 'a mysterious stranger'}</h1>
        {this.userId ? <div> {this.renderChat()} </div>: null}
        <Link to="/profile"><p className="caps back"><span className="glyphicon glyphicon-chevron-left"></span>back to profile</p></Link>
      </div>
     )
    }
}
