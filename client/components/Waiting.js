import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase.js';
import { Link } from 'react-router'
import { Wait } from './';

export default class Waiting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            usersObj: {},
            userData: {},
            otherData: {},
            allMatches: {},
            myAnswers: [],
            theirAnswers: [],
            heartStatus: null,
            theirName: '',
            finishedQuiz: false,
            img: ''
        }
        this.otherUser = null;
        this.matchRef = null;
        this.otherUserMatch = null;
        this.dataRef = null;
        this.usersRef = null;
    }

    componentDidMount () {

     firebaseAuth.onAuthStateChanged((user) => {
      if (user) {

        this.usersRef = firebaseUsersRef.on('value', snapshot => {
            this.setState({usersObj: snapshot.val()})
        })

        let user = firebaseAuth.currentUser.uid;
        let data = firebaseUsersRef.child(user)

        this.dataRef = data.on('value',
            (snapshot) => {
                this.setState({userData: snapshot.val()});
            },
            (errorObject) => {
                console.error('The read failed: ' + errorObject.code)
            })

        let matchRef = firebaseUsersRef.child(user).child('matches');
        this.matchRef = matchRef
        //We obtain an object with all the user's matches from the database
        //We preserve this object to state on allMatches
        //Then, we find the most recent match by comparing timestamps
        matchRef.on("value", (snapshot) => {
            this.setState({allMatches: snapshot.val()})
                let max = 0;
                let maxKey;
                let matchKeys = Object.keys(snapshot.val()).forEach(key => {
                    let timestamp = snapshot.val()[key].timestamp;
                    if (timestamp > max) {
                        max = timestamp;
                        maxKey = key;
                    }})

                    //Update finishedQuiz to true
                    data.child('matches').child(maxKey).update({
                        finishedQuiz: true,
                    });

                    let questions = snapshot.val()[maxKey] ? snapshot.val()[maxKey].round1 : null
                    let myAnswers = [];
                    if (questions) {
                    Object.keys(questions).forEach(question => {
                        console.log(question)
                        console.log(questions[question])
                        myAnswers.push(questions[question]);
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
                    this.otherUserMatch = otherUserMatchRef
                    otherUserMatchRef.on('value',
                        (snapshot) => {
                            this.setState({otherData: snapshot.val()});
                            //3)
                            console.log("other user", snapshot.val())
                            let theirQuestions = snapshot.val() ? snapshot.val().round1 : null
                            let theirAnswers = [];
                            if (theirQuestions) {
                                Object.keys(questions).forEach(question => {
                                    if (question) theirAnswers.push(theirQuestions[question])
                                })
                                this.setState({theirAnswers: theirAnswers});
                                let heartStatus = 0;
                                //4)
                                if (myAnswers.length && theirAnswers.length) {
                                    for (let i = 0 ; i < myAnswers.length ; i++) {
                                        if (myAnswers[i] == theirAnswers[i]) heartStatus++
                                    }
                                        this.setState({heartStatus: heartStatus}, () => {
                                        })
                                        //5
                                        otherUserMatchRef.update({
                                            heartStatus: heartStatus
                                        })
                                        //6)
                                        matchRef.child(maxKey).update({
                                            heartStatus: heartStatus
                                        })
                                    //Check in database the finishedQuiz status of both users
                                    let theyFinishedQuiz = snapshot.val().finishedQuiz;
                                    firebaseUsersRef.child(user).child('matches').child(maxKey).on('value',
                                        (snapshot) => {
                                            let iFinishedQuiz = snapshot.val().finishedQuiz;
                                            let finishedQuiz = iFinishedQuiz && theyFinishedQuiz;
                                            this.setState({finishedQuiz});
                                        })
                                    console.log("heartStatus", this.state.heartStatus)
                                            if (this.state.heartStatus == 0){
                                                this.setState({img: '/img/no-hearts.gif'});
                                            } else if (this.state.heartStatus == 1) {
                                                this.setState({img: '/img/1-heart.gif'});
                                            } else if (this.state.heartStatus == 2) {
                                                this.setState({img: '/img/2-hearts.gif'});
                                            } else if (this.state.heartStatus == 3) {
                                                this.setState({img: '/img/3-hearts.gif'});
                                            } else if (this.state.heartStatus == 4) {
                                                this.setState({img: '/img/4-hearts.gif'});
                                            } else if (this.state.heartStatus == 5) {
                                                this.setState({img: '/img/5-hearts.gif'});
                                            } else {
                                                this.setState({img: '/img/5-hearts-loop.gif'});
                                            }
                                            console.log("img", this.state.img)
                                }
                            }
                        },
                        (errorObject) => {
                            console.error('The read failed: ' + errorObject.code)
                        })
                    //Getting name of matched user
                    let otherUserRef = firebaseUsersRef.child(maxKey)
                    this.otherUser = otherUserRef
                    otherUserRef.on('value',
                        (snapshot) => {
                            let theirName = snapshot.val().name;
                            this.setState({theirName: theirName})
                        })
                }
        ,
        (errorObject) => {
            console.error('The read failed: ' + errorObject.code)
        });
      }
      })



        console.log("this.state.img", this.state.img, "heartStatus",this.state.heartStatus)
    }

    componentWillUnmount(){
        firebaseUsersRef.off();
        firebaseQuizRef.off()
        firebaseUsersRef.child(firebaseAuth.currentUser.uid).child('matches').off()
        firebaseUsersRef.child(firebaseAuth.currentUser.uid).off()
        if (this.otherUser) this.otherUser.off()
        if (this.otherUserMatch) this.otherUserMatch.off()
        if (this.matchRef) this.matchRef.off()
     }

    render() {
        return (
            this.state.userData.matches && this.state.heartStatus !== null && this.state.theirName && this.state.finishedQuiz && this.state.theirAnswers.length === 5 && this.state.myAnswers.length === 5 ?
            <div>
                <Link to="/profile"><p id="waiting-back" className="caps back"><span className="glyphicon glyphicon-chevron-left"></span>back to profile</p></Link>
                <img id="waiting-hearts" src={this.state.img} />
                <h2 className='center'>You and {this.state.theirName} had {this.state.heartStatus}  {this.state.heartStatus == 1 ? 'answer' : 'answers'} in common</h2>
                <h1 className="fancy-type center caps ready-round2">Ready player one?</h1>
                  <Link to={`/chat/${this.state.userData.partnerId}`
                    }><button
                    id="round2-btn"
                    className="btn misc-btn caps"
                    onClick={this.enterQuiz}
                    >round 2</button>
                </Link>
            </div> :
            <Wait />
        )
    }

}



