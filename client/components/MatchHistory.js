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
     firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).on('value', snapshot => {
      this.setState({userObj: snapshot.val()}, () => {
        firebaseUsersRef.on('value', snapshot => {
          this.setState({allUsersObj: snapshot.val()})
        })
      })
    });
      }
     });
  }

  componentWillUnmount(){
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).off('value')
    firebaseUsersRef.off('value')
  }

  render(){
    return (
      <div>
          {this.state.userObj.matches && arrayifyWithKey(this.state.userObj.matches).length ?
            <div>
            {
            arrayifyWithKey(this.state.userObj.matches).map(match => {
            console.log(match)
            return (
                <div key={match.key}>
                  <h4 className="inline-block"> {this.state.allUsersObj && (this.state.allUsersObj[match.key]).name} </h4>
                  <p className="inline-block">, matched on {new Date(match.timestamp).toDateString()}</p>
                  <img className="inline-block matches-img" src={this.state.allUsersObj && `${(this.state.allUsersObj[match.key]).imageUrl}`}></img>
                  <Link to={
                    {
                      pathname:`/chat/${match.key}`,
                      state: {partnerInfo: this.state.allUsersObj[match.key]}
                    }
                  }> <button
                    className="btn misc-btn caps inline-block matches-chat"
                    >chat</button></Link>
                    <hr />

                </div>
                )
              })
            }
          </div> :
          <div>
            <span>You have no matches yet. Go find some!</span>
          </div>
        }
        <Link to="/profile"><p className="caps back"><span className="glyphicon glyphicon-chevron-left"></span>back to profile</p></Link>
      </div>
    )
  }
}
