import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase.js';

export default class Waiting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: {}
        }
    }

    componentDidMount () {
        //let user = firebaseAuth.currentUser.uid;
        let data = firebaseUsersRef.child('User1')
        data.on('value',
            (snapshot) => {
                this.setState({userData: snapshot.val()})
            },
            (errorObject) => {
                console.error('The read failed: ' + errorObject.code)
            })
    }

    render() {

        return (
            this.state.userData.matches ? 
            <div>
                <h1>Marianne is still answering</h1>
                <h3>We'll let you know when she's done</h3>
            </div> : null
        )
    }

}
