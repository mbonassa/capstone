import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase.js';

export default class Quiz extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            val: {}
        }

    }

    componentDidMount () {
        firebaseQuizRef.on('value', 
            (snapshot) => {
                this.setState({val: snapshot.val()})
            },
            (errorObject) => {
                console.error('The read failed: ' + errorObject.code)
            })
    }

    render() {
        let length = this.state.val.length;
        let random = Math.floor(Math.random() * length);
        let question = this.state.val[random];
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