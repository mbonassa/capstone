import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseAuth } from '../../utils/firebase.js';
import { Link, browserHistory } from 'react-router';
import { arrayifyWithKey } from '../../utils/helperFunctions'


export default class MatchHistory extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      userObj: {},
      allUsersObj: ''
    }
  }

  componentDidMount(){
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).on('value', snapshot => {
      this.setState({userObj: snapshot.val()}, () => {
        firebaseUsersRef.on('value', snapshot => {
          this.setState({allUsersObj: snapshot.val()})
        })
      })
    });
  }

  componentWillUnmount(){
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).off('value')
  }

  render(){
    return (
      <div>
      {this.state.userObj.matches && arrayifyWithKey(this.state.userObj.matches).map(match => {
        return (
          <div key={match.key}>
            <span> {this.state.allUsersObj && (this.state.allUsersObj[match.key]).name} </span>
            <span>, matched on {new Date(match.timestamp).toDateString()}</span>
            <img src={this.state.allUsersObj && `${(this.state.allUsersObj[match.key]).imageUrl}`}></img>
            <Link to={
              {
                pathname:`/chat/${match.key}`,
                state: {partnerInfo: this.state.allUsersObj[match.key]}
              }
            }> Go to chat </Link>
              <hr />

          </div>
        )
      })}
      </div>
    )
  }
}
