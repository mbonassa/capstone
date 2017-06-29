import React from 'react'
import { Route } from 'react-router'
import { firebaseDb, firebaseAuth} from '../../utils/firebase'

const db = firebaseDb
    , auth = firebaseAuth

import Chat from './Chat'

// This component is a little piece of glue between React router
// and our Scratchpad component. It takes in props.params.title, and
// shows the Scratchpad along with that title.
export default (props) => {
    console.log(props)
        let partnerId = props.params.partnerId || {};
        let partner = props.location.state.partnerInfo;
    return (
      <div>
        <h1>Your chat with {partner.name}</h1>
        {/* Here, we're passing in a Firebase reference to
            /scratchpads/$scratchpadTitle. This is where the scratchpad is
            stored in Firebase. Each scratchpad is just a string that the
            component will listen to, but it could be the root of a more complex
            data structure if we wanted. */}
        <Chat
          auth={auth}
          fireRef={db.ref('Users').child(auth.currentUser.uid).child('matches').child(partnerId).child('chat')}
          partnerId={partnerId}
        />
      </div>
  )
}
