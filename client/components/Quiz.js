import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase.js';

export default class Quiz extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            userData: {},
            current: 0
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

        //let user = firebaseAuth.currentUser.uid;
        let data = firebaseUsersRef.child('User1')
        data.on('value',
            (snapshot) => {
                this.setState({userData: snapshot.val()})
            },
            (errorObject) => {
                console.error('The read failed: ' + errorObject.code)
            })
    }

    handleClick() {
      let number = this.state.current + 1;
      this.setState({
        current: number
      })
    }

    render() {
        let questionNumbers = [83,23,57,91,8]
        let question = this.state.data[questionNumbers[this.state.current]];
        console.log(this.state.userData)

        return (
            this.state.current < 5 ?
            <div>
                <h1>{question ? question[0] : null}</h1>
                <a onClick={this.handleClick}><h3>{question ? question[1] : null}</h3></a>
                <a onClick={this.handleClick}><h3>{question ? question[2] : null}</h3></a>
                <a onClick={this.handleClick}><h3>{question ? question[3] : null}</h3></a>
                <a onClick={this.handleClick}><h3>{question ? question[4] : null}</h3></a>
            </div> : (
            this.state.userData.matches.m1.heartStatus ?
            <div>
                <h1>{question ? question[0] : null}</h1>
                <a href='/gametransition'><h3>{question ? question[1] : null}</h3></a>
                <a href='/gametransition'><h3>{question ? question[2] : null}</h3></a>
                <a href='/gametransition'><h3>{question ? question[3] : null}</h3></a>
                <a href='/gametransition'><h3>{question ? question[4] : null}</h3></a>
            </div>      
            :
            <div>
                <h1>{question ? question[0] : null}</h1>
                <a href='/waiting'><h3>{question ? question[1] : null}</h3></a>
                <a href='/waiting'><h3>{question ? question[2] : null}</h3></a>
                <a href='/waiting'><h3>{question ? question[3] : null}</h3></a>
                <a href='/waiting'><h3>{question ? question[4] : null}</h3></a>
            </div> 
            )
        )
    }

}
