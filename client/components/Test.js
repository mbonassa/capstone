import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase.js';
import anime from 'animejs';


export default class Test extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.handleClick = this.handleClick.bind(this);

    }



    componentDidMount () {
        function swipe () {
            var el = document.querySelector('#question-title');
            var domNode = anime({
              targets: el,
              translateX: 250,
              duration: 5000,
              delay: 500
            });
        }

        function cards () {
            var el = document.querySelector('.answer-text');
             var domNode = anime({
              targets: el,
              visibility: visible,
              duration: 5000,
              delay: 1000
            });
        }
        swipe();
    }

    handleClick(event) {
        console.log("got it")
    }


    render() {
        return (
            <div className="quiz">
                <h1 id="question-title">What's your favorite reptile?</h1>
                <div id="answers">
                    <a onClick={this.handleClick}><div className="answer"><h3 className="answer-text">Lizards</h3></div></a>
                    <a onClick={this.handleClick}><div className="answer"><h3 className="answer-text">Geckos</h3></div></a>
                    <a onClick={this.handleClick}><div className="answer"><h3 className="answer-text">Argonians</h3></div></a>
                    <a onClick={this.handleClick}><div className="answer"><h3 className="answer-text">Snakes</h3></div></a>
                </div>
            </div>
            )
    }

}
