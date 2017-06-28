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
        let data = firebaseUsersRef.child('User1')
        data.on('value',
            (snapshot) => {
                this.setState({userData: snapshot.val()})

                let questionNumbers = snapshot.val().matches.m1.numbers.split(',');
                this.setState({questionNumbers})
            },
            (errorObject) => {
                console.error('The read failed: ' + errorObject.code)
            })


    }

    findLatestMatch() {
      var matchRef = firebaseUsersRef.child('User1').child('matches');
        matchRef.orderByValue().limitToFirst(1).on("value", function(snapshot) {
          snapshot.forEach(function(data) {
          console.log("The " + data.key + " score is " + data.val().timestamp);
          matchRef.child(data.key).update({
            'round1': {
              '1': '3'
            }
          })
  });
});
    }

    handleClick() {
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
                <a onClick={this.handleClick}><h3>{question ? question[1] : null}</h3></a>
                <a onClick={this.handleClick}><h3>{question ? question[2] : null}</h3></a>
                <a onClick={this.handleClick}><h3>{question ? question[3] : null}</h3></a>
                <a onClick={this.handleClick}><h3>{question ? question[4] : null}</h3></a>
            </div> :
            <div>
                <h1>{question ? question[0] : null}</h1>
                <a href='/waiting'><h3>{question ? question[1] : null}</h3></a>
                <a href='/waiting'><h3>{question ? question[2] : null}</h3></a>
                <a href='/waiting'><h3>{question ? question[3] : null}</h3></a>
                <a href='/waiting'><h3>{question ? question[4] : null}</h3></a>
            </div>
            )
    }

}
