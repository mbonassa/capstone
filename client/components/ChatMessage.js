import React from 'react'
import { firebaseDb, firebaseAuth, firebaseUsersRef } from '../../utils/firebase'
import ignite, { withAuth, FireInput } from '../../utils/ignite'
import { browserHistory } from 'react-router';
import { randomize } from '../../utils/helperFunctions'

const users = firebaseDb.ref('Users'), nickname = uid => users.child(uid).child('name')

export const Nickname = ignite(
  ({value}) => <span className='chat-message-nick white'>{value}</span>
)

export const ChatMessage = ignite(
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
    return <div className='chat-message white'>
      <Nickname className='white' fireRef={nickname(from)} />
      <span className='chat-message-body white'>{` (${realTime})`}</span>
      <span className='chat-message-body white'>{`: ${body}`}</span>
    </div>
  }
)
