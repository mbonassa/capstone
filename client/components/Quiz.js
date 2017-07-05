import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase';
import { arrayify } from '../../utils/helperFunctions'
import anime from 'animejs'
import { Link, browserHistory } from 'react-router';

export default class Quiz extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            userData: {},
            current: 0,
            questionNumbers: [],
            latestMatchKey: '',
            finishedQuiz: false,
            quizData: {}
        }
        this.partnerId = "",
        this.handleClick = this.handleClick.bind(this);
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
        firebaseAuth.onAuthStateChanged((user) => {
            let userRef = firebaseUsersRef.child(firebaseAuth.currentUser.uid)
            if (user){
            userRef.on('value',
                (snapshot) => {
                this.setState({userData: snapshot.val()}, () => {
                    this.partnerId = this.state.userData.partnerId
                    console.log(this.state, snapshot.val())
                    if (this.partnerId){
                        userRef.child('matches').child(this.partnerId).on('value',
                        (snapshot) => {
                            this.setState({
                                finishedQuiz: snapshot.val().finishedQuiz,
                                round1: snapshot.val().round1,
                                questionNumbers: snapshot.val().numbers.split(',')
                            }, () => {
                                console.log(this.state)
                                if (arrayify(this.state.round1).length === 5) browserHistory.push('waiting')
                            })
                        });
                    }
                })
            });
                    firebaseQuizRef.on('value',
                    (snapshot) => {
                        let quizData = snapshot.val();
                        this.setState({quizData});
                    });
                } else {
                    browserHistory.push('login')
                }
            })


        function swipe () {
            var el = document.querySelector('#question-title');
            var domNode = anime({
              targets: el,
              translateX: 250,
              duration: 5000,
              delay: 500
            });
        }
        swipe();


    }

    componentWillUnmount(){
        firebaseQuizRef.off()
        firebaseUsersRef.child(firebaseAuth.currentUser.uid).off()
    }

    handleClick(event) {
        let user = firebaseAuth.currentUser.uid;
        let matchRef = firebaseUsersRef.child(user).child('matches');
        let questionNumber = +this.state.questionNumbers[this.state.current];
        let answerNumber = Number(event.target.id);
        let latestMatchKey;

        if (this.partnerId.length && answerNumber) {
            console.log('firing with', answerNumber)
            latestMatchKey = this.partnerId;
            matchRef.child(latestMatchKey).child('round1').update({
                [questionNumber]: answerNumber
            })
            .then(() => {
                let current = this.state.current +1;
                this.setState({current}, () => {
                    console.log("current is", this.state.current)
                    if (this.state.current > 4){
                        browserHistory.push('waiting')
                    }
                });
            })
            .catch(console.log.bind.console)
        }

        //Update database with new question count and answer count
        let questionData = this.state.quizData[questionNumber];
        let questionCount = questionData.questionCount ? questionData.questionCount + 1 : 1;
        let answerCountKey = answerNumber.toString() + 'a';
        let answerCount = questionData[answerCountKey] ? questionData[answerCountKey] + 1 : 1;
        firebaseQuizRef.child(questionNumber).update({questionCount, [answerCountKey]: answerCount});

        // let current = this.state.current +1;
        // this.setState({current}, () => {
        //     console.log("current is", this.state.current)
        //     if (this.state.current > 4){
        //         browserHistory.push('waiting')
        //     }
        // });

    }

    render() {
        let questionNumbers = this.state.questionNumbers;
        let question = questionNumbers ? this.state.data[questionNumbers[this.state.current]] : null;
        let chatRoute = '/chat/' + this.partnerId;

        return (
            <div>
            <div className="quiz">
                <h1 id="question-title">{question ? question[0] : null}</h1>
                <div id="answers">
                    <a onClick={this.handleClick}><div className="answer"><h3 className="answer-text" id="1">{question ? question[1] : null}</h3></div></a>
                    <a onClick={this.handleClick}><div className="answer"><h3 className="answer-text" id="2">{question ? question[2] : null}</h3></div></a>
                    <a onClick={this.handleClick}><div className="answer"><h3 className="answer-text" id="3">{question ? question[3] : null}</h3></div></a>
                    <a onClick={this.handleClick}><div className="answer"><h3 className="answer-text" id="4">{question ? question[4] : null}</h3></div></a>
                </div>
            </div>
            </div>
            )
    }

}
