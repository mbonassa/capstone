import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseQuizRef, firebaseAuth } from '../../utils/firebase.js';

export default class Answer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: {},
            value: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange (event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    componentDidMount () {
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


    render() {
        console.log(this.state.value)
        return (
            <div>
                <h3>Marianne asked</h3>
                <h1>What's your sign?</h1>
                    <form>
                        <label>
                        <input onChange={this.handleChange} type="text" name="name" />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
            </div>
        )
    }

}