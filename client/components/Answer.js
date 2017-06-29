import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth, firebaseQuestionsRef } from '../../utils/firebase.js';

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
            answered: false
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
        //let user = firebaseAuth.currentUser.uid;
        let userRef = firebaseUsersRef.child('User5');
        let answerKey = this.state.latestQuestionKey + 'answer';
        userRef.child('matches').child(this.state.latestMatchKey).child('round2answers').update({
            [answerKey]: [response]
        })
        this.setState({answered: true, response: ''})
    }

    componentDidMount () {

        //let user = firebaseAuth.currentUser.uid;
        let userRef = firebaseUsersRef.child('User5')
        userRef.on('value',
            (snapshot) => {
                let userData = snapshot.val();
                //Finding latest match
                let max = 0;
                let maxKey;
                let matchKeys = Object.keys(userData.matches).forEach(key => {
                    let timestamp = snapshot.val().matches[key].timestamp;
                    if (timestamp > max) {
                        max = timestamp;
                        maxKey = key;
                    }
                })
                //Getting their name
                firebaseUsersRef.child(maxKey).on('value', 
                    (snapshot) => {
                        let theirName = snapshot.val().name;
                        this.setState({userData, latestMatchKey: maxKey, theirName});
                    })
                //Finding round2 object to get question number
                userRef.child('matches').child(maxKey).child('round2').on('value',
                    (snapshot) => {
                        let round2 = snapshot.val();
                        let max2 = 0;
                        let maxKey2;
                        Object.keys(round2).forEach(questionKey => {
                                let timestamp = round2[questionKey].split(',')[1]
                                if (timestamp > max2) {
                                    maxKey2 = questionKey;
                                }
                        })
                        this.setState({latestQuestionKey: maxKey2})
                        //Finding latest question text
                        firebaseQuestionsRef.on('value', 
                            (snapshot) => {
                                let questions = snapshot.val();
                                let latestQuestionText = questions[maxKey2];
                                this.setState({latestQuestionText: latestQuestionText, questions: questions});
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


    render() {
        return (
            <div>
                <h3>{this.state.theirName} {this.state.theirName && this.state.latestQuestionText ? 'asked' : null}</h3>
                <h1>{this.state.latestQuestionText}</h1>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                        <input onChange={this.handleChange} value={this.state.response} type="text" name="name" />
                        </label>
                        <input disabled={this.state.answered} type="submit" value="Submit" />
                    </form>
                {this.state.answered ? <a href='/pickquestion'>Send {this.state.theirName} a question</a> : null}
            </div> 
        )
    }

}