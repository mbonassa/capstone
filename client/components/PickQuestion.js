import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuestionsRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase.js';

export default class Quiz extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            userData: {}
        }

    }


    componentDidMount () {
        firebaseQuestionsRef.on('value', 
            (snapshot) => {
                this.setState({data: snapshot.val()})
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

        let arr = [];
        while (arr.length < 4) {
            let random = Math.round(Math.random() * this.state.data.length) + 1;
            if (arr.indexOf(random) === -1) arr.push(random)
        }

        console.log(arr)

        console.log(this.state)
        return (
            <div>
                <h1>Pick a question to send Marianne!</h1>
                <h3>{this.state.data[arr[0]]}</h3>
                <h3>{this.state.data[arr[1]]}</h3>
                <h3>{this.state.data[arr[2]]}</h3>
            </div>
        )
    }

}