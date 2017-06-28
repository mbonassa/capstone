import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase.js';

export default class GameTransition extends React.Component {
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
                <h1>You and Marianne have {this.state.userData.matches.m1.heartStatus} hearts</h1>
                <h3>That means you had {this.state.userData.matches.m1.heartStatus} answers in common</h3>
                <a href='/pickquestion'><h3>Go to round 2</h3></a>
            </div> : null
        )
    }

}
