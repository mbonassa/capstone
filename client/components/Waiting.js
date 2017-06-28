import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase.js';

export default class Waiting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: {},
            allMatches: {},
            myAnswers: [],
            theirAnswers: []
        }
    }

    componentDidMount () {
        //To get theirAnswers:
            //

        //let user = firebaseAuth.currentUser.uid;
        let data = firebaseUsersRef.child('User4')

        data.on('value',
            (snapshot) => {
                this.setState({userData: snapshot.val()});
            },
            (errorObject) => {
                console.error('The read failed: ' + errorObject.code)
            })

        let matchRef = firebaseUsersRef.child('User4').child('matches');

        //We obtain an object with all the user's matches from the database
        //We preserve this object to state on allMatches
        //Then, we find the most recent match by comparing timestamps
        matchRef.orderByValue().on("value", (snapshot) => {
            this.setState({allMatches: snapshot.val()})
                let max = 0;
                let maxKey;
                let matchKeys = Object.keys(snapshot.val()).forEach(key => {
                    let timestamp = snapshot.val()[key].timestamp;
                    if (timestamp > max) {
                        max = timestamp;
                        maxKey = key;
                    }
                    let questions = snapshot.val()[maxKey] ? snapshot.val()[maxKey].round1 : null
                    let myAnswers = [];
                    if (questions) {
                    Object.keys(questions).forEach(question => {
                        myAnswers.push(questions[question][0]);
                    })
                    this.setState({myAnswers: myAnswers})
                    }
                })
        },
        (errorObject) => {
            console.error('The read failed: ' + errorObject.code)
        });


    }

    render() {
        return (
            this.state.userData.matches && this.state.userData.matches.User5.heartStatus ? 
            <div>
                <h1>You and Marianne have {this.state.userData.matches.m1.heartStatus} hearts</h1>
                <h3>That means you had {this.state.userData.matches.m1.heartStatus} answers in common</h3>
                <a href='/pickquestion'><h3>Go to round 2</h3></a>
            </div> : 
            <div>
                <h1>Marianne is still answering</h1>
                <h3>We'll let you know when she's done</h3>
            </div>
        )
    }

}



