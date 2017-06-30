import React from 'react';
import { Link } from 'react-router';
import FireBaseTools, { firebaseUsersRef, firebaseQuestionsRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase.js';

export default class Quiz extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            allUsers: '',
            userMatches: ''
        }
        this.matchObj = {},
        this.partnerInfo = {},
        this.partnerId = '',
        this.partnerMatch = {},
        this.questionsAnswered = '',
        this.handleClick = this.handleClick.bind(this);
    }


    componentDidMount () {

        firebaseAuth.onAuthStateChanged((user) => {
            if (user){
                let userRef = firebaseUsersRef.child(firebaseAuth.currentUser.uid);

                //We obtain an object with all the user's matches from the database
                //We preserve this object to state on allMatches
                //Then, we find the most recent match by comparing timestamps

                firebaseUsersRef.on('value', snapshot => {
                    this.setState({allUsers: snapshot.val()}, () => {
                        this.partnerInfo = this.state.allUsers.partnerId || {}
                        this.partnerMatch =
                        this.state.allUsers.partnerId && this.state.allUsers.partnerId.matches.userId || {}
                        this.questionsAnswered = 0 // tbd
                    });
                });
                userRef.on('value', (snapshot) => {
                        this.setState({userInfo: snapshot.val()}, () => {
                        this.partnerId = this.state.userInfo.partnerId;
                        this.matchObj = this.state.userInfo.matches[this.partnerId] || {};
                    });
                });
            }
        });

        firebaseQuestionsRef.on('value',
            (snapshot) => {
                this.setState({questions: snapshot.val()})
                let arr = [];
                while (arr.length < 4) {
                    let random = Math.round(Math.random() * Object.keys(snapshot.val()).length) + 1;
                    if (arr.indexOf(random) === -1) arr.push(random)
                }
                this.setState({randomNumbers: arr})
            },
            (errorObject) => {
                console.error('The read failed: ' + errorObject.code)
        });
    }

    handleClick (n) {
        let matchKey = this.partnerId;
        let questionNumber = this.state.randomNumbers[n]
        //This is the database reference to the latest (current) match's match object
        firebaseUsersRef.child(matchKey).child('matches').child('User4').child('round2').update({
            //We affix a timestamp to each question so later we can be sure to get the latest one
            [questionNumber]: 'true,' + Date.now()
        })
        //Update turnToAsk from true to false
        if (firebaseAuth.currentUser.uid) firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('matches').child(matchKey).update({
            turnToAsk: false
        })
    }

    render() {
        return (
            <div>
            {
                this.questionsAnswered == 6 && this.matchObj.heartStatus < 5 ?
                // to-do ^^^^^
                <h1>You lost the match!</h1>
                :
                <div>
                    {this.matchObj.turnToAsk && this.matchObj.heartStatus < 5 ?
                    <div>
                        <div>{(this.state.allUsers[this.partnerId]).length ?
                        <h1>Pick a question to send to {this.state.theirName}!</h1> : null}</div>
                        <Link to='/viewanswer'><h3 onClick={() => this.handleClick(0)}>{this.state.questions[this.state.randomNumbers[0]]}</h3></Link>
                        <Link to='/viewanswer'><h3 onClick={() => this.handleClick(1)}>{this.state.questions[this.state.randomNumbers[1]]}</h3></Link>
                        <Link to='/viewanswer'><h3 onClick={() => this.handleClick(2)}>{this.state.questions[this.state.randomNumbers[2]]}</h3></Link>
                    </div>
                    :
                    <div>
                    {this.matchObj.heartStatus >= 5 ?
                    <div>
                        <h1>You and {this.partnerInfo.name} have accumulated {this.matchObj.heartStatus} hearts!</h1>
                        <h2>You've won the game, and the privilege to talk to your partner! What are you waiting for?!</h2>
                        <a><h2>Go Chat!</h2></a>
                    </div>
                    :
                    <div>
                        <h1>It's not your turn to pick a question!</h1>
                        <Link to='/answer'><h2>Go answer one instead</h2></Link>
                    </div>
                }
                </div>
            }
            </div>
        }
        </div>
        )
    }

}


