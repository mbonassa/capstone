import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth, firebaseQuestionsRef } from '../../utils/firebase.js';
import { Link } from 'react-router';

export default class Answer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: {},
            response: '',
            questions: {},
            latestQuestionKey: '',
            latestMatchKey: '',
            theirName: '',
            latestQuestionText: '',
            answered: false,
            turnToAsk: false,
            heartStatus: 0,
            questionsAnswered: 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange (event) {
        this.setState({response: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        let response = this.state.response;
        let user = firebaseAuth.currentUser.uid;
        let userRef = firebaseUsersRef.child(user);
        let answerKey = this.state.latestQuestionKey + 'answer';
        //Checking whether answer to latest question already exists
        userRef.child('matches').child(this.state.latestMatchKey).child('round2answers').on('value',
            (snapshot) => {
                let arrayOfAnsweredQuestionNumbers = [];
                let answers = Object.keys(snapshot.val()).forEach(questionKey => {
                    arrayOfAnsweredQuestionNumber.push(Number(questionKey.slice(-6)));
                })
                if (arrayOfAnsweredQuestionNumbers.indexOf(Number(this.state.latestQuestionKey)) === -1) {
                //If answer to latest question doesn't exist, allow answer to go through to database
                userRef.child('matches').child(this.state.latestMatchKey).child('round2answers').update({
                    [answerKey]: [response]
                })
                //update turnToAsk from false to true
                let latestMatchKey = this.state.latestMatchKey;
                userRef.child('matches').child(latestMatchKey).update({
                    turnToAsk: true
                })
                }
            })
        //Regardless if question had already been previously answered or not, do this:
        this.setState({answered: true, response: ''})

    }

    componentDidMount () {

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        let user = firebaseAuth.currentUser.uid;
        let userRef = firebaseUsersRef.child(user);
        userRef.on('value',
            (snapshot) => {
                let userData = snapshot.val();
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
                //Finding whether it's user's turn to ask with that match
                //Get heartStatus with match
                //Get number of questions answered
                userRef.child('matches').child(latestMatchKey).on('value',
                    (snapshot) => {
                        let turnToAsk = snapshot.val().turnToAsk;
                        let heartStatus = snapshot.val().heartStatus;
                        let myAnsweredQuestions = Object.keys(snapshot.val().round2answers).length;

                        //Getting match's name and the number of questions they've answered
                        firebaseUsersRef.child(latestMatchKey).on('value', 
                            (snapshot) => {
                                let theirName = snapshot.val().name;
                                let user = firebaseAuth.currentUser.uid;
                                let theirAnsweredQuestions = Object.keys(snapshot.val().matches[user].round2answers).length;
                                let questionsAnswered = myAnsweredQuestions + theirAnsweredQuestions;
                                //Make sure that if match is lost, that gets persisted to the db for both users
                                if (questionsAnswered > 5 && heartStatus < 5) {
                                    userRef.child('matches').child(latestMatchKey).update({
                                        lost: true
                                    })
                                    //let user = firebaseAuth.currentUser.uid;
                                    firebaseUsersRef.child(latestMatchKey).child('matches').child('User4').update({
                                        lost: true
                                    })
                                }
                                this.setState({userData, latestMatchKey, theirName, turnToAsk, heartStatus, questionsAnswered});
                            })
                    })
                //Finding round2 object to get latest question number
                userRef.child('matches').child(latestMatchKey).child('round2').on('value',
                    (snapshot) => {
                        let round2 = snapshot.val();
                        let max2 = 0;
                        let maxKey2;
                        Object.keys(round2).forEach(questionKey => {
                                let timestamp = Number(round2[questionKey].split(',')[1]);
                                if (timestamp > max2) {
                                    max2 = timestamp;
                                    maxKey2 = questionKey;
                                }
                        })
                        this.setState({latestQuestionKey: maxKey2})
                        //Finding latest question text
                        firebaseQuestionsRef.on('value', 
                            (snapshot) => {
                                let questions = snapshot.val();
                                let latestQuestionText = questions[maxKey2];
                                this.setState({latestQuestionText, questions});
                            },
                            (errorObject) => {
                                console.error('The read failed: ' + errorObject.code)
                            })
                        
                    })
            },
            (errorObject) => {
                console.error('The read failed: ' + errorObject.code)
            })
    } 
});

}


    render() {      
        return (
        <div>
        {this.state.heartStatus < 5 && this.state.questionsAnswered === 6 ?
        <h1>You lost the match!</h1>
        :
        <div>
        {this.state.heartStatus < 5 ?
            <div>
            {!this.state.turnToAsk ? 
            <div>
                <h3>{this.state.theirName} {this.state.theirName && this.state.latestQuestionText ? 'asked' : null}</h3>
                <h1>{this.state.latestQuestionText}</h1>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                        <input onChange={this.handleChange} value={this.state.response} type="text" name="name" />
                        </label>
                        <input disabled={this.state.answered} type="submit" value="Submit" />
                    </form>
                {this.state.answered && this.state.turnToAsk ? 
                    <a href='/pickquestion'>Send {this.state.theirName} a question</a>
                : null}
            </div> : 
            <a href='/pickquestion'><h1>It's your turn to ask a question. Go do it!</h1></a>
            } 
            </div>
            :
            <div>
                <h1>You and {this.state.theirName} have accumulated {this.state.heartStatus} hearts!</h1>
                <h2>You've won the game, and the privilege to talk to your partner! What are you waiting for?!</h2>
                <a><h2>Go Chat!</h2></a> 
            </div>
        }
        </div>
        }
        </div>
        )
    }

}
