import React from 'react';
import { browserHistory } from 'react-router';
import { firebaseUsersRef, firebaseAuth } from '../../utils/firebase'

export default class Signup extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: "",
      gender: "",
      age: "",
      imageUrl: "",
      bio: "",
      genderPreference: {
                          male: false,
                          female: false
                        },
      agePreference: ""
    }
    this.onChange = this.onChange.bind(this);
    this.genderPreferenceChange = this.genderPreferenceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt){
    evt.preventDefault();
    console.log(this.state)
    firebaseUsersRef.child(firebaseAuth.currentUser.uid).update({
      name: this.state.name,
      gender: this.state.gender,
      age: this.state.age,
      imageUrl: this.state.imageUrl,
      bio: this.state.bio,
      genderPreference: this.state.genderPreference,
      agePreference: this.state.agePreference,
      active: false,
      partnerId: '',
      viewed: {}
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
      console.log(evt.target.value)
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
        <form className="form-horizontal">
      <div className="form-group">
        <label htmlFor="userName" className="col-sm-2 control-label">Name</label>
        <div className="col-sm-10">
          <input onChange={this.onChange('name')} type="userName" className="form-control" id="userName" placeholder="Enter a name..." />
        </div>
      </div>
      <div className="col-sm-10">
        <div onChange={this.onChange('gender')} className="form-group">
          <label htmlFor="gender" className="col-sm-2 control-label">I am...</label>
         <label className="radio-inline">
          <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="female" /> female
        </label>
        <label className="radio-inline">
          <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="male" /> male
        </label>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="userBio" className="col-sm-2 control-label">Bio</label>
        <div className="col-sm-10">
          <textarea onChange={this.onChange('bio')} rows="3" type="bio" className="form-control" id="userBio" placeholder="Enter a short bio..."></textarea>
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
      <div className="form-group">
        <label htmlFor="agePreference" className="col-sm-2 control-label">Age Preference</label>
        <div className="col-sm-10">
          <input onChange={this.onChange('agePreference')} type="agePreference" className="form-control" id="agePreference" placeholder="Enter your preferred age range..." />
        </div>
      </div>
      <div>
      <label htmlFor="age" className="col-sm-2 control-label">Age</label>
      <select onChange={this.onChange('age')} className="form-control">
        {this.generateAgeDropdown().map(el => {
          return <option key={el}>{el}</option>
        })
      }
      </select>
      </div>
      <div className="form-group">
        <label htmlFor="imageUrl" className="col-sm-2 control-label">Profile Picture URL</label>
        <div className="col-sm-10">
          <input onChange={this.onChange('imageUrl')} type="plaintext" className="form-control" id="imageUrl" placeholder="Give a url for your profile picture...." />
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
