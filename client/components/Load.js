import React from 'react';
import { browserHistory } from 'react-router';
import anime from 'animejs';


export default class Load extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }



    componentDidMount () {
      function time () {
        setTimeout(function(){ browserHistory.push('/login') }, 5000);
      }
    }


    render() {
        return (
            <div id="load">
              <img src="" id="load-img" />
            </div>
            )
    }

}
