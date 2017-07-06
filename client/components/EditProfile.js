import React from 'react';
import FireBaseTools, { firebaseUsersRef, firebaseAuth } from '../../utils/firebase.js';
import { Link, browserHistory } from 'react-router';

export default class EditProfile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      gender: '',
      age: '',
      imageUrl: '',
      bio: '',
      genderPreference: {
                          male: false,
                          female: false
                        },
      minAge: '',
      maxAge: ''
    }
    this.onChange = this.onChange.bind(this);
    this.genderPreferenceChange = this.genderPreferenceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateAgeDropdown = this.generateAgeDropdown.bind(this);
  }

  componentDidMount(){
    if (firebaseAuth.currentUser){
      firebaseUsersRef.child(firebaseAuth.currentUser.uid).on("value",
        (snapshot) => {
        this.setState({
          val: snapshot.val(),
          name: snapshot.val().name,
          bio: snapshot.val().bio,
          gender: snapshot.val().gender,
          genderPreference: snapshot.val().genderPreference || {male: false, female: false},
          agePreference: snapshot.val().agePreference,
          imageUrl: snapshot.val().imageUrl
        });
      },
        (errorObject) => {
        console.log("The read failed: " + errorObject.code);
      });
    } else {
      alert("You are not logged in.")
    }
  }

  handleSubmit(evt){
    evt.preventDefault();
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).update({
      name: this.state.name,
      gender: this.state.gender,
      imageUrl: this.state.imageUrl,
      bio: this.state.bio,
      genderPreference: this.state.genderPreference,
      minAge: this.state.minAge,
      maxAge: this.state.maxAge
    })
    .then(() => {
      browserHistory.push('/profile')
    })
  }

  genderPreferenceChange(evt){
    let newStateObj = this.state.genderPreference;
    newStateObj[evt.target.value] = !this.state.genderPreference[evt.target.value]
    this.setState(Object.assign({}, this.state, {genderPreference: newStateObj}));
  }

  onChange(type){
    return (evt) => {
      let newStateObj = {};
      newStateObj[type] = evt.target.value
      this.setState(Object.assign({}, this.state, newStateObj))
    }
  }

  generateAgeDropdown(){
    let output = [];
    for (var i = 18; i < 100; i++){
      output.push(i)
    }
    return output
  }

  render(){
    return(
      <div>
      <img className="logo-top" src="./img/sm-logo.png" />
        <form className="form-horizontal">
      <div className="form-group">
        <label htmlFor="userName" className="col-sm-2 control-label">Update Name</label>
        <div className="col-sm-10">
          <input onChange={this.onChange('name')} type="userName" className="form-control" id="userName" value={this.state.name} />
        </div>
          <div className="col-sm-10">
            <p className="control-label"> Gender: {this.state.gender} </p>
          </div>
      </div>

      <div>
      <label htmlFor="age" className="col-sm-2 control-label">Your Age</label>
      <select onChange={this.onChange('age')} className="form-control">
        {this.generateAgeDropdown().map(el => {
          return <option key={el}>{el}</option>
        })
      }
      </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="userBio" className="col-sm-2 control-label">Update Bio</label>
        <div className="col-sm-10">
          <textarea onChange={this.onChange('bio')} rows="3" type="bio" className="form-control" id="userBio" value={this.state.bio}></textarea>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="genderPreference" className="col-sm-2 control-label">Looking for...</label>
        <div className="col-sm-10">
          <label className="checkbox-inline">
            <input onChange={this.genderPreferenceChange} type="checkbox" id="inlineCheckbox1" value="male" /> men
          </label>
          <label className="checkbox-inline">
            <input onChange={this.genderPreferenceChange} type="checkbox" id="inlineCheckbox2" value="female" /> women
          </label>
          </div>
      </div>

      <div>
      <label htmlFor="minAge" className="age-range-title col-sm-2 control-label">Minimum Age</label>
      <select onChange={this.onChange('minAge')} className="age-range col-sm-6 form-control" placeholder="min">
        {this.generateAgeDropdown().map(el => {
          return <option key={el}>{el}</option>
        })
      }
      </select>
      </div>

      <div>
      <label htmlFor="maxAge" className="age-range-title col-sm-2 control-label">Maximum Age</label>
      <select onChange={this.onChange('maxAge')} className="age-range col-sm-6 form-control" placeholder="max">
        {this.generateAgeDropdown().map(el => {
          return <option key={el}>{el}</option>
        })
      }
      </select>
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl" className="col-sm-2 control-label">Add New Photo URL</label>
        <div className="col-sm-10">
          <input onChange={this.onChange('imageUrl')} type="plaintext" className="form-control" id="imageUrl" value={this.state.imageUrl} />
        </div>
      </div>
      <div className="form-group">
        <div className="col-sm-offset-2 col-sm-10">
          <button type="submit" onClick={this.handleSubmit} className="btn btn-default">Confirm</button>
        </div>
      </div>
    </form>
      </div>
    )
  }

  }
