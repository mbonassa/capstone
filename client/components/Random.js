import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase.js';

export default class Random extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            userData: {}
        }
    }

    componentDidMount () {
        firebaseQuizRef.on('value',
            (snapshot) => {
                this.setState({
                  data: snapshot.val()
                })
            },
            (errorObject) => {
                console.error('The read failed: ' + errorObject.code)
            })

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
        let number = Math.round(Math.random() * this.state.data.length) + 1;
        let question = this.state.data[number];
        return (
            <div>
                <h1>{question ? question[0] : null}</h1>
                <a><h3>{question ? question[1] : null}</h3></a>
                <a><h3>{question ? question[2] : null}</h3></a>
                <a><h3>{question ? question[3] : null}</h3></a>
                <a><h3>{question ? question[4] : null}</h3></a>
            </div>
        )
    }
}
