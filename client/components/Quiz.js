import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase.js';

export default class Quiz extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            userData: {},
            current: 0,
            questionNumbers: []
        }
        this.handleClick = this.handleClick.bind(this);
        this.findLatestMatch = this.findLatestMatch.bind(this);
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

        //let user = firebaseAuth.currentUser.uid;
        let data = firebaseUsersRef.child('User2')
        data.on('value',
            (snapshot) => {
                this.setState({userData: snapshot.val()})

                let questionNumbers = snapshot.val().matches.m3.numbers.split(',');
                this.setState({questionNumbers})
            },
            (errorObject) => {
                console.error('The read failed: ' + errorObject.code)
            })


    }

    findLatestMatch() {

    }

    handleClick(event) {

        let matchRef = firebaseUsersRef.child('User2').child('matches');
        let questionNumber = +this.state.questionNumbers[this.state.current];
        let answerNumber = Number(event.target.className);

        matchRef.orderByValue().limitToFirst(1).on("value", function(snapshot) {
            snapshot.forEach(function(data) {
                matchRef.child(data.key).child('round1').update({
                        [questionNumber]: [answerNumber]
                })
            });
        });

        let number = this.state.current + 1;
        this.findLatestMatch();
        this.setState({
            current: number
        })

        
    }

    render() {
        let questionNumbers = this.state.questionNumbers;
        let question = this.state.data[questionNumbers[this.state.current]];

        return (
            this.state.current < 5 ?
            <div>
                <h1>{question ? question[0] : null}</h1>
                <a onClick={this.handleClick}><h3 className={1}>{question ? question[1] : null}</h3></a>
                <a onClick={this.handleClick}><h3 className={2}>{question ? question[2] : null}</h3></a>
                <a onClick={this.handleClick}><h3 className={3}>{question ? question[3] : null}</h3></a>
                <a onClick={this.handleClick}><h3 className={4}>{question ? question[4] : null}</h3></a>
            </div> :
            <div>
                <h1>{question ? question[0] : null}</h1>
                <a href='/waiting'><h3 className={1}>{question ? question[1] : null}</h3></a>
                <a href='/waiting'><h3 className={2}>{question ? question[2] : null}</h3></a>
                <a href='/waiting'><h3 className={3} >{question ? question[3] : null}</h3></a>
                <a href='/waiting'><h3 className={4} >{question ? question[4] : null}</h3></a>
            </div>
            )
    }

}
