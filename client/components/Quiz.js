import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase.js';

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


    }

    handleClick(event) {
        let user = firebaseAuth.currentUser.uid;
        let matchRef = firebaseUsersRef.child(user).child('matches');
        let questionNumber = +this.state.questionNumbers[this.state.current];
        let answerNumber = Number(event.target.className);

        if (this.state.latestMatchKey.length) {
            let latestMatchKey = this.state.latestMatchKey;
        }
        matchRef.child(latestMatchKey).round1.update({
            [questionNumber]: [answerNumber]
        })
        let number = this.state.current +1;
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
