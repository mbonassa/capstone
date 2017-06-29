import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase.js';
import anime from 'animejs'

export default class Quiz extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            userData: {},
            current: 0,
            questionNumbers: [],
            latestMatchKey: ''
        }
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

        let user = firebaseAuth.currentUser.uid;
        let data = firebaseUsersRef.child(user)
        data.on('value',
            (snapshot) => {
                this.setState({userData: snapshot.val()})
                let max = 0;
                let maxKey;
                let matchKeys = Object.keys(snapshot.val().matches).forEach(key => {
                    let timestamp = snapshot.val().matches[key].timestamp;
                    if (timestamp > max) {
                        max = timestamp;
                        maxKey = key;
                    }
                })
                this.setState({latestMatchKey: maxKey})
                let questionNumbers = snapshot.val().matches[maxKey] ? snapshot.val().matches[maxKey].numbers.split(',') : null;
                this.setState({questionNumbers})
            },
            (errorObject) => {
                console.error('The read failed: ' + errorObject.code)
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

    handleClick(event) {
        let user = firebaseAuth.currentUser.uid;
        let matchRef = firebaseUsersRef.child(user).child('matches');
        let questionNumber = +this.state.questionNumbers[this.state.current];
        let answerNumber = Number(event.target.className);
        let latestMatchKey;

        if (this.state.latestMatchKey.length) {
            latestMatchKey = this.state.latestMatchKey;
        }
        matchRef.child(latestMatchKey).child('round1').update({
            [questionNumber]: [answerNumber]
        })
        let number = this.state.current +1;
        this.setState({
            current: number
        })

    }

    render() {
        let questionNumbers = this.state.questionNumbers;
        let question = questionNumbers ? this.state.data[questionNumbers[this.state.current]] : null;

        return (
            this.state.current < 5 ?
            <div className="quiz">
                <h1 id="question-title">{question ? question[0] : null}</h1>
                <div id="answers">
                    <a onClick={this.handleClick}><div className="answer"><h3 className="{1} answer-text">{question ? question[1] : null}</h3></div></a>
                    <a onClick={this.handleClick}><div className="answer"><h3 className="{2} answer-text">{question ? question[2] : null}</h3></div></a>
                    <a onClick={this.handleClick}><div className="answer"><h3 className="{3} answer-text">{question ? question[3] : null}</h3></div></a>
                    <a onClick={this.handleClick}><div className="answer"><h3 className="{4} answer-text">{question ? question[4] : null}</h3></div></a>
                </div>
            </div> :
            <div className="quiz">
                <h1 id="question-title">{question ? question[0] : null}</h1>
                <div id="answers">
                    <a href='/waiting'><div className="answer"><h3 className="{1} answer-text">{question ? question[1] : null}</h3></div></a>
                    <a href='/waiting'><div className="answer"><h3 className="{2} answer-text">{question ? question[2] : null}</h3></div></a>
                    <a href='/waiting'><div className="answer"><h3 className="{3} answer-text">{question ? question[3] : null}</h3></div></a>
                    <a href='/waiting'><div className="answer"><h3 className="{4} answer-text">{question ? question[4] : null}</h3></div></a>
                </div>
            </div>
            )
    }

}
