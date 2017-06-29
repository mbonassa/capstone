import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth, firebaseQuestionsRef } from '../../utils/firebase.js';

export default class ViewAnswer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: {},
            latestMatchKey: '',
            theirName: '',
            latestQuestionKey: '',
            questions: {},
            latestQuestionText: '',
            answer: ''
        }

    }

    componentDidMount () {

        // let user = firebaseAuth.currentUser.uid;
        let userRef = firebaseUsersRef.child('User4');
        userRef.on('value',
            (snapshot) => {
                let userData = snapshot.val();
                let username = snapshot.val().name;
                //Finding latest match
                let max = 0;
                let latestMatchKey;
                let matchKeys = Object.keys(userData.matches).forEach(key => {
                    let timestamp = snapshot.val().matches[key].timestamp;
                    if (timestamp > max) {
                        max = timestamp;
                        latestMatchKey = key;
                    }
                })
                //Getting their name
                firebaseUsersRef.child(latestMatchKey).on('value', 
                    (snapshot) => {
                        let theirName = snapshot.val().name;
                        //Getting their question number (key)
                        // let user = firebaseAuth.currentUser.uid;
                        let round2 = snapshot.val()['matches']['User4'].round2
                        let max2 = 0;
                        let latestQuestionKey;
                        Object.keys(round2).forEach(questionKey => {
                                let timestamp = round2[questionKey].split(',')[1]
                                if (timestamp > max2) {
                                    max2 = timestamp;
                                    latestQuestionKey = questionKey;
                                }
                        })
                        //Finding latest question text
                        firebaseQuestionsRef.on('value', 
                            (snapshot) => {
                                let questions = snapshot.val();
                                let latestQuestionText = questions[latestQuestionKey];
                                //Finding answer to latest question
                                let answerKey = latestQuestionKey + 'answer';
                                // let user = firebaseAuth.currentUser.uid;
                                firebaseUsersRef.child(latestMatchKey).child('matches').child('User4').child('round2answers').child(answerKey).on('value',
                                    (snapshot) => {
                                        let answer = snapshot.val()[0]
                                        this.setState({latestQuestionText, latestQuestionKey, questions, userData, theirName, latestMatchKey, answer});
                                    })
                            },
                            (errorObject) => {
                                console.error('The read failed: ' + errorObject.code)
                            })
                    })
            })


    }


    render() {
        return (
            <div>
                <h1>Here's {this.state.theirName}'s answer to your question</h1>
                    <h3>{this.state.latestQuestionText}</h3>
                    <h3>{this.state.answer}</h3>
            </div> 
        )
    }

}