import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase.js';

export default class Waiting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: {},
            otherData: {},
            allMatches: {},
            myAnswers: [],
            theirAnswers: [],
            heartStatus: 0,
            theirName: ''
        }
    }

    componentDidMount () {

        let user = firebaseAuth.currentUser.uid;
        let data = firebaseUsersRef.child(user)

        data.on('value',
            (snapshot) => {
                this.setState({userData: snapshot.val()});
            },
            (errorObject) => {
                console.error('The read failed: ' + errorObject.code)
            })

        let matchRef = firebaseUsersRef.child(user).child('matches');

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
                    }})
                    let questions = snapshot.val()[maxKey] ? snapshot.val()[maxKey].round1 : null
                    let myAnswers = [];
                    if (questions) {
                    Object.keys(questions).forEach(question => {
                        myAnswers.push(questions[question][0]);
                    })
                    this.setState({myAnswers: myAnswers})
                    }
                    //To get theirAnswers:
                    //1) Find matched user. Latest match key is maxKey, which corresponds to the matched user's username
                    //2) Find latest match of matched user's data, whose key will be the current user's username, and get data.
                            //Set data to otherData
                    //3) Apply same process to get answers. Set them to state as theirAnswers
                    //4) Compare answers and find heartStatus. Set it to state as heartStatus, render page
                    //5) Update database heartStatus for other user
                    //6) Update database heartStatus for own user

                    //1) 
                        //let matchedUserRef = firebaseUsersRef.child(maxKey)
                    //2)
                    let user = firebaseAuth.currentUser.uid;
                    let otherUserMatchRef = firebaseUsersRef.child(maxKey).child('matches').child(user)
                    otherUserMatchRef.on('value', 
                        (snapshot) => {
                            this.setState({otherData: snapshot.val()});
                            //3)
                            let theirQuestions = snapshot.val() ? snapshot.val().round1 : null
                            let theirAnswers = [];
                            if (theirQuestions) {
                                Object.keys(questions).forEach(question => {
                                    theirAnswers.push(theirQuestions[question][0])
                                })
                                this.setState({theirAnswers: theirAnswers});
                                let heartStatus = 0;
                                //4)
                                if (myAnswers.length && theirAnswers.length) {
                                    for (let i = 0 ; i < myAnswers.length ; i++) {
                                        if (myAnswers[i] == theirAnswers[i]) heartStatus++
                                    }
                                    this.setState({heartStatus: heartStatus})
                                    //5
                                    otherUserMatchRef.update({
                                        'heartStatus': heartStatus
                                    })
                                    //6)
                                    matchRef.child(maxKey).update({
                                        heartStatus: heartStatus
                                    })
                                }
                            }
                        },
                        (errorObject) => {
                            console.error('The read failed: ' + errorObject.code)
                        })
                    let otherUserRef = firebaseUsersRef.child(maxKey)
                    otherUserRef.on('value',
                        (snapshot) => {
                            this.setState({theirName: snapshot.val()})
                        })
                }
        ,
        (errorObject) => {
            console.error('The read failed: ' + errorObject.code)
        });


    }

    render() {
        return (
            this.state.userData.matches && this.state.heartStatus && this.state.theirName ? 
            <div>
                <h1>You and {this.state.theirName} have {this.state.heartStatus} {this.state.heartStatus == 1 ? 'heart' : 'hearts'}</h1>
                <h3>That means you had {this.state.heartStatus} {this.state.heartStatus == 1 ? 'answer' : 'answers'} in common</h3>
                <a href='/pickquestion'><h3>Go to round 2</h3></a>
            </div> : 
            <div>
                <h1>{this.state.theirName} is still answering</h1>
                <h3>We'll let you know when she's done</h3>
            </div>
        )
    }

}



