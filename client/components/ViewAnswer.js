import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth, firebaseQuestionsRef } from '../../utils/firebase.js';
import { Link } from 'react-router'

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
            answer: null,
            heartStatus: 0,
            disabled: false,
            questionsAnswered: 0
        }
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount () {

    firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
        let user = firebaseAuth.currentUser.uid;
        let userRef = firebaseUsersRef.child(user);
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
                let heartStatus = userData.matches[latestMatchKey].heartStatus;
                //Getting their name
                firebaseUsersRef.child(latestMatchKey).on('value',
                    (snapshot) => {
                        let theirName = snapshot.val().name;

                        //Getting their number of questions answered
                            //Finding number of questions match has answered
                            let user = firebaseAuth.currentUser.uid;
                            let theirAnsweredQuestions = 0;
                            if (snapshot.val().matches[user].round2answers){
                                theirAnsweredQuestions = Object.keys(snapshot.val().matches[user].round2answers).length
                            }
                            //Finding number of questions user has answered with match
                            userRef.child('matches').child(latestMatchKey).child('round2answers').on('value',
                                snapshot => {
                                    let myAnsweredQuestions = 0
                                    if (snapshot.val()){
                                        myAnsweredQuestions = Object.keys(snapshot.val()).length;
                                    }
                                    let questionsAnswered = myAnsweredQuestions + theirAnsweredQuestions;
                                    //Make sure that if match is lost, that gets persisted to db for both users
                                        if (questionsAnswered > 5 && heartStatus < 5) {
                                            userRef.child('matches').child(latestMatchKey).update({
                                                lost: true
                                            })
                                            let user = firebaseAuth.currentUser.uid;
                                            firebaseUsersRef.child(latestMatchKey).child('matches').child(user).update({
                                                lost: true
                                            })
                                        }
                                    this.setState({questionsAnswered})
                                })

                        //Getting their question number (key)
                        //Insert hardcoded user here if necessary instead of auth
                        let round2 = snapshot.val()['matches'][user].round2
                        let max2 = 0;
                        let latestQuestionKey;
                        Object.keys(round2).forEach(questionKey => {
                                let timestamp = Number(round2[questionKey].split(',')[1]);
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
                                let user = firebaseAuth.currentUser.uid;
                                this.setState({latestQuestionText, latestQuestionKey, questions, userData, theirName, latestMatchKey, heartStatus});
                                firebaseUsersRef.child(latestMatchKey).child('matches').child(user).child('round2answers').child(answerKey).on('value',
                                    (snapshot) => {
                                        let answer = snapshot.val()? snapshot.val() : null;
                                        if (answer) this.setState({answer});
                                    })
                            },
                            (errorObject) => {
                                console.error('The read failed: ' + errorObject.code)
                            })
                    })
            })
        } else {
            console.log("no user")
        }
    });

    }


    handleClick () {
        //Increment heartStatus for both users

            //For logged in user:
            let user = firebaseAuth.currentUser.uid;
            let userRef = firebaseUsersRef.child(user);
            let latestMatchKey = this.state.latestMatchKey;
            let heartStatus = this.state.heartStatus;
            heartStatus++
            userRef.child('matches').child(latestMatchKey).update({
                heartStatus: heartStatus
            })

            //For matched user:
            //let user = firebaseAuth.currentUser.uid;
            firebaseUsersRef.child(latestMatchKey).child('matches').child(user).update({
                heartStatus: heartStatus
            })

            this.setState({heartStatus: heartStatus, disabled: true})
    }

    render() {
        console.log(this.state.heartStatus, this.state.questionsAnswered)
        let sassyMessage = Math.random() > 0.5 ? 'Go outside?' : 'Maybe they have a life?';
        return (
        <div>
            {this.state.heartStatus < 5 && this.state.questionsAnswered === 6 ?
            <h1>You lost the match!</h1>
            :
            <div>
                {this.state.heartStatus < 5 ?
                <div>{this.state.theirName.length && !this.state.answer
                    ?
                    <div>
                        <h1>{this.state.theirName} hasn't answered yet. {sassyMessage}</h1>
                        <h3>Your question was "{this.state.latestQuestionText}"</h3>
                        <h4>Your heart count: {this.state.heartStatus}</h4>
                    </div>
                    :
                    <div>
                        {this.state.theirName && this.state.heartStatus ?
                            <div>
                                <h1>Here's {this.state.theirName}'s answer to your question</h1>
                                <h2>"{this.state.latestQuestionText}"</h2>
                                <h3>{this.state.answer}</h3>
                                <h3>Like that? Give your match another heart</h3>
                                <button disabled={this.state.disabled} onClick={this.handleClick}>Love</button>
                                <h4>Your heart count: {this.state.heartStatus}</h4>
                            </div>
                        : null}
                    </div>
                    }
                </div>
                :
                <div>
                    <h1>You and {this.state.theirName} have accumulated {this.state.heartStatus} hearts!</h1>
                    <h2>You've won the game, and the privilege to talk to your partner! What are you waiting for?!</h2>
                    <Link to="insertproperchatlinklater"><h2>Go Chat!</h2></Link>
                </div>
            }
            </div>
            }
            <Link to="/profile"><p className="caps back"><span className="glyphicon glyphicon-chevron-left"></span>back to profile</p></Link>
        </div>
        )
    }

}
