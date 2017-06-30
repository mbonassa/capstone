import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuestionsRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase.js';

export default class Quiz extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            questions: {},
            matchKey: '',
            randomNumbers: [],
            theirName: ''
        }
        this.handleClick = this.handleClick.bind(this);
    }


    componentDidMount () {
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
            })

        //let user = firebaseAuth.currentUser.uid;
        let userRef = firebaseUsersRef.child('User4')

        //We obtain an object with all the user's matches from the database
        //We preserve this object to state on allMatches
        //Then, we find the most recent match by comparing timestamps
        userRef.child('matches').on("value", (snapshot) => {
            this.setState({allMatches: snapshot.val()})
                let max = 0;
                let maxKey;
                let matchKeys = Object.keys(snapshot.val()).forEach(key => {
                    let timestamp = snapshot.val()[key].timestamp;
                    if (timestamp > max) {
                        max = timestamp;
                        maxKey = key;
                    }})
                    this.setState({matchKey: maxKey});
                    //Getting name of match
                    firebaseUsersRef.child(maxKey).on('value', (snapshot) => {
                        let name = snapshot.val().name;
                        this.setState({theirName: name})
                    })
        },
        (errorObject) => {
            console.error('The read failed: ' + errorObject.code)
        });

    }

    handleClick (n) {
        //let user = firebaseAuth.currentUser.uid;
        let userRef = firebaseUsersRef.child('User4')
        let matchKey = this.state.matchKey;
        let questionNumber = this.state.randomNumbers[n]
        //This is the database reference to the latest (current) match's match object
        firebaseUsersRef.child(matchKey).child('matches').child('User4').child('round2').update({
            //We affix a timestamp to each question so later we can be sure to get the latest one
            [questionNumber]: 'true,' + Date.now()
        })
        //Update turnToAsk from true to false
        userRef.child('matches').child(matchKey).update({
            turnToAsk: false
        })
    }

    render() {
        //If your match's turnToAsk is false, that means that they have just picked a question, so link should appear to Answer
        return (
            <div>
                {this.state.theirName.length ? <h1>Pick a question to send to {this.state.theirName}!</h1> : null}
                <a href='/viewanswer'><h3 onClick={() => this.handleClick(0)}>{this.state.questions[this.state.randomNumbers[0]]}</h3></a>
                <a href='/viewanswer'><h3 onClick={() => this.handleClick(1)}>{this.state.questions[this.state.randomNumbers[1]]}</h3></a>
                <a href='/viewanswer'><h3 onClick={() => this.handleClick(2)}>{this.state.questions[this.state.randomNumbers[2]]}</h3></a>
            </div>
        )
    }

}